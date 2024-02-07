 export const address=new URL(import.meta.url).pathname;
 export const location = address.replace(/\/[^/]*$/,"");
 var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m", blink:"\x1b[5m", reverse:"\x1b[7m",invisible:"\x1b[8m", black:"\x1b[30m", red:"\x1b[31m", green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m", magenta:"\x1b[35m",cyan:"\x1b[36m", white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};

 export function ascend(term)
{return term?[...ascend(Object.getPrototypeOf(term)),term]:[];
};

 export function fields(term)
{return ascend(term).flatMap(term=>
{try{return Reflect.ownKeys(term);}catch(fail)
{console.warn("warning: can't see all properties on",term," - ",fail.message);
 return Object.keys(term);
};
});
};

 export async function prompt(...context)
{// request context from client interface, 
 // or offer it to the client (syncing the cli 
 // with debugPort and customizing it don't work yet). 
 let {createInterface}=await import("readline");
 let {stdin:input,stdout:output}=process;
 let socket=await new Promise((resolve,error)=>import("net").then(({connect})=>
 observe.call(connect(process.debugPort),{connect(){resolve(this)},error}))).catch(fail=>undefined);
 let interfaces=[{input,output},socket&&{input:socket,output:socket}].filter(Boolean).map(createInterface);
 let abortion=new AbortController();
 let entries=context.flat().flatMap(term=>compound(term)?Object.entries(term):[[term]]);
 entries=await entries.reduce(record(([node,term])=>new Promise(resolve=>
 term?resolve(term):each("question",node+":",{signal:abortion.signal}
,combine(compose(swap(abortion),"abort"),resolve))(...interfaces)).then(term=>
 [node,term]))
,[]);
 return compose(each("close"),swap(Object.fromEntries(entries)))(...interfaces);
};

 export var collect=
 // cumulate context (wether singular, plural and/or asynchronous) in an array. 
[factor=>factor instanceof Promise
,context=>Promise.all(context)
,factor=>factor?.constructor?.constructor?.name==="GeneratorFunction"
,context=>context.map(factor=>[factor,factor?.constructor?.constructor?.name]).flatMap(([factor,name])=>
 name==="GeneratorFunction"?[...factor]:[factor])
,factor=>factor?.constructor?.constructor?.name==="AsyncGeneratorFunction"
,context=>context.reduce(record(function resolve(factor)
{return Promise.resolve(factor?.constructor?.constructor?.name==="AsyncGeneratorFunction"
?factor.next().then(({value,done})=>!done?resolve(factor).then(next=>[value,...next]):[])
:[factor])
}),[]).then(context=>Object.values(context).flat())
,factor=>factor instanceof Promise
,context=>Promise.all(context)
].map((condition,index,actions)=>
 actions.splice(index,2,actions.slice(index,index+2))).map(([condition,expand])=>
 context=>context.some(condition)?expand(context):context).reduce((record,expand)=>
 function collect(...context)
{context=record.call(this,...context);
 if(context instanceof Function)return context;
 return context instanceof Promise?context.then(expand):expand(context);
},(...context)=>context);

 export function provide(context,agnostic)
{// express plurality with Generator (singularity ignored if agnostic). 
 if(context instanceof Promise)
 return context.then(context=>provide(context,agnostic));
 return agnostic||(Array.isArray(context)&&(context.length!==1))
?function* provide(context)
{yield* Array.isArray(context)?context:[context];
}(context)
:Array.isArray(context)?context[0]:context;
};

 export function infer(term,...pretext)
{// call/attach/detach/attend or append term on collected and dynamically prepended context. 
 if(!defined(this))
 return describe(function(...context)
{let scope=this;
 if(defined(scope))
 context.unshift(scope);
 context=collect(...context);
 if(context instanceof Promise)
 return context.then(context=>infer(term,...pretext)(...context));
 scope=provide(context.length?[context.shift()]:[],true);
 return infer.call(scope,term,...pretext,...context);
},infer,...arguments);
 let context=collect(this,...pretext);
 if(context instanceof Promise)
 return context.then(context=>
 infer.call(provide(context,true),term));
 if(!defined(term))
 return provide(context);
 let [scope]=context;
 let prefix=/^tether /;
 let detach=string(term)&&prefix.test(term)&&term.replace(prefix,"");
 let attach=term instanceof Function&&prefix.test(term.name)&&term;
 let attend=!attach&&defined(scope??undefined)&&!Array.isArray(term)
?[Object(scope),detach||term].reduce((domain,term)=>term instanceof Function
?fields(domain).find(field=>{try{return Object.is(Reflect.get(domain,field),term);}catch(fail){};})&&term
:Reflect.get(domain,term?.toString?term:null))
:undefined;
 let bound=attach||attend;
 if(detach)context.shift();
 if(!((bound??term) instanceof Function))
 return bound??provide([...context,term]);
 let functor=bound?Function.call.bind(bound):term;
 //console.log(bound, functor,scope,context)
 return functor(...context);
};

 export function differ(term)
{// infer without allowing identity. 
 if(!defined(this))
 return refer(differ,term);
 let context=collect(this)
 let fail=compose(swap([term?.name||String(term),"yielded identity of",JSON.stringify(this)].join(" ")),Error,exit);
 return compose.call(this,infer(term,provide(context)),wether(same(provide(context)),fail,infer()));
};

 export function buffer(term,quit=provide)
{// alternative inference for failure. 
 if(!defined(this))
 return refer(buffer,term,quit);
 try
{let context=infer(term)(this);
 return context instanceof Promise?context.catch(quit):context;
}catch(fail){return quit(fail);};
};

 export function refer(combinator,...terms)
{// bind term to context to keep terms distinguished. 
 if(!defined(this))
 return describe(function(...context)
{if(defined(this))
 context.unshift(this);
 return refer.call(provide(collect(...context),true),combinator,...terms);
},combinator,...terms);
 return combinator.call(this,...terms);
};

 export function tether(term,...context)
{// bind term to scope by inferring with a "tether" prefix. 
 let bound=is(Function)(term)
?describe.call("tether ",function(){return term.call(this,...arguments);},term)
:term;
 return infer.call(this,bound,...context);
};

 export function either(functor,...functors)
{// alternative difference before last inference (errors cumulate in context)
 if(!defined(this))
 return refer(either,...arguments);
 let context=collect(this);
 let next=functors.length?buffer(differ(functor)):functor;
 return compose(provide,next,function proceed(...terms)
{let fail=terms.length&&terms.every(is(Error));
 let valid=!fail&&terms.every(term=>is(something,not(nay))(term));
 //let valid=!fail&&infer(each(term=>is(something,not(nay))(term)))(...terms)
 if(valid)
 return provide(terms);
 let identity=fail&&terms.at(-1).message.startsWith((functor?.name||functor)+" yielded identity");
 if(functors.length)
 return either(...functors)(provide(context),...fail&&!identity?terms:[]);
 if(!fail)
 return provide(terms);
 exit(terms.pop());
})(context);
//  return functors.reduce(function next(context,functor,index,functors)
// {context=collect(context);
//  let remaining=functors.length-index-1;
//  if(!remaining)
//  return infer(functor)(provide(context));
//  let cumulate=fail=>infer(fail.message.includes("yielded identity")?undefined:fail)(provide(context));
//  let next=buffer(differ(functor),cumulate);
//  let valid=is(compose(crop(-1),not(Error)),each(term=>is(something,not(nay))(term)));
//  let escape=combine(infer(),compose(swap(functors),infer("splice",index),drop()));
//  let proceed=wether(valid,escape,infer());
//  return compose(next,proceed)(provide(context));
// },this);
};

 export function wether(condition,...functors)
{// conditional inference. 
 if(!defined(this))
 return refer(wether,...arguments);
 let context=collect(this);
 let conditions=[condition].flat();
 return compose.call
(conditions
,infer("reduce",record(function(condition,index,{length})
{let [track]=this;
 return track??compose
(is(Function)(condition)?buffer(condition):swap(condition)
,valid=>!numeric(valid)?valid&&!is(Error)(valid)?index:track:valid
)(...context);
},0),[])
,([track])=>functors[track??conditions.length]??
 compose(swap(Error([conditions.length,"conditions not satisfied:",trace().reverse().find(([term])=>term?.startsWith(wether.name))[0]].join(" "))),exit)
,infer.bind(provide(context,true))
);
};

 export function compose(...terms)
{// recursive inference agnostic of dynamic context. 
 if(!defined(this))
 return refer(compose,...arguments);
 let inference=describe((context,term)=>infer(term)(context),compose);
 return terms.reduce(inference,this);
};

 export function combine(...functors)
{// parallel inference/multiplication (church arithmetic). 
 if(!defined(this))
 return refer(combine,...arguments);
 let context=collect(this);
 let [factor]=context;
 let records=Object.entries(Object(factor));
 let content=functors.map(functor=>typeof functor!=="number"
?compose.call(context,provide,functor)
:Object.assign([]
,Array(Math.floor(functor)).fill(factor)
,functor%1&&
 {[Math.floor(functor)]:records.length
?compose.call(records.slice(0,functor%1*records.length)
,Object.fromEntries,...Array.isArray(factor)?[Object.values]:[])
:functor%1*factor
 }));
 return provide(collect(...content));
// length?compose(drop(),functor,Math.ceil,Array,fields,"fill","flat",[]
// ,tether("reduce",(records,field,index,fields)=>
// (index%Math.round(functor*length)||
//  records.push(fields.slice(index,index+functor*length))
// )&&records))
};

 export function record(term,distinction="length")
{// cumulate terms (of configurable distinction) on dynamic scope. 
 if(term instanceof Function)
 return tether(function record(...context)
{let field=compose(tether(distinction),collect,"pop")(this,...context);
 if(something(this[field]))
 return this;
 return compose.call(this,combine
(infer()
,compose(tether(term,...context),term=>something(term)?describe(term,field):{})
),Object.assign
);
});
 return Array.from(term);
};

 export function route(term,...context)
{// compose with static context, methodic and scope-rebound alternatives. 
 if(!this)return tether(route,...arguments);
 let scope=this;
 let method=context[0]?.method;
 let last=drop(-1);
 let fail=compose(last,is(Error));
 let functors=[term].flat().map((term,index,{length})=>infer(either
(term
,wether(fail,last,either(compose(combine(differ(method),drop(1)),differ(term)),infer()))
,wether(fail,last,tether(scope[term]))
,wether(fail,last,tether(scope[method]))
),...context));
 let conclude=either(infer(method,...context),wether(fail,last,infer()));
 let composition=compose(...functors,conclude);
 return scope?composition(scope):composition;
};

 export function each(term,...context)
{if(!defined(this))
 return tether(each,...arguments);
 return compose(collect,infer("map",infer(term)),provide)(this,...context);
};

 export function drop(stop=Infinity,start=0,...inject)
{// filter context between indexes (trim if stop<start), 
 // eg. combine(drop(1,-1),drop(-1,1))(1,2,3,4)=((2,3),(1,4)). 
 let determine=(offset,index,{length})=>
 offset<length?(length+offset)%length:length;
 return describe(infer(function(...context)
{//if(typeof stop!=="number")return stop;
 let [integral,interval]=compose.call
(context,"length",Array,[start,stop],Object.assign
,infer("map",determine)
,combine
(infer("reduce",(start,stop)=>Number(stop<start))
,compose
(combine(1),0,infer("sort",(stop,start)=>(start<stop)-1)
,combine(infer(0),infer("reduce",(past,next)=>next-past))
,collect
)
)
);
 context=[context,context.splice(...interval,...inject)][integral];
 return provide(context);
}),drop,...arguments);
};

 export var crop=drop.bind(null,0);
 export var slip=drop.bind(null,0,0);
 export var swap=drop.bind(null,Infinity,0);

 export function note(...context)
{// expose context in console. (combine(compose(note,drop()),infer()))
 let stack=trace().slice(0,-1);
 // let composition="compose/reduce/compose/infer\\((bound )*note\\)/infer/note".split("/");
 // let composed=composition.every((term,index,{length})=>RegExp(term+"$").test(stack.at(index-length)?.[0]));
 // stack=stack.slice(0,composed?-composition.length:-1);
 let neutral="\x1b[0m";
 let blue=neutral+"\x1b[40m\x1b[34m\x1b[1m\x1b[3m";
 let dim=neutral+"\x1b[40m\x1b[34m\x1b[2m\x1b[1m\x1b[3m";
 let source=dim+"\x1b[30m@"+stack.at(-1)?.[1]+dim+"\n "||"...intractable";
 source=!globalThis.window?blue+source+"\x1b[0m":source;
 stack=compose.call
(stack
,infer("map",([term,position],index,{length})=>length-index-1?term||position?.replace("file://"+location,"."):(blue+term))
,blue+"/"+dim,"join"
)+"\x1b[0m";
 let stream=console[this?"info":"log"];
 stream(dim+"\x1b[3m "+clock(new Date())+source+blue+stack+neutral+":");
 let steady=colors.steady;
 let phase=colors[this]||Object.values(colors)[this]||steady;
 process.stdout.write(phase);
 stream(...context);
 process.stdout.write(steady);
 return provide(context);
};

 export function observe(actions)
{if(!defined(this))
 return tether(observe,...arguments);
 return Object.entries(actions).reduce((scope,[event,action])=>scope.on(event,action),this);
};

 export function describe(term,...context)
{// name term after a bound prefix and context in its closure. 
 let functor=term instanceof Function;
 if(!functor)
 return context.flat().reverse().reduce((scope,field)=>({[field]:scope}),term);
 let prefix=String(this||"");
 let eponymous=context.shift();
 let name=[prefix,eponymous?.name||eponymous].filter(Boolean).join("");
 let abbreviation=/^([\s\S]{20})[\s\S]*$/;
 let value=context.reduce((value,term,index,{length})=>
[value
,!numeric(term)
?string(term)
?"\""+term.replace(abbreviation,(...match)=>match[1]+"…").replace(/\n/g,"")+"\""
:(term instanceof Function)
?(term.name||"functor")
:(term?.constructor?.name??(typeof term).toLowerCase())
:String(term)
].join(index?",":"(")+(length-index-1?"":")")
,name);
 return Object.defineProperty(term,"name",{value});
};

 export function defined(term){return term!==undefined;};
 export function compound(term){return typeof term==="object";};
 export function iterable(term){try{return Symbol.iterator in term;}catch(fail){return false}};
 export function array(term){return Array.isArray(term);};
 export function binary(term){return typeof term==="boolean";};
 export function string(term){return typeof term==="string";};
 export function numeric(term){return typeof term==="number"};
 export function aye(term){return Object.is(term,true);};
 export function nay(term){return Object.is(term,false);};
 export var something=compose(term=>term??undefined,defined);
 export var nothing=not(something);
 export var pattern=is(RegExp);
 export var promise=is(Promise);
 export function is(...terms)
{// express context as true if defined or satisfies terms.
 if(!defined(this))
 return refer(is,...terms);
 let context=collect(this);
 let conditions=terms.map(term=>term
?compose(provide,/^[A-Z]/.test(term.name)
?scope=>scope instanceof term:term)(context):false);
 return compose(provide,collect,infer("every",Boolean))(conditions);
};
 export function not(...terms)
{// deny conditions
 return is(...terms.map(term=>compose(term,nay)));
};
 export function has(fields)
{if(this)
 return [fields].flat().every(field=>field in this);
 return tether(has,fields);
};
 export function when(...terms)
{// demand conditions on context. 
 if(!defined(this))
 return refer(when,...terms);
 let context=collect(this);
 terms=[terms].flat().flatMap(term=>compound(term)?Object.values(term):term);
 let index=terms.findIndex((term,index)=>!is(term)(context[index]));
 if(index+1)
 throw Error(terms[index].name+": "+context[index]);
 return provide(context,true);
};
 export function same(...context)
{if(!defined(this))
 return refer(same,...context);
 return compose
(collect,collect(...context),(terms,context)=>
 context.length<terms.length||
 context.every((term,index)=>terms[index]===term)
)(this);
};
 export function match(...expressions)
{if(!defined(this))
 return tether(match,...expressions);
 if(!string(this))
 throw Error("can't match regular expressions on ",this);
 return expressions.every(expression=>expression.test(this));
}

 export function wait(time)
{// hold context for time period.
 if(!defined(this))
 return refer(wait,time)
 return new Promise(resolve=>setTimeout(resolve,time)).then(infer.bind(this));
};

 export function expect(condition=something,interval=500,limit=Infinity)
{// hold thread until context satisfies condition. 
 if(!defined(this))
 return refer(expect,...arguments);
 if(!limit)return infer(condition)(this);
 let context=collect(this);
 let repeat=compose(wait(interval),swap(provide(context)),expect(condition,interval,limit-1));
 return either(condition,repeat)(provide(context));
};

 export function revert(resolve)
{// revert a Promise's inversion of control. 
 if(!defined(this))
 return refer(revert,...arguments);
 return Reflect.construct(Promise,[compose(crop(1),infer(resolve,this))]);
};

 export function exit(fail){throw fail;}

 export function clock(date,precision="time")
{if(!isNaN(Number(date)))
 date=new Date(date);
 if(!date||!date.getFullYear)
 date=new Date();
 let time=
[""
,...precision.includes("date")?[date.getFullYear(),date.getMonth()+1,date.getDate()]:Array(3)
,...precision.includes("time")?[date.getHours()+1,date.getMinutes(),date.getSeconds()]:Array(3)
].map(value=>value===undefined?"":String(value)).reduce((time,value,index)=>
{let zeros="0".repeat(Math.max(2,value.length)-value.length);
 let separator=index<6?index<4?index==3?". ":".":":":"";
 if(!value)return time;
 return time+zeros+value+separator;
});
 return time;
};

 var stack=
 // parse nodejs stack trace entry. 
 compose(either
(infer("match",compose(Object.values,infer("map",infer("source")),"","join",RegExp)(
 // at object.property/Promise.all
 {term:/at(?: async){0,1}(?: (Promise\.all|.*) | )/
 // (protocol:path/file:line:index)/(index 0)/(<anonymous>)
 ,location:/\(*((?:index [0-9]+)|(?:.+?(?::[0-9]+){0,2}))\)*$/
 }))
,swap([])
),infer("slice",1),infer("map",match=>match||"anonymous"));

 export function trace(term,path=[])
{// trace term in scope or stack. 
 if(!something(term))
 return compose.call
(Error,combine
 // collect stack trace. 
(infer()
,compose(...combine(2)("stackTraceLimit"),describe)
,compose
({stackTraceLimit:Infinity},Object.assign
,Function.call,"stack",/\n */,"split",infer("slice",1)
,infer("map",stack)
,"reverse"
)
)
,combine(drop(2),compose(crop(2),Object.assign))
,crop(1)
,combine(infer(),swap(0),infer("findIndex",([term])=>term===trace.name)),infer("slice")
);
 let scope=this;
 if(scope===term||!scope)
 return path;
 return Object.entries(scope).reduce((hit,[track,scope])=>hit||
 [term===scope,path.concat(track)].reduce((hit,path)=>
 hit?path:(typeof scope=="object")?trace.call(term,scope,path):undefined)
,undefined);
};

 // OBSOLETE (weak variations of provide, infer, compose, tether) 

 export function plural(...context)
{// express plurality with Generators.
 context=context.flatMap((term)=>
 term?.constructor?.constructor?.name==="GeneratorFunction"?[...term]:[term]);
 return (function*(){yield* context;})();
}

 export var apply = (context, term) =>
 // apply or append term to context (respecting plurality and asynchronicity).
 [context, term].some((context) => context instanceof Promise)
? Promise.all([context, term]).then(([context, term]) => apply(context, term))
: term instanceof Function
? term(...plural(context))
: plural(context, term);

 // consecutive application.
 export function stream(context,...terms){return terms.reduce(apply,context);}

 export function bind(factor,...pretext)
{// bound inference. (univalence axiom) 
 let bound=factor instanceof Function
?describe.call("tether ",function()
{return factor.call(...arguments);
},factor)
:factor;
 // when monadic inference is ready. 
 //return infer.call(this,bound,...pretext);
 return bound;
};


 export var tests=
 {collect:{context:[1,2,3],terms:[[1,2,3]],condition:["deepEqual"]}
 ,drop:
 {full:{context:[],terms:[1,2,3,Function.call,4,4],condition:"equal"}
 ,left:
[{context:[1],terms:[1,2,3,Function.call,collect,[2,3]],condition:"deepEqual"}
,{context:[2,1],terms:[1,2,3,Function.call,collect,[1,3]],condition:"deepEqual"}
],right:
[{context:[-1],terms:[1,2,3,Function.call,collect,[3]],condition:"deepEqual"}
,{context:[-2,-1],terms:[1,2,3,Function.call,collect,[2]],condition:["deepEqual"]}
],modular:
[{context:[-1,1],terms:[1,2,3,Function.call,collect,[1,3]],condition:["deepEqual"]}
,{context:[1,-1],terms:[1,2,3,Function.call,collect,[2]],condition:["deepEqual"]}
]}
 ,tether:
 {access:{context:["length"],terms:[[1,2],Function.call,2],condition:["equal"]}
 ,invoke:{context:["a"],terms:[{a:a=>a*2},3,Function.call,6],condition:["equal"]}
 ,method:{context:[provide([Array.prototype.map,a=>a*2])],terms:[[1],Function.call,[2]],condition:["deepEqual"]}
 ,idempotence:{context:[provide([function scope(){return this}])],terms:[2,Function.call,2],condition:["equal"]}
 }
 ,infer:
 {undefined:{context:[],terms:[Function.call,collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[0,Function.call,0],condition:["equal"]}
 ,append:
[{context:[5,1,2],terms:[0,3,4,Function.call,collect,[0,1,2,3,4,5]],condition:["deepEqual"]}
,{context:[3,4,5],terms:[0,1,2,Function.call,collect,[0,4,5,1,2,3]],condition:["deepEqual"]}
],access:{scope:[],context:["length"],terms:[0],condition:["equal"]}
 ,invoke:{context:[isNaN],terms:[{},Function.call,true],condition:["equal"]}
 ,method:
[{scope:[1],context:[provide(["map",crop(1)])],terms:[[1]],condition:["deepEqual"]}
,{scope:{a:a=>1},context:["a"],terms:[1],condition:["equal"]}
]}
 ,buffer:
[{context:[provide([a=>{throw Error()},fail=>2])],terms:[1,Function.call,2],condition:"equal"}
,{context:[provide([a=>2,fail=>3])],terms:[1,Function.call,2],condition:"equal"}
,{context:[provide([exit])],terms:[Function.call,is(Error),false],condition:"equal"}
],differ:
[{context:[provide([a=>a])],terms:[buffer,1,infer(Function.call),is(Error)],condition:"ok"}
,{context:[provide([a=>2])],terms:[buffer,1,infer(Function.call),2],condition:"equal"}
],either:
 {first:{context:[provide([a=>a*2,a=>a*3])],terms:[1,Function.call,2],condition:["equal"]}
 ,second:{context:[provide([a=>false,a=>a*3])],terms:[1,Function.call,3],condition:["equal"]}
 ,abscond:{context:[provide([a=>false,drop()])],terms:[1,Function.call,collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[1,Function.call,1],condition:["equal"]}
 ,neither:{context:[provide([differ()])],terms:[buffer,1,2,Function.call,is(Error),true],condition:["equal"]}
 ,promise:{context:[provide([a=>false,a=>2])],terms:[Promise.resolve(1),Function.call,2],condition:["equal"]}
 }
 ,wether:
 {boolean:
[{context:[provide([a=>true,1,2])],terms:[{1:"a"},infer(Function.call),"a"],condition:["equal"]}
,{context:[provide([a=>false,1,2])],terms:[{2:"a"},infer(Function.call),"a"],condition:["equal"]}
],indexed:{context:[provide([a=>a,swap(1),swap(2)])],terms:[null,1,infer(Function.call),2],condition:["equal"]}
 ,switch:{context:[provide([[a=>a,a=>true],swap(1),swap(2)])],terms:[null,false,infer(Function.call),2],condition:["equal"]}
 ,fallback:{context:[provide([[a=>a,a=>a],1,2,swap(3)])],terms:[null,false,infer(Function.call),3],condition:["equal"]}
 }
 ,combine:{context:[provide([a=>a*2,a=>a*3,a=>a*4])],terms:[1,Function.call,collect,[2,3,4]],condition:["deepEqual"]}
 ,route:
 {path:{scope:{a:{b:c=>c.body}},context:[["a","b"],{method:"post",body:1}],terms:[1],condition:["equal"]}
 ,method:{scope:{a:{get:c=>c.method}},context:[["a"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,beyond:{scope:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,broken:
[{scope:{a:{b:c=>{throw Error("fail")}}},context:[["a","b"]],terms:[is(Error)],condition:["ok"]}
,{scope:{a:{b:{get:c=>{throw Error("fail")}}}},context:[["a","b"],{method:"get"}],terms:[is(Error)],condition:["ok"]}
]}
 ,is:
 {something:{context:[provide([something])],terms:[0,Function.call,true],condition:["equal"]}
 ,nothing:{context:[],terms:[Function.call,false],condition:["equal"]}
 ,instance:{context:[provide([Function])],terms:[infer(undefined,function(){}),Function.call,true],condition:["equal"]}
 ,multiple:{context:[provide([iterable,a=>a.some(Boolean)])],terms:[[0,1,2],Function.call,true],condition:["equal"]}
 }
 ,revert:
[{context:[provide([(resolve,context)=>resolve(context)])],terms:[2,Function.call,2],condition:["equal"]}
,{context:[provide([(resolve,context)=>Promise.resolve(context).then(resolve)])],terms:[3,Function.call,3],condition:["equal"]}
]};
