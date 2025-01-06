 export const address=new URL(import.meta.url).pathname;
 export const location=address.replace(/\/[^/]*$/,"");
 var browser=globalThis.window||(globalThis.constructor.name==="DedicatedWorkerGlobalScope");
 export var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",bold:"\x1b[3m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",invisible:"\x1b[8m",black:"\x1b[30m",red:"\x1b[31m",green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};
 var {log,trace:trc}=console;

 export var crop=drop.bind(null,0);
 export var slip=drop.bind(null,0,0);
 export var swap=drop.bind(null,Infinity,0);

 export function something(term){return defined(term??undefined);};
 export function defined(term){return term!==undefined;};
 export function none(term){return term===null;};
 export function functor(term){return typeof term==="function";};
 export function asynchronous(term){return ["AsyncGeneratorFunction","AsyncFunction"].includes(term?.constructor?.name);};
 export function binary(term){return typeof term==="boolean";};
 export function string(term){return typeof term==="string";};
 export function numeric(term){return typeof term==="number"};
 export function simple(term){return term?.constructor?.name==="Object";};
 export function compound(term){return Boolean(typeof term==="object"&&term);};
 export function basic(term){return compound(term)&&(simple(term)||array(term));};
 export function generator(term){return term?.constructor?.constructor?.name==="GeneratorFunction";};
 export function asyncgenerator(term){return term?.constructor?.constructor?.name==="AsyncGeneratorFunction";};
 export function ascending(past,next){return (past<=next)-1;};
 export function minor(past,next){if(!defined(next))return compose(when(numeric),infer(minor,past));return past<next;};
 export function major(past,next){if(!defined(next))return compose(when(numeric),infer(major,past));return next<past;};
 export var array=Array.isArray;
 export var iterable=buffer(term=>Symbol.iterator in term,swap(false));
 export var plural=term=>generator(term)||asyncgenerator(term);
 export var nothing=not(something);
 export var promise=term=>term instanceof Promise;
 export var pattern=is(RegExp);
 export function not(term){return compose.call(this,term,is(false));};
 export function is(...terms)
{// reduce context to binary of satisfying respective terms. 
 if(!defined(this))
 return confer(is,...terms);
 let context=collect(this);
 return !context.some((scope,index)=>
 ![terms[index]??[]].flat().every(term=>functor(term)
?/^[A-Z]/.test(term.name)
?scope instanceof term
:term(scope)
:Object.is(scope,term)));
};
 export function are(...terms)
{// reduce context to binary of satisfying terms. 
 if(!defined(this))
 return confer(are,...terms);
 return collect(this).every(is(terms));
};
 export function same(...context)
{if(!defined(this))
 return confer(same,...context);
 return compose
(collect,collect(...context),(terms,context)=>
 !context.some((context,index)=>context!==terms[index])
)(this);
};
 export function has(fields)
{if(!defined(this))
 return tether(has,fields);
 if(!compound(this)&&!functor(this))
 return false;
 return [fields].flat().every(field=>field in this);
};
 export function match(next,past)
{if(arguments.length<2)
 return infer(match,next);
 return pattern(past)
?past.test(next)
:functor(past)
?past(next)
:compound(past)
?!Object.entries(past).some(([field,value])=>!match(value,next[field]))
:past===next;
};
 export function pdflike(buffer)
{if(!buffer||buffer.length<4)return false;
 return [0x25,0x50,0x44,0x46].every((code,index)=>buffer[index]===code);
};

 export function when(...terms)
{// demand conditions on context. 
 if(!defined(this))
 return confer(when,...terms);
 let context=collect(this);
 terms=[terms].flat().flatMap(term=>compound(term)?Object.values(term):term);
 let index=terms.findIndex((term,index)=>!is(term)(context[index]));
 if(index+1)
 throw Error(terms[index].name+": "+context[index]);
 return provide(context,true);
};

 export function drop(stop=Infinity,start=0,...inject)
{// filter context between indexes (or outside if stop<start), 
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
(combine(1),0,infer("sort",(stop,start)=>(start<stop)?1:-1)
,combine(infer(0),infer("reduce",(past,next)=>next-past))
,collect
)
)
);
 context=[context,context.splice(...interval,...inject)][integral];
 return provide(context);
}),drop,...arguments);
};

 export function pass(term,...context)
{return infer(describe(function(...terms)
{return compose(combine(infer(),infer(term,...context)),crop(terms.length))(...terms);
},pass,term));
};

 export function ascend(term,limit,path=[])
{if(path.length>limit)
 return [];
 return (term??undefined)!==undefined?[...ascend(Object.getPrototypeOf(term),limit,[path,term].flat()),term]:[];
};

 export function fields(term)
{return ascend(...arguments).flatMap(term=>
{try{return Reflect.ownKeys(term);}catch(fail)
{console.warn("warning: can't see all properties on",typeof term," - ",fail.message);
 if(term instanceof String)
 if(term.length>1000)
 return [];
 return Object.keys(term);
};
});
};

 export function* iterate(term)
{if(!iterable(term))exit(Error(["can't",iterate.name,typeof term].join(" ")));
 yield* term;
};

 var expand=
[term=>term instanceof Promise,context=>Promise.all(context)
,generator,context=>context.flatMap(term=>generator(term)?[...term]:[term])
,asyncgenerator,context=>context.reduce(function resolve(context,term)
{return context instanceof Promise
?context.then(context=>resolve(context,term))
:asyncgenerator(term)
?term.next().then(({value,done})=>!done?resolve(context,term).then(next=>
 next.splice(context.length,0,value)&&next):[...context])
:[...context,term]
},[])
,term=>term instanceof Promise,context=>Promise.all(context)
].map((condition,index,actions)=>
 actions.splice(index,2,actions.slice(index,index+2))).map(([condition,expand])=>
 context=>context.some(condition)?expand(context):context);
 
 export function collect(...context)
{// cumulate context (whether singular, plural and/or asynchronous) in an array. 
 return expand.reduce((context,expand)=>
 context instanceof Promise?context.then(expand):expand(context)
,context);
};

 export function provide(context,agnostic)
{// express plurality with Generator (singularity ignored if agnostic). 
 if(context instanceof Promise)
 return context.then(context=>provide(context,agnostic));
 return agnostic||(array(context)&&(context.length!==1))
?function* provide(context)
{yield* array(context)?context:[context];
}(context)
:array(context)?context[0]:context;
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
},infer,term,...pretext);
 let context=collect(this,...pretext);
 if(context instanceof Promise)
 return context.then(context=>
 infer.call(provide(context,true),term));
 if(!defined(term))
 return provide(context);
 let [scope]=context;
 let map=functor(term);
 let combinator=map&&term.name.includes("(");
 let prebound=map&&term.name.startsWith("bound ");
 let prefix=/^tether /;
 let detach=string(term)&&prefix.test(term)&&term.replace(prefix,"");
 let attach=map&&prefix.test(term.name)&&term;
 let attend=!prebound&&!attach&&defined(scope??undefined)&&!array(term)&&!combinator
?[Object(scope),detach||term].reduce((domain,term)=>map
?(domain[term.name]===term||fields(domain?.buffer instanceof ArrayBuffer?Object.getPrototypeOf(domain):domain).find(field=>
{try{return Object.is(Reflect.get(domain,field),term);}catch(fail){};
}))&&term
:Reflect.get(domain,term?.toString?term:null))
:undefined;
 let bound=attach||attend;
 if(detach)context.shift();
 if(!functor(bound??term))
 return bound??provide([...context,term]);
 let inference=bound?Function.call.bind(bound):term;
 return inference(...context);
};

 export function tether(term,...context)
{// bind term to scope by inferring with a "tether" prefix. 
 let bound=functor(term)
?describe.call("tether ",function(){return term.call(this,...arguments);},term)
:term;
 if(defined(this))
 return infer.call(this,bound,...context);
 return compose(when(defined),infer(bound,...context));
};

 export function confer(term,...terms)
{// call term on collected dynamic context without prepending it with terms. 
 if(!defined(this))
 return describe(function(...context)
{if(defined(this))
 context.unshift(this);
 return confer.call(provide(collect(...context),true),term,...terms);
},term,...terms);
 if(this instanceof Promise)
 return this.then(context=>confer.call(context,...arguments));
 if(functor(term))
 return term.call(this,...terms);
 return provide(collect(this,term,...terms));
};

 export function differ(term)
{// infer without allowing identity. 
 if(!defined(this))
 return confer(differ,term);
 let context=collect(this);
 let fail=compose(swap([term?.name||String(term),"yielded identity of",JSON.stringify(this)].join(" ")),Error,exit);
 return compose.call(this,infer(term,provide(context)),wether(same(provide(context)),fail,infer()));
};

 export function buffer(term,quit=infer())
{// alternative inference for failure. 
 if(!defined(this))
 return confer(buffer,term,quit);
 let context=collect(this);
 try
{let next=infer(term)(...context);
 return next instanceof Promise?next.catch(infer(quit,...context)):next;
}catch(fail){return quit(fail,...context);};
};

 export function either(...terms)
{// alternative difference before last inference. 
 if(!defined(this))
 return confer(either,...arguments);
 let context=collect(this);
 let reset=swap(...context);
 let identity=same(...context);
 let valid=are(something,not(is(false)),not(is(Error)));
 return terms.reduce((context,term,index)=>compose(wether
([!index,identity,valid]
,term,term,infer(),compose(reset,term)
))(context),provide(context));
};

 export function wether(condition,...terms)
{// conditional inference. 
 if(!defined(this))
 return confer(wether,...arguments);
 let context=collect(this);
 let conditions=[condition].flat();
 return compose.call
(conditions
,infer("reduce",record(function(condition,index,{length})
{let [track]=this;
 return track??compose
(functor(condition)?buffer(condition):swap(condition)
,valid=>!numeric(valid)?valid&&!is(Error)(valid)?index:track:valid
)(provide(context));
},0),[])
,([track])=>terms[track??conditions.length]??infer()
 //compose(swap(Error(["conditions not satisfied:",trace().reverse().find(([term])=>term?.startsWith(wether.name))[0]].join(" "))),exit)
,infer.bind(provide(context,true))
);
};

 export function compose(...terms)
{// recursive inference agnostic of dynamic context. 
 if(!defined(this))
 return confer(compose,...arguments);
 return terms.reduce(function inference(context,term)
{return infer(term)(context);
},this);
};

 export function combine(...terms)
{// parallel inference/multiplication (church arithmetic, should be "split"). 
 if(!defined(this))
 return confer(combine,...arguments);
 let context=collect(this);
 let [factor]=context;
 let records=Object.entries(Object(factor));
 let content=terms.map(term=>!numeric(term)
?compose.call(context,provide,term)
:Object.assign([]
,Array(Math.floor(term)).fill(factor)
,term%1&&
 {[Math.floor(term)]:records.length
?compose.call(records.slice(0,term%1*records.length)
,Object.fromEntries,...array(factor)?[Object.values]:[])
:term%1*factor
 }));
 return provide(collect(...content));
// length?compose(drop(),functor,Math.ceil,Array,fields,"fill","flat",[]
// ,tether("reduce",(records,field,index,fields)=>
// (index%Math.round(functor*length)||
//  records.push(fields.slice(index,index+functor*length))
// )&&records))
};

 export function each(term,...context)
{if(!defined(this))
 return confer(each,...arguments);
 if(this instanceof Promise)
 return this.then(scope=>each.call(scope,...arguments));
 let scope=plural(this)?this:provide([this].flat(),true);
 let next=(scope,past)=>infer.call(past[past.push(scope.next())-1],"done");
 let unfold=describe(generator(scope)&&!asynchronous(term)
?function*({past,scope,resolve})
{while(!next(scope,past))
 yield resolve(...arguments);
}
:async function*({past,scope,resolve})
{while(!await next(scope,past))
 yield* await collect(resolve(...arguments));
},"unfold");
 return unfold(
 {past:[],scope,term,context,resolve({past,term,context})
{let next=infer(array(term)?term[past.length-1]:term,past.length-1,...context);
 return compose("value",next)(past.at(-1));
}});
 // return compose(collect,infer("map",(value,index,record)=>
 // infer(array(term)?term[index]:term,...context,index,record)(value)),provide)(this);
};

 export function record(term,field="length",...context)
{// assign term to field of dynamic scope.
 if(!defined(this))
 return array(field)
?field.filter(something).reverse().reduce((scope,field)=>({[field]:scope}),term)
:tether(record,term,field,...context);
 let path=compose(tether(field),collect,"pop")(this,...context);
 if(!defined(path)||something(this[path]))
 return this;
 return compose.call(this,combine
(crop(1)
,compose(tether(term,...context),term=>something(term)?record(term,[path]):{})
),Object.assign
);
};

 export function remember(term,distinction="0")
{// record on an implicit scope. 
 let scope=this||[];
 return either
(compose(slip(scope),tether(distinction),slip(scope),Reflect.get)
,compose(slip(scope),combine(record(term,distinction),tether(distinction)),Reflect.get)
);
};

 export function route(term,...context)
{// compose with static context, methodic and scope-rebound alternatives. 
 if(!this)return tether(route,...arguments);
 let scope=this;
 let path=[term].flat();
 let method=context[0]?.method?.toLowerCase();
 let methodic=combine(method,drop(1));
 // record for methodic route taken. 
 let branch=[];
 let branched=compose(swap(branch),"length",major(0));
 let fail=compose(swap(branch),Error("not found"),"concat",infer("find",is(Error)),exit);
 let terms=path.map(term=>infer(either
(term
,wether(has(method),buffer(compose(methodic,differ(term),pass(record(drop(1,2)).bind(branch))),swap(undefined)),infer())
,tether(scope[term])
,fail
),...context));
 let composition=compose(...terms,wether
 // invoke method if not done already. 
(branched,infer(),either(infer(method,...context),crop(1))
));
 return scope?composition(scope):composition;
};

 export function note(...context)
{// expose context in console. (combine(compose(note,drop()),infer()))
 let stack=trace().slice(0,-1);
 // let composition="compose/reduce/compose/infer\\((bound )*note\\)/infer/note".split("/");
 // let composed=composition.every((term,index,{length})=>RegExp(term+"$").test(stack.at(index-length)?.[0]));
 // stack=stack.slice(0,composed?-composition.length:-1);
 let {steady,dim,bright,blue,gray,bold}=colors;
 let source=dim+gray+"@"+bright+blue+stack.at(-1)?.[1]||"...intractable";
 stack=compose.call
(stack
,infer("map",([term,position],index,{length})=>length-index-1
?term||position?.replace("file://"+location,".")
:(steady+bright+blue+term))
,dim+blue+"/"+dim+gray,"join"
)+steady;
 let stream=console[this?"info":"log"];
 console.groupCollapsed(steady+bright+bold+blue+" "+clock(new Date())+source+steady);
 stream(bright+blue+stack+steady+":");
 console.groupEnd();
 let color=!compound(this)&&this;
 let phase=colors[color]||Object.values(colors)[color]||steady;
 if(!browser)process.stdout.write(phase);
 else context.unshift(phase),context.push(steady);
 stream(...browser&&context.every(string)?[context.join("")]:context);
 if(!browser)process.stdout.write(steady);
 else context.shift(),context.pop();
 return provide(context);
};

 var stack=compose
 // parse nodejs stack trace entry. 
(either
(infer("match",compose(Object.values,infer("map",infer("source")),"","join",RegExp)(
 // at object.property/Promise.all
 {term:/at(?: async){0,1}(?: (Promise\.all|.*) | )/
 // (protocol:path/file:line:index)/(index 0)/(<anonymous>)
 ,location:/\(*((?:index [0-9]+)|(?:.+?(?::[0-9]+){0,2}))\)*$/
 }))
,swap([])
),infer("slice",1),infer("map",match=>match||"anonymous")
);

 export function trace(term,path=[])
{// trace term in scope or stack. 
 if(!something(term))
 return compose.call
(Error,combine
 // collect stack trace. 
(infer()
,compose("stackTraceLimit",["stackTraceLimit"],record)
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

 export function observe(action,register)
{// construct event (pair) fragments (css pseudoclasses for js)
 // and (un)register them on bound Node. 
 if(!defined(this)&&register)
 return tether(observe,...arguments);
 if(defined(this)&&!defined(register))
 register=true;
 //let propagate=register>1;
 let binary=
 {hover:['mouseover','mouseout']
 ,mouse:['mouseover','mouseout']
 ,focus:['focusin','focusout']
 ,touch:['pointerover','pointerout']
 };
 let entries=[action].flat().flatMap(action=>
 simple(action)?Object.entries(action):[[action?.name,action]]).flatMap(([name,action])=>
 binary[name]?.map((event,index,[start])=>[event,index?rebind:action])||
 [[name,action]]);
 if(!defined(this))
 return Object.fromEntries(entries);
 let {ResizeObserver:resize,MutationObserver:mutate}=this?.ownerDocument?.defaultView||{};
 let constructor={resize,mutate};
 let method=["EventListener".replace(/^/,register?'add':'remove'),"on"].find(has.bind(this));
 return entries.reduce((scope,[event,action])=>constructor[event]
?action
?compose.call(constructor[event],[action],Reflect.construct,combine
(infer("observe",scope,register)
,observer=>scope[method]("unobserve",({detail})=>detail===event&&observer.unobserve(this),{once:true})
),swap(scope))
:scope.dispatchEvent(new CustomEvent("unobserve",{detail:event}))||scope
:scope[method](event,action,register)||scope
,this);
 function rebind(event)
{//if(!propagate)event.stopPropagation();
 let type=event.type.replace(/out$/,"");
 let start={focus:"in"}[type]||"over";
 let constructor=type.replace(/^./,infer("toUpperCase"))+"Event";
 this.dispatchEvent(new globalThis[constructor](type+start,event));
};
};

 export function describe(term,...context)
{// name term after a bound prefix and context in its closure. 
 if(!functor(term))
 try{exit("can't describe "+term);} catch(f){console.log(term,typeof term);throw f}
 let prefix=String(this||"");
 let eponymous=context.shift();
 let name=[prefix,eponymous?.name||eponymous].filter(Boolean).join("");
 let abbreviation=/^([\s\S]{20})[\s\S]*$/;
 let value=context.reduce((value,term,index,{length})=>
[value
,!numeric(term)
?string(term)
?"\""+term.replace(abbreviation,(...match)=>match[1]+"…").replace(/\n/g,"")+"\""
:(functor(term))
?(term.name||"functor")
:(term?.constructor?.name??(typeof term).toLowerCase())
:String(term)
].join(index?",":"(")+(length-index-1?"":")")
,name);
 return Object.defineProperty(term,"name",{value});
};

 export function wait(time)
{// hold context for time period.
 if(!defined(this))
 return confer(wait,time);
 return new Promise(resolve=>setTimeout(resolve,time)).then(infer.bind(this));
};

 export function expect(condition=something,interval=500,limit=Infinity)
{// hold thread until context satisfies condition. 
 if(!defined(this))
 return confer(expect,...arguments);
 if(!limit)return infer(condition)(this);
 let context=collect(this);
 let repeat=compose(wait(interval),swap(provide(context)),expect(condition,interval,limit-1));
 return either(condition,repeat)(provide(context));
};

 export function revert(term,...context)
{// revert a Promise's inversion of control. 
 if(!defined(this))
 return confer(revert,...arguments);
 return new Promise(compose(...context,this,term));
};

 export function control(controller,...context)
{when(is(AbortController))(...arguments);
 // observe an abort signal, optionally composing it with a context for explicit abortion. 
 return revert((resolve,reject,controller,...context)=>
 context.reduce((signal,term,index,context)=>
 compose(buffer(term),slip(controller),"abort")({signal},...context.splice(1))
,observe.call(controller.signal,{abort({target:{reason}})
{(reason instanceof Error?reject:resolve)(reason);
}},{once:true})))(...arguments);
};

 export function exit(fail){throw fail;}

 export function clock(mark,precision="time")
{let number=!isNaN(Number(mark));
 if(number)
 mark=new Date(string(mark)
?mark.split("").reduce((date,mark,index,{length})=>
 date+(index&&!(index%2)?index>2?index>7?index===8?" ":":":"/":"":"")+mark
,"")
:mark);
 if(string(mark))
 mark=new Date(mark);
 //[new Date(mark),new Date(new Date(mark).getTime()+new Date(mark).getTimezoneOffset()*60*1000)].reduce((utc,date)=>
 //date.setHours(utc.getHours()-utc.getTimezoneOffset()/60)&&date);
 if(!is(Date)(mark))
 mark=new Date();
 let [date,time,minute]="date/time/minute".split("/").map(range=>precision.includes(range));
 return (
[...Object.assign(Array(3),date&&[mark.getFullYear(),mark.getMonth()+1,mark.getDate()])
,...Object.assign(Array(3),(time||minute)&&[mark.getHours(),mark.getMinutes(),!minute&&mark.getSeconds()])
]).map(value=>numeric(value)?String(value):"").reduce((time,value,index,times)=>
{if(!value)return time;
 let zeros="0".repeat(Math.max(2,value.length)-value.length);
 let separator=times[index-1]&&index?index<4?index==3?". ":".":":":"";
 return time+separator+zeros+value;
},"");
};

 // OBSOLETE (weak variations of infer, compose, tether) 

 export var apply=(context,term)=>
 // apply or append term to context (respecting plurality and asynchronicity).
 [context,term].some(context=>context instanceof Promise)
?Promise.all([context,term]).then(([context,term])=>apply(context,term))
:functor(term)
?term(...collect(context))
:provide(collect(context,term));

 // consecutive application.
 export function stream(context,...terms){return terms.reduce(apply,context);}

 export function bind(factor,...pretext)
{// bound inference. (univalence axiom) 
 let bound=functor(factor)
?describe.call("tether ",function()
{return factor.call(...arguments);
},factor)
:factor;
 // when monadic inference is ready. 
 //return infer.call(this,bound,...pretext);
 return bound;
};

 export var tests=
 {collect:
[{context:[1,2,3,4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,Promise.resolve(2),3,4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,provide([2,3]),4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,provide([2,Promise.resolve(3),4])],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,2,async function*(){yield* [3,4]}()],terms:[[1,2,3,4]],condition:["deepEqual"]}
],drop:
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
 ,confer:
 {scope:{context:[function(){return this;}],terms:[1,2,3,"call",collect,[1,2,3]],condition:["deepEqual"]}
 ,terms:{context:[function(term){return term;},4],terms:[1,2,3,"call",4],condition:["equal"]}
 }
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
 //,fail:{context:[provide([a=>exit(Error("b")),(a,b)=>b.message])],terms:[1,Function.call,"b"],condition:["equal"]}
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
 {path:{scope:{a:{b:c=>c.body}},context:[["a","b"],{body:1}],terms:[1],condition:["equal"]}
 ,method:{scope:{a:{get:c=>c.method}},context:[["a"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,beyond:{scope:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,broken:
[{scope:{a:{b:c=>{throw Error("fail")}}},context:[["a","b"]],terms:[is(Error)],condition:["ok"]}
,{scope:{a:{b:{get:c=>{throw Error("fail")}}}},context:[["a","b"],{method:"get"}],terms:[is(Error)],condition:["ok"]}
]}
 ,is:
 {something:{context:[something],terms:[0,Function.call,true],condition:["equal"]}
 ,nothing:{context:[],terms:[Function.call,false],condition:["equal"]}
 ,instance:{context:[provide([Function])],terms:[infer(undefined,function(){}),Function.call,true],condition:["equal"]}
 ,multiple:{context:[[iterable,a=>a.some(Boolean)]],terms:[[1,2],Function.call,true],condition:["equal"]}
 ,respective:{context:provide([[iterable,a=>a.some(Boolean)],a=>a==="a"]),terms:[[1,2],"a",Function.call,true],condition:["equal"]}
 }
 ,match:{context:Array(2).fill({a:{b:"a"},c:5}),terms:[true],condition:["equal"]}
 ,revert:
[{context:[provide([(resolve,reject,context)=>resolve(context)])],terms:[2,Function.call,2],condition:["equal"]}
,{context:[provide([(resolve,reject,context)=>Promise.resolve(context).then(resolve)])],terms:[3,Function.call,3],condition:["equal"]}
]};
