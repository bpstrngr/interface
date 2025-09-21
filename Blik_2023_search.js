 import {note,something,provide,has,compose,combine,buffer,slip,drop,stream,infer,either,swap,crop,not,whether,pass,promise,collect,simple,functor,defined,string,compound,tether,is,numeric,array,basic,iterable,construct} from "./Blik_2023_inference.js";
 import {resolve} from "./Blik_2023_interface.js";

 export var stringify=scope=>
 scope&&iterable(Object(scope))?String(scope):JSON.stringify(scope);

 export function random(length,domain="abcdefghijklmnopqrstuvwxyz123456789_")
{return Array(length).fill(domain).map(domain=>
 domain.charAt(Math.floor(Math.random()*domain.length))).join("");
};

 export var rgb=fill=>/^#/.test(fill)
?/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fill).slice(1,4).map(hue=>parseInt(hue,16))
:fill.replace("rgb(","rgba(").replace(/((?:[\(,] *\d+ *){3})\)/,"$1,1)");

 export var normal=fraction=>Math.pow(Math.E,-(fraction**2)/2)/Math.sqrt(Math.PI*2);

 export function encrypt(hash,algorithm="sha256",value)
{if(!this)
 return value=import("crypto").then(crypto=>value=crypto),function()
{return encrypt.call(value,hash,algorithm,...arguments);
};
 return compose.call(this,hash,algorithm?infer("createHmac",algorithm):"createHash"
,value,"utf-8","update","hex","digest");
};

 export function edit(source,edits)
{return Object.entries(edits||{}).reduce((source, [field,value]) =>
 source.replace(new RegExp(field,"g"),(match, ...groups) =>
 [value, ...groups.slice(0,-2)].reduce((value, group, index) =>
 value.replaceAll("$"+index, group)))
,source);
};

 export function sum(...context)
{// cumulate context values. 
 return context.flat().map(term=>Number(term)||0).reduce((sum,value)=>sum+value,0);
};

 export function extreme(series)
{return ["min","max"].map(key=>Math[key](...[series].flat()));
};

export function calendar(timestamps)
{let year=
 {January:31,February:(year)=>28+Number(!(year%4)),March:31,April:30,May:31
 ,June:30,July:31,August:31,September:30,October:31,November:30,December:31
 };
 if(!timestamps)return year;
 return timestamps.reduce((calendar,time)=>
 (['FullYear','Month','Date'].reduce((calendar,scale)=>
 [calendar,new Date(time)['get'+scale]()].reduce((calendar,field)=>
 (calendar[field]=[calendar[field],0].reduce((value)=>(!isNaN(value)?value+1:value))||
 Object.values(year).map((days)=>Object.fromEntries(Array(days.call?.(null,field)||days).fill(0).map((value,index)=>
 [index+1,value])))))
,calendar)
,calendar)
,{});
};

 export function date(time)
{const date=new Date(time);
 const [year,month,day]=['FullYear','Month','Date'].map(frame=>date['get'+frame]());
 const [mm,dd]=[month+1,day].map(frame=>
 Object.assign('00'.split(''),String(frame).split('').reverse()).reverse().join(''));
 return [mm,dd,String(year)].join('/');
}

 export function time(date)
{const [mm,dd,year]=date.split(/[/ ]/);
 return new Date([mm,dd,year].join('/')).getTime();
}

 export function round(date,up=0)
{// set date to a turn of the month.
 if(!(date instanceof Date))
 date=new Date(date);
 return new Date(['FullYear','Month'].map((scale,month)=>
 date['get'+scale]()+month+(up&&month)).reduce((year,month)=>
 [year+(month>12),month%12||12].join('/')+'/1 0:0')).getTime();
};

 export function normalize(samples,resolution,range)
{const grid = range.reduce((min, max) => max - min) / resolution;
 return samples.map(sample=>
[[sample.lon,sample.lat].map(axis=>Math[axis<0?'ceil':'floor'](axis/grid)*grid).join(':')
,sample
]).reduce((clusters,[field,sample])=>
 Object.assign(clusters,{[field]:[clusters[field]||[],sample].flat()})
,{});
}

 export function kmeans(samples,bounds,size,projection)
{const clusters=bounds.reduce(([left,top],[right,bottom])=>
 Array(Math.floor((right-left)/size)).fill(left).flatMap((left,x)=>
 Array(Math.floor((bottom-top)/size)).fill(top).map((top,y)=>(
 {center:projection.invert([left+(x+0.5)*size,top+(y+0.5)*size])
 ,nodes:[]
 }))));
 samples=samples.filter((sample)=>
{const {lat:y,lon:x}=sample;
 const distances=clusters.map(({center:[cx,cy]})=>
 Math.pow(cx-x,2)+Math.pow(cy-y,2));
 const closest=Math.min(Infinity,...distances);
 const cluster=clusters.at(distances.indexOf(closest));
 return !cluster?.nodes.push(sample);
});
 return clusters.filter(({nodes})=>nodes.length).flatMap((cluster)=>
 cluster.nodes.length>1?cluster:cluster.nodes).concat(samples);
};

 export function nearest(range,value)
{const distances = range.map((range) => Math.abs(range - value));
 const index = distances.indexOf(Math.min(...distances));
 return range[index];
};

 export const antipode=(point,scale)=>point/(scale/360)-180;

 export const bisection=(point,scale)=>(point/(scale/2)-1)*-1;

 export const gudermannian=normal=>
 ((2*Math.atan(Math.exp(normal*Math.PI))-Math.PI/2)*180)/Math.PI;

 export function quadrate(center,width,ratio)
{return [-1,1].map(unit=>[0,1].map(axis=>
 center[axis]+(width/(axis?ratio:1)/2)*unit));
};

 export function search(term,recursive=false,path=[])
{// traverse scope for entries satisfying a term (condition or singular path).
 // recursive search includes ranges in recursion domain.
 if(!defined(this))
 return tether(search,...arguments);
 let scope=this;
 if(typeof scope!=='object'||scope===null)
 return [];
 let condition=functor(term);
 if(!condition)
 return !compound(term)?scope[term]:array(term)
?[term].flat().reduce((scope,field)=>scope?.[field],scope)
:Object.entries(term).flatMap(([field,term])=>
 [term].flat().flatMap(term=>scope[field]&&search.call(scope[field],term)));
 let group=whether(compose(path,tether(term)),[1],[0]);
 let length=stash(compose(drop(2,1),tether(search),"length"));
 let route=compose(group,length,drop(2),collect,"flat");
 let [domain,range]=[[],[]];
 for(let field in this)
 compose(stash(route),merge)([domain,range],[field,this[field]]);
 if(recursive)
 domain=[domain,range].flat();
 if(domain.some(promise))
 debugger
 let subrange=domain.flatMap(([field,value])=>Object.entries
(search.call(value,term,recursive,path.concat(field))
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
 (entries.length||array(scope))&&!entries.some(([field],index,entries)=>
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
,"flat",provide,collect,([graft,...range])=>range.flatMap(scope=>graft
?Object.entries(compound(scope)?scope:{})
:[[field,scope]]))(scope,[field,source],path);
}),[]),"flat",scope,index);
};

 var index=whether
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
 let disjunct=construct(target)?!simple(source):construct(source);
 let opaque=disjunct||[target,source].some(term=>!compound(term));
 if(opaque)
 return [target,source][Number(Boolean(override))];
 return Object.entries(source).reduce(function(target,[field,next])
{const past=target[field];
 const value=defined(past)?merge(past,next,override):next;
 // mutation warning - reduce on an empty target to copy.
 if(something(value))
 return buffer(Object.assign,drop(1,2))(target,{[field]:value});
 delete target[field];
 return array(target)?[target].flat():target;
},target);
};

 export function record(range,field="length")
{// assign range to field of dynamic scope.
 if(array(field))
 return field.filter(something).reverse().reduce((range,field)=>({[field]:range}),range);
 let path=compose(tether(field),collect,"flat");
 let composition=compose(combine(crop(1),tether(range),path),merge);
 return defined(this)?composition(this):composition;
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
 let fail=compose(swap(branch),Error("not found"),"concat",infer("find",is(Error)),exit);
 let terms=path.map((term,index,path)=>infer(either
(term
,whether(has(method),buffer(compose(methodic,differ(term),store),compose(store,swap(undefined))),infer())
,tether(scope[term])
,fail
),...context,path.slice(0,index)));
 let composition=compose(...terms,whether
 // invoke method if not done already. 
(branched,infer(),either(infer(method,...context),crop(1))
));
 return scope?composition(scope):composition;
};

 function set(options,namespace)
{return Object.entries(namespace).reduce((defaults,[field,kinds])=>
 Object.assign(defaults
,{[field]:options[field]
?Object.entries(kinds).find(([kind])=>
 [kind,options[field]].map((kind)=>kind.toLowerCase()).reduce(Object.is))?.pop()||
 Error([String(options[field]),'not in "'+field+'" options',Object.keys(kinds),].join(" "))
:defaults[field],
 }),this);
};

 export function flatten(factor,path=[])
{// expose factors in scope. 
 let scope=this;
 return [scope].flat().flatMap(scope=>
 [scope,...flatten.call(scope[factor],factor)]);
};

 export function trace(term,path=[])
{// trace term in scope or stack.
 let scope=this;
 if(scope===term||!scope)return path;
 return Object.entries(scope).reduce((hit,[track,scope])=>hit||
 [term===scope,path.concat(track)].reduce((hit,path)=>
 hit?path:compound(scope)?trace.call(scope,term,path):undefined)
,undefined);
};

 export function parse(records,separator="\",\"")
{if(records instanceof ArrayBuffer||records.constructor?.name==="Buffer")
 records=new TextDecoder('utf-8').decode(records);
 return records.split("\n").filter(({length})=>length).map(record=>
 record.replace(/^"|"$/g,"").split(separator).map(field=>
 field.includes(";")?field.split(/; */g):field)).reduce((fields,record,index,records)=>
 records.splice(index).map(record=>
 Object.fromEntries(fields.map((field,index)=>[field,record[index]]))));
};

 export function cluster(records,{field="Year"}={})
{return records.reduce((clusters,record)=>record[field]
?Object.assign(clusters,{[record[field]]:sum(clusters[record[field]],1)})
:clusters
,{});
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

 export function unfold(field,ancestors=new Set())
{if(!this||ancestors.has(this))
 return [];
 ancestors.add(this);
 let fold=[field].flat().flatMap(field=>functor(field)?field(this):this?.[field]||[]);
 return [this,fold.flatMap(scope=>unfold.call(scope,field,ancestors))].flat();
};

 export function clone(scope)
{return merge(JSON.parse(JSON.stringify(scope)),scope);
};

 export function isolate(path)
{// prune scope to specified path.
 return record(search.call(this,path),path);
};

 export function extract(fields,source)
{if(!this)return source?extract.call(source,fields):tether(extract,fields);
 if(source)
 return prune.call(this,([field,value])=>fields.includes(field)?undefined:value,0,0);
 return [fields].flat().reduce((term,field)=>
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

 export const tests=
 {merge:
[{context:[{a:1},{b:2}],terms:[{a:1,b:2}],condition:["deepEqual"]}
,{context:[{a:{}},2,"a/b/c".split("/")],terms:[{a:{b:{c:2}}}],condition:["deepEqual"]}
,{context:[undefined,{b:2}],terms:[{b:2}],condition:["deepEqual"]}
,{context:[undefined,{b:2},true],terms:[{b:2}],condition:["deepEqual"]}
,{context:[new URL("http://localhost"),{b:2},true],terms:["b",2],condition:"equal"}
],search:
[{scope:{a:{b:2}},context:[({1:value})=>value===2],terms:[{"a/b":2}],condition:"deepEqual"}
,{scope:{a:{b:1}},context:["abc".split("")],terms:[term=>term===undefined],condition:"ok"}
,{scope:{a:{b:1}},context:[["a","b"]],terms:[1],condition:["equal"]}
,{scope:{a:{b:1}},context:[entry=>entry,true],terms:[{a:{b:1},"a/b":1}],condition:["deepEqual"]}
,{scope:{a:{b:1}},context:[([field,value])=>!isNaN(value)],terms:[{"a/b":1}],condition:["deepEqual"]}
],prune:
 {trim:{scope:{a:{b:{c:3}}},context:[([field,value])=>field!=='b'?value:undefined],terms:[{a:[]}],condition:"deepEqual"}
 ,collapse:{scope:{a:{b:{b:2,c:3}}},context:[([field,value])=>field!=='b'?value:undefined,true],terms:[{a:{c:3}}],condition:"deepEqual"}
 ,shave:{scope:{a:{b:{c:{d:1},f:2}},e:3},context:[([field,value],path)=>path.length<2?value:undefined],terms:[{a:{b:[]},e:3}],condition:"deepEqual"}
 //,agnostic:{scope:{a:{b:[]},e:3},context:[([field,value])=>Promise.resolve(value)],terms:[note,{a:{b:[]},e:3}],condition:"deepEqual"}
},route:
 {path:{scope:{a:{b:c=>c.body}},context:[["a","b"],{body:1}],terms:[1],condition:["equal"]}
 ,method:{scope:{a:{get:c=>c.method}},context:[["a"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,beyond:{scope:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,broken:
[{scope:{a:{b:c=>{throw Error("fail")}}},context:[["a","b"]],terms:[is(Error)],condition:["ok"]}
,{scope:{a:{b:{get:c=>{throw Error("fail")}}}},context:[["a","b"],{method:"get"}],terms:[is(Error)],condition:["ok"]}
]}
 };
