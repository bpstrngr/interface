 import * as namespace from "./Blik_2023_inference.js";
 export * from "./Blik_2026_type.js";
 export const {pathname:address,origin}=new URL(import.meta.url);
 export const location=address.replace(/\/[^/]*$/,"");
 var browser=globalThis.window||(globalThis.constructor.name==="DedicatedWorkerGlobalScope");
 // skip dynamic inference for combinators in ./infer. 
 var freeterms=new Set([...Object.values(namespace).filter(functor),Array,Object.assign,Object.values,Object.entries,Object.fromEntries,RegExp].map(term=>term.name));

 import {colors,describe,cast,construct,type,defined,something,functor,simple,compound,string,numeric,iterable,array,heritage,asynchronous,promise,generator,asyncgenerator,plural,pattern,basic} from "./Blik_2026_type.js";

 export function* unit(){yield* arguments;};

 export function index(){return Array.from(arguments);};

 export var trickle=describe(infer("reduce",(queue,next,index,heap)=>
 // sort promises by speed. 
[queue
,Promise.resolve(queue.at(-1)).then(past=>
 Promise.any(heap.map((slot,index)=>
 Promise.race([slot,false]).then(next=>next?past===next
?Promise.reject(heap.splice(index,1))
:stagger(next):slot)
 )))
].flat(),[]),"trickle");

 export var settle=describe(Object.values(
 // resolve async context in index. 
 {promise(context){return Promise.all(context);}
 ,asyncgenerator(context)
{return context.reduce(function resolve(context,term)
{return promise(context)
?context.then(context=>resolve(context,term))
:asyncgenerator(term)
?term.next().then(({value,done})=>!done?resolve(context,term).then(next=>
 next.splice(context.length,0,value)&&next):[...context])
:[...context,term];
},[]);
}}).map(term=>(
 {type(index){return index.some({promise,asyncgenerator,generator}[term.name]);}
 ,term
 })).map(({type,term})=>cast(type,term)).reduce(induce,index),"settle");

 export function expand(context){return context.flatMap(term=>generator(term)?[...term]:[term]);};

 export var collect=describe(induce(settle,cast(index=>index.some(generator),expand)),"collect");

 export var rank=
 // infer unit from index. 
 describe(deduce(unit.apply.bind(unit,null)),"rank");

 export function yank(index)
{// rank plurality or yield singularity of index. 
 return array(index)?index.length-1?rank(index):index[0]:index;
};

 export function drop(stop=Infinity,start=0,...stack)
{// filter context between (or outside if stop<start) indexes. 
 // eg. combine(drop(1,-1),drop(-1,1))(1,2,3,4)=((2,3),(1,4)). 
 // stop may be a filter condition, stack may be a function on dropped context (start<stop). 
 if(functor(stop))
 return each(whether(is(not(functor),major(start-1)),drop()));
 let modulus=(offset,index,{length})=>
 offset<length?(length+offset)%length:length;
 let split=compose("length",Array,[start,stop],Object.assign
,infer("map",modulus)
,combine
(infer("reduce",(start,stop)=>Number(stop<start))
,compose
(combine(1),0,infer("sort",(stop,start)=>(start<stop)?1:-1)
,combine(infer(0),infer("reduce",(past,next)=>next-past))
,collect
)
),lift);
 return describe(function(...context)
{if(defined(this))
 context.unshift(this);
 let [crop,interval]=split(context);
 let replace=!crop&&interval[1]&&functor(stack[0]);
 return infer.call
(replace?infer.call(rank(interval.reduce((index,length)=>crop
?[context.slice(index+length),context.slice(0,index)].flat()
:context.slice(index,index+length))),...stack):rank(stack)
,(...stack)=>rank([context,context.splice(...interval,...stack)][crop])
);
},drop,...arguments);
};

 export var slip=drop.bind(null,0,0);
 export var crop=drop.bind(null,Infinity);
 export var swap=drop.bind(null,Infinity,0);
 export var push=drop.bind(null,Infinity,Infinity);
 export var flip=describe(compose(collect,"reverse",rank),"flip");
 export function rotate(offset)
{return describe(function(...context)
{return rank(context.map((value,index,context)=>
 context[(context.length+index-offset)%context.length]));
},rotate,...arguments);
};

 export function undefine(){};

 export function constant(term){return describe(function(){return term;},constant,term);};

 export function add(...terms){return describe(function*(){yield* arguments;yield* terms;},add,...term);};

 export function deduce(unfold)
{// monadic inference. 
 return describe(function(term)
{return promise(term)?term.then(unfold):unfold(term);
},deduce,unfold);
};

 export function induce(fold=unit,unfold=cede)
{// variadic inference with monadic conclusion. 
 let deduction=deduce(unfold);
 let induction=describe(function(...context)
{if(defined(this))
 context.unshift(this);
 return deduction(fold(...context));
},induce,...arguments);
 return defined(this)?induction(this):induction;
};

 export function reduce(fold)
{// co-induction. 
 return describe(induce(collect,fold.apply.bind(fold,null)),reduce,fold);
};

 export function conduce(term)
{// co-reduction. 
 let fold=functor(term)?reduce:add;
 return fold(term);
};

 export function produce(...terms)
{// co-conduction. 
 return terms.map(conduce).reduce(induce);
};

 export var lift=induce(collect,rank);

 export var cede=induce(collect,yank);

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

 export function same(...context)
{let identity=describe
(compose(index,context,(terms,context)=>
 !context.some((context,index)=>context!==terms[index]))
,same,...arguments
);
 return defined(this)?identity(this):identity;
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
 return describe(infer(match,next),match,...arguments);
 return past===next?true
:pattern(past)?past.test(next)
:functor(past)?past(next)
:basic(past)?compound(next)&&
 Object.entries(past).every(([field,value])=>
 match(next?.[field],value))
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
 export function sum(...context)
{// cumulate context values. 
 return context.flat().reduce((sum,value)=>sum+(Number(value)||0),0);
};
 export function extreme(series)
{return ["min","max"].map(key=>Math[key](...[series].flat()));
};
 export function minor(past,next){if(!defined(next))return compose(when(numeric),infer(minor,past));return past<next;}
 export function major(past,next){if(!defined(next))return compose(when(numeric),infer(major,past));return next<past;}

 export var tally=compose(when(numeric),crop(1),combine
(compose(-1,sum,major,slip(fold(),collect,"length"),compose,"tally")
,unit
),lift,describe);

 export function tether(term,...context)
{// infer term with scope. 
 let bind=describe(compose(when(defined),infer(functor(term)?Function.call.bind(term):term,...context)),tether,...arguments);
 return defined(this)?bind(this):bind;
};

 export function pivot(term,...stack)
{// rank dynamic context in term scope. 
 return defined(this)?pivot(this):describe(pivot,...arguments);
 function pivot(...context)
{if(defined(this))
 context.unshift(this);
 let scope=rank(context);
 return functor(term)
?term.call(scope,...stack)
:lift(scope,term,...stack);
};
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
 let bound=map&&term.name.startsWith("bound ");
 let free=map&&(!term.name||term.name.includes("(")||freeterms.has(term.name));
 let detach=string(term)&&term.startsWith("tether ")&&term.substring(7);
 let attend=something(scope)&&!array(term)&&!bound&&!free
?[Object(scope),detach||term].reduce((domain,term)=>map
?(domain[term.name]===term||heritage(domain?.buffer instanceof ArrayBuffer?Object.getPrototypeOf(domain):domain).find((field,index,fields)=>
{try{return Object.is(Reflect.get(domain,field),term);}catch(fail){};
}))&&term
:Reflect.get(domain,term?.toString?term:null))
:undefined;
 if(detach)context.shift();
 if(!functor(defined(attend)?attend:term))
 return defined(attend)?attend:rank(context.push(term)&&context);
 let inference=attend?Function.call.bind(attend):term;
 return inference(...context);
};

 export function fold(term=unit)
{// rank procedure. 
 return function* fold(){yield term(...arguments);};
};

 export function surge(...context)
{// recursive lift. 
 if(promise(this))
 return this.then(scope=>surge.call(scope,...context));
 if(match(this,context))
 return rank(this);
 let scope=this||context;
 return surge.call(collect(...scope),...scope);
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
 let controlled=is(AbortController)(controller);
 let loop=next.apply.bind(next,null);
 return rank(context.reduce(next,[]));
 function next(context,term)
{if(controlled&&controller.signal.aborted)
 return exit(controller.signal.reason);
 if(promise(context)||promise(term))
 return Promise.all([context,term]).then(loop);
 context.push(!plural(term)?term
:compose.call(each.call(term,(next,past)=>spill.call(controller
 // synchronize promises. 
,promise(past.at(-1))?past.at(-1).then(past=>next):next)),lift,cede));
 return context;
};
};

 export function model(...context)
{// snapshot of context. 
 return Object.fromEntries(Object.entries(context).map(([index,term])=>
 [index,plural(term)?model(...term):term]));
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

 export function buffer(term,quit)
{// alternative inference for failure. 
 if(!defined(this))
 return pivot(buffer,...arguments);
 let context=collect(this);
 try
{let next=infer.call(rank(context),term);
 return promise(next)?next.catch(infer(quit,rank(context))):next;
}catch(fail){return infer(quit,rank(context))(fail);};
};

 export function differ(term)
{// infer without allowing identity. 
 let difference=compose
(combine(compose(same,not,when),term),lift
,infer,Function.call
);
 return defined(this)?difference(this):difference;
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
{// alternative difference before last inference. 
 let valid=is([something,not(is(false)),not(is(Error))]);
 let composition=terms.reduce((past,term,index,{length},left=length-index-1)=>
 buffer(past,compose(drop(1),left?compose(differ(term),when(valid)):term))
,terms.length?exit:unit);
 describe(composition,either,...arguments);
 return defined(this)?infer.call(this,composition):composition;
};

 export function whether(condition,...terms)
{// conditional inference. 
 let index=[condition].flat().map((condition,index)=>compose
(functor(condition)?condition:swap(condition)
,when(is([something,not(is(false))])),swap(index)
));
 let term=compose(either(...index,swap(index.length)),slip(terms),Reflect.get);
 let composition=describe(compose(combine(term,fold()),lift,infer,Function.call),whether,...arguments);
 return defined(this)?infer.call(this,composition):composition;
};

 export function decide({else:otherwise,...cases})
{return whether
(Object.values(cases).map(({0:first,condition=first})=>condition)
,...Object.values(cases).map(({1:second,term=second})=>term)
,otherwise
);
};

 export function stash(...terms)
{return describe(compose(combine(unit,...terms.map(term=>functor(term)?term:swap(term))),lift),stash,...arguments);
};

 export var zap=compose(each(
 // lift context into index. (([1,2],3)=>(1,3),(2,3))
[compose(crop(1),index,"flat")
,compose(crop(1),swap,slip(1),crop)
]),infer("map"),rank);

 export function each(term,...stack)
{if(!defined(this))
 return pivot(each,...arguments);
 let status=deduce(next=>next.done);
 let value=fold(deduce(search("value")));
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

 export function prune(term,collapse,limit=[],path=[],trace=[])
{// map entries recursively.
 let scope=this;
 if(!compound(scope))return scope;
 let entries=Object.entries(scope);
 if(!entries.length)
 for(let field in scope)
 entries.push([field,scope[field]]);
 entries=entries.flatMap(function([field,source],index,entries)
{let terminal=numeric(limit)?path.length===limit:[limit].flat().some(limit=>
[[limit],[array(limit)?path:[],field]
].map(compose("flat","/","join")).reduce(Object.is))
 let value=term.call(scope,[field,source],path,trace);
 let pluck=!defined(value);
 if(pluck&&(!collapse||terminal))
 return [];
 if(terminal)
 return [[field,value]];
 let graft=pluck&&collapse;
 let range=[...collect(graft?source:value)].map(value=>
 prune.call(value,term,collapse,limit,path.concat(field),trace.concat([scope])));
 return range.flatMap(scope=>graft
?Object.entries(compound(scope)?scope:{})
:[[field,scope]]);
});
 let iterable=//!entries.length||
 array(scope)&&(entries.length||array(scope))&&!entries.some(([field],index,entries)=>
 isNaN(field)||[entries[index-1]?.[0],field].map(Number).reduce((past,next)=>next<past));
 if(iterable)
 entries.forEach(function([field],index,entries)
{if(!index)
 // snap first index. 
 return field!=0&&entries.forEach(entry=>entry[0]=Number(entry[0])-entries[0][0]);
 let leap=1-field+Number(entries[index-1]?.[0]);
 if(leap)
 // spread plural indexes. 
 entries.slice(index).forEach((entry)=>entry[0]=Number(entry[0])+leap);
});
 scope=Object.fromEntries(entries);
 return iterable?Object.assign(Array(0),scope):scope;
 // composition for async terms, makes some optimization overdue. 
 return compose.call(entries,infer("reduce",record(function([field,source],index,entries)
{let terminal=numeric(limit)?path.length===limit:[limit].flat().some(limit=>
[[limit],[array(limit)?path:[],field]
].map(compose("flat","/","join")).reduce(Object.is));
 let dispensible=!collapse||terminal;
 return compose(tether(term),either
(whether(dispensible&&not(defined),swap([]))
,whether(terminal,value=>[[field,value]])
,either(whether(collapse&&not(defined),swap(true,source)),slip(false))
),collect,([graft,...scope])=>[graft,scope.map(scope=>
 prune.call(scope,term,collapse,limit,path.concat(field)))]
,"flat",rank,collect,([graft,...range])=>range.flatMap(scope=>graft
?Object.entries(compound(scope)?scope:{})
:[[field,scope]]))(scope,[field,source],path);
}),[]),"flat",scope,reindex);
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

//  export function route(scope,term,path)
// {// insert/invoke term in scope on given path.
//  if(!scope)return;
//  let paths=[path(scope,term)].flat().filter(something);
//  if(!paths.length)return;
//  let descended=paths.find(field=>route(scope[field],term,path));
//  if(descended)return descended;
//  let entries=paths.map(path=>[path,functor(term)?term([path,scope[path]]):term]);
//  return entries.reduce(record(([path,term])=>infer(term,term=>
//  array(scope)?scope.splice(path,0,term):Object.assign(scope,{[path]:term})))
// ,[]);
// };

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
 return override?source:new Group([source,target].flatMap(part=>Array.from(part)));
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
 if(defined(value))
 return buffer(Object.assign,drop(1,2))(target,{[field]:value});
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
 return induce(either
(compose(slip(scope),tether(distinction),slip(scope),Reflect.get)
,compose(slip(scope),combine(record(term,distinction),tether(distinction)),lift,Reflect.get)
),cede);
};

 export function route(term,...context)
{// compose with static context, methodic and scope-rebound alternatives. 
 if(functor(context[1]))
 throw Error("Route variant to merge dynamic values on dynamic paths is deprecated. Use search.merge to support it.");
 if(!this)return tether(route,...arguments);
 let scope=this;
 let path=[term].flat();
 let method=context[0]?.method?.toLowerCase();
 let methodic=combine(method,drop(1));
 // record for methodic route taken. 
 let branch=[];
 let branched=compose(swap(branch),"length",major(0));
 let store=pass(record(drop(1,2)).bind(branch));
 let fail=compose(swap(branch),Error("not found: "+path.join("/")),"concat",infer("find",is(Error)),exit);
 let terms=path.map((term,index,path)=>infer(either
(buffer(term,store)
,whether(has(method),buffer(compose(methodic,lift,differ(term),store),compose(store,swap(undefined))),unit)
,buffer(tether(scope[term]),store)
,fail
),...context,path.slice(0,index)));
 let composition=describe(compose(...terms,whether
 // invoke method if not done already. 
(branched,infer(),buffer(compose(infer(method,...context),crop(1)),crop(1))
)),route,...arguments);
 return scope?composition(scope):composition;
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
{return records.reduce((clusters,record)=>
 record[field]?.map(phrase=>
 phrase.toLowerCase()).reduce((clusters,phrase,index,phrases)=>
 phrases.filter((phrase,coindex)=>coindex!==index).reduce((clusters,cophrase)=>
 [phrase,cophrase][clusters[phrase]?"slice":"reverse"]().reduce((phrase,cophrase)=>
 merge(clusters,sum(clusters[phrase]?.[cophrase],1),[phrase,cophrase]))
,clusters)
,clusters)
 ||clusters
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
 fields=string(fields)?[fields]:fields;
 if(exclusive)
 return prune.call(this,([field,value])=>
 fields.includes(field)?undefined:value,0,0);
 return fields.reduce((term,field)=>
 merge(term,{[field]:this[field]}),{});
};

 export var fields=(record,term=something)=>
 Object.keys(record).filter(field=>
 term(record[field]));

 export function relevant(scope,term)
{return Object.fromEntries(Object.entries(scope).flatMap(([field,value])=>!string(value)
?["ends","starts"].some(side=>term[side+"With"](field))?Object.entries(value):[]
:[[field,value]]));
};

 export function debug(...context){debugger;return rank(context);};

 export function note(...context)
{// expose context in console. (combine(compose(note,drop()),unit))
 let stack=trace().slice(0,-1);
 // let composition="compose/reduce/compose/infer\\((bound )*note\\)/infer/note".split("/");
 // let composed=composition.every((term,index,{length})=>RegExp(term+"$").test(stack.at(index-length)?.[0]));
 // stack=stack.slice(0,composed?-composition.length:-1);
 let {steady,dim,bright,blue,gray,bold}=colors;
 let source=dim+gray+"@"+bright+blue+stack.at(-1)?.[1]||"...intractable";
 stack=compose.call
(stack
,whether(compose(infer("at",-6),"0",is("rank.pivot")),infer("slice",0,-6),unit)
,infer("map",([term,position],index,{length})=>length-index-1
?term||position?.replace(origin+location.slice(1),".")
:(steady+bright+blue+term))
,dim+blue+"/"+dim+gray,"join"
)+steady;
 let stream=console[this?"info":"log"];
 console.groupCollapsed(steady+bright+bold+blue+" "+clock(new Date())+source+steady);
 stream(bright+blue+stack+steady+":");
 console.groupEnd();
 let color=!compound(this)&&this;
 let phase=colors[color]||Object.values(colors)[color]||steady;
 if(!browser)globalThis.process.stdout.write(phase);
 else context.unshift(phase),context.push(steady);
 stream(...browser&&context.every(string)?[context.join(" ")]:context);
 if(!browser)globalThis.process.stdout.write(steady);
 else context.shift(),context.pop();
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
(infer("observe",scope,register)
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
 return either.call(rank(context),condition,repeat);
};

 export function revert(term,...context)
{// revert a Promise's inversion of control. 
 if(!defined(this))
 return pivot(revert,...arguments);
 return new Promise(compose(rank(context),this,lift,term));
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

 export function exit(fail){throw is(Error)(fail)?fail:Error(fail,{reason:fail});};

 // OBSOLETE (weak variations of infer, compose, tether) 

 export var apply=(context,term)=>
 // apply or append term to context (respecting plurality and asynchronicity).
 [context,term].some(context=>promise(context))
?Promise.all([context,term]).then(([context,term])=>apply(context,term))
:functor(term)
?term(...collect(context))
:lift(context,term);

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
 {deduce:{context:[sum],terms:[1,2,3,"call"],condition:when(is(2))}
 ,induce:
 {identity:{context:[sum],terms:[1,2,3,"call"],condition:when(is(6))}
 ,reduce:{context:[index,cast(index=>index.some(generator),expand)],terms:[1,rank([2,3]),4,"call"],condition:when(match([1,2,3,4]))}
 }
 ,infer:
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
[{scope:true,context:[[1],"map",induce(crop(1),cede)],terms:[[1]],condition:["deepEqual"]}
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
,{context:[rank([1])],condition:when(is(plural))}
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
 {sync:{context:[1,rank([rank([rank([rank([rank([rank([2,3])])])])])]),4],terms:[lift],condition:when(is(1,2,3,4))}
 ,async:{context:[1,rank([rank([rank([rank([Promise.resolve(2),rank([rank([3])])])])])]),4],terms:[lift],condition:when(is(1,2,3,4))}
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
 ,buffer:
[{context:[a=>{throw Error()},fail=>2],terms:[1,Function.call,2],condition:"equal"}
,{context:[a=>2,fail=>3],terms:[1,Function.call,2],condition:"equal"}
,{context:[exit],terms:[Function.call,is(Error),true],condition:"equal"}
],differ:
[{context:[a=>a],terms:[buffer,1,infer(Function.call),is(Error)],condition:"ok"}
,{context:[a=>2],terms:[1,infer(Function.call),2],condition:"equal"}
,{context:[],terms:[buffer,1,Function.call,is(Error)],condition:"ok"}
],either:
 {first:{context:[a=>a*2,a=>a*3],terms:[1,Function.call,2],condition:["equal"]}
 ,second:{context:[a=>false,a=>a*3],terms:[1,Function.call,3],condition:["equal"]}
 ,abscond:{context:[a=>false,drop()],terms:[1,Function.call,collect,c=>c.length,0],condition:["equal"]}
 ,identity:{context:[],terms:[null,1,Function.call,1],condition:["equal"]}
 ,neither:{context:[differ()],terms:[buffer,1,2,Function.call,is(Error),true],condition:["equal"]}
 ,promise:{context:[a=>false,a=>2],terms:[Promise.resolve(1),Function.call,2],condition:["equal"]}
 ,fail:{context:[a=>exit("b"),a=>2],terms:[1,Function.call,2],condition:["equal"]}
 }
 ,whether:
 {boolean:
[{context:[a=>true,1,2],terms:[{1:"a"},infer(Function.call),"a"],condition:["equal"]}
,{context:[a=>false,1,2],terms:[{2:"a"},infer(Function.call),"a"],condition:["equal"]}
],indexed:{context:[a=>a,swap(1),swap(2)],terms:[null,1,infer(Function.call),2],condition:["equal"]}
 ,switch:{context:[[a=>a,a=>true],swap(1),swap(2)],terms:[null,false,infer(Function.call),2],condition:["equal"]}
 ,fallback:{context:[[a=>a,a=>a],1,2,swap(3)],terms:[null,false,infer(Function.call),3],condition:["equal"]}
 }
 ,combine:
[{context:[a=>a*2,a=>a*3,a=>a*4],terms:[1,Function.call,collect,[2,3,4]],condition:["deepEqual"]}
,{context:[a=>rank([a,a]),a=>a*3,a=>a*4],terms:[1,Function.call,is(plural,3,4),true],condition:"equal"}
],compose:
[{context:[3],terms:[1,2,Function.call],condition:when(is(1,2,3))}
,{context:[3],terms:[rank([1,2]),Function.call],condition:when(is(plural,3))}
,{context:[3],terms:[rank([1,2]),Function.call,is(plural,3),true],condition:"equal"}
,{context:[3],terms:[rank([rank([1,2])]),Function.call,is(plural,3),true],condition:"equal"}
],is:
 {nothing:{context:[something],terms:[Function.call,false],condition:["equal"]}
 ,something:{context:[something],terms:[0,Function.call,true],condition:["equal"]}
 ,anything:{context:[],terms:[1,Function.call,true],condition:["equal"]}
 ,neutral:{context:[],terms:[Function.call,true],condition:["equal"]}
 ,instance:{context:[Function],terms:[infer(undefined,function(){}),Function.call,true],condition:["equal"]}
 ,multiple:{context:[[iterable,a=>a.some(Boolean)]],terms:[[1,2],Function.call,true],condition:["equal"]}
 ,respective:{context:[[iterable,a=>a.some(Boolean)],a=>a==="a"],terms:[[1,2],"a",Function.call,true],condition:["equal"]}
 }
 ,match:
 {deep:{context:Array(2).fill({a:{b:"a"},c:5}),terms:[true],condition:["equal"]}
 ,flat:{context:[["a",""],["a",string]],terms:[true],condition:["equal"]}
 ,flatcombinative:{context:[["a",string]],terms:[["a",""],infer,"call",true],condition:["equal"]}
 ,emptymatch:{context:[["a",""],[]],terms:[true],condition:["equal"]}
 ,emptyvalue:{context:[[],[string]],terms:[false],condition:["equal"]}
 ,mismatch:{context:[0,[string]],terms:[false],condition:["equal"]}
 }
 ,revert:
[{context:[(resolve,reject,context)=>resolve(context)],terms:[2,Function.call,2],condition:["equal"]}
,{context:[(resolve,reject,context)=>Promise.resolve(context).then(resolve)],terms:[3,Function.call,3],condition:["equal"]}
]};
