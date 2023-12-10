 export const address=new URL(import.meta.url).pathname;
 export const location = address.replace(/\/[^/]*$/,"");
 var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m", blink:"\x1b[5m", reverse:"\x1b[7m",invisible:"\x1b[8m", black:"\x1b[30m", red:"\x1b[31m", green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m", magenta:"\x1b[35m",cyan:"\x1b[36m", white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};

 export async function prompt(...context)
{// request context from client interface, 
 // or offer it to the client (syncing the cli 
 // with debugPort and customizing it don't work yet). 
 let {createInterface}=await import("readline");
 let {stdin:input,stdout:output}=process;
 let socket=await import("net").then(({connect})=>connect(process.debugPort));
 let inspector=await createInterface({input:socket,output:socket});
 let shell=await createInterface({input,output});
 let abortion=new AbortController();
 let entries=context.flat().flatMap(term=>compound(term)?Object.entries(term):[[term]]);
 entries=await entries.reduce(record(([node,term])=>new Promise(resolve=>
 term?resolve(term):each("question",node+":",{signal:abortion.signal}
,combine(compose(swap(abortion),"abort"),resolve))(shell,inspector)).then(term=>
 [node,term]))
,[]);
 return compose(each("close"),swap(Object.fromEntries(entries)))(shell,inspector);
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
?[Object.getPrototypeOf(domain),domain].filter(Boolean).flatMap(domain=>
{try{return Reflect.ownKeys(domain);}catch(fail)
{console.warn(["warning: can't see all properties to attend ",term.name," on"].join("\""),domain," - ",fail.message);
 return Object.keys(domain);
};
}).find(field=>
{try{return Object.is(Reflect.get(domain,field),term);}catch(fail){};
})&&term
:Reflect.get(domain,term))
:undefined;
 let bound=attach||attend;
 if(detach)context.shift();
 if(!((bound??term) instanceof Function))
 return bound??provide([...context,term]);
 let functor=bound?Function.call.bind(bound):term;
 return functor(...context);
};

 export function differ(term,...context)
{// infer without allowing identity. 
 if(!defined(this))
 return tether(differ,...arguments);
 let fail=compose(swap([term?.name||term,"yielded identity of",JSON.stringify(this)].join(" ")),Error,exit);
 return compose.call(this,infer(term,...context),wether(same(this,...context),fail,infer()));
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
 return refer.call(provide(context,true),combinator,...terms);
},combinator,...terms);
 return combinator.call(this,...terms);
};

 export function tether(term,...context)
{// bind term to scope by prefixing "tether" for inference. (undefined scope will keep prepending context). 
 let bound=is(Function)(term)
?describe.call("tether ",function()
{return term.call(this,...arguments);
},term)
:term;
 return infer.call(this,bound,...context);
};

 export function either(functor,...functors)
{// alternative difference before last inference (errors cumulate in context)
 if(!defined(this))
 return refer(either,...arguments);
 let context=collect(this);
 let next=functors.length?buffer(differ(functor)):functor;
 return compose(next,function proceed(...terms)
{let fail=terms.length&&terms.every(is(Error));
 let valid=!fail&&terms.every(term=>is(something,not(nay))(term));
 if(valid)
 return provide(terms);
 let identity=fail&&terms.at(-1).message.startsWith((functor?.name||functor)+" yielded identity");
 if(functors.length)
 return either(...functors)(...context,...fail&&!identity?terms:[]);
 if(!fail)
 return provide(context);
 exit(terms.pop());
})(...context);
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
(is(Function)(condition)?condition:swap(condition)
,valid=>!numeric(valid)?valid?index:track:valid
)(...context);
},0),[])
,([track])=>functors[track??conditions.length]??
 compose(swap(Error([conditions.length,"conditions not satisfied:",trace().reverse().find(([term])=>term?.startsWith(wether.name))[0]].join(" "))),exit)
,infer.bind(provide(context))
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
 return provide(content);
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
 return tether(...arguments);
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
)
)
);
 context=[context,context.splice(...interval,...inject)][integral];
 return provide(context);
}),drop,...arguments);
};

 export var crop=drop.bind(null,0);
 export var swap=drop.bind(null,Infinity,0);

 export function note(...context)
{// expose context in console. (combine(compose(note,drop()),infer()))
 let stack=trace();
 let composition="provide.compose/Array.reduce/infer/infer(note)/provide.infer/note".split("/");
 let composed=composition.every((term,index,{length})=>stack.at(-length+index)?.[0]===term);
 stack=stack.slice(0,composed?-composition.length:-1);
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

 export function describe(factor,...context)
{// name factor after a bound prefix and context in its closure. 
 let functor=factor instanceof Function;
 let name=functor?context.shift()?.name:context.shift();
 if(this!==undefined)
 name=String(this)+name;
 if(!functor)
 return {[name]:factor};
 let value=context.reduce((value,context,field,{length})=>
[value
,typeof context!=="number"
?typeof context==="string"
?"\""+context.replace(/*/(?<=^.{9}).*//^([\s\S]{20})[\s\S]*$/,/*({length})=>length?"…":""*/(...match)=>match[1]+"…").replace(/\n/g,"")+"\""
:(context instanceof Function)
?context.name||"functor"
:(context?.constructor?.name??(typeof context).toLowerCase())
:String(context)
].join(field?",":"(")+(length-field-1?"":")")
,name);
 return Object.defineProperty(factor,"name",{value});
};

 export function defined(term){return term!==undefined;};
 export function compound(term){return typeof term==="object";};
 export function serial(term){return Symbol.iterator in term;};
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
 export function is(term=something,...terms)
{// express term as true if defined or satisfies term.
 if(!defined(this))
 return refer(is,...arguments);
 let [scope,...context]=collect(this);
 return [term,...terms].every(term=>/^[A-Z]/.test(term?.name)
?scope instanceof term
:infer(term)(scope,...context));
};
 export function not(...terms)
{// deny conditions
 return is(...terms.map(term=>compose(term,nay)));
};
 export function has(fields)
{if(this)
 return fields.every(this.hasOwnProperty.bind(this));
 return tether(has,fields);
};
 export function when(...terms)
{// demand conditions on context. 
 return function when(...context)
{terms=[terms].flat().flatMap(term=>compound(term)?Object.values(term):term);
 let index=terms.findIndex((term,index)=>!is(term)(context[index]));
 if(index+1)
 throw Error(terms[index].name+": "+context[index]);
 return provide(context,true);
};
};
 export function same(...context)
{if(!defined(this))
 return refer(same,...context);
 return compose(collect,context,(terms,context)=>context.length<terms.length||context.every((term,index)=>terms[index]===term))(this);
};

 export function wait(time)
{// hold context for time period.
 if(!defined(this))
 return refer(wait,time)
 return new Promise(resolve=>setTimeout(resolve,time)).then(infer.bind(this));
};

 export function expect(condition=something,time=500)
{// hold thread until factor satisfies condition. 
 if(!defined(this))
 return refer(expect,condition,time);
 return either(condition,compose(wait(time),expect(condition,time)))(this);
}

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

 export function trace(term,path=[])
{// trace term in scope or stack. 
 if(!something(term))
 return stack();
 let scope=this;
 if(scope===term||!scope)
 return path;
 return Object.entries(scope).reduce((hit,[track,scope])=>hit||
 [term===scope,path.concat(track)].reduce((hit,path)=>
 hit?path:(typeof scope=="object")?trace.call(term,scope,path):undefined)
,undefined);
};

 var term=
 // parse nodejs stack trace entry. 
 compose(either
(infer("match",compose(Object.values,infer("map",infer("source")),"","join",RegExp)(
 // at object.property/Promise.all
 {term:/at(?: async){0,1}(?: (Promise\.all|.*) | )/
 // (protocol:path/file:line:index)/(index 0)/(<anonymous>)
 ,location:/\(*((?:index [0-9]+)|(?:.+?(?::[0-9]+){0,2}))\)*$/
 }))
,swap([])
),infer("slice",1));

 export var stack=compose.bind(Error,combine
 // collect stack trace. 
(infer()
,compose(...combine(2)("stackTraceLimit"),describe)
,compose
({stackTraceLimit:Infinity},Object.assign
,Function.call,"stack",/\n */,"split",infer("slice",1)
,infer("map",term)
,combine(infer(),infer("findIndex",([term])=>term===trace.name))
,infer("slice")
,infer("slice",1)
,"reverse"
)
)
,combine(drop(2),compose(crop(2),Object.assign))
,crop(1));

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
 {full:{context:[],terms:[1,2,3,tether(Function.call),4,4],condition:"equal"}
 ,left:
[{context:[1],terms:[1,2,3,tether(Function.call),collect,[2,3]],condition:"deepEqual"}
,{context:[2,1],terms:[1,2,3,tether(Function.call),collect,[1,3]],condition:"deepEqual"}
],right:
[{context:[-1],terms:[1,2,3,tether(Function.call),collect,[3]],condition:"deepEqual"}
,{context:[-2,-1],terms:[1,2,3,tether(Function.call),collect,[2]],condition:["deepEqual"]}
],modular:
[{context:[-1,1],terms:[1,2,3,tether(Function.call),collect,[1,3]],condition:["deepEqual"]}
,{context:[1,-1],terms:[1,2,3,tether(Function.call),collect,[2]],condition:["deepEqual"]}
]}
 ,tether:
 {access:{context:["length"],terms:[[1,2],tether(Function.call),2],condition:["equal"]}
 ,invoke:{context:["a"],terms:[{a:a=>a*2},3,tether(Function.call),6],condition:["equal"]}
 ,method:{context:[provide([Array.prototype.map,a=>a*2])],terms:[[1],tether(Function.call),[2]],condition:["deepEqual"]}
 ,idempotence:{context:[provide([function scope(){return this}])],terms:[2,tether(Function.call),2],condition:["equal"]}
 }
 ,infer:
 {undefined:{context:[],terms:[tether(Function.call),collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[0,tether(Function.call),0],condition:["equal"]}
 ,append:
[{context:[5,1,2],terms:[0,3,4,tether(Function.call),collect,[0,1,2,3,4,5]],condition:["deepEqual"]}
,{context:[3,4,5],terms:[0,1,2,tether(Function.call),collect,[0,4,5,1,2,3]],condition:["deepEqual"]}
],access:{tether:[],context:["length"],terms:[0],condition:["equal"]}
 ,invoke:{context:[isNaN],terms:[{},tether(Function.call),true],condition:["equal"]}
 ,method:
[{tether:[1],context:[provide(["map",crop(1)])],terms:[[1]],condition:["deepEqual"]}
,{tether:{a:a=>1},context:["a"],terms:[1],condition:["equal"]}
]}
 ,buffer:
[{context:[provide([a=>{throw Error()},fail=>2])],terms:[1,tether(Function.call),2],condition:"equal"}
,{context:[provide([a=>2,fail=>3])],terms:[1,tether(Function.call),2],condition:"equal"}
,{context:[provide([exit])],terms:[tether(Function.call),is(Error),false],condition:"equal"}
],differ:
[{context:[provide([a=>a])],terms:[buffer,1,infer(Function.call),is(Error)],condition:"ok"}
,{context:[provide([a=>2])],terms:[buffer,1,infer(Function.call),2],condition:"equal"}
],either:
 {first:{context:[provide([a=>a*2,a=>a*3])],terms:[1,tether(Function.call),2],condition:["equal"]}
 ,second:{context:[provide([a=>false,a=>a*3])],terms:[1,tether(Function.call),3],condition:["equal"]}
 ,abscond:{context:[provide([a=>false,drop()])],terms:[1,tether(Function.call),collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[1,tether(Function.call),1],condition:["equal"]}
 ,neither:{context:[differ()],terms:[buffer,1,2,tether(Function.call),is(Error),true],condition:["equal"]}
 }
 ,wether:
 {boolean:
[{context:[provide([a=>true,1,2])],terms:[{1:"a"},infer(Function.call),"a"],condition:["equal"]}
,{context:[provide([a=>false,1,2])],terms:[{2:"a"},infer(Function.call),"a"],condition:["equal"]}
],indexed:{context:[provide([a=>a,swap(1),swap(2)])],terms:[null,1,infer(Function.call),2],condition:["equal"]}
 ,switch:{context:[provide([[a=>a,a=>true],swap(1),swap(2)])],terms:[null,false,infer(Function.call),2],condition:["equal"]}
 ,fallback:{context:[provide([[a=>a,a=>a],1,2,swap(3)])],terms:[null,false,infer(Function.call),3],condition:["equal"]}
 }
 ,combine:{context:[provide([a=>a*2,a=>a*3,a=>a*4])],terms:[1,tether(Function.call),collect,[2,3,4]],condition:["deepEqual"]}
 ,route:
 {path:{tether:{a:{b:c=>c.body}},context:[["a","b"],{method:"post",body:1}],terms:[1],condition:["equal"]}
 ,method:{tether:{a:{get:c=>c.method}},context:[["a"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,beyond:{tether:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,broken:
[{tether:{a:{b:c=>{throw Error("fail")}}},context:[["a","b"]],terms:[is(Error)],condition:["ok"]}
,{tether:{a:{b:{get:c=>{throw Error("fail")}}}},context:[["a","b"],{method:"get"}],terms:[is(Error)],condition:["ok"]}
]}
 ,is:
 {something:{context:[],terms:[0,tether(Function.call),true],condition:["equal"]}
 ,nothing:{context:[],terms:[tether(Function.call),false],condition:["equal"]}
 ,instance:{context:[provide([Function])],terms:[infer(undefined,function(){}),tether(Function.call),true],condition:["equal"]}
 ,multiple:{context:[provide([serial,a=>a.some(Boolean)])],terms:[[0,1,2],tether(Function.call),true],condition:["equal"]}
 }
 };
