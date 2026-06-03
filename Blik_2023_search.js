 import {note,something,sum,rank,cede,lift,has,compose,combine,buffer,slip,drop,stream,infer,either,swap,crop,not,whether,pass,promise,collect,simple,functor,defined,string,compound,tether,is,numeric,array,basic,iterable,construct,describe} from "./Blik_2023_inference.js";

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
{return Object.entries(edits||{}).reduce((source,[field,value])=>
 source.replace(new RegExp(field,"g"),(match,...groups)=>
 [value,...groups.slice(0,-2)].reduce((value,group,index)=>
 value.replaceAll("$"+index,group)))
,source);
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

 export function unfold(field,limit=new Set())
{if(!this||!limit)
 return [this];
 if(!numeric(limit))
 if(!limit.has?.(this))
 limit.add(this);
 else return [];
 let fold=[field].flat().flatMap(field=>
 functor(field)?field(this):this?.[field]||[]);
 return [this,limit?fold.flatMap(scope=>
 unfold.call(scope,field,numeric(limit)?limit-1:limit)):fold].flat();
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
 {trim:{scope:{a:{b:{c:3}}},context:[([field,value])=>field!=='b'?value:undefined],terms:[{a:{}}],condition:"deepEqual"}
 ,collapse:{scope:{a:{b:{b:2,c:3}}},context:[([field,value])=>field!=='b'?value:undefined,true],terms:[{a:{c:3}}],condition:"deepEqual"}
 ,shave:{scope:{a:{b:{c:{d:1},f:2}},e:3},context:[([field,value],path)=>path.length<2?value:undefined],terms:[{a:{b:{}},e:3}],condition:"deepEqual"}
 //,agnostic:{scope:{a:{b:[]},e:3},context:[([field,value])=>Promise.resolve(value)],terms:[note,{a:{b:[]},e:3}],condition:"deepEqual"}
},route:
 {path:{scope:{a:{b:c=>c.body}},context:[["a","b"],{body:1}],terms:[1],condition:["equal"]}
 ,method:{scope:{a:{get:c=>c.method}},context:[["a"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,beyond:{scope:{a:{get:c=>({b:c.method})}},context:[["a","b"],{method:"get"}],terms:["get"],condition:["equal"]}
 ,broken:
[{scope:{a:{b:c=>{throw Error("fail")}}},context:[["a","b"]],terms:[is(Error)],condition:["ok"]}
,{scope:{a:{b:{get:c=>{throw Error("fail")}}}},context:[["a","b"],{method:"get"}],terms:[note,is(Error)],condition:["ok"]}
]}
 };
