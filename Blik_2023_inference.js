
 import * as namespace from "./Blik_2023_inference.js";
 import {colors,describe,cast,construct,type,defined,something,functor,simple,compound,string,numeric,iterable,array,heritage,asynchronous,promise,generator,asyncgenerator,plural,pattern,basic,native} from "./Blik_2026_type.js";
 export * from "./Blik_2026_type.js";
 export const {pathname:address,origin}=new URL(import.meta.url);
 export const location=address.replace(/\/[^/]*$/,"");
 var browser=globalThis.window||(globalThis.constructor.name==="DedicatedWorkerGlobalScope");
 // skip dynamic inference for combinators in ./infer. 
 var freeterms=new Set([...Object.values(namespace).filter(functor),Array,Object.assign,Object.values,Object.entries,Object.fromEntries,RegExp].map(term=>term.name));
 var warn={};

 // CONTEXT ALGEBRA

 export function model(...context)
{// snapshot of context. 
 return Object.fromEntries(Object.entries(context).map(([index,term])=>
 [index,plural(term)?model(...term):term]));
};

 export function undefine(){};
 export function constant(term){return describe(function(){return term;},constant,term);};
 export function unary(term){return term;};
 export function* unit(){yield* arguments;};
 export function index(){return Array.from(arguments);};
 export function rank(index){if(!iterable(index))console.warn("Rank invoked on non-index. Uninduced context?");return unit.apply(null,index);}
 export function yank(index){return array(index)?index.length-1?rank(index):index[0]:index;};
 
 export var trickle=describe(infer("reduce",(queue,next,index,heap)=>[queue
 // sort promises in index by speed. 
,Promise.resolve(queue.at(-1)).then(past=>
 Promise.any(heap.map((slot,index)=>
 Promise.race([slot,false]).then(next=>
 next?past===next?Promise.reject(heap.splice(index,1)):stagger(next):slot)
 )))].flat(),[]),"trickle");

 export var [settle,expand]=
 // spread generators in context. 
[[asyncgenerator,function settle(index)
{return index.reduce(induce(pluck),[]);
 function pluck(index,term){return asyncgenerator(term)?term.next().then(next=>stack(next,index,term)):[...index,term];}
 function stack({value:next,done},past,term){return !done?pluck(past,term).then(index=>graft(index,past,next)):[...past];}
 function graft(index,past,term){return index.splice(past.length,0,term)&&index;}
}]
,[generator,function expand(index){return index.reduce((index,term)=>(index.push(...generator(term)?term:[term]),index),[]);}]
].map(([type,unfold])=>cast(index=>index.some(type),unfold));

 export var collect=describe([settle,expand].reduce(deduce,index),"collect");
 export var cede=deduce(collect,yank);
 export var lift=reduce(unit);

 export function surge(...context)
{// recursive lift. 
 if(match(this,context))
 return rank(this);
 let scope=this||context;
 return induce(bind(surge))(collect(...scope),...scope);
};

 export function flush(...context)
{// forgetful surge. 
 if(!context.length)
 return rank([]);
 return compose(lift,flush,swap(...context),lift)(...context.filter(plural));
};

 export function spill(...context)
{// depth-first surge.
 let controller=this;
 let controlled=controller instanceof AbortController;
 let flat=deduce((term,past)=>
 controlled&&controller.signal.aborted?exit(controller.signal.reason)
:plural(term)?recursion(term,past.at(-1))
:term,reduce(lift));
 let recursion=induce(term=>each.call(term,flat));
 return cede(each.call(rank(context),flat));
};

 export function add(...terms){return describe(function*(){yield* arguments;yield* terms;},add,...terms);};

 export function drop(stop=Infinity,start=0,...stack)
{// filter context between (or outside if stop<start) indexes. 
 // eg. combine(drop(1,-1),drop(-1,1))(1,2,3,4)=((2,3),(1,4)). 
 // stop may be a filter condition, stack may be a function on dropped context (start<stop). 
 if(functor(stop))
 return each(whether(is(not(functor),major(start-1)),drop()));
 return describe(function(...context)
{if(defined(this))
 context.unshift(this);
 let length=Math.max(context.length,2);
 let modulus=offset=>offset<length?(length+offset)%length:length;
 let [starting,stopping]=[start,stop].map(modulus);
 let crop=Number(stopping<starting);
 let [head,tail]=[starting,stopping].sort((past,next)=>past-next);
 let replace=!crop&&tail-head&&functor(stack[0]);
 return infer.call
(replace?infer.call(rank(context.slice(head,tail)),...stack):rank(stack)
,(...stack)=>rank([context,context.splice(head,tail-head,...stack)][crop])
);
},drop,...arguments);
};

 export var slip=drop.bind(null,0,0);
 export var crop=drop.bind(null,Infinity);
 export var swap=drop.bind(null,Infinity,0);
 export var push=drop.bind(null,Infinity,Infinity);
 export var flip=describe(produce(collect,"reverse",rank),"flip");
 export function rotate(offset)
{return describe(function(...context)
{return rank(context.map((value,index,context)=>
 context[(context.length+index-offset)%context.length]));
},rotate,...arguments);
};

 export var zap=compose(combine
 // rank index with context. (([1,2],3)=>(1,3),(2,3))
(compose(unary,index,"flat")
,compose(drop(1),swap,slip(1),crop)
),infer("map"),rank);

 export var tally=compose(when(numeric),crop(1),combine
(compose(-1,sum,major,slip(fold(),collect,"length"),compose,"tally")
,unit
),lift,describe);

 export function major(past,next){if(!defined(next))return compose(when(numeric),infer(major,past));return next<past;}
 export function minor(past,next){if(!defined(next))return compose(when(numeric),infer(minor,past));return past<next;}

 export function extreme(series)
{return ["min","max"].map(key=>Math[key](...[series].flat()));
};

 export function sum(...context)
{// cumulate context values. 
 return context.flat().reduce((sum,value)=>sum+(Number(value)||0),0);
};

 // CONTINUATION  
 // #1 `this` immediately invokes combinators. 
 // #2 deduce and induce calls terms with scope, pivot prepends it for functors with stack/context separation. 
 //
 //            Generator             Array              Generator
 //       unit/         \expand    /collect\apply      /fold     \cede
 // ...Context           ...Context          ...Context           ...Context

 export function fold(term=unit)
{// rank procedure. (protects Promise/Generator from induction/reduction until collected)
 return function* fold(){yield term(...arguments);};
};

 export function induce(fold=unit,...stack)
{// promise-agnostic inference (catamorphism - any category over Kleisli Promise). 
 function catamorphism(term)
{return arguments.length-1?Array.from(arguments).some(promise)
?Promise.all(arguments).then(fold.apply.bind(fold,this))
:fold.call(this,...arguments):promise(term)?term.then(fold.bind(this)):fold.call(this,term);
};
 return defined(this)?catamorphism(this):describe(catamorphism,induce,fold);
};

 export function deduce(fold=unit,monad=cede)
{// monadic co-induction (paramorphism - arbitrary transient category). 
 let catamorphism=induce(monad);
 let paramorphism=describe(induce(function(...context)
{return catamorphism(fold.call(this,...context));
}),deduce,...arguments);
 return defined(this)?paramorphism(this):paramorphism;
};

 export function reduce(fold=unit)
{// variadic re-induction (cata+ana hylomorphism - Collect and Apply a transient Array). 
 let catamorphism=functor(fold)?fold:infer(fold);
 let hylomorphism=deduce(collect,catamorphism.apply.bind(catamorphism,undefined));
 return defined(this)?hylomorphism(this):describe(hylomorphism,reduce,fold);
};

 export function produce(...terms)
{// recursive reduction of a Unit fold. 
 let procedure=terms.map(reduce).reduce(deduce,unit);
 return defined(this)?procedure(this):describe(procedure,produce,...terms);
};

 export function bind(term,...stack)
{return function(){return term.call(...stack,...arguments);};
};

 export function free(term)
{return function(){return term(...arguments);};
};

 export function pivot(term,...stack)
{// rank dynamic context in term scope.
 // pivot is for combinators that need to unfold a plural `this` themselves (like infer or
 // buffer do, internally) while keeping that unfolded `this` separate from `stack`, their own
 // closure-captured static context - term.call(scope,...stack) keeps scope and stack apart.
 // reduce can't stand in for this: reduce.apply flattens everything into one positional list,
 // so it would collapse stack into scope instead of preserving the separation.
 function pivot(...context)
{if(defined(this))
 context.unshift(this);
 let scope=rank(context);
 return functor(term)
?term.call(scope,...stack)
:lift(scope,term,rank(stack));
};
 return defined(this)?pivot(this):describe(pivot,...arguments);
};

 // PREDICATES 

 export function not(term)
{let functor=describe(compose(term,is(false)),not,term);
 return defined(this)?functor(this):functor;
};

 export function is(...terms)
{// reduce context to binary of satisfying respective terms. 
 if(!defined(this))
 return pivot(is,...terms);
 let context=collect(this);
 return !terms.some((term,index)=>
 [term].flat().some(term=>functor(term)
?/^[A-Z]/.test(term.name)
?!(context[index] instanceof term)
:!term(context[index])
:!Object.is(context[index],term)));
};

 export function are(...terms)
{// reduce context to binary of all satisfying terms. 
 if(!defined(this))
 return pivot(are,...terms);
 return collect(this).every(is(terms));
};

 export function some(...terms)
{if(!defined(this))
 return pivot(some,...terms);
 return collect(this).some(is(terms));
};

 export function same(...terms)
{let identity=describe
(compose(index,terms,(context,terms)=>
 !terms.length?false:!terms.some((term,index)=>term!==context[index]))
,same,...arguments
);
 return defined(this)?identity(this):identity;
};

 export function has(entry,value)
{// match entries by [field] or [value]. for pairs use match({field:value})
 if(!defined(this))
 return tether(has,entry,value);
 if(!compound(this)&&!functor(this))
 return false;
 let defines=[entry].flat().every(entry=>entry in this);
 if(!value?.length&&!string(value))
 return defines;
 let values=Object.values(this);
 let assigns=[value].flat().every(value=>
 values[string(value)?"includes":"some"](pattern(value)?match(pattern):value));
 return defines&&assigns;
};

 export function match(target,source)
{if(arguments.length<2)
 return describe(infer(match,target),match,...arguments);
 return source===target?true
:pattern(source)?source.test(target)
:functor(source)?source(target)
:basic(source)?something(target)&&Object.keys(source).every(field=>
 match(target[field],source[field]))
:false;
};

 export function clock(mark,precision="time")
{mark=mark?is(Date)(mark)?mark:Number(mark)
?new Date(string(mark)
?mark.split("").reduce((date,mark,index,{length})=>
 date+(index&&!(index%2)?index>2?index>7?index===8?" ":":":"/":"":"")+mark
,"")
:mark)
:string(mark)
?new Date(mark)
:new Date():new Date();
 //[new Date(mark),new Date(new Date(mark).getTime()+new Date(mark).getTimezoneOffset()*60*1000)].reduce((utc,date)=>
 //date.setHours(utc.getHours()-utc.getTimezoneOffset()/60)&&date);
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

 // INFERENCE 

 export function tether(term,...stack)
{// infer term with scope. 
 let bind=describe(compose(when(defined),infer(functor(term)?Function.call.bind(term):term,...stack)),tether,...arguments);
 return defined(this)?bind(this):bind;
};

 export function infer(term,...stack)
{// call/attach/detach/attend/append term on pivotal context, prefixed with stack. 
 if(!defined(this))
 return pivot(infer,...arguments);
 let context=[collect(this),collect(...stack)];
 if(context.some(promise)) // rank prevents surge in recursion.
 return Promise.all(context).then(([context,stack])=>
 infer.call(rank(context),term,rank(stack)));
 context=context.reduce((context,stack)=>
 context.splice(1,0,...stack)&&context);
 if(!defined(term))
 return yank(context);
 let [scope]=context;
 let map=functor(term);
 if(map&&!warn.infer)console.trace(warn.infer="Infer will be demoted to dynamic access. Use Reduce to induce/append a term.")
 let detach=string(term)&&term.startsWith("tether ")&&term.substring(7);
 let field=detach||term;
 let dynamic=map
 // named, unbound, uncomposed, not a freeterm: may be a method of scope.
?term.name&&!term.name.startsWith("bound ")&&!term.name.includes("(")&&!freeterms.has(term.name)
:!array(term);
 let attend=something(scope)&&dynamic?map
?Object(scope)[term.name]===term?term:undefined
:Reflect.get(Object(scope),field?.toString?field:null)
:undefined;
 if(detach)context.shift();
 if(!functor(defined(attend)?attend:term))
 return defined(attend)?attend:rank(context.push(term)&&context);
 return (attend?Function.call.bind(attend):term)(...context);
};

 export function buffer(term,quit)
{// alternative inference for failure. 
 if(!defined(this))
 return pivot(induce(buffer),...arguments);
 let context=collect(this);
 if(promise(context))
 return context.then(context=>buffer.call(rank(context),...arguments))
 try
{let next=infer.call(rank(context),term);
 return promise(next)?next.catch(infer(quit,rank(context))):next;
}catch(fail){return infer(quit,rank(context))(fail);};
};

 export function differ(term)
{// infer without allowing identity. 
 return compose.call(this,combine(compose(same,not,when),term),lift,infer,Function.call);
};

 export function pass(term,...context)
{// synchronous side-effect inference. 
 return describe(compose
(combine(unit,compose(infer(...arguments),drop()))
,cede
),pass,...arguments);
};

 export function skip(...terms)
{// parallel side-effect inference. 
 return function(...context)
{return infer(...terms)(...context),rank(context);
};
};

 export function stash(...terms)
{return describe(compose(combine(unit,...terms.map(term=>functor(term)?term:swap(term))),lift),stash,...arguments);
};

 // PRISMS 

 export function when(...terms)
{// demand conditions on context. 
 let condition=pass(describe(combine
(...terms.map((term,index,terms)=>compose
(drop(index),combine(not(term),unit),lift,(fail,...context)=>fail&&
 exit(term.name+": "+context.map(buffer(JSON.stringify,drop(1,2))).join(""))
))
),when,...terms));
 return defined(this)?condition(this):condition;
};

 export function compose(...terms)
{// recursive inference agnostic of dynamic context. 
 if(!defined(this))
 return pivot(compose,...terms);
 return terms.reduce(function inference(context,term)
{return infer.call(defined(context)?context:unit(context),term);
},this);
};

 export function combine(...terms)
{// parallel inference/multiplication (church arithmetic, should be "split"). 
 if(!defined(this))
 return pivot(combine,...arguments);
 let context=collect(this);
 let [factor]=context;
 let content=terms.map(term=>!numeric(term)
?infer.call(rank(context),term)
:Object.assign([]
,Array(Math.floor(Math.abs(term))).fill(factor).map(factor=>numeric(factor)?factor*(term>0||-1):factor)
,term%1&&
 {[Math.floor(Math.abs(term))]:infer.call(Object[array(factor)?"values":"entries"](Object(factor))
,records=>records.length
?Object[array(factor)?"values":"fromEntries"](records.slice(...[term<0?undefined:0,term%1*records.length][term<0?"reverse":"concat"]()))
:term%1*factor)
 }));
 return rank(content);
// length?compose(drop(),functor,Math.ceil,Array,fields,"fill","flat",[]
// ,tether("reduce",(records,field,index,fields)=>
// (index%Math.round(functor*length)||
//  records.push(fields.slice(index,index+functor*length))
// )&&records))
};

 export function either(...terms)
{if(!terms.length)
 return unit;
 let valid=is([something,not(is(false)),not(is(Error))]);
 return function(...context)
{if(defined(this))context.unshift(this);
 let scope=context.shift();
 return attempt(0);
 function attempt(index)
{if(index===terms.length-1)
 return infer(terms[index],...context)(scope);
 return produce
(buffer(differ(terms[index]))
,result=>valid(result)?result:attempt(index+1)
)(scope,...context);
};
};
};

 export function whether(condition,...terms)
{let conditions=[condition].flat();
 return function(...context)
{if(defined(this))context.unshift(this);
 let scope=context.shift();
 return test(0);
 function test(index)
{if(index===conditions.length)
 return infer(terms[index],...context)(scope);
 let condition=conditions[index];
 let result=functor(condition)?infer(condition,...context)(scope):condition;
 return induce(result=>valid(result)?infer(terms[index],...context)(scope):test(index+1))(result);
};
};
 function valid(result){return something(result)&&result!==false;}
};

 export function decide({else:otherwise,...cases})
{return whether
(Object.values(cases).map(({0:first,condition=first})=>condition)
,...Object.values(cases).map(({1:second,term=second})=>term)
,otherwise
);
};

 export function each(term,...stack)
{if(!defined(this))
 return pivot(each,...arguments);
 let status=induce(next=>next.done);
 let value=fold(induce(search("value")));
 let context=plural(this)?this:rank([this]);
 let synchronous=generator(context)&&!asynchronous(term);
 return describe(synchronous
?      function*(){while(!      next(this,...arguments))yield       resolve(...arguments);}
:async function*(){while(!await next(this,...arguments))yield await resolve(...arguments);}
,"unfold").call(context,[],[],term,stack);
 function next(context,past,terms){return status(past[past.push(context.next(terms.at(-1)))-1]);};
 function resolve(past,terms,term,stack)
{let next=array(term)?term[past.length-1]:term;
 return compose
(value,next?whether(tally(1),infer(next,terms,...stack)):unit
,pass(term=>terms.push(term))
)(past.at(-1));
};
};

 // LENSES 

 export function search(term,recursive=false,limit=false,path=[])
{// traverse scope for entries satisfying a term (condition or path).
 // recursive search includes ranges in recursion domain.
 if(!defined(this))
 return tether(search,...arguments);
 let scope=this;
 if(!compound(scope))
 return [];
 if(limit&&[limit].flat().some(limit=>functor(limit)?limit(this):limit===this))
 return [];
 let condition=functor(term);
 if(!condition)
 return !compound(term)?scope[term]:array(term)
?[term].flat().reduce((scope,field)=>scope?.[field],scope)
:Object.entries(term).flatMap(([field,term])=>
 [term].flat().flatMap(term=>scope[field]&&search.call(scope[field],term,recursive,limit,path)));
 let [domain,range]=[[],[]];
 for(let field in this)
 [domain,range][term.call(this,[field,this[field]],path)?1:0].push([field,this[field]]);
 if(recursive)
 domain=[domain,range].flat();
 let subrange=domain.flatMap(([field,value])=>Object.entries
(search.call(value,term,recursive,limit,path.concat(field))
).map(([path,value])=>[[field,path].join('/'),value]));
 return Object.fromEntries([range,subrange].flat());
};

 export function prune(term,collapse=0,limit=[],path=[],trace=[])
{// map entries recursively. collapse: 
 // 0 drops undefined entries; 
 // 1 grafts their children;
 // -1 goes depth-first, so term sees already pruned scopes.
 if(!defined(this))
 return tether(prune,...arguments);
 let scope=this;
 if(!compound(scope))return scope;
 let entries=Object.entries(scope);
 if(!entries.length)
 for(let field in scope)
 entries.push([field,scope[field]]);
 let terminal=field=>numeric(limit)?path.length===limit:[limit].flat().some(limit=>
[[limit],[array(limit)?path:[],field]
].map(compose("flat","/","join")).reduce(Object.is));
 return compose.call
(entries,infer("reduce",record(function([field,source])
{let done=terminal(field);
 let immediate=collapse>-1||done||!compound(source);
 let value=immediate?term.call(scope,[field,source],path,trace):undefined;
 let pluck=!defined(value);
 if(collapse<0&&immediate)
 return pluck?[]:[[field,value]];
 if(collapse>-1)
 if(pluck&&(!collapse||done))
 return [];
 else if(done)
 return [[field,value]];
 let graft=pluck&&collapse>0;
 return compose.call
(collect(graft||collapse<0?source:value)
,infer("reduce",record(value=>
 prune.call(value,term,collapse,limit,path.concat(field),trace.concat([scope]))),[])
,infer("flatMap",collapse<0
?function(reduced){let value=term.call(scope,[field,reduced],path,trace);return defined(value)?[[field,value]]:[];}
:function(source){return graft?Object.entries(compound(source)?source:{}):[[field,source]];})
);
}),[]),"flat",whether
(array(scope)&&not(infer("some",labeled))
,compose(pass(infer("forEach",function([field],index,entries)
{if(!index)
 // snap first index. 
 return field!=0&&entries.forEach(entry=>entry[0]=Number(entry[0])-entries[0][0]);
 let leap=1-field+Number(entries[index-1]?.[0]);
 if(leap)
 // spread plural indexes. 
 entries.slice(index).forEach((entry)=>entry[0]=Number(entry[0])+leap);
})),Object.fromEntries,slip(Array(0)),merge)
,Object.fromEntries
)
);
 function labeled([field],index,entries)
{return isNaN(field)||[entries[index-1]?.[0],field].map(Number).reduce((past,next)=>next<past);
};
};

 var reindex=whether
((entries,scope)=>(entries.length||array(scope))&&!entries.some(([field],index,entries)=>
 isNaN(field)||[entries[index-1]?.[0],field].map(Number).reduce((past,next)=>
 next<past))
,compose(pass(infer("forEach",function([field],index,entries)
{if(!index)
 // snap first index. 
 return field!=0&&entries.forEach(entry=>entry[0]=Number(entry[0])-entries[0][0]);
 let leap=1-field+Number(entries[index-1]?.[0]);
 if(leap)
 // spread plural indexes. 
 entries.slice(index).forEach((entry)=>entry[0]=Number(entry[0])+leap);
})),Object.fromEntries,slip(Array(0)),Object.assign)
,Object.fromEntries
);

 export function merge(target,source,override=1)
{// unite scopes (assign if path specified to override).
 let assign=array(override)||string(override);
 if(assign)
 return [target,...[override].flat(),source].reduce((scope,field,index,route)=>
 route.length-index-1
?scope[field]=route.length-index>2?scope[field]||{}:route[index+1]
:route[0]);
 let Group=[Set,Map].find(group=>target instanceof group);
 if(Group)
 return override<0
?new Group(Array.from(target).filter(target=>!source[array(source)?"includes":"has"](target)))
:override?source
:new Group([source,target].flatMap(part=>Array.from(part)));
 let extensible=[target,source].every(array);
 if(extensible&&!override)
 return target.concat(source);
 // to merge array domains, pass the source as plain object. 
 let disjunct=[target,source].some((term,index,terms)=>
 construct(term)&&!simple(terms[(index+1)%2]));
 let opaque=disjunct||[target,source].some(term=>!compound(term));
 if(opaque)
 return [target,source][Number(Boolean(override))];
 return Object.entries(source).reduce(function(target,[field,next])
{const past=target[field];
 const value=defined(past)?merge(past,next,override):next;
 if(past===value)
 return target;
 // mutation warning - reduce on an empty target to copy.
 if(defined(value))try
{return Object.assign(target,{[field]:value});
}catch(fail){return target;};
 delete target[field];
 return array(target)?[target].flat():target;
},target);
};

 export function record(term,field="length")
{// assign term to field of dynamic scope.
 if(array(field))
 return field.filter(something).reverse().reduce((term,field)=>({[field]:term}),term);
 let path=compose(tether(field),collect,"flat");
 let combination=describe(compose(lift,combine(crop(1),tether(term),path),lift,merge),record,...arguments);
 return defined(this)?combination(this):combination;
};

 export function remember(term,distinction="0")
{// record on an implicit scope. 
 let scope=this||[];
 return deduce(either
(compose(slip(scope),tether(distinction),slip(scope),tether(search))
,compose(slip(scope),combine(record(term,distinction),tether(distinction)),lift,tether(search))
),cede);
};

 export function route(term,...stack)
{// compose with static context, methodic and scope-rebound alternatives. 
 if(functor(stack[1]))
 throw Error("Route variant to merge dynamic values on dynamic paths is deprecated. Use search.merge to support it.");
 if(!this)return tether(route,...arguments);
 let scope=this;
 let path=[term].flat();
 let method=stack[0]?.method?.toLowerCase();
 let methodic=combine(method,drop(1));
 // record for methodic route taken. 
 let branch=[];
 let branched=compose(swap(branch),"length",major(0));
 let store=pass(record(drop(1,2)).bind(branch));
 let offbeat=term=>buffer(compose(methodic,lift,differ(term),store),compose(store,swap(undefined)));
 let fail=compose(swap(branch),Error("not found: "+path.join("/")),"concat",infer("find",is(Error)),exit);
 let terms=path.map((term,index,path)=>infer(either
(buffer(term,compose(store,note))
,whether(has(method),offbeat(term))
,buffer(tether(scope[term]),store)
,fail
),...stack,path.slice(0,index)));
 let composition=describe(compose(...terms,whether
 // invoke method if not done already. 
(branched,infer(),buffer(compose(infer(method,...stack),crop(1)),crop(1))
)),route,...arguments);
 return scope?composition(scope):composition;
};

 export function map(range)
{if(!defined(this))
 return pivot(map,...arguments);
 return prune.call(this,function([field,value],path)
{return search.call(range,path)?.call?.(this,value)||value;
});
};

 export function set(options,namespace)
{return Object.entries(namespace).reduce((defaults,[field,kinds])=>
 Object.assign(defaults
,{[field]:options[field]
?Object.entries(kinds).find(([kind])=>
 [kind,options[field]].map(kind=>kind.toLowerCase()).reduce(Object.is))?.pop()||
 Error([String(options[field]),'not in "'+field+'" options',Object.keys(kinds),].join(" "))
:defaults[field]
 }),this);
};

 export function flatten(factor,path=[])
{// expose factors in scope. 
 let scope=this;
 return [scope].flat().flatMap(scope=>
 [scope,...flatten.call(scope[factor],factor)]);
};

 export function cooccurrence(records,{field="phrases"}={})
{return records.reduce((clusters,record)=>record[field]?.map(phrase=>
 phrase.toLowerCase()).reduce((clusters,phrase,index,phrases)=>
 phrases.filter((phrase,coindex)=>coindex!==index).reduce((clusters,cophrase)=>
 [phrase,cophrase][clusters[phrase]?"slice":"reverse"]().reduce((phrase,cophrase)=>
 merge(clusters,sum(clusters[phrase]?.[cophrase],1),[phrase,cophrase]))
,clusters)
,clusters)||clusters
,{});
};

 export function clone(scope)
{return merge(JSON.parse(JSON.stringify(scope)),scope);
};

 export function isolate(path)
{// prune scope to specified path.
 return record(search.call(this,path),path);
};

 export function extract(fields,exclusive)
{if(!this)return exclusive?extract.call(exclusive,fields):tether(extract,fields);
 fields=[fields].flat();
 if(exclusive)
 return prune.call(this,([field,value])=>
 fields.includes(field)?undefined:value,0,0);
 return fields.reduce((term,field)=>
 merge(term,{[field]:this[field]}),{});
};

 export var fields=(record,term=something)=>
 Object.keys(record).filter(field=>
 term(record[field]));

 export function debug(...context){debugger;return rank(context);};

 export function note(...context)
{// expose context in console. (combine(compose(note,drop()),unit))
 let {steady,dim,bright,blue,gray,bold}=colors;
 let stack=trace().slice(0,-1);
 if(stack.at(-6)?.[0]==="rank.pivot")
 stack=stack.slice(0,-6);
 let source=dim+gray+"@"+bright+blue+(stack.at(-1)?.[1]??"...intractable");
 let path=stack.map(([term,position],index,{length})=>index<length-1
?term||position?.replace(origin+location.slice(1),".")
:steady+bright+blue+term).join(dim+blue+"/"+dim+gray)+steady;
 let stream=console[this?"info":"log"];
 console.groupCollapsed(steady+bright+bold+blue+" "+clock(new Date())+source+steady);
 stream(bright+blue+path+steady+":");
 console.groupEnd();
 let color=!compound(this)&&this;
 let phase=colors[color]||Object.values(colors)[color]||steady;
 if(browser)
{let output=[phase,...context,steady];
 return stream(...output.every(string)?[output.join(" ")]:output),yank(context);
};
 globalThis.process.stdout.write(phase);
 stream(...context);
 globalThis.process.stdout.write(steady);
 return yank(context);
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
,infer("filter",match=>match!=="Promise.all")
);

 export function trace(term,path=[])
{// trace term in scope or stack. 
 if(!something(term))
 return compose.call
(Error,combine
 // collect stack trace. 
(unit
,compose("stackTraceLimit",limit=>({stackTraceLimit:limit}))
,compose
({stackTraceLimit:Infinity},Object.assign
,Function.call,"stack",/\n */,"split",infer("slice",1)
,infer("map",stack),"reverse"
)
),lift
,combine(drop(2),compose(crop(2),Object.assign))
,lift,crop(1)
,combine(unit,swap(0),infer("findIndex",([term])=>term===trace.name)),lift,"slice"
);
 let scope=this;
 if(scope===term||!scope)
 return path;
 return Object.entries(scope).reduce((hit,[field,scope])=>hit||
 [term===scope,path.concat(field)].reduce((hit,path)=>
 hit?path:compound(scope)?trace.call(term,scope,path):undefined)
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
 {focus:['focusin','focusout']
 ,mouse:['mouseover','mouseout']
 ,touch:['touchstart','touchend']
 ,point:['pointerdown','pointerup']
 ,hover:['pointerover','pointerout']
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
(infer("observe",scope,register===true?undefined:register)
,observer=>scope[method]("unobserve",({detail})=>detail===event&&observer.unobserve(this),{once:true})
),lift,swap(scope))
:scope.dispatchEvent(new CustomEvent("unobserve",{detail:event}))||scope
:scope[method](event,action,register)||scope
,this);
 function rebind(event)
{//if(!propagate)event.stopPropagation();
 let type=event.type.replace(/(out|move|end|up)$/,"");
 let mode=event.type.replace(type,"");
 let start={focus:"in",touch:"start"}[type]||{up:"down",out:"over",end:"start"}[mode]||"over";
 let constructor=type.replace(/^./,infer("toUpperCase"))+"Event";
 event.target.dispatchEvent(new globalThis[constructor](type+start,event));
};
};

 export function wait(time)
{// hold context for time period.
 if(!defined(this))
 return pivot(wait,time);
 return new Promise(resolve=>setTimeout(resolve,time)).then(infer.bind(this));
};

 export function stagger(...context)
{if(globalThis.process)
 return yank(context);
 return revert.call(context,(resolve,reject,context)=>
 window.requestAnimationFrame(time=>
 resolve(yank(context))));
};

 export function expect(condition=something,interval=0,limit=Infinity)
{// hold thread until context satisfies condition. 
 if(!defined(this))
 return pivot(expect,...arguments);
 if(!limit)return infer.call(this,condition);
 let context=collect(this);
 let repeat=compose(wait(interval),swap(rank(context)),lift,expect(condition,interval,limit-1));
 return reduce(either(condition,repeat))(rank(context));
};

 export function revert(term,...stack)
{// revert a Promise's inversion of control. 
 if(!defined(this))
 return pivot(revert,...arguments);
 return new Promise(compose(rank(stack),this,lift,term));
};

 export function control(controller,...context)
{when(is(AbortController))(...arguments);
 // observe an abort signal, optionally composing it with a context for explicit abortion. 
 return revert((resolve,reject,controller,...context)=>
 context.reduce((signal,term,index,context)=>
 compose(buffer(term),collect,slip(controller),"abort")({signal},...context.splice(1))
,observe.call(controller.signal,{abort({target:{reason}})
{(is(Error)(reason[0])?reject:resolve)(...reason);
}},{once:true})))(...arguments);
};

 export function measure(label)
{let persistent=defined(this);
 let scope=persistent?this:{};
 return function mark(...context)
{if(!scope[label])
 scope[label]={start:performance.now()/1000};
 else merge(scope,{[label]:{end:(performance.now()/1000-scope[label].start)+"s"}})
,persistent||console.log({[label]:scope[label].end});
 return yank(context);
}.bind(scope);
};

 export function exit(fail){throw is(Error)(fail)?fail:Error(fail,{reason:fail});};

 export var tests=
 {induce:{context:[sum],terms:[1,2,3,"call"],condition:when(is(5))}
 ,deduce:
 {identity:{context:[sum],terms:[1,2,3,"call"],condition:when(is(5))}
 ,reduce:{context:[index,cast(index=>index.some(generator),expand)],terms:[0,1,rank([2,3]),4,"call"],condition:when(match([1,2,3,4]))}
 },produce:
[{context:[3],terms:[0,1,2,Function.call],condition:when(is(1,2,3))}
,{context:[3],terms:[0,rank([1,2]),Function.call],condition:when(is(plural,3))}
,{context:[3],terms:[0,rank([1,2]),Function.call,is(plural,3),true],condition:"equal"}
,{context:[3],terms:[0,rank([rank([1,2])]),Function.call,is(plural,3),true],condition:"equal"}
,{context:Array(100).fill(unit),terms:[0,rank([rank([1,2])]),Function.call,is(plural,3),false],condition:"equal",benchmark:true}
],compose:
[{context:[3],terms:[1,2,Function.call],condition:when(is(1,2,3))}
,{context:[3],terms:[rank([1,2]),Function.call],condition:when(is(plural,3))}
,{context:[3],terms:[rank([1,2]),Function.call,is(plural,3),true],condition:"equal"}
,{context:[3],terms:[rank([rank([1,2])]),Function.call,is(plural,3),true],condition:"equal"}
,{context:Array(100).fill(unit),terms:[rank([rank([1,2])]),Function.call,is(plural,3),false],condition:"equal",benchmark:true}
],infer:
 {undefined:{context:[],terms:[Function.call,collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[0,Function.call,0],condition:["equal"]}
 ,monad:{scope:true,context:[rank([2]),1],terms:[is(2,1),true],condition:["equal"]}
 ,plurality:
[{context:[rank([2]),1],terms:[Function.call,is(1,plural),true],condition:["equal"]}
,{context:[1,rank([2])],terms:[Function.call,is(2,1),true],condition:["equal"]}
,{context:[],terms:[rank([rank([1,2])]),Function.call,is(plural),true],condition:["equal"]}
],append:
[{context:[5,1,2],terms:[0,3,4,Function.call,collect,[0,1,2,3,4,5]],condition:["deepEqual"]}
,{context:[3,4,5],terms:[0,1,2,Function.call,collect,[0,4,5,1,2,3]],condition:["deepEqual"]}
],access:{scope:true,context:[[],"length"],terms:[0],condition:["equal"]}
 ,invoke:{context:[isNaN],terms:[{},Function.call,true],condition:["equal"]}
 ,method:
[{scope:true,context:[[1],"map",deduce(crop(1),cede)],terms:[[1]],condition:["deepEqual"]}
,{scope:true,context:[{a:a=>1},"a"],terms:[1],condition:["equal"]}
]}
 ,is:
 {nothing:{context:[something],terms:[Function.call,false],condition:["equal"]}
 ,something:{context:[something],terms:[0,Function.call,true],condition:["equal"]}
 ,anything:{context:[],terms:[1,Function.call,true],condition:["equal"]}
 ,neutral:{context:[],terms:[Function.call,true],condition:["equal"]}
 ,instance:{context:[Function],terms:[infer(undefined,function(){}),Function.call,true],condition:["equal"]}
 ,multiple:{context:[[iterable,a=>a.some(Boolean)]],terms:[[1,2],Function.call,true],condition:["equal"]}
 ,respective:{context:[[iterable,a=>a.some(Boolean)],a=>a==="a"],terms:[[1,2],"a",Function.call,true],condition:["equal"]}
 ,plural:{context:[plural],terms:[rank([rank([rank([1,2])])]),Function.call,true],condition:["equal"]}
 }
 ,pass:
[{context:[a=>a*2],terms:[1,Function.call,1],condition:"equal"}
,{context:[a=>a*2],terms:[rank([rank([rank([1])])]),Function.call,plural,true],condition:"equal"}
],when:
[{context:[is(1)],terms:[1,Function.call,1],condition:"equal"}
 // implicit drop(1) in when buffering condition lifts singular second rank, hence double. 
,{context:[is(plural)],terms:[rank([rank([1,2])]),fold(infer("call")),is(plural),true],condition:"equal"}
],unit:
[{context:[1,2,3],condition:when(is(1,2,3))}
,{context:[rank([rank([rank([1])])])],condition:when(is(plural))}
],cede:
[{context:[1,2,3],terms:[],condition:when(is(1,2,3))}
,{context:[1,rank([2,3])],condition:when(is(1,2,3))}
,{context:[1,2,Promise.resolve(3)],condition:when(is(1,2,3))}
,{context:[1,rank([rank([2,3])])],terms:[is(1,plural),true],condition:"equal"}
,{context:[1,2,rank([Promise.resolve(3)])],terms:[is(1,2,promise),true],condition:"equal"}
],collect:
[{context:[1,2,3,4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,Promise.resolve(2),3,4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,rank([2,3]),4],terms:[[1,2,3,4]],condition:["deepEqual"]}
,{context:[1,rank([2,Promise.resolve(3),4])],condition:when(match([1,2,promise,4]))}
,{context:[1,rank([2,rank([3]),4])],condition:when(match([1,2,plural,4]))}
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
],functional:
 {infer:{context:[-1,1,a=>a*2],terms:[1,2,3,Function.call,collect,[1,4,3]],condition:["deepEqual"]}
 ,fold:{context:[-1,1,rank([a=>a*2])],terms:[1,2,3,Function.call,lift],condition:when(is(1,functor,3))}
 ,ignore:{context:[1,-1,a=>a*2],terms:[1,2,3,Function.call,collect,[2]],condition:["deepEqual"]}
 }
 ,plural:{context:[1],terms:[1,rank([rank([2,3])]),Function.call,is(plural),true],condition:"equal"}
 }
 ,crop:{context:[1,a=>a*2],terms:[1,2,3,Function.call],condition:when(is(1,4))}
 ,swap:{context:[a=>a*2],terms:[1,2,3,Function.call],condition:when(is(2))}
 ,slip:{context:[a=>a*2],terms:[1,2,3,Function.call],condition:when(is(functor,1,2,3))}
 ,push:{context:[a=>a*2],terms:[1,2,3,Function.call],condition:when(is(1,2,3,functor))}
 ,surge:{context:[1,rank([rank([rank([rank([rank([rank([2,3])])])])])]),4],condition:when(is(1,2,3,4))}
 ,flush:{context:[1,rank([rank([rank([rank([2,3])])])]),4],condition:when(is(1,4))}
 ,model:{context:[0,rank([1,rank([2,3]),4,rank([5,rank([6,7]),8]),9]),10],condition:when(match({0:0,1:{0:1,1:{0:2,1:3},2:4,3:{0:5,1:{0:6,1:7},2:8},4:9},2:10}))}
 ,spill:
 {sync:{context:[1,rank([2,3]),4],terms:[lift],condition:when(is(1,2,3,4))}
 ,async:{context:[1,rank([rank([rank([rank([Promise.resolve(2),rank([rank([3])])])])])]),4],terms:[lift,],condition:when(is(1,Promise,3,4))}
 ,asyncgen:{context:[1,each.call(rank([Promise.resolve(2),rank([rank([3])])]),async a=>Promise.resolve(a)),4],terms:[lift],condition:when(is(1,2,3,4))}
 ,drain:{context:[1,rank([rank([rank([rank([2,3])])])]),4],terms:[flush],condition:when(is(1,4))}
 }
 ,tether:
 {access:{context:["length"],terms:[[1,2],Function.call,2],condition:["equal"]}
 ,invoke:{context:["a"],terms:[{a:a=>a*2},3,Function.call,6],condition:["equal"]}
 ,method:{context:[Array.prototype.map,a=>a*2],terms:[[1],Function.call,[2]],condition:["deepEqual"]}
 ,identity:{context:[function scope(){return this}],terms:[2,Function.call,2],condition:["equal"]}
 }
 ,pivot:
 {scope:{context:[function(){return this;}],terms:[1,2,3,"call",collect,[1,2,3]],condition:["deepEqual"]}
 ,terms:{context:[function(term){return term;},4],terms:[1,2,3,"call",4],condition:["equal"]}
 }
 ,each:
 {map:{context:[a=>a*2],terms:[1,2,3,"call",collect,[2,4,6]],condition:"deepEqual"}
 ,cumulative:{context:[(item,past)=>item+(past.at(-1)||0)],terms:[1,10,100,"call",collect,[1,11,111]],condition:"deepEqual"}
 ,perposition:{context:[[a=>a+1,a=>a+2,a=>a+3]],terms:[10,10,10,"call",collect,[11,12,13]],condition:"deepEqual"}
 ,shortarray:{context:[[a=>a+100]],terms:[10,20,30,"call",collect,[110,20,30]],condition:"deepEqual"}
 ,async:{context:[async a=>a*2],terms:[1,2,3,"call",collect,[2,4,6]],condition:"deepEqual"}
 }
 ,buffer:
[{context:[a=>{throw Error()},fail=>2],terms:[1,Function.call,2],condition:"equal"}
,{context:[a=>2,fail=>3],terms:[1,Function.call,2],condition:"equal"}
,{context:[exit],terms:[Function.call,is(Error),true],condition:"equal"}
],differ:
[{context:[a=>a],terms:[buffer,1,"call",is(Error)],condition:"ok"}
,{context:[a=>2],terms:[1,"call",2],condition:"equal"}
,{context:[],terms:[buffer,1,Function.call,is(Error)],condition:"ok"}
],either:
 {first:{context:[a=>a*2,a=>a*3],terms:[1,Function.call,2],condition:["equal"]}
 ,second:{context:[a=>false,a=>a*3],terms:[1,Function.call,3],condition:["equal"]}
 ,abscond:{context:[a=>false,drop()],terms:[1,Function.call,collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[null,1,Function.call,1],condition:["equal"]}
 ,neither:{context:[differ()],terms:[buffer,0,1,2,Function.call,is(Error),true],condition:["equal"]}
 ,promise:{context:[a=>false,a=>2],terms:[0,Promise.resolve(1),Function.call,2],condition:["equal"]}
 ,fail:{context:[a=>exit("b"),a=>2],terms:[0,1,Function.call,2],condition:["equal"]}
 }
 ,whether:
 {boolean:
[{context:[a=>true,1,2],terms:[{1:"a"},"call","a"],condition:["equal"]}
,{context:[a=>false,1,2],terms:[{2:"a"},"call","a"],condition:["equal"]}
],indexed:{context:[a=>a,swap(1),swap(2)],terms:[null,1,"call",2],condition:["equal"]}
 ,switch:{context:[[a=>a,a=>true],swap(1),swap(2)],terms:[null,false,"call",2],condition:["equal"]}
 ,fallback:{context:[[a=>a,a=>a],1,2,swap(3)],terms:[null,false,"call",3],condition:["equal"]}
 ,literal:
[{context:[true,()=>"YES",()=>"NO"],terms:["call","YES"],condition:"equal"}
,{context:[false,()=>"YES",()=>"NO"],terms:["call","NO"],condition:"equal"}
]}
 ,combine:
[{context:[a=>a*2,a=>a*3,a=>a*4],terms:[1,Function.call,collect,[2,3,4]],condition:["deepEqual"]}
,{context:[a=>rank([a,a]),a=>a*3,a=>a*4],terms:[1,Function.call,is(plural,3,4),true],condition:"equal"}
],is:
 {nothing:{context:[something],terms:[Function.call,false],condition:["equal"]}
 ,something:{context:[something],terms:[0,Function.call,true],condition:["equal"]}
 ,anything:{context:[],terms:[1,Function.call,true],condition:["equal"]}
 ,neutral:{context:[],terms:[Function.call,true],condition:["equal"]}
 ,instance:{context:[Function],terms:[infer(undefined,function(){}),Function.call,true],condition:["equal"]}
 ,multiple:
[{context:[[numeric,string]],terms:[5,Function.call,false],condition:"equal"}
,{context:[[numeric,a=>a>0]],terms:[5,Function.call,true],condition:"equal"}
],respective:{context:[[iterable,a=>a.some(Boolean)],a=>a==="a"],terms:[[1,2],"a",Function.call,true],condition:["equal"]}
 }
 ,match:
 {deep:{context:Array(2).fill({a:{b:"a"},c:5}),terms:[true],condition:["equal"]}
 ,flat:{context:[["a",""],["a",string]],terms:[true],condition:["equal"]}
 ,flatcombinative:{context:[["a",string]],terms:[["a",""],infer,"call",true],condition:["equal"]}
 ,emptymatch:{context:[["a",""],[]],terms:[true],condition:["equal"]}
 ,emptyvalue:{context:[[],[string]],terms:[false],condition:["equal"]}
 ,mismatch:{context:[0,[string]],terms:[false],condition:["equal"]}
 }
 ,prune:
 {map:{scope:true,context:[{a:1,b:2,c:3},([field,value])=>field==="b"?undefined:value*10,false,[]],terms:[{a:10,c:30}],condition:["deepEqual"]}
 ,collapse:{scope:true,context:[{a:1,b:{x:1,y:2},c:3},([field,value])=>field==="b"?undefined:value,true,[]],terms:[{a:1,x:1,y:2,c:3}],condition:["deepEqual"]}
 ,recurse:{scope:true,context:[{a:{x:1,y:2},b:3},([field,value])=>value,false,[]],terms:[{a:{x:1,y:2},b:3}],condition:["deepEqual"]}
 ,array:{scope:true,context:[[1,2,3],([field,value])=>value,false,[]],terms:[[1,2,3]],condition:["deepEqual"]}
 ,reindex:{scope:true,context:[[1,2,3,4],([field,value])=>value%2?undefined:value,false,[]],terms:[[2,4]],condition:["deepEqual"]}
 ,terminal:{scope:true,context:[{type:"Identifier",start:0,end:1,name:"a"},([field,value])=>/^(type|start|end|loc|range)$/.test(field)?undefined:value,true,1],terms:[{name:"a"}],condition:["deepEqual"]}
 ,depth:{scope:true,context:[{a:{b:{c:1,d:2},e:3},f:4},([field,value])=>value,false,1],terms:[{a:{b:{c:1,d:2},e:3},f:4}],condition:["deepEqual"]}
 ,promise:{scope:true,context:[{a:1,b:2},([field,value])=>field==="b"?Promise.resolve(value*100):value,false,[]],terms:[{a:1,b:200}],condition:["deepEqual"]}
 ,source:{scope:true,context:[{a:1,b:Promise.resolve({x:1,y:2})},([field,value])=>field==="b"?undefined:value,true,[]],terms:[{a:1,x:1,y:2}],condition:["deepEqual"]}
 ,nested:{scope:true,context:[{a:{b:Promise.resolve(5)}},([field,value])=>value,false,[]],terms:[{a:{b:5}}],condition:["deepEqual"]}
 ,bottom:
 {leaf:{scope:true,context:[{a:{x:1,y:2},b:3},([field,value])=>numeric(value)?value*10:value,-1,[]],terms:[{a:{x:10,y:20},b:30}],condition:["deepEqual"]}
 ,fold:{scope:true,context:[{a:{x:1,y:2,z:3},b:4},([field,value])=>field==="a"?Object.values(value).reduce((sum,v)=>sum+v,0):value,-1,[]],terms:[{a:6,b:4}],condition:["deepEqual"]}
 ,drop:{scope:true,context:[{a:1,b:{x:1,y:2}},([field,value])=>field==="x"?undefined:value,-1,[]],terms:[{a:1,b:{y:2}}],condition:["deepEqual"]}
 ,compound:{scope:true,context:[{a:1,b:{x:1,y:2},c:3},([field,value])=>field==="b"?undefined:numeric(value)?value*10:value,-1,[]],terms:[{a:10,c:30}],condition:["deepEqual"]}
 ,terminal:{scope:true,context:[{a:{b:{c:1,d:2},e:3},f:4},([field,value])=>numeric(value)?value*10:value,-1,1],terms:[{a:{b:{c:1,d:2},e:30},f:40}],condition:["deepEqual"]}
 ,promise:{scope:true,context:[{a:{b:Promise.resolve(5)},c:2},([field,value])=>numeric(value)?value*10:value,-1,[]],terms:[{a:{b:50},c:20}],condition:["deepEqual"]}
 ,array:{scope:true,context:[[{x:1,y:2},{x:3,y:4}],([field,value])=>field==="0"||field==="1"?Object.values(value).reduce((sum,v)=>sum+v,0):value,-1,[]],terms:[[3,7]],condition:["deepEqual"]}
 }
 }
 ,revert:
[{context:[(resolve,reject,context)=>resolve(context)],terms:[2,Function.call,2],condition:["equal"]}
,{context:[(resolve,reject,context)=>Promise.resolve(context).then(resolve)],terms:[3,Function.call,3],condition:["equal"]}
],route:
{direct:{context:["greet","world"],terms:[{greet(request){return "hello "+request;}},"call",collect,["hello world"]],condition:"deepEqual"}
,nested:{context:[["a","b"],"X"],terms:[{a:{b(request){return "got "+request;}}},"call",collect,["got X"]],condition:"deepEqual"}
,method:{context:["missing",{method:"GET"}],terms:[{get(request){return {missing:"GET"};}},"call",collect,["GET"]],condition:"deepEqual"}
,constitution:{context:["missing",{method:"GET"}],terms:[{missing:{get(request){return "GET";}}},"call",collect,["GET"]],condition:"deepEqual"}
,recursive:{context:[["b","c","a"]],terms:[{a(){return this+2;},b:{c:1}},"call",collect,[3]],condition:"deepEqual"}
}};
