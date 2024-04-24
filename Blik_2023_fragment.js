 import {resolve,modularise,window,fetch} from "./Blik_2023_interface.js";
 import {note,provide,collect,infer,either,buffer,compose,record,combine,wether,compound,string,defined,exit,route,drop,crop,same} from "./Blik_2023_inference.js";
 import {merge,prune} from "./Blik_2023_search.js";
 import script from "./Blik_2024_script.js";
 import fragment from "./Blik_2023_fragment.js";
 import network from "./Blik_2024_network.js";
 var {default:svg}=await resolve("./Blik_2020_svg.json");

 export default
 {document,media,portfolio
 ,canvas:compose(image,canvas)
 ,vector,network,script
 };

 export function* document(source,namespace,language)
{if(source.nodeName||["NodeList"].includes(source.constructor?.name)||typeof source=="string")
 return yield source.nodeName?source:window.document.createRange().createContextualFragment(language
?[source.match(new RegExp("#"+language+"(.*)#"+language))||[],source].reduce((match,source)=>match[1]||source)
:source);
 let [fragment,...nodes]=Object.entries(source||{}).reduce(function([fragment,...nodes],[name,value])
{if(!value)return [fragment,...nodes];
 let textnode=name=="#text";
 if(textnode)
 value=typeof value!="string"?value[language]||Object.values(value)[0]:value;
 let dataset=name=="dataset";
 if(dataset)
 return [fragment,...nodes,...Object.entries(metamarkup(value))];
 let child=textnode||value.nodeName;
 if(child)
 return [fragment.appendChild(document(value,namespace,language).next().value)&&fragment,...nodes];
 let attribute=["string","number","boolean"].includes(typeof value);
 if(attribute)
 return [fragment,...nodes,[name,value]];
 let defaults=
 {a:{target:"_blank"}
 ,svg:{viewBox:"0 0 1 1",xmlns:namespaces.svg,"xmlns:xlink":namespaces.xlink}
 }[name];
 let values=Array.isArray(value)?value:[value];
 let children=values.filter(Boolean).map(value=>merge(value,defaults,0)).map(function(value){try
{let qualifier=value.xmlns?name:[name,namespace].find(qualifier=>namespaces[qualifier]);
 let specification=namespaces[qualifier]||value.xmlns;
 let suffix=specification?"NS":"";
 let node=window.document["createElement"+suffix](...[specification,name].filter(Boolean));
 let nodes=document(value,qualifier,language);
 populate(node,nodes);
 return node;
}catch(fail){return fail.stack}});
 fragment.append(...children);
 return [fragment,...nodes];
},[new window.DocumentFragment()]);
 fragment=fragment.childNodes.length==1?fragment.firstChild:fragment;
 yield* [fragment,...nodes];
};

 export function populate(node,nodes)
{if(!node)return;
 let entries=Array.from(nodes);
 if(!entries.length)
 entries=Object.entries(nodes);
 entries.forEach(entry=>entry.nodeName
?!node.nodeName
?node[entry.nodeName]=entry.nodeValue
:node.appendChild(entry)
:entry.reduce((qualifier,value)=>value&&Object.keys(value).some(isNaN)
?compose
(infer("concat",node.nodeName?Array.from(node.childNodes).filter(({nodeName})=>RegExp(nodeName,"i").test(qualifier)):node[qualifier])
,infer("map",compose(crop(1),value,populate))
)([])
:!node.nodeName
?node[qualifier]=value
:node[(value??false)&&"setAttribute"+(qualifier.split(":")[1]?"NS":"")||"removeAttribute"](...
[qualifier.split(":").reduce((namespace,name)=>
 [namespaces[namespace],qualifier])
].flat(),value)));
 return node;
};

 export async function transform({incumbent,resource,...fields})
{let source=fields.source||"get";
 resource=resource||await buffer(compose(fetch,note,wether(compose("type",same("application/pdf")),"arrayBuffer",compose("text",either(JSON.parse,crop(1))))))(source);
 if(resource instanceof Error)
 resource=resource.toString(),fields.layout="media";
 if(resource.pdf)
 resource=await pdf(resource),fields.layout="media";
 if(typeof resource!="object"&&["network",undefined].includes(fields.layout))
 fields.layout="media";
 if(this)
 fields=compose(fields,profile,get=>({get}),field.bind(this))(resource);
 let process=fragment[fields.layout||"media"];
 let product=await compose(process,{id:source},merge)(resource,fields,incumbent||window);
 return product;
 let values=this?.elements?.source?.parentNode?.querySelector("ul");
 if(values)
 d3.select(values).datum(resource.descendants?resource.descendants():fields.source);
 //new Array(file.numpages).reduce((canvas,phase,index)=>file.getPage(index+1).then(page=>
//{let view=page.getViewport({scale:1.5});canvas.width=canvas.width<view.width?view.width:canvas.width;canvas.height=(canvas.height||0)+view.height;
 //page.render({canvasContext:canvas.getContext('2d'),viewport:view});return canvas;
//}),document.createElement('canvas')))
};

 export function field(fields,labels={})
{let group=Object.entries(fields).reduce((group,[key,value],index)=>
 typeof value=="object"&&!Array.isArray(value)&&!index&&key,false);
 if(group)
 fields=fields[group];
 labels=this?.dataset?.labels||labels;
 if(typeof labels=="string")
 labels=JSON.parse(labels);
 let label=Object.entries(fields).map(([id,value])=>
{if(typeof value=="undefined")return;
 let type=value.constructor==Date?"date":(value instanceof Set)?"radio":Array.isArray(value)?"select":(typeof value=="boolean")?"checkbox":"text";
 let field=
 {for:id,title:id
 ,class:[group,type,{checkbox:value?"checked":""}[type]].filter(Boolean).join(" ")||undefined
 ,input:
 {type:["select","date"].includes(type)?"text":type,id,name:id
 ,value:type=="date"?clock(value,"datetime"):(type=="text"&&value&&String(value))||undefined
 ,checked:{checkbox:value?value.toString():undefined}[type]
 ,autocomplete:"off"
 }
 ,ul:type=="date"
?clockwork(value)
:{li:prune.call([value].flat(),([field,value])=>!["ul","li","#text"].includes(field)
?compose(infer("map",([field,value])=>(
 {"#text":string(value)?value:field
 ,ul:value&&!string(value)?{li:value}:undefined
 })),provide)(compound(value)?Object.entries(value):[[field,value]])
:value)
 }
 ,...tag(labels,typeof labels[id]=="function"?labels[id](value):id)
 };
 return JSON.parse(JSON.stringify(field));
});
 if(this?.nodeName?.toLowerCase()!="form")
 return {label};
 Array.from(this.elements||[]).filter(input=>
 Object.keys(fields).includes(input.id)||input.closest("label").remove());
 label.forEach(label=>
{if(!defined(label))return;
 let [input,value]=[this.elements||{},fields].map(fields=>fields[label.for]);
 label.input.value=compound(value)?Array.isArray(value)?value.includes(input?.value)?input?.value:value[0]:Object.keys(value).at(-1):value;
 input?.closest("label").remove();
 this.appendChild(document({label}).next().value);
 if(label.input.type=="text")
 this.elements[label.for]?.dispatchEvent(new window.Event("change",{bubbles:true}));
});
 return Object.fromEntries([...new window.FormData(this)]);
}

 var tag=(labels,id)=>typeof id!="string"
?id
:typeof labels[id]=="object"
?labels[id]
:(labels[id]&&labels[id][0]=="<")
?{"#text":labels[id]}
:{span:{"#text":typeof labels[id]=="string"?labels[id]:id}};

 export function profile(resource,presets)
{if(typeof resource=="string"||(resource instanceof String))
 return {source:presets.source,layout:["media","script"]};
 let fields=
 {network:
 {spread:["force","left","right","up","down","radius"]
 ,gradual:Boolean(presets.gradual)
 ,title:["name","image","wiki image"]
 //,relations:presets.layout=="network"&&[resource].map(function repetitive(value,sample){let entry=Object.entries(value).find(([key,value])=>Array.isArray(value)&&((key==sample)||value.some(value=>repetitive(value,key))));return entry&&entry[0];},spread)
 }}[presets.layout];
 let priority=presets.layout||"network";
 let matrix= Object.keys(resource).filter(function record(key)
{return Object.values(resource[key]||{}).every(value=>Array.isArray(value)?record(value):!isNaN(value))
});
 let profile=
 {source:Object.assign(resource,{[presets.source]:undefined})
 ,layout:Object.entries(fragment).map(([key])=>key).sort(value=>value!=priority||-1)
 ,...fields
 ,matrix
 };
 return profile;
};

 export function pdf()
{return import("./mozilla_2010_pdf_brightspace.js").then(pdf=>
{pdf.default.GlobalWorkerOptions.workerSrc="mozilla_2010_pdf_worker_brightspace.js";
 pdf.getDocument(file).promise.then(pdf=>Object.assign(note(pdf),{pdf:true}))
});
};

 export function image(src)
{if(/image/i.test(src.nodeName))return src;
 return new Promise((resolve,reject)=>
 Object.assign(document({img:{crossOrigin:"anonymous"}}).next().value
,{onload(){resolve(this);}
 ,onerror:reject
 ,src
 }));
 //if(!colors[color])svg.select("circle#"+id).attr("fill",["rgb(",...new Vibrant(this).swatches()["Vibrant"].rgb].reduce((hex,hue,index)=>hex+hue+(index<2?",":")")));
};

 export function canvas(image)
{let canvas=document({canvas:{width:image.naturalWidth,height:image.naturalHeight}}).next().value;
 canvas.getContext("2d").drawImage(image,0,0);
 return canvas;
}

 export function vector(node)
{if(node.nodeName.toLowerCase()=="svg")
 return node;
 let attributes=demarkup(node);
 let {r,x,y,cx,cy,dx,dy,width,height}=attributes;
 let font=Number(attributes["font-size"]?.replace(/[^0-9\.]*/g,""));
 let align=attributes["text-anchor"];
 //if(!isNaN(font))populate(node,{dy:(Number(dy)||0)+font});
 x=cx?cx-r:x||0;
 y=cy?cy-r:y||0;
 width=width||r*2||font||0;
 height=height||r*2||font||0;
 let rotation=detransform(node,"rotate")*180/Math.PI;
 let transform="rotate("+rotation+")";
 if(rotation)populate(node,{transform:""});
 return fragment.document
({svg:
 {id:node.closest("g")?.getAttribute("id")
 ,viewBox:[x,y,width,height].join(" ")
 ,width,height,x,y
 ,style:"overflow:visible"
 ,...rotation&&{transform}
 ,.../svg$/.test(node.namespaceURI)
?{node}
:{foreignObject:
 {x,y,width,height
 ,node
 }
 }
 }
 }
).next().value;
};

 export var stringify=node=>node.innerHTML||
 Array.from(node.childNodes).map(function outerXML({nodeType,nodeName,attributes,childNodes})
{let tag=()=>"<"+nodeName+
 Array.from(attributes).map(({nodeName,nodeValue})=>" "+nodeName+"=\""+(nodeValue||"").toString()+"\"").join("")+
 (childNodes.length?">"+Array.from(childNodes).map(outerXML).join("")+"</"+nodeName+">":"/>");
 let text=()=>nodeValue;
 let cdata=()=>"<![CDATA["+nodeValue+"]]>";
 let value={1:tag,3:text,4:cdata}[node.nodeType];
 return value?value():"";
}).join("");

 export function markup(object,indentation)
{let xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+
 Object.entries(object).map(function markup([key,value],indentation)
{let fragment="";
 indentation=typeof indentation=="string"?indentation:"";
 if(Array.isArray(value))
 fragment+=value.map(child=>
 indentation+markup([key,child],indentation+"\t")+"\n").join("");
 else if(typeof(value)=="object")
{fragment+=indentation+"<"+key;
 let hasChild;
 Object.entries(value).forEach(([key,value])=>
 key.charAt(0)=="@"
?fragment+=" "+key.substr(1)+"=\""+value.toString()+"\""
:(hasChild=true));
 fragment+=hasChild
?">"+
[Object.entries(value).map(([key,value],index)=>
 ({"#text":value||" ","#cdata":"<![CDATA["+value+"]]>"}[key]||
 (key.charAt(0)!="@"?(index?"":"\n")+markup([key,value],indentation+"\t")+"\n":""))).join("")
,0
].reduce(fragment=>
 fragment+(fragment.slice(-1)=="\n"?indentation:""))+
 "</"+key+">"
:"/>";
}else fragment+=indentation+"<"+key+">"+value.toString()+"</"+key+">";
 return fragment;
}).join("");
 return indentation ? xml.replace(/\t/g, indentation) : xml.replace(/\t|\n/g, "");
};

 export function demarkup(node,fields)
{fields=[fields].flat().filter(Boolean);
 if(fields.length)
 return Object.fromEntries(fields.map(field=>
 [field,compose(infer("getAttribute",field),wether(isNaN,infer(),Number))(node)]));
 node.normalize();
 if(node.documentElement)
 return demarkup(node.documentElement);
 let nodetypes={3:"#text",4:"#cdata",9:"#document"};
 let type=nodetypes[node.nodeType];
 if(type=="#text"&&!node.nodeValue?.match(/[^ \f\n\r\t\v]/))
 return node.remove();
 if(type)
 return {
 [type]:Object.entries(
 {"\\\\":/[\\]/g,'\\"':/[\"]/g
 ,'\\n':/[\n]/g,'\\r':/[\r]/g
 }).reduce((text,[escape,expression])=>text.replace(expression,escape)
,type=="#cdata"?node.nodeValue:stringify(node))
        };
 let attributes=Object.fromEntries(Array.from(node.attributes).map(({nodeName,nodeValue})=>
 [nodeName,isNaN(Number(nodeValue))?nodeValue?.toString()||"":Number(nodeValue)]));
 let children=Array.from(node.childNodes).map(demarkup);
 return [attributes,...children].filter(Boolean).reduce(merge);
};

export async function deform(resource)
{// text{style} text@source text#tag text/json#transform text#transform(text/json)
 let text=new RegExp(/[A-Za-zÁÉÍÓÖŐÚŰÜáéíóöőúűü\d\:\.\;\/\?\=\&\-\'_#\%\!\@]/);
 let json=new RegExp(/[{\[]{1}(?:[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/,"m");
 let call=new RegExp("\\((?:(\""+text.source+"*\"|"+json.source+")[,\)]{0,1})+");
 let tags={"@":"source","#":"document","{":"style"};
 let tag=new RegExp("(["+Object.keys(tags).join("")+"])("+json.source+"|"+text.source+"+("+call.source+")*)[\}]*","g");
 let form=new RegExp("(?<=^|[ \n])("+text.source+"+?[^\(\)\"\':, \n"+Object.keys(tags).join("")+"])((?:"+tag.source+")+)","gm");
 let promises=await [...resource.matchAll(form)].reduce(record(async([match,title,input])=>
{let {source,document,style}=Object.fromEntries([...input.matchAll(tag)].map(([match,tag,value])=>[tags[tag],value]).reverse());
 [document,source,input]=!document||!document.includes("(")
?[document,source||title,input]
:[...document.matchAll(json.source+"|"+text.source+"+")].map(([match])=>match.replace("(",""));
 if(source)
 try{source=JSON.parse(source)}catch(fail)
{source=source.split(",").reduce((json,piece)=>
 //split consecutive jsons matched by the json regexp
{if(typeof json!="string"){input=(input?input+",":"")+piece;return json;}
 json=json+","+piece;
 try{return JSON.parse(json)}catch(fail){return json};
})
}try{input={source,...JSON.parse(input)}}catch(fail){input={source}}
 source=fragment[document]
?fragment[document].constructor==Function
?await compose.call(source,fetch,"json",input,fragment[document])
:defer({layout:document,...input})
:refer(title,source,document||(source==title&&"span"))||match;
 if(source.setAttribute)
 source.setAttribute("style",style);
 return source;
}),[]);
 return resource.replace(form,match=>(promises.shift()||{outerHTML:""}).outerHTML);
}

 export function detransform(node,value)
{if(!node)return;
 let computed=
 window.getComputedStyle(node).transform?.split("(")[1]?.split(")")[0].split(", ").map((value,index)=>(
 {[["cos","sin","asin"][index]]:Number(value)})).reduce(merge);
 if(computed)
 return value=="rotate"
?Math.acos(computed?.cos||Math.PI/2)*(computed?.sin>0?-1:1)
:computed;
 let defined=
 node.getAttribute("transform")?.split(/\(|\)/).map((piece,index,split)=>
 index%2?[split[index-1],-Number(piece)*Math.PI/180]:false).filter(Boolean);
 if(!defined)
 return undefined;
 defined=Object.fromEntries(defined);
 return defined[value]??defined;
};

 export function drillresize({width,height})
{// use in svg resizeobserver until SVG resize becomes observable: 
 // https://stackoverflow.com/questions/65565149/how-to-apply-resizeobserver-to-svg-element
 let [x,y]=this.getAttribute("viewBox").split(" ").map(Number);
 let attributes=vectorspace(x,y,width,height);
 let polyfill=
 {foreignObject:
 {width,height
 ,canvas:{style:Object.entries({width,height}).map(entry=>entry.join(":")+"px").join(";")}
 }
 };
 return Object.assign(attributes,polyfill);
};

 export var metamarkup=object=>object&&
 Object.fromEntries
((object.nodeName)
?Object.entries(object.dataset).map(([key,value])=>
 [key,isNaN(Number(value))?JSON.parse(value):Number(value)])
:Object.entries(object).map(([key,value])=>["data-"+key,isNaN(value)?JSON.stringify(value):String(value)])
);

 export function stretch(target,extend)
{if(!this||!target)return;
 if(target.nodeType===11)return;
 let style=size=>({style:Object.entries(size).map(entry=>entry.join(":")).join(";")});
 let resize=([{target,contentRect:{width,height}}])=>
 populate(this,(extend||style)({width,height}));
 let observer=new ResizeObserver(resize);
 observer.observe(target);
//  if(/svg/i.test(target.nodeName))
// (observer=new ResizeObserver(([{contentRect:{width,height}}])=>
//  populate(target,vectorspace(...
//  [target.getAttribute("viewBox").split(" "),[width,height]].reduce((viewbox,size)=>
//  viewbox.splice(2,2,...size)&&viewbox)))&&
//  resize([{target,contentRect:{width,height}}]))
// ).observe(target.parentNode);
 return observer;
};

 export var vectorspace=(x,y,width,height)=>(
 {viewBox:[x,y,width,height].join(" ")
 ,width,height
 });

 export var deselect=source=>
 [source,".",":"].reduce((source,selector)=>
 source.replace(new RegExp("\\"+selector),"\\"+selector));

export var error=compose
(async function*(text)
{let style=await stylesheet({body:{background:"black",color:color.red},center:layout.middle});
 yield* [{center:{"#text":String(text)}},"Error","/svg/worm",[],[style]];
},hypertext,document,route
);

function portfolio(source)
{return document(
 {div:
 {h1:
 {"#text":window.location.pathname.split("/").filter(Boolean).pop()
 ,onclick:"import('/Blik_2020_window.js').then(({retreat})=>retreat())"
 ,style:"cursor:url('/vector/arrow_curved'),pointer"
 }
 ,h2:["pub","sub"].map(key=>(
 {"#text":key
 ,onclick:"import('/Blik_2020_actions.js').then(({transform,insert})=>insert({fragment:transform({source:window.location.pathname+'"+key+"',layout:'feed',number:15}),target:this,place:'over'}))"
 }))
 }
 }).next().value
}

function media(resource,{incumbent,source,...fields})
{if(source&&[incumbent?.title,incumbent?.parentNode.title].includes(source))
 return document(incumbent.childNodes).next().value;
 if(resource.constructor.name=="Buffer")
 resource=new TextDecoder("utf-8").decode(new Uint8Array(resource));
 return resource.nodeName?resource:note(resource).startsWith("<")
?window.document.createRange().createContextualFragment(resource)
:deform(resource).then(source=>window.document.createRange().createContextualFragment(source))
}

 export var defer=form=>
 document({"img":
 {onload:"!function expect(){setTimeout(tick=>(typeof dispatch=='undefined'?expect:dispatch).call(this,event),500)}.call(this)"
 ,src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
 ,"data-subject":JSON.stringify(form)
 ,class:"defer"
 }        }).next().value;

 var refer=(title,source,layout,elements={"audio":["mp3"],"img":["png","jpg","svg","gif"]})=>document(
 {[layout||Object.keys(elements).find(key=>elements[key].includes(source&&source.slice&&source.slice(-3)))||"a"]:
 {class:"reference",title,source:title||source,alt:title||source,href:source,src:source,controls:"on"
 ,"#text":(title||source).replace(/_/g," ")
 }
 }).next().value;

 export async function hypertext(body,title,favicon,scripts,styles=[])
{scripts=[scripts].flat().filter(actions=>!compound(actions)||!activate(body,actions));
 let script=scripts.map(src=>{return {src,type:"module"}}).concat(body.script||[]);
 let [link,style]=[styles].flat().reduce((nodes,style,index)=>
 nodes[index=+/{|}/.test(style)].push(index?{"#text":style}:{rel:"stylesheet",type:"text/css",href:style})&&nodes
,[[],[]]);
 link.push({rel:"icon",type:"image/svg+xml",href:favicon||"favicon.ico"})
 return {html:
 {"head":
 {"title":{"#text":title}
 ,"base":{"href":"/"}
 ,"meta":
[{"charset":"utf-8"}
,{"http-equiv":"content-language","content":"en-us"}
,{"http-equiv":"Content-Type","content":"text/html;charset=UTF-8"}
,{"name":"theme-color","content":"#000000"}
,{"name":"description","content":""}
,{"name":"viewport","content":"width=device-width, initial-scale=1"}
],link,style,script
//,{"#text":"setInterval(done=>fetch('/authority',{method:'POST',headers:sessionStorage.getItem('authority')}).then(done=>console.log(done)),1000*60)"}
 }
 ,body
 }      };
};

 export function activate(fragment,actions)
{if(!actions)return fragment;
 let node=(fragment instanceof window.DocumentFragment)
?Array.from(fragment.childNodes)
:fragment.nodeName
?[fragment]
:fragment;
 let nodes=Object.entries(node).flatMap(([nodename,node])=>
 [node].flat().filter(compound).map(node=>compose
(collect,infer("map",selector=>actions[selector]||{}),infer("reduce",merge)
,Object.keys
,infer("map",event=>["on"+event,"(delay=time=>window.dispatch?.call(this,event)||setTimeout(delay,500))(0);"])
,Object.fromEntries
,node
,(events,node)=>populate(node,events)
,node=>node.childNodes?Array.from(node.childNodes):node
)((node.nodeName||nodename).toLowerCase()
,(node.nodeName?node.getAttribute?.("id"):node.id)?.replace(/^/,"#")
,...[node.class?.split(" ")||[],node.classList||[]].flat().map(name=>"."+name))
));
 nodes.forEach(infer(activate,actions));
 return fragment;
};

 export var wheel={svg:
 {class:"wheel"
 ,...svg.goo
 ,...svg.circle
 ,circle:undefined
 ,g:{filter:"url(#goo)",circle:Array(2).fill(svg.circle.circle)}
 ,width:"50px",height:"50px"
 }};

 export function insert(fragment,place,target,style)
{if(!fragment)return target;
 let click=target.onclick;
 target.removeEventListener("click",click);
 let {over,before,after,under}={[place]:true};
 if(fragment instanceof Promise)
 return over?infer(insert)(...arguments):compose(document,infer(insert,place,target),drop(0,0,fragment,"over"),insert)(wheel);
 note(globalThis.window?{fragment,[place]:target}:{fragment:fragment.nodeName,[place]:target.nodeName});
 if(under)
 return Array.from(target.childNodes).map(child=>style
?transition(child,style,3).then(child=>child.remove())
:child.remove())&&
 target.appendChild(fragment);
 let [sibling,edge]=before?["previous","prepend"]:["next","appendChild"];
 let method=target[sibling+"Sibling"]?"insertBefore":edge;
 if(target.parentNode)
 target.parentNode[method](fragment.documentElement||fragment,before?target:target.nextSibling);
 if(style)
 (fragment instanceof window.DocumentFragment
?Array.from(fragment.childNodes)
:[fragment.documentElement||fragment]).forEach(fragment=>transition(fragment,style,3));
 if(over&&fragment!==target)
 if(style)
 setTimeout(faded=>target.remove(),transition(target,style,3)&&3000);
 else target.remove();
 return fragment;
};

 export function throttle(fragment,progress=0)
{if(!fragment.simulation)return fragment;
 //if(!fragment.simulation||!fragment.simulation.nodes().length)return fragment;
 return new Promise(resolve=>setTimeout(time=>resolve(fragment),2000)).then(fragment=>
{//let size=fragment.querySelectorAll("g.node").length;
 //if(size>progress||!size)
 for(let simulation of Array.isArray(fragment.simulation)?fragment.simulation:[fragment.simulation])
 if(note(Math.floor((1-simulation.alpha())*100),"% throttling "+fragment.getAttribute("title")).next().value<90)
 return throttle(fragment);
 else fragment.simulation.stop();
 return fragment;
});
};

 export function expose(){if(globalThis.window)Object.assign(globalThis.window,{dispatch});};

 export async function dispatch(event,...input)
{console.log({[event.type]:this},...input);
 let selectors=
[this.nodeName?.toLowerCase()||"body","#"+this.id
,...Array.from(this.classList||[]).map(classname=>"."+classname)
];
 let actions=await resolve([import.meta.url,"./actions"]).then(modules=>
 merge(...modules.map(({default:module})=>module)));
 selectors.map(selector=>
[selector
,"tether "+event.type.replace(/[A-Z]+/g,match=>match.slice(-1).toLowerCase())
]).forEach(path=>
 route.call(actions,path,this,event,...input));
 return true;
};

 export async function navigate(node,sibling)
{let path=window.location.pathname.replace(/[a-zA-Z0-9]*\/$/,match=>!node||sibling?"":match)+(node?node+"/":"");
 window.history.pushState({path},null,path);
 window.dispatchEvent(new window.PopStateEvent("popstate",{path}));
};

 export function path(name){return (window.location.pathname+(name||"")).replace(/^\/*|\/*$/g,"");}// regexp bracket matching: */

 export function retreat(){return window.location=window.location.pathname.split("/").filter(Boolean).slice(0,-1).join("/")+"/";}

 export async function identity(name)
{let signature=window.document.cookie.match(/signature=[^;]+/);
 if(!signature)return;
 signature="/"+signature[0].replace("=","/");
 let resolve=response=>response.status==200&&response.json().then(author=>({author:note(author).author}));
 let body=JSON.stringify(await fetch(signature).then(resolve));
 return await fetch(signature,{method:"put",body}).then(resolve);
};

 export var transition=(node,style,seconds)=>
 !seconds?Object.assign(node.style,style)&&node:compose
((transition,node)=>Object.assign(node.style,{transition})&&node
)(wait((seconds+(Number(style["transition-delay"]?.replace(/[^0-9\.]/g,""))||0))*1000
,node.style.transition
,Object.assign(node.style,{transition:Object.keys(style).map(style=>style+" "+seconds+"s").join(","),...style})&&node));

 export var data=(mime,base64)=>"data:image/"+mime+";base64,"+base64;

 export var namespaces=
 {xml:"http://www.w3.org/XML/1998/namespace"
 ,xlink:"http://www.w3.org/1999/xlink"
 ,xmlns:"http://www.w3.org/2000/xmlns/"
 ,xhtml:"http://www.w3.org/1999/xhtml"
 ,svg:"http://www.w3.org/2000/svg"
 };

 export async function stylesheet(style,global=true)
{let {default:{resolve}}=await import("path");
 let [jss,...plugins]=await Promise.all(
 ["","_nested","_extend","_global"].map(plugin=>"./Isonen_2014_jss"+plugin+".js").map(module=>
 import(module).then(module=>module.default||module)));
 return jss.use(...plugins.map(plugin=>plugin())).createStyleSheet(global?{"@global":style}:style).toString();
};
