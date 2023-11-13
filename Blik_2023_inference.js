 export const address=new URL(import.meta.url).pathname;
 export const location = address.replace(/\/[^/]*$/,"");

 export function defined(term){return term!==undefined;};
 export function compound(term){return typeof term==="object";};
 export function serial(term){return Symbol.iterator in term;};
 export function array(term){return Array.isArray(term);};
 export function binary(term){return typeof term==="boolean";};
 export function string(term){return typeof term==="string";};
 export function aye(term){return Object.is(term,true);};
 export function nay(term){return Object.is(term,false);};
 export var something=compose(term=>term??undefined,defined);
 export var nothing=not(something);
 export var numeric=not(isNaN);
 export var pattern=is(RegExp);
 export var promise=is(Promise);
 export function is(term=something,...terms)
{// express term as true if defined or satisfies term.
 if(!defined(this))
 return tether(is,term,...terms);
 return [term,...terms].every(term=>/^A-Z/.test(term.name)
?this instanceof term
:infer(term)(this));
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
 return plural(...context);
};
};

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

 export function trace(factor,path=[])
{// trace factor in scope or stack. 
 let scope=this;
 let remarks=compose.call(
{term:/at (?:async )*([^ ]*)/
,file:/(?:.*[\(_|\/])*(.*?)/
,location:/(?:.js)*(?::[0-9]+){0,2}/
},Object.values,infer("map",infer("source")),"","join",RegExp);
 if(!something(factor))
 return compose.call
(Error,combine
(infer()
,compose(...Array(2).fill("stackTraceLimit"),describe)
,compose
({stackTraceLimit:Infinity},Object.assign
,Function.call,"stack",/\n */,"split"
,infer("map",compose
(infer("replace","file://"+location,".")
,infer("match",remarks)
,combine(infer("slice",1,3),"input")
,combine("concat")
,infer("reverse")
))
)
),combine
(drop(2)
,compose(drop(0,2),Object.assign)
)
,drop(0,1)
,combine(infer(),infer("findIndex",({2:term})=>term==trace.name))
,infer("slice")
,infer("slice",1)
);
 if(scope===factor||!scope)
 return path;
 return Object.entries(scope).reduce((hit,[track,scope])=>hit||
 [factor===scope,path.concat(track)].reduce((hit,path)=>
 hit?path:(typeof scope=="object")?trace.call(factor,scope,path):undefined)
,undefined);
};

 export function note(...context)
{// expose context in console. 
 let stack=trace().slice(1);
 let source=Object.values(stack)[0]?.[0]||"...intractable";
 stack=compose.call
(stack.reverse()
,infer("map",compose(drop(0,1),infer("slice",1),infer("filter",Boolean),".","join"))
,infer("map",(stack,index,{length})=>(index+1==length?"\x1b[36m\x1b[7m":"")+stack)
,"\x1b[0m/\x1b[36m","join"
)+"\x1b[0m";
 source=!globalThis.window?"\x1b[30m"+source+"\x1b[0m":source;
 console.log("\x1b[36m\x1b[7m"+clock(new Date())+"\x1b[0m "+stack+" ("+source+"\x1b[36m)\x1b[0m:\n");
 console.log(...context);
 return provide(context);
};

export function plural(...context) {
  // express plurality with Generators.
  context = context.flatMap((term) =>
    term?.constructor?.constructor?.name === "GeneratorFunction" ? [...term] : [term]
  );
  return (function* () {
    yield* context;
  })();
}

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

export var apply = (context, term) =>
  // apply or append term to context (respecting plurality and asynchronicity).
  [context, term].some((context) => context instanceof Promise)
    ? Promise.all([context, term]).then(([context, term]) => apply(context, term))
    : term instanceof Function
    ? term(...plural(context))
    : plural(context, term);

export function stream(context, ...terms) {
  // consecutive application.
  return terms.reduce(apply, context);
}

export var wait = (time, ...context) =>
  // halt thread for a time period.
  new Promise((resolve) => setTimeout(resolve.bind(undefined, plural(...context)), time));

 export function exit(fail){throw fail;}

// MONADIC

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
?context.replace(/(?<=^.{9}).*/,({length})=>length?"…":"")
:(context instanceof Function)
?context.name||"functor"
:(context?.constructor?.name??(typeof context).toLowerCase())
:String(context)
].join(field?",":"(")+(length-field-1?"":")")
,name);
 return Object.defineProperty(factor,"name",{value});
};

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
 return provide([context,context.splice(...interval,...inject)][integral]);
}),drop,...arguments);
};

 export var crop=drop.bind(null,0);
 export var swap=drop.bind(null,Infinity,0);

 export var collect=
 // cumulate context (wether signular, plural and/or asynchronous) in an array. 
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

 export function record(factor,distinction="length")
{// cumulate terms (of configurable distinction) on dynamic domain. 
 if(factor instanceof Function)
 return tether(function record(...context)
{let field=compose(tether(distinction),collect,"pop")(this,...context);
 if(something(this[field]))
 return this;
 return compose.call(this,combine
(infer()
,compose(tether(factor,...context),term=>something(term)?describe(term,field):{})
),Object.assign
);
});
 return Array.from(factor);
};

 export function infer(term,...pretext)
{// call/attach/detach/attend or append term on collected and dynamically prepended context. 
 if(this===undefined)
 return describe(function(...context)
{if(this!==undefined)
 context.unshift(this);
 let scope=collect(context.shift());
 return infer.call(provide(scope,true),term,...pretext,...context);
},infer,...arguments);
 let context=collect(this,...pretext);
 if(context instanceof Promise)
 return context.then(context=>
 infer(term)(...context));
 if(term===undefined)
 return provide(context);
 let scope=context.shift();
 let prefix=/^tether /;
 let detach=typeof term==="string"&&prefix.test(term)&&term.replace(prefix,"");
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
 if(!detach)context.unshift(scope);
 if(!((bound??term) instanceof Function))
 return bound??provide([...context,term]);
 let functor=bound?Function.call.bind(bound):term;
 return functor(...context);
};

 export function buffer(term,quit=provide,...context)
{// alternative inference for failure. 
 if(!this)
 return tether(buffer,term,quit,...context);
 context=collect(this,...context);
 try
{context=infer(term)(...context);
 return context instanceof Promise?context.catch(quit):context;
}catch(fail){return quit(fail);};
};

  export function tether(term,...context)
{// bound inference. (univalence axiom - undefined scope will return identity). 
 let bound=term instanceof Function
?describe.call("tether ",function()
{return term.call(this,...arguments);
},term,...context)
:term;
 return infer.call(this,bound,...context);
};

 export function either(functor,...functors)
{// alternative inference until assertive term found. (errors cumulate in context)
 if(this===undefined)
 return describe(function(...context)
{if(this!==undefined)context.unshift(this);
 return either.call(provide(context,true),functor,...functors);
},either,...arguments);
 let context=collect(this);
 if(functor===undefined)
 return context.shift();
 return compose(buffer(functor,provide),function proceed(...terms)
{let identity=context.length&&context.every((term,index)=>terms[index]===term);
 let valid=!identity&&(!terms.length||terms.some(term=>not(nothing,nay,term=>term instanceof Error)(term)));
 if(valid)
 return provide(terms);
 if(functors.length)
 return either(...functors)(...context,...identity?[]:terms);
 exit(identity?Error([functor.name||functor,"yielded identity"].join(" ")):terms)
})(...context);
};

 export function wether(condition,...functors)
{// conditional inference. 
 if(this===undefined)
 return describe(function(...context)
{context.unshift(this);
 return wether.call(provide(context,true),condition,...functors)
},wether,...arguments);
 let context=collect(this);
 let conditions=[condition].flat();
 return compose.call
(conditions
,infer("reduce",record(function(condition,index,{length})
{let [track]=this;
 return track??compose
(condition instanceof Function?tether(condition):swap(condition)
,valid=>typeof valid!=="number"?valid?index:track:valid
)(...context);
},0),[])
,either(0,drop())
,track=>functors[track??conditions.length]||drop()
,tether.bind(provide(context))
);
};

 export function compose(...terms)
{// recursive inference agnostic of dynamic context. 
 if(this===undefined)
 return describe(function(...context)
{if(this!==undefined)
 context.unshift(this);
 return compose.call(provide(context,true),...terms);
},compose,...terms);
 return terms.reduce(describe((context,term)=>
 infer(term)(context),infer)
,this);
};

 export function combine(...functors)
{// parallel inference/multiplication (church numerals) on plural domain. 
 if(this===undefined)
 return describe(function(...context)
{if(this!==undefined)
 context.unshift(this);
 return combine.call(provide(context),...functors);
},combine,...functors);
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

 export function route(functor,...context)
{// compose with static context, methodic calls and scope rebinds. 
 let scope=this;
 if(!scope)return tether(route,...arguments);
 let method=context[0]?.method;
 let fail=compose(drop(-1),a=>a instanceof Error);
 let functors=[functor].flat().map(functor=>infer(buffer(either
(infer(functor)
,wether(fail,drop(-1),compose(infer(method),infer(functor),crop(1)))
,wether(fail,drop(-1),tether(scope[functor]))
,wether(fail,drop(-1),tether(scope[method]))
)),...context));
 let composition=compose(...functors);
 return scope?composition(scope):composition;
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
 // unintended idempotence. 
 //,idempotence:{context:[function scope(){return this}],terms:[undefined,tether(Function.call),2],condition:["equal"]}
 }
 ,infer:
 {undefined:{context:[],terms:[tether(Function.call),undefined],condition:["equal"]}
 ,identity:{context:[],terms:[0,tether(Function.call),0],condition:["equal"]}
 ,append:
[{context:[5,1,2],terms:[0,3,4,tether(Function.call),collect,[0,1,2,3,4,5]],condition:["deepEqual"]}
,{context:[3,4,5],terms:[0,1,2,tether(Function.call),collect,[0,4,5,1,2,3]],condition:["deepEqual"]}
],access:{tether:[],context:["length"],terms:[0],condition:["equal"]}
 ,invoke:{context:[isNaN],terms:[{},tether(Function.call),true],condition:["equal"]}
 ,method:
[{tether:[1],context:[provide(["map",either()])],terms:[[1]],condition:["deepEqual"]}
,{tether:{a:a=>1},context:["a"],terms:[1],condition:["equal"]}
]}
 ,buffer:
[{context:[provide([a=>{throw Error()},fail=>2])],terms:[1,tether(Function.call),2],condition:"equal"}
,{context:[provide([a=>2,fail=>3])],terms:[1,tether(Function.call),2],condition:"equal"}
]
 ,either:
 {first:{context:[provide([a=>a*2,a=>a*3])],terms:[1,tether(Function.call),2],condition:["equal"]}
 ,second:{context:[provide([a=>false,a=>a*3])],terms:[1,tether(Function.call),3],condition:["equal"]}
 ,abscond:{context:[provide([a=>false,drop()])],terms:[1,tether(Function.call),undefined],condition:["equal"]}
 ,any:{context:[],terms:[1,2,tether(Function.call),1],condition:["equal"]}
 ,neither:{context:[infer()],terms:[buffer,1,2,tether(Function.call),is(Error),true],condition:["equal"]}
 }
 ,wether:
 {boolean:
[{context:[provide([a=>a,1,2])],terms:[{1:"a"},true,infer(Function.call),"a"],condition:["equal"]}
,{context:[provide([a=>a,1,2])],terms:[{2:"a"},false,infer(Function.call),"a"],condition:["equal"]}
],indexed:{context:[provide([a=>a,swap(1),swap(2)])],terms:[null,1,infer(Function.call),2],condition:["equal"]}
 ,switch:{context:[provide([[a=>a,a=>true],swap(1),swap(2)])],terms:[null,false,infer(Function.call),2],condition:["equal"]}
 ,fallback:{context:[provide([[a=>a,a=>a],1,2,swap(3)])],terms:[null,false,infer(Function.call),3],condition:["equal"]}
 }
 ,combine:{context:[provide([a=>a*2,a=>a*3,a=>a*4])],terms:[1,tether(Function.call),collect,[2,3,4]],condition:["deepEqual"]}
 ,route:
[{tether:{a:{b:c=>c}},context:[["a","b"],1],terms:[1],condition:["equal"]}
,{tether:{a:{b:c=>{throw Error("fail")}}},context:[["a","b","c"]],terms:[a=>a instanceof Error],condition:["ok"]}
,{tether:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
],is:
 {something:{context:[],terms:[1,tether(Function.call),true],condition:["equal"]}
 // fails due to tether/idempotence issue. 
 //,nothing:{context:[],terms:[undefined,tether(Function.call),false],condition:["equal"]}
 ,instance:{context:[provide(Function,true)],terms:[infer(undefined,function(){}),tether(Function.call),true],condition:["equal"]}
 ,multiple:{context:[provide([serial,a=>a.some(Boolean)])],terms:[[0,1,2],tether(Function.call),true],condition:["equal"]}
 }
 };
