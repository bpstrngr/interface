 import {locate,resolve,modularise,agent,virtual,window,jsdom,fetch,digest,query,cookies} from "./Blik_2023_interface.js";
 import {note,wait,observe,provide,collect,slip,infer,either,each,pass,tether,buffer,differ,compose,flip,skip,stash,revert,iterate,combine,whether,swap,compound,something,string,basic,minor,functor,defined,undefine,simple,iterable,exit,drop,crop,odd,same,major,binary,match,is,are,has,not,numeric,array,pdflike,when,debug,expect,generator,clock,type,heritage,ascend as prototypes} from "./Blik_2023_inference.js";
 import {search,merge,prune,extract,unfold,record,route,fields} from "./Blik_2023_search.js";
 import {serialize,proceduralize,mime,data} from "./Blik_2023_meta.js";
 import * as layout from "./Blik_2023_layout.js";
 import {color} from "./Blik_2023_layout.js";
 // var [jss,...plugins]=await resolve(["","nested","extend","global"].map(plugin=>
 // ["./Isonen_2014_jss",plugin].filter(Boolean).join("_")+".js")).then(modules=>
 // modules.map(module=>module.default||module));
 if(!window&&!virtual)
 // tests require a browser ready. warning: virtual modules may be used. 
 await jsdom("http://localhost:80/");
 var address=new URL(import.meta.url).pathname;
 export const file=address.replace(/.*\//,"");

 export var namespaces=
 {xml:"http://www.w3.org/XML/1998/namespace"
 ,xlink:"http://www.w3.org/1999/xlink"
 ,xmlns:"http://www.w3.org/2000/xmlns/"
 ,xhtml:"http://www.w3.org/1999/xhtml"
 ,svg:"http://www.w3.org/2000/svg"
 ,viewBox:"http://www.w3.org/2000/svg"
 };

 export function document(source,namespace,language)
{let scope=is(window.EventTarget)(this)&&this;
 if(is(window.EventTarget)(source))
 return source;
 let fragment=scope||Reflect.construct(window.DocumentFragment,[]);
 let texts=compose(swap(fragment),"childNodes",Array.from,infer("filter",compose("nodeType",is(3))));
 let erase=compose(texts,infer("forEach",node=>node.remove()));
 let overwrite=compose(drop(2,1)//,whether
//(search(["parentNode","sheet"])
//,pass(compose(each([search(["parentNode","sheet"]),crop(1)]),"replaceSync",note))
,compose(stash("textContent"),merge))
//),crop(1));
 let write=each(either
(compose(stash(compose(drop(1),stash(texts),flip,tether(search))),flip,whether(defined,overwrite,crop(1)))
,compose(crop(1),slip(scope.ownerDocument),"createTextNode")
));
 let translate=whether(simple,either(language,compose(Object.values,0)));
 let text=compose(search(1),translate,whether(not(something),drop()),collect,"flat",provide,write);
 let render=buffer(infer(node.bind(fragment),namespace,language),compose("stack",write));
 let metadata=compose(search(1),metamarkup,Object.entries,infer("map",render),provide);
 let classlist=compose(provide,each([crop(1),compose(crop(1),whether(array,infer("join"," ")))]),collect,render);
 let layout=compose(provide,each([crop(1),compose(crop(1),collect,"flat",infer("map",whether(is([simple,not(has("#text"))]),compose(crop(1),css,["#text"],record),crop(1))))]),collect,render);
 return compose
(whether(simple,Object.entries,compose(collect,"flat")),provide,each(whether(
[...["#text","dataset","class","style"].map(name=>match([name]))
,array,is(window.NodeList),something
],text,metadata,classlist,layout
,render,Array.from,crop(1),drop()))
,slip(fragment),append
)(source);
};

 export function node([name,value],namespace,language)
{let base=
 {a:{target:"_blank"}
 ,svg:{viewBox:"0 0 1 1",xmlns:namespaces.svg,"xmlns:xlink":namespaces.xlink}
 }[name]||{};
 return provide([value].flat().flatMap(whether
([is(window.NodeList),is(window.EventTarget),simple,something,is(null)]
,Array.from,crop(1)
,(value,index)=>compose
(crop(1),base,0,merge,stash(either
(is(window.EventTarget)(this)&&either
(simple(value)&&value.match?.bind(this)
,buffer(compose
(qualify,slip(name),"concat",slip(this),0,tether(descend)
,whether(compose("length",major(1)),search(index),search(0))
))
)
,compose
(either("xmlns",compose(swap(namespaces),either(name,namespace,swap(namespace))))
,stash(name),"Element",flip,create
)
)),flip,stash(infer("namespaceURI")),language,tether(document)
)(value)
,value=>compose
(crop(1),["value"],record,stash(compose
(swap(namespaces),either(name.split(":")[0],namespace,swap(namespace))
,stash(name),"Attribute",flip,create
)),flip,merge
)(value)
,is(window.EventTarget)(this)?compose(swap(this,name,0),tether(descend),infer("forEach",infer("remove")),drop()):drop()
,drop()
)));
};

 export var create=compose
(when(either(is("Element"),is("Attribute")),string)
,whether(compose(drop(2),string),infer(),crop(2))
,stash(compose(combine(swap("create"),crop(1),compose(drop(2),whether(string,swap("NS"),drop()))),"concat"))
,drop(1),flip,slip(window?.document),tether(infer)
);

 export var append=compose(when(is(window?.EventTarget))
,collect,infer("reduce",compose(pass(whether
(compose(drop(1),"nodeType",is(2)),whether
(compose(drop(1),infer("specified"))
// not used in document cuz createAttributeNS out of context is crazy, couldn't get eg. viewBox or id to be valid on svg in any create/set namespace combinated. 
// stash(compose(drop(1),whether(compose("namespaceURI",string),swap("NS"),drop()),"setAttributeNode",flip,"concat"))
,compose
(each([crop(1),combine("name","value")])
,skip(whether(compose(crop(1),is("data-actions")),compose(drop(2,1),tether(capture))))
,"setAttribute"
),compose(each([crop(1),"name"]),"removeAttribute")
),whether(not("contains"),"appendChild",crop(1))
)),crop(1))),whether
(is([is(window?.DocumentFragment),compose("children","length",minor(2))])
,search(["firstChild"])
,crop(1)
));

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
 return indentation?xml.replace(/\t/g,indentation):xml.replace(/\t|\n/g, "");
};

 export function demarkup(node,fields)
{fields=[fields].flat().filter(Boolean);
 if(fields.length)
 return Object.fromEntries(fields.map(field=>
 [field,whether(numeric,Number,crop(1))(node.getAttribute(field))]));
 node.normalize();
 if(node.documentElement)
 return demarkup(node.documentElement);
 let nodetypes={3:"#text",4:"#cdata",9:"#document"};
 let type=nodetypes[node.nodeType];
 if(type=="#text"&&!node.nodeValue?.match(/[^ \f\n\r\t\v]/))
 return node.remove();
 if(type)
 return (
 {[type]:Object.entries(
 {"\\\\":/[\\]/g,'\\"':/[\"]/g
 ,'\\n':/[\n]/g,'\\r':/[\r]/g
 }).reduce((text,[escape,expression])=>text.replace(expression,escape)
,type=="#cdata"?node.nodeValue:stringify(node))
 });
 let attributes=Object.fromEntries(Array.from(node.attributes).map(({nodeName,nodeValue})=>
 [nodeName,isNaN(Number(nodeValue))?nodeValue?.toString()||"":Number(nodeValue)]));
 let children=Array.from(node.childNodes).map(demarkup);
 return [attributes,...children].filter(Boolean).reduce(merge);
};

 export function metamarkup(object)
{return object&&Object.fromEntries
(object.nodeName
?Object.entries(object.dataset).map(([key,value])=>
 [key,whether(isNaN,buffer(JSON.parse,drop(1)),parseFloat)(value)])
:Object.entries(object).map(([key,value])=>["data-"+key,compound(value)?JSON.stringify(value):String(value)])
);
};

 export function qualify(node)
{// extract css selectors from node/fragment, or vice versa. 
 when(defined)(node);
 if(simple(node))
 return compose.call(node,({id,class:group,classed})=>
 ["",id||[group,classed].flat().flatMap(group=>group?.split(" ")||[])].flat().filter(string).join(id?"#":"."));
 if(string(node))
 return record(
[node.match(/[#\.][^#\.\[\]]+/g)?.reduce((node,selector)=>
 merge(node,{[["id","class"]["#.".indexOf(selector[0])]]:[selector.slice(1)]})
,{})||{}
,node.match(/\[[^=]+?=?.*?\]/g)?.reduce((node,selector)=>
 merge(node,Object.assign(Array(2).fill(undefined),selector.slice(1,-1).split("=")).reduce((attribute,value)=>(
 {[attribute]:value})))
,{})||{}
].reduce(merge)
,node.match(/^[^#\.\[\]]+/)||[]);
 let name=node.nodeName?.toLowerCase()||"";
 let selectors=name?{id:"#",classList:"."}:{id:'#',class:'.',classed:'.'};
 let attributes=Array.from(node.attributes||[]).filter(({name})=>
 !["id","class","style"].includes(name.toLowerCase())&&!name.startsWith("on")).map(({name,value})=>
 "["+[name,value].join("='")+"']").join("");
 return name+Object.entries(selectors).flatMap(([attribute,selector])=>
[attribute==="classList"?Array.from(node[attribute]):["class","className"].includes(attribute)
?node[attribute]?.split?.(' ')||[]:node[attribute]
].flat().filter(value=>
 string(value)&&value?.length).map(value=>selector+value)).join('')+attributes;
};

 export function hypertext(body,title,favicon,scripts,styles=[])
{if(this)
 return {imports:
 {"/Blik_2023_fragment.js":["","capture","socket","image","canvas","insert"]
 ,"/Blik_2023_inference.js":["","infer","compose"]
 ,"/Blik_2023_interface.js":["","path","query"]
 }
 ,exports:{default:{body:
 {load(event)
{if(this!==event.target.body)
 // ignore propagated load events. 
 return;
 this.querySelectorAll("canvas[role=img]").forEach(canvas=>
 canvas.dispatchEvent(new canvas.ownerDocument.defaultView.Event("contextrestored",{bubbles:true})));
 this.querySelectorAll("[data-actions]").forEach(scope=>capture.call(scope)&&
 scope.dispatchEvent(new scope.ownerDocument.defaultView.Event("contextrestored")));
 Promise.all(["interface","inference","search","fragment","meta"].map(module=>
 "/Blik_2023_"+module+".js").map(module=>import(module))).then(modules=>modules.forEach(module=>
 Object.assign(globalThis,Object.fromEntries(Object.entries(module).filter(([field])=>
 !Object.hasOwn(globalThis,field))))));
 socket("/relay");
},popstate(event)
{//note(event);this.document.forms[0]?.dispatchEvent(new Event("submit"));
},async message(event)
{let {data:message}=event;
 console.info("send",message);
 let address=this.ownerDocument.defaultView.location.href;
 if(!message.room)
 message.room=["",path(address),query(address).source].join("/");
 if(this.ownerDocument.defaultView.socket?.readyState===3)
 await socket("/relay");
 this.ownerDocument.defaultView.socket?.send(JSON.stringify(message));
},beforeprint(event)
{console.log(this.querySelector("#composer"),this.querySelector("#frame"));
},afterprint(event)
{console.log(this.querySelector("#composer"),this.querySelector("#frame"));
}}
 ,"canvas[role=img]":
 {contextrestored(event)
{let [src,alt]=["data-source","aria-label"].map(this.getAttribute.bind(this));
 compose(image,canvas,infer(insert,"over",this))(src,alt);
}}}}};
 let activation=
 {exports:{capture,heritage,delegate,defer,ascend:prototypes}
 ,procedures:function()
{capture.call(window.document.body);
 let worker=import("/Blik_2023_interface.js").then(({delegate})=>
 delegate("/worker/module")).then(worker=>
 Object.assign(window,{worker})).catch(fail=>
 Object.assign(window,{worker:console.warn("Worker not available at /worker.")}));
 Object.assign(window,{worker});
}};
 let script=[activation,scripts].flat().flatMap(src=>
[{type:"module",defer:true}
,/^\./.test(src)?{src}:{"#text":string(src)?src:functor(src)?proceduralize(src):serialize(src)}
].reduce(merge));
 let [link,style]=[styles].flat().reduce((nodes,style,index)=>
 nodes[index=+/{|}/.test(style)].push(index?string(style)?{"#text":style}:style:{rel:"stylesheet",type:"text/css",href:style})&&nodes
,[[],[]]);
 link.push({rel:"icon",type:"image/svg+xml",href:favicon||"favicon.ico"})
 let meta=
[{charset:"utf-8"}
,{"http-equiv":"content-language",content:"en-us"}
,{"http-equiv":"Content-Type",content:"text/html;charset=UTF-8"}
,{name:"theme-color",content:"#000000"}
,{name:"description",content:title}
,{name:"viewport",content:"width=device-width, initial-scale=1"}
];
 let head=
 {title:{"#text":title},meta,link,style,script
 //,"base":{"href":"/"}
//,{"#text":"setInterval(done=>fetch('/authority',{method:'POST',headers:sessionStorage.getItem('authority')}).then(done=>console.log(done)),1000*60)"}
 };
 let actions=["",file,"module",hypertext.name,"module"].join("/");
 capture.call({body},actions);
 return {html:{lang:"en",head,body}};
};

 export async function socket(actions)
{var {default:peer}=await import(actions);
 var {protocol,host}=window.location;
 return revert((resolve,reject,socket)=>
 Object.assign(window
,{socket:Object.assign(new WebSocket(socket)
,{async onopen({target})
{console.warn("Websocket open: ",target);
 let {author:name}=cookies(window.document.cookie);
 if(name)
 this.send(JSON.stringify({action:"sign",name}));
 resolve(this);
},onmessage(event)
{let message=JSON.parse(event.data);
 if(message.action!=="check")
 console.log("receive",message);
 peer[message.action]?.call(this,message,window);
},onerror({target}){console.warn("Websocket not available at "+target.url);reject(target);}
 ,onclose({target}){console.warn("Websocket closed: ",target);}
 })
 }))(protocol.replace(/^http/,"ws")+"//"+host);
};

 export function capture(module=this.dataset.actions)
{// register events to be routed to actions scoped by selector (eg. {#form:{submit(){}}}). 
 if(!module)return this;
 if(!globalThis.window||this?.constructor?.name==="Object")
 // Re-invoke on client to capture events. 
 return this?.constructor?.name==="Object"
?prune.call(this,({1:value})=>merge(value,{dataset:{actions:[module]}}),0,0)
:this.dataset.actions=JSON.stringify(Array.from(new Set(
[JSON.parse(this.dataset.actions||"[]")
,this.dataset.actions===module?[]:module
].flat())))
,this;
 try{module=JSON.parse(module)}catch(fail){}
 let actions=Promise.all([module].flat().map(module=>
 import(module).then(({default:module})=>module))).then(modules=>
 modules.reduce((past,next)=>Object.assign(past,next),{}));
 let refer=defer.bind(actions);
 let scope=this===this.ownerDocument.body?this.ownerDocument.defaultView:this;
 let deferred=new Set(heritage(scope).filter(event=>event.startsWith?.("on")));
 deferred=deferred.union(new Set(["focusout","focusin","message"].map(event=>"on"+event)));
 deferred=deferred.difference(new Set(
[["motion","orientation","orientationabsolute"].map(sensor=>"device"+sensor)
,["start","run","end","cancel"].map(state=>"transition"+state)
,"unhandledrejection"
].flat().map(event=>"on"+event)));
 deferred.forEach(event=>scope.addEventListener(event.slice(2),refer,{passive:false}));
 actions.then(actions=>
 new Set(Object.values(actions).flatMap(Object.keys)).forEach(event=>
 scope.addEventListener(event,delegate.bind(actions),{passive:false}))||
 console.groupCollapsed("routing all propagated events to actions from scope: ",{fragment:scope})||
 console.log({[this.ownerDocument.defaultView.location.origin+module]:actions})||
 console.groupEnd()).then(ready=>
 deferred.forEach(event=>scope.removeEventListener(event.slice(2),refer)));
 return this;
};

 export function delegate(event)
{let target=event.target.document?.body||event.target.body||event.target;
 if(target.nodeType===3)target=target.parentNode;
 let scopes=Object.entries(this).filter(([selector,actions])=>
 actions[event.type]&&target.closest(selector));
 scopes.map(([selector,actions])=>
 [target.closest(selector),actions[event.type]]).forEach(([scope,action])=>
 console.debug({[event.type]:scope})||
 action.call(scope,event));
};

 export function defer(event)
{// asynchronizing event dispatch unblocks its synchronous default unless prevented. 
 event.preventDefault();
 event=Object.fromEntries("type/target/keyCode/isTrusted/bubbles/srcElement".split("/").map(field=>
 [field,event[field]]));
 this.then(actions=>delegate.call(actions,event));
 console.groupCollapsed({["captured "+event.type+" event from"]:event.target});
 console.warn(event);
 console.groupEnd();
};

 export function dispose(){if(globalThis.window)Object.assign(window.actions,actions);}

 export async function navigate(node,sibling)
{let path=window.location.pathname.replace(/[a-zA-Z0-9]*\/$/,match=>!node||sibling?"":match)+(node?node+"/":"");
 window.history.pushState({path},null,path);
 window.dispatchEvent(new window.PopStateEvent("popstate",{path}));
};

 export function retreat(){return window.location=window.location.pathname.split("/").filter(Boolean).slice(0,-1).join("/")+"/";}

 export function list(value,ordered)
{return prune.call([value].flat(),([field,value])=>
 ![ordered?"ol":"ul","li","span","#text"].includes(field)
?compose(infer("map",([field,value],index)=>(
 {span:{"#text":field==index&&string(value)?value:field}
 ,[ordered?"ol":"ul"]:value&&(compound(value)||field!=index)?{li:[value]}:undefined
 })),provide)(compound(value)?Object.entries(value):[[field,value]])
:value);
};

 export var annotate=(fields,labels)=>labels
?prune.call(fields,([field,value])=>defined(labels[field])?{label:labels[field],value}:value,0,0)
:exit("no labels provided to"+annotate.name+" fields.");

 export function form(fields={})
{let group=Object.entries(fields).reduce((group,[field,value],index)=>
 simple(value)&&!array(value)&&!index&&field,false);
 if(group)
 fields=fields[group];
 let span=Object.entries(fields).flatMap(function([id,entry])
{let {label,value}=defined(entry?.label)?entry:{label:id,value:entry};
 if(!defined(value))
 return [];
 let [text,type]=whether([either(binary,match(/^(true|false)$/)),basic,is(Set),is(Date)],...Object.entries(
 {checkbox:[undefine]
 ,menu:[undefine]
 ,radio:[undefine]
 ,time:["datetime",clock]
 ,textbox:[whether(is(defined),infer(),swap(""))]
 }).map(([type,text])=>compose(...text,type)))(value);
 return {id,title:id,class:group,span:
[{"#text":label},defined(value)
?{name:id,role:type,"aria-checked":{checkbox:value}[type]
 ,tabindex:"0",contenteditable:type!=="checkbox","#text":text
 }:undefined
],ul:type==="time"?clockwork(value):compound(value)?{li:list(value)}:null
 };
});
 let style=[{"@scope":{":scope":
 {"&>span[title]":
 {...layout.label
 ,"&>span[name]":layout.input
 ,"&>span[role=list]":
 {position:"fixed",display:"none",padding:"0px","margin-bottom":"0px"
 ,"margin-left":"0.6em","max-height":"100%","max-width":"100%",overflow:"scroll"
 ,"&:hover":{display:"block"}
 }
 ,"& ul":
 {position:"fixed",display:"none",padding:"0px","margin-bottom":"0px","margin-left":"0.6em","max-height":"100%","max-width":"100%"
 ,"z-index":"2","text-align":"left","pointer-events":"none","list-style-type":"none"
 ,"box-sizing":"border-box",width:"inherit","overflow":"scroll"
 ,color:"var(--abyss)","font-weight":"bold"
 ,"text-shadow":Array(25).fill("var(--note) 0px 0px .25em").join()
 ,"&:hover":{display:"block"}
 ,"& ul":{position:"relative",bottom:"initial","max-height":"initial","vertical-align":"top","text-align":"left"}
 ,"& li":
 {position:"relative",display:"inline-block","pointer-events":"all","padding-right":"1em","vertical-align":"top"
 ,margin:"auto",left:"0px",right:"0px","white-space":"pre","padding-left":"1em"
 ,"&:hover,&.hover":
 {"&>span":{color:"var(--highlight)"}
 ,"& ul":
 {display:"inline-block","white-space":"pre"
 ,"&:hover>li":{display:"block"}
 }
 }
 ,"&>svg":{position:"absolute",height:"1em",left:"0px","margin-left":"0px","margin-right":"0px",transform:"scale(0.9)",fill:"var(--text)"}
 }
 ,"&>li":{display:"block"}
 }
 ,"&[focused=true]":{"&>ul,&>span[role=list]":{display:"block"}}
 }
 }}}];
 return {role:"form",style,span};
};

 export function fill(fields)
{if(!simple(fields))
 return compose(Array.from
,infer("filter",input=>!fields||input.parentNode.classList.contains(fields))
,infer("map",input=>[input.getAttribute("name"),input.role==="checkbox"?input.getAttribute("aria-checked")==="true":input.textContent])
,Object.fromEntries)(this.querySelectorAll("span[contenteditable]"));
 if(fields)
 Object.entries(fields||{}).map(([field,value])=>
 [!compound(value)&&this.querySelector("[name="+field+"]"),value]).forEach(([node,text])=>
 node&&document.call(node,{[node.role==="checkbox"?"aria-checked":"#text"]:text}));
 return fill.call(this,this.getAttribute("method"));
};

 export function media(resource,{source,...fields}={})
{if(is(window.EventTarget)(resource))
 return resource;
 if(is(ArrayBuffer)(resource))
 resource=new Uint8Array(resource);
 if(pdflike(resource))
 return print(resource);
 if(is(Uint8Array)(resource)||resource.constructor.name==="Buffer")
 resource=new TextDecoder("utf-8").decode(resource);
 if(compound(resource))
 resource=serialize(resource,"json");
 return simple(resource)
?document({span:{style:"white-space:pre;","#text":JSON.stringify(resource,null,2)}})
:resource.startsWith("<")
?window.document.createRange().createContextualFragment(resource)
:parse(resource,semiotics);
};

 export function dispatch(form)
{return document(
 {"img":
 {onload:"!function expect(){setTimeout(tick=>(typeof dispatch=='undefined'?expect:dispatch).call(this,event),500)}.call(this)"
 ,src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
 ,"data-subject":JSON.stringify(form)
 ,class:"defer"
 }
 });
};

 export function insert(fragment,place,target)
{if(!fragment)return target;
 let {over,before,after,under}={[place]:true};
 if(fragment instanceof Promise)
 return infer(insert)(...arguments);
 //:compose(document,infer(insert,place,target),drop(0,0,fragment,"over"),insert)(wheel);
 console.info(globalThis.window?{fragment,[place]:target}:{fragment:fragment.nodeName,[place]:target.nodeName});
 if(generator(fragment))
 return collect(each.call(fragment,fragment=>
 insert(fragment,...Array.from(arguments).slice(1))));
 let orphan=fragment instanceof window.DocumentFragment;
 let fragments=[orphan?Array.from(fragment.childNodes):fragment].flat();
 if(under)
 return Array.from(target.childNodes).map(child=>destroy(child))
,provide(fragments.map(fragment=>target.appendChild(fragment)));
 let [sibling,edge]=before?["previous","prepend"]:["next","appendChild"];
 let method=target[sibling+"Sibling"]?"insertBefore":edge;
 if(target.parentNode)
 target.parentNode[method](fragment.documentElement||fragment,before?target:target.nextSibling);
 if(over&&fragment!==target)
 destroy(target);
 return provide(fragments);
};

 export function throttle(fragment,progress=0)
{if(!fragment?.simulation)return fragment;
 //if(!fragment.simulation||!fragment.simulation.nodes().length)return fragment;
 return new Promise(resolve=>setTimeout(time=>resolve(fragment),2000)).then(fragment=>
{//let size=fragment.querySelectorAll("g.node").length;
 //if(size>progress||!size)
 for(let simulation of [fragment.simulation].flat())
 if(note(Math.floor((1-simulation.alpha())*100),"% throttling "+fragment.getAttribute("title")).next().value<10)
 return throttle(fragment);
 else fragment.simulation.stop();
 return fragment;
});
};

 export function ascend(selector,descendants=new Set())
{let fragment=this instanceof window.EventTarget;
 let selection=!fragment&&!simple(this);
 let node=fragment?this:selection?this.node():this;
 if((selection||fragment)&&!defined(selector))selector="svg";
 let limited=numeric(selector);
 if(limited&&!selector)
 return [node];
 let matching=!limited&&(!/[\.#]/.test(selector)
?node.nodeName.toLowerCase()===selector
:functor(selector)?selector(node)
:fragment?node.matches(selector):// match selectors on node. 
[qualify(qualify(node)),prune.call({"":qualify(selector)},({1:value})=>
 Object.keys(value).every(field=>["id","class"].includes(field))?value:undefined,1,1)
].map(Object.entries).reduce(([[nodename,node]],[[name,selector]])=>
 (!name||nodename===name)&&
 Object.entries(selector).every(([field,value])=>
 value.every(value=>node[field]?.includes(value)))));
 if(matching)
 return [node];
 let parent=fragment||selection?node.parentNode:node.parent;
 return !descendants.has(node)&&parent
?[...ascend.call(parent,limited?selector-1:selector,descendants.add(node)),node]
:[node];
};

 export function descend(selector,limit=Infinity,ascendants=new Set())
{let nodes=Array.from(this.children).filter(node=>node.matches(selector));
 return ascendants.size<limit
?[nodes,nodes.map(node=>descend(node,limit,ascendants.add(this)))].flat()
:nodes;
};

 export function seek(selector,direction)
{if(!defined(this))
 return tether(seek,...arguments);
 if(direction===0)
 return Array.from(this.parentNode.children).find(node=>node.matches(selector));
 let sibling=this[["previous",undefined,"next"][direction+1]+"Sibling"];
 return sibling?sibling.matches(selector)?sibling:seek.call(sibling,...arguments):undefined;
};

 export function tracenode(node,trail=[])
{if(!node||node.documentElement)return trail;
 let ordinal=node.parentNode&&Array.from(node.parentNode.childNodes).filter(({nodeName})=>nodeName==node.nodeName).indexOf(node);
 return [...tracenode(node.parentNode,[]),node.nodeName+(ordinal?":nth-of-type("+(ordinal+1)+")":"")]
};

 export function print(file)
{return resolve.bind(import.meta.url)(
["/mozilla_2010_pdf_viewer_brightspace.js"
,"/mozilla_2010_pdf_link_service_brightspace.js"
,"/mozilla_2010_pdf_brightspace.js"
]).then(function([{PDFViewer},{PDFLinkService},pdf])
{pdf.default.GlobalWorkerOptions.workerSrc="/mozilla_2010_pdf_worker_brightspace.js";
 let viewer=new PDFViewer(
 {linkService:new PDFLinkService(),renderer:"svg"
 ,textLayerMode:0,disableRange:true,forceRendering:true
 ,container:document({div:
 {class:"pdfjs",style:"margin:auto;height:100%;overflow:scroll;"
 ,div:{id:"viewer"}
 }})
 });
 viewer.linkService.setViewer(viewer);
 pdf.getDocument(file).promise.then(combine
(viewer.setDocument.bind(viewer)
,compose(1,"getPage",1,"getViewport",combine("width","height")
,(width,height)=>viewer.container.append(document({style:{"@scope":{":scope":
 {"&>div#viewer":
 {width:"100%",height:"100%"
 ,"&>div.page":
 {margin:"auto",width:"100% !important",height:"unset !important","aspect-ratio":width/height
 ,"background-image":"url('/icon/blackboard.png')"
 ,filter:"invert(round(1 - var(--invert)))"
 ,"&>*":{filter:"invert(round(1 - var(--invert)))"}
 ,"&>.loadingIcon":{content:"",fill:"red","border-radius":"50%",width:"20px",height:"20px"}
 ,"&~div.page>div.canvasWrapper>svg image":{opacity:0.3}
 ,"&>div.canvasWrapper":
 {width:"unset !important",height:"unset !important"
 ,"&>svg":{width:"100% !important",height:"auto !important"}
 ,"&>svg tspan":{fill:"var(--text,#dbd1b4)"}
 ,"&>svg image":{opacity:0.3}
 //,"&>svg path":{fill:"rgba(33,33,33,0.533)"}
 }
 }
 }
 }}}})))
)).catch(note);
 return viewer.container;
});
};

 export var progress={span:{class:"progress",style:{"@scope":{":scope":
 {display:"block",position:"absolute",width:"100%",height:"100%"
 ,background:"linear-gradient(transparent 0%,rgba(33,150,243,0.25) 75%,transparent 100%)"
 ,animation:"wave 3s ease 1s infinite"
 },"@keyframes wave":
 {"0%":{height:0,transform:"translate(0,-100%)",opacity:0}
 ,"50%":{opacity:0.25},"100%":{transform:"translate(0,100%)",opacity:0}
 }}}}};

 export function image(source,alt,sync)
{if(/image/i.test(source?.nodeName))return source;
 let src=is(Blob)(source)?URL.createObjectURL(source):source;
 let img=document({img:{}});//crossOrigin:"anonymous"}})
 if(sync)
 return document.call(img,{src,alt});
 return revert((resolve,reject,img,src,alt)=>compose.call
(img
,{onload(){if(/^blob:/.test(this.src))URL.revokeObjectURL(this.src);resolve(this,...arguments);}
 ,onerror(){if(/^blob:/.test(this.src))URL.revokeObjectURL(this.src);reject(this,...arguments);}
 ,src,alt
 },Object.assign
,globalThis.window?undefined:infer("dispatchEvent",new window.Event("load"))
))(img,src,alt);
 //if(!colors[color])svg.select("circle#"+id).attr("fill",["rgb(",...new Vibrant(this).swatches()["Vibrant"].rgb].reduce((hex,hue,index)=>hex+hue+(index<2?",":")")));
};

 export function canvas(image)
{let {naturalWidth:width,naturalHeight:height}=image;
 let canvas=document({canvas:
 {role:"img","aria-label":image.getAttribute("alt")
 ,"data-source":image.getAttribute("src")
 ,width,height
 }});
 let frame=canvas.getContext("2d");
 if(!frame)
 document.call(canvas
,{style:"background:repeating-linear-gradient(135deg,black,black 2px,transparent 2px,transparent 4px"
 });
 else frame.drawImage(image,0,0);
 return canvas;
};

 export function vector(node)
{if(node.nodeName.toLowerCase()=="svg")
 return node;
 let attributes=demarkup(node);
 let {r,x,y,cx,cy,dx,dy,width,height}=attributes;
 let font=Number(attributes["font-size"]?.replace(/[^0-9\.]*/g,""));
 let align=attributes["text-anchor"];
 //if(!isNaN(font))document.call(node,{dy:(Number(dy)||0)+font});
 x=cx?cx-r:x||0;
 y=cy?cy-r:y||0;
 width=width||r*2||font||0;
 height=height||r*2||font||0;
 let rotation=detransform(node,"rotate")*180/Math.PI;
 let transform="rotate("+rotation+")";
 if(rotation)document.call(node,{transform:""});
 return document
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
);
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

 export function snap()
{let {width:limitx,height:limity}=this.parentNode.getBoundingClientRect();
 let {left,top,width,height}=this.getBoundingClientRect();
 let overflow=[-left,-top,left+width-limitx,top+height-limity];
 overflow.forEach(whether(major(0),(overflow,index)=>
 this.style[index%2?"top":"left"]=Number(this.style[index%2?"top":"left"].match(/\d+/)?.[0])+overflow*(index<2||-1)+"px",infer()));
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

 export function stretch(target,extend)
{if(!this||!target)return;
 if(target.nodeType===11)return;
 let style=size=>({style:Object.entries(size).map(entry=>entry.join(":")).join(";")});
 let resize=([{target,contentRect:{width,height}}])=>
 document.call(this,(extend||style)({width,height}));
 let observer=new ResizeObserver(resize);
 observer.observe(target);
//  if(/svg/i.test(target.nodeName))
// (observer=new ResizeObserver(([{contentRect:{width,height}}])=>
//  document.call(target,vectorspace(...
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

 export var deselect=compose(when(string),/[^\w]/g,"_","replace");

 export async function error(path,request)
{when(is(Error))(this);
 // if(!request.headers?.referer?.endsWith(request.url))
 // return this;
 if(!request.headers?.accept?.split(",").includes("text/html"))
 return {body:this.stack,status:500};
 let style=await css({body:{background:"black",color:color.red}});
 let report=compose.call({div:{id:"frame",style:"white-space:pre-wrap","#text":this.stack}},"Error","/svg/animal/worm/document",[],[style],hypertext,document);
 let body=report.outerHTML;
 report.innerHTML="";
 return {body,status:500,type:mime("html")};
};

 export async function consume([source,common],index)
{return compose
(buffer(compose(fetch,"json"),fail=>({fail}))
,feed=>({common,source,...["items","posts","data"].some(field=>field in feed)?feed:
 {items:Object.entries(feed).map(([source,common])=>({source,common}))
 }})
)(source);
};

 export function syndicate({source,common,...feed})
{return either("items","posts","data",swap([]))(feed).map(next=>
 Object.assign(next
,{author:next.author?.name||common?.author?.name||source.substring(0,source.search(/_\d\d/)).replace("_"," & ")
 ,avatar:common?.icon||next.avatar||next.author?.avatar_URL||feed.feed?.image
 ,post:either("createdTime","pubDate","created_time","date",swap(0))(next)||next.common?.put||
 next.source?.substring(next.source.search(/_\d\d/)+1,next.source?.search(/\d\d_/)+2).split("").map((digit,index,date)=>
{if([3,6].includes(index))date.splice(index+1,0,"-");return digit;
}).join("")
 ,source:next.id||next.site_ID||next.source
 ,title:next.title||next.message||next.source?.substring(next.source?.search(/\d\d_/)+3).replace(/\.txt/g,"").replace(/_/g," ")
 ,content:next.content
 ,media:next.enclosure&&next.enclosure.link
 })).sort(({post:past},{post:next})=>[next,past].map(time=>
 new Date(clock(time,"datetime")).getTime()).reduce((next,past)=>next-past)).reverse();
};

 export async function* feed({name,icon,pub,sub},{source})
{let items=Object.entries(pub).map(([source,common])=>({source,common}));
 let feed=await compose.call
({source:"pub",feed:{image:icon},items,common:{icon,author:{name}}}
,combine(author,compose(each(syndicate),provide,each(article)))
,collect,"flat",infer("reduce",compose(pass("appendChild"),crop(1)))
);
 yield feed;
 let peer=document({div:{}});
 yield peer;
 await compose(Object.entries,provide,each(compose(consume,author,peer.append.bind(peer))),collect)(sub);
};

 export async function author({source,common,...feed},index)
{if(this)
 return  {imports:
 {"/Blik_2023_interface.js":["","resolve","locate","digest","cookie","cookies","query","path"]
 ,"/Blik_2023_search.js":["","merge","unfold","search","prune","extract","route","record"]
 ,"/Blik_2023_inference.js":";note;expect;compose;combine;pass;trace;drop;crop;slip;infer;tether;whether;wait;observe;buffer;swap;when;array;has;each;differ;provide;collect;is;match;basic;defined".split(";")
 ,"/Blik_2023_fragment.js":";* as fragment;document;form;image;canvas;message;demarkup;insert;navigate;metamarkup;detransform;stretch;vectorspace;error;drillresize;deselect;namespaces;keyboard;spell;expand;parse;semiotics;consume;syndicate;article;destroy;reference;fill;annotate;qualify;cursor;capture;socket".split(";")
 ,"/Blik_2023_layout.js":["* as layout"]
 }
 ,exports:{default:
 {".author":
 {click()
{let description=this.nextSibling;
 if(this.parentNode.nextSibling)
 return [this.parentNode,"nextSibling"].reduce(function trim(node,next){destroy(node[next])&&trim(...arguments);})
,merge(description,{style:"display:none"});
 if(description)
 spell(description);
 let {source:icon}=this.querySelector("canvas")?.dataset||{};
 let {textContent:name}=this.querySelector("span");
 let source=this.closest(".feed").getAttribute("source");
 compose(collect,consume,syndicate,provide,each(article)
,each(fragment=>insert(fragment,"after",this.parentNode))
,collect)(source,{icon,author:{name}});
}}
 ,".article":
 {async click()
{let feed=this.closest(".feed");
 let multiple=Array.from(feed.querySelectorAll(".article")).filter(node=>
 node!==this).some(node=>node.nextSibling);
 let expanded=this.nextSibling;
 feed.style.setProperty("max-width",!expanded||multiple?"calc(100% - 2em)":"revert");
 if(expanded)
 return [this,"nextSibling"].reduce(function trim(node,next){destroy(node[next])&&trim(...arguments);});
 let source=feed.getAttribute("source");
 let title=this.getAttribute("source");
 let index=this.getAttribute("index");
 let article=await compose(consume,syndicate,index)([source]);
 let media=article?.media&&document(link(article?.media,""));
 let progress=insert(document({span:{style:"display:inline-block;white-space:nowrap;overflow:hidden;font-family:monospace;animation:dotdot 3s infinite normal;","#text":"..."}}),"after",this);
 let content=defined(article?.content)
?[this.ownerDocument.createRange().createContextualFragment(article.content),/#.*$/].reduce((fragment,hash)=>
 Array.from(fragment.querySelectorAll("a")).map(link=>[link,link.getAttribute("href")]).forEach(([link,href])=>
 hash.test(href)&&link.setAttribute("href",href.replace(/[^#]*/,"")))||fragment)
:await compose(fetch,whether(compose("headers","Content-Type","get",is("text/html"))
,compose("text",text=>this.ownerDocument.createRange().createContextualFragment(text))
,compose("text",semiotics,parse)))([source,title,this.dataset?.fragment].filter(Boolean).join("/"));
 let entry=insert(document({span:{media}}),"after",this);
 await collect(each.call(content,async function add(fragment,index,entry)
{if(!index)
 progress.remove();
 return compose.call(fragment
,infer(insert,...entry.lastChild?["after",entry.lastChild]:["under",entry]));
},entry));
 if(article?.link)
 insert
 (document(link(article?.link,this.querySelector("span").textContent))
,entry.lastChild?"after":"under",entry.lastChild||entry
);
 let section=document({span:
 {class:"comments"
 ,span:merge
(form({name:cookie("author")||"",comment:""})
,{class:"comment"
 ,span:[{role:"button",canvas:await compose(image,canvas)("/svg/object/paperplane/tilt/document")}]
 ,style:
[{"@scope":{":scope":
 {"&>span[title]":
 {display:"table-cell","align-content":"center","min-height":"2.5em"
 ,"&[id=name]":{"margin-right":0,"border-radius":"2.1em 0 0 2.1em","padding":"0 .5em"}
 ,"&[id=comment]":
 {"max-width":"100%","word-break":"break-all"
 ,"&>span:first-of-type":{display:"none"}
 ,"&>span[role=textbox]":{"min-width":0,"text-align":"left","white-space":"pre"}
 }
 }
 ,"&>span[role=button]":
 {"border-radius":"0 2.1em 2.1em 0","margin-left":0,padding:".5em","vertical-align":"middle",overflow:"hidden",cursor:"pointer"
 ,"&>canvas":{width:"1.2em",height:"1.2em","vertical-align":"middle"}
 }
 ,"&:hover>span[id=comment]>span[role=textbox]":{"min-width":"5em"}
 }}
 }
]},0)
 ,style:
 {"@scope":{":scope":
 {display:"inline-block"
 ,"&>span.history":{display:"table-cell","border-spacing":"0 1em","text-align":"left"}
 ,"&>span.comment":
 {...layout.material,display:"inline-block","border-radius":"2.1em"
 }
 ,"@keyframes warn":{from:{"box-shadow":"#880e4f 0px 0px 5px inset"},to:{"box-shadow":"revert"}}
 }}}
 }});
 insert(section,"after",entry);
 let comments=await compose
(fetch,either("json",swap([])),provide,each(message)
,collect,["span","span"],record
,{span:{class:"history"}},merge,document
,infer(insert,"after",section.firstChild)
)("/Blik_2024_comments.json/module/namespace/default/"+title);
}}
 ,".comment":
 {keydown({target,keyCode:code,ctrlKey})
{let {enter}=keyboard(code);
 if(!enter)
 return;
 if(target.getAttribute("name")==="name")
 return arguments[0].preventDefault();
 if(ctrlKey)
 this.querySelector("[role=button]").dispatchEvent(new Event("click",{bubbles:true}));
},async click({target})
{if(!target.closest("[role=button]"))
 return;
 let fields=fill.call(this);
 let empty=Object.keys(fields).find(field=>!fields[field]);
 if(empty)
 return ["warn 1s","unset"].forEach((animation,index)=>
 compose(wait(1000*index),Object.assign)(this.querySelector("span[title="+empty+"]").style,{animation}));
 let source=this.closest(".comments").parentNode.querySelector(".article").getAttribute("source");
 let comments=target.closest(".comments").querySelector(".history");
 let text={put:note(Date.now()),...fields};
 let body=JSON.stringify({[source]:[text]});
 let {status}=await fetch("/Blik_2024_comments.json",{method:"put",body});
 if(status!==200)
 return ["warn 1s","unset"].forEach((animation,index)=>
 compose(wait(1000*index),Object.assign)(target.closest(".comment").style,{animation}));
 await message(text,comments.childNodes.length,comments);
 fill.call(this,{comment:""});
 if(cookie("author")===fields.name)
 return;
 this.ownerDocument.cookie=cookie({author:fields.name,path:"/"});
 let rank=await fetch("/author/"+fields.name+"/rank");
 let expires=rank.status===200?undefined:new Date().toUTCString();
 this.ownerDocument.cookie=cookie({rank:await rank.text(),path:"/",expires});
}}
 ,".message>span:first-of-type":
 {...observe({hover({isTrusted:hover,target})
{if(this!==target)return;
 if(!hover)
 return [target.firstChild.nextSibling].forEach(function remove(node){node&&remove(node.nextSibling),node?.remove();});
 let name=this.closest(".message").querySelector(".name").textContent;
 if(name!==cookie("author")&&cookie("rank")!=="ranger")
 return;
 let actions=document({span:{class:"actions",style:"width:0",svg:
 {role:"button",viewBox:"0 0 448 512"
 ,...svg.effect.shadow_amber
 ,path:{d:"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"}
 }}});
 this.firstChild.after(actions);
 actions.style.width="auto";
}})
 //,touchstart(event){event.preventDefault();}
 }
 ,".message svg[role=button]":
 {async click()
{let source=this.closest(".comments").parentNode.querySelector(".article").getAttribute("source");
 let message=this.closest(".message");
 let {index}=message.dataset;
 let body=JSON.stringify({[source]:{[index]:null}});
 let comments=await fetch("/Blik_2024_comments.json?override=true",{method:"put",body});
 if(comments.status!==200)return;
 let style=message.querySelector("style");
 if(style)
 (message.nextSibling||message.previousSibling)?.append(style);
 [message.previousSibling].forEach(function decrement(node){if(!node)return;decrement(node.previousSibling);node.dataset.index-=1;});
 message.remove();
}}
 }}};
 let src=common?.icon||feed?.feed?.image;
 let material=prune.call(layout.material,([field,value],{length})=>
 field==="&:hover"?{...value,animation:"blink .5s ease-in"}:value);
 let author=document(
 {span:
 {class:"feed",source:common?.source||source
 ,style:index?undefined:
 {"@keyframes blink":{"0%":{"box-shadow":"black 0 0 10px"},"33%":{"box-shadow":"var(--text) 0 0 10px"},"66%":{"box-shadow":"black 0 0 20px"},"100%":{"box-shadow":"revert-layer"}}
 ,".feed":
 {...material,display:"inline-block",overflow:"hidden","vertical-align":"middle"
 ,"max-width":"20em",transition:".3s",background:"var(--platform)","border-radius":"1.5em"
 ,position:"relative"
 }
 }
 ,span:
 {class:"title",style:index?undefined:{".feed>.title":
 {display:"block",cursor:"pointer",padding:"0.5em","text-align":"center"
 ,"&>span":
 {"white-space":"pre-wrap",color:"var(--note)"
 ,"&:first-of-type":{color:"var(--text)","&:hover":layout.text.glow,"&+span":{display:"block","text-align":"left"}}
 }
 ,"& canvas":{width:"2em",height:"2em","border-radius":"1em","vertical-align":"middle","&+span:before":{content:"' '"}}
 ,"& span[role=link]":{display:"block","text-align":"right",color:"var(--note)","font-style":"italic","&:hover":layout.text.glow,"&:before":{content:"' - '"}}
 }}
 ,span:await 
[common?.author?.name||common?.title||feed?.feed?.author||feed?.feed?.title
,feed?.feed?.description||common?.description
].reduce(async(author,description)=>
[{class:"author"
 ,canvas:src&&await buffer(compose(image,canvas),swap(undefined))(src)
 ,span:{"#text":author?.replace(/&amp;/g,match=>({"&amp;":"&"}[match]))}
 }
,author!==description&&description&&
 {class:"spell"
 ,"#text":description,style:"display:none"
 ,link:await compose(address=>link&&link(address))(feed?.feed?.link)
 }
].flat())
 }
 }
 });
 capture.call(author,["",file,"module","author","module"].join("/"));
 return author;
};

 async function comment({put,name,comment},index,comments)
{return compose
(fetch,buffer("json",swap({name})),{comment},merge
,async({name,icon,comment,put})=>insert(document({span:
 {class:"comment",...await message({icon,name,put,message:comment},index)
 }}),comments.firstChild?"before":"under",comments.firstChild||comments)
)("/author/"+name);
};

 export function link(address,title=address,redirect)
{if(this)
 return {imports:
 {"/Blik_2023_inference.js":["","compose","each","pass","infer"]
 ,"/Blik_2023_interface.js":["","fetch","digest"]
 ,"/Blik_2023_fragment.js":["","document","demarkup","insert","destroy"]
 ,"/Blik_2023_search.js":["","record","merge"]
 }
 ,exports:
 {default:
 {"[role=link]":
 {click()
{let address=this.getAttribute("data-address");
 if(/^#/.test(address))
 return this.ownerDocument.defaultView.location=address;
 let redirect=this.classList.contains("redirect")?"_blank":undefined;
 if(redirect)
 return this.ownerDocument.defaultView.open(address,redirect);
 let {1:extension}=new URL(address).pathname.match(/\.([^\/]+)$/)||[];
 let [format]=extension&&fields(
 {audio:["mp3"],video:["mp4","webm"]
 ,img:["png","jpg","jpeg","svg","gif","webp"]
 },value=>value.includes(extension))||[];
 if(this.nextSibling?.classList.contains("media"))
 return destroy(this.nextSibling);
 merge(this.style,{pointerEvents:"none",animation:"glow 2s infinite"});
 let style={span:{class:"media",style:{"@scope":{":scope":
 {display:"block",position:"relative"
 ,width:"90%",height:"470px",margin:"auto"
 ,border:"none",overflow:"visible"
 ,"&>iframe":{width:"100%",height:"100%",border:"none","border-radius":"15px"}
 }}}}};
 let fragment=format
?compose([format,"src"],record)
:/^http/.test(address)&&extension!=="pdf"
?compose(["iframe","src"],record,{a:
 {href:address
 ,style:{"@scope":{":scope":
 {position:"absolute"
 ,left:"100%",bottom:"1em",transform:"rotate(-90deg) translateY(0.5em)"
 ,"transform-origin":"left",width:"460px"
 ,overflow:"scroll","white-space":"nowrap"
 }}}
 ,"#text":address
 }},merge)
:compose(fetch,digest,{source:address},media,["span"],record);
 return compose
(buffer
(compose(fragment,["span"],record,style,merge,document,infer(insert,"after",this)),drop()
),pass(compose(swap(this),{style:{pointerEvents:null,animation:null}},merge))
)(address);
}}
 }
 }
 };
 address=/^http/.test(address)?address:[window.location.origin,address.replace(/^\/*/,"")].join("/");
 let {1:extension}=new URL(address).pathname.match(/\.([^\/]+)$/)||[];
 let [format]=extension&&fields(
 {audio:["mp3"],video:["mp4","webm"]
 ,img:["png","jpg","jpeg","svg","gif","webp"]
 },value=>value.includes(extension))||[];
 let style={"@scope":
 {":scope":{color:"#0097a7"}
 ,"@keyframes glow":
 {"0%":{"text-shadow":"0 0 0 var(--text)"}
 ,"50%":{"text-shadow":"0 0 8px var(--text)"}
 ,"100%":{"text-shadow":"0 0 0 var(--text)"}
 }
 }};
 if(format)
 return format==="img"?image(address,title,true):{[format]:{src:address,alt:title}};
 return capture.call
({span:
 {role:"link",class:fields({redirect}),style
 ,"data-address":address
 ,"#text":title
 }
 }
,["",file,"module",link.name,"module"].join("/")
);
};

 export function reference(title,source,layout,elements={audio:["mp3"],video:["mp4","webm"],img:["png","jpg","jpeg","svg","gif","webp"]})
{let url=/^http/.test(source)?source:[window.location.origin,source.replace(/^\/*/,"")].join("/");
 let [extension]=/[^\.]+$/.exec(new URL(url).pathname)||[];
 let tag=layout||extension&&Object.keys(elements).find(key=>
 elements[key].includes(extension))||"span";
 let target=/^#/.test(source)?"":undefined;
 return document(
 {[tag]:
 {id:title.replace(" ","_"),role:"link"
 ,title:title&&source,alt:title||source
 ,href:source
 ,src:source,controls:"on",target
 ,"#text":title||source
 }
 });
};

 export async function article(item,index)
{return document(
 {style:index?undefined:
 {"#text":await css({".article":
 {color:"#b71c1c",display:"block","white-space":"pre-wrap"
 ,cursor:"pointer",padding:"0.5em",position:"relative","z-index":2
 ,"&>canvas":{"border-radius":"50%",height:"1em",width:"1em","vertical-align":"bottom"}
 ,"&>span":{color:"var(--text)",display:"block"}
 ,"&:hover>span":layout.text.glow
 ,"&+span":{"text-align":"left","&>img":{"max-width":"100%",height:"auto"},"&>audio":layout.audio}
 }})
 }
 ,span:
 {span:
 {class:"article",id:item.source,source:item.source,platform:item.platform,index:String(index)
 ,...metamarkup(item.common)
 ,canvas:await compose(image,canvas)(item.avatar,item.author)
 ,"#text":" "+(item.post?clock(item.post,"date"):item.name.substring(5,13))
 ,span:{"#text":item.title+"\n"}
 }
 }
 });
};

 export function stylerules(selector)
{return Array.from(window.document.styleSheets).flatMap(({rules})=>
 Array.from(rules)).filter(({selectorText})=>selectorText?.includes(selector));
};

 export async function message({icon,name,put,comment,message=comment},index)
{return (
 {class:"message","data-index":String(index)
 ,style:{"@scope":{":scope":
 {display:"table-row","text-align":"left"
 ,"&>span":
 {display:"table-cell","vertical-align":"top"
 ,"&:first-of-type":
 {"& img,& svg,& canvas[role=img]":
 {...layout.material,position:"relative",display:"inline-block","vertical-align":"middle",height:"2em",width:"2em",margin:"0 .5em","z-index":1
 ,"border-radius":"50%","background-color":"var(--isle)"
 }
 ,"& svg":{padding:".25em",width:"2em",height:"2em",overflow:"visible"}
 ,"&>span.actions":
 {...layout.material,margin:0,position:"absolute",display:"inline-block","margin-left":"-2.5em","padding-left":"2.5em","border-radius":"2em",background:"var(--isle)"
 ,"&>svg":{width:"1.5em",height:"1.5em",margin:"0","&:hover":layout.glow.amber}
 }
 }
 ,"&>span":
 {"&.title":{"white-space":"nowrap","&>span":{"&.name":{"font-weight":"bold"},"&.time":{color:"var(--isle)","&:before":{content:"' '"}}}}
 ,"&:not(.title)":{display:"block"}
 }
 }
 }}}
 ,span:
[{canvas:await buffer
(compose(icon&&fetch,digest,whether(is(Blob),compose(image,canvas),infer()))
,swap({role:"img"})
)(icon)
 }
,{span:
[{class:"title",span:[{class:"name","#text":name},{class:"time","#text":clock(put,"dateminute")}]}
,{"#text":message}
]}
]});
};

 export function chapters(id)
{let target=(this?.closest("body")||window.document).querySelector("#"+id);
 let fragment=target.parentNode.parentNode;
 // let chapters=Array.from({length:7},(chapter,index)=>
 // Array.from(fragment.querySelectorAll("h"+index))).flat().filter(node=>
 // node!==target);
 let chapters=unfold.call(fragment,compose("childNodes",Array.from)).filter(node=>
 /h\d/.test(node.nodeName.toLowerCase()));
 chapters=chapters.slice(chapters.indexOf(target)+1);
 let top=Math.min(...chapters.map(node=>Number(node.nodeName.at(-1))));
 let tree=chapters.reduce(function fold(tree,node,index,chapters)
{let depth=node.nodeName.at(-1)-top;
 let path=[tree].flatMap(function last(tree)
{let [field,value]=Object.entries(tree).at(-1)||[];
 return value?[field,last(value)].flat():[];
});
 return merge(tree,{},[path.slice(0,depth),node.textContent].flat());
},{});
 return target.parentNode.insertBefore(document(
 {ol:
 {li:prune.call(list(tree),([field,value])=>
 field!=="span"||!value?.["#text"]?value
:{a:
 {"#text":value["#text"]
 ,"href":"#"+encodeURIComponent(value["#text"])
 ,target:null
 ,style:"display:block;white-space:pre;font-weight:bold;"
 }
 })
 ,style:{"#text":css({["#"+id+"+ol ul"]:{"list-style-type":"disc"}})}
 }
 }),target.nextSibling);
 // target.parentNode.insertBefore(document(
 // {a:chapters.map(node=>(
 // {"#text":" ".repeat(node.nodeName.at(-1))+node.textContent
 // ,"href":"#"+encodeURIComponent(node.textContent)
 // ,target:null
 // ,style:"display:block;white-space:pre;font-weight:bold;"
 // }))
 // }),target.nextSibling);
};

 export async function featurefacebook()
{let module=await import("//connect.facebook.net/en_US/sdk.js");
 let {default:svg}=await resolve.bind(import.meta.url)("/Blik_2020_svg.json");
 let {default:awesome}=await resolve.bind(import.meta.url)("/blessochampion_2019_awesomesvgs.json");
 return new Promise(resolve=>
 window.fbAsyncInit=function()
{FB.init({appId:"281250585888156",autoLogAppEvents:true,status:false,xfbml:true,version:"v4.0"});
 FB.AppEvents.logPageView();
 FB.getLoginStatus(function(response)
{window.document.csss[0].addRule("#facebook","position:absolute;bottom:20px;right:15vw;font-size:30px;color:#757575;font-weight:900;transform:rotate(-10deg);line-height:0.8em;cursor:pointer;white-space:pre;");
 window.document.styleSheets[0].addRule("#facebook svg","fill:#757575;position:absolute;right:-35px;top:0;bottom:0;margin-top:auto;margin-bottom:auto;width:30px;transform:none;")
 let facebook=document(
 {"div":
 {"id":"facebook","title":"authorize access to featured facebook posts"
 ,"svg":{...svg.arrow_curved.svg,"style":"position:absolute;width:48px;bottom:-66px;right:-20px;fill:#757575;transform:rotate(6deg)"}}
 ,"#text":"Feature \nfacebook?"+awesome["fab fa-facebook-square"].replace("<svg ","<svg width='10px' ")
 });
 facebook.connected=response.status==="connected";
 !function connectfacebook(click)
{facebook.onclick=null;
 let facebooklogo=facebook.removeChild(facebook.lastChild);
 insert(null,facebook.lastChild,true);
 let settle=function(response)
{facebook.connected=response.status==="connected";
 facebook.replaceChild(window.document.createTextNode(facebook.connected?"Forget \nfacebook":"Feature \nfacebook?"),facebook.childNodes[1]);
 facebook.onclick=connectfacebook;
 facebook.replaceChild(facebooklogo,facebook.lastChild);//spin();
}
 if(click.srcElement)(facebook.connected?FB.logout:FB.login)(settle,{scope:'user_posts'})
 else settle(click);
}(response);
 resolve.bind(import.meta.url)(facebook)
})
}).then(facebook=>facebook)
};

 export async function charge(actions,syntax)
{return compose
({exports:{actions}
 ,procedures:[proceduralize(dispose)]
 },merge,serialize,text=>({type:"module","#text":text})
)(syntax);
};

 export function keyboard(code)
{let codes=
 {enter:13,escape:27,space:32,leftright:[37,39],updown:[38,40],backspace:8,tab:9
 ,shift:16,ctrl:17,alt:18,caps:20,end:35,home:36,insert:45,delete:46
 ,...Object.fromEntries(
[Array.from({length:10},(number,index)=>index)
,Array.from("abcdefghijklmnopqrstuvwxyz")
].flat().map((key,index)=>[key,(index>9?55:48)+index]))
 };
 if(string(code))
 return codes[code];
 let [key]=Object.entries(codes).find(({1:codes})=>[codes].flat().includes(code))||[];
 return key?{[key]:true}:{};
};

 export function hydrate(fragment)
{// to be used in element's style onload event to dispatch associated script actions as event attributes. 
 let module=Array.from(fragment.parentNode.childNodes).find(node=>
 node.nodeName?.toLowerCase()==="script").textContent;
 let expose="postMessage(Object.values(actions).flatMap(Object.keys));";
 let blob=new Blob([module,expose],{type:mime("js")});
 let {Worker,URL}=fragment.ownerDocument.defaultView;
 let worker=new Worker(URL.createObjectURL(blob),{type:"module"});
 compose
(revert(function(onmessage,worker){Object.assign(worker,{onmessage,onerror:console.error})})
,({data:namespace})=>activate(fragment.parentNode
,{[qualify(fragment.parentNode)]:Object.fromEntries(namespace.map(name=>[name,Function]))})
)(worker);
};

 export function select(actions)
{// extract actions associated with node/fragment. 
 let [scope]=Object.entries(actions).map(unfold).find(match.bind(this))||[{}];
 return scope;
 function unfold([selector,scope])
{return [qualify(selector),scope].reduce((selector,scope)=>
[scope,Object.values(selector).every(simple)
?Object.entries(selector).shift()
:["",selector]
]).flat();
};

 function match([scope,name,selector])
{let nodename=this.nodeName?.toLowerCase()||"body";
 let namematch=!name||name===nodename;
 return namematch&&Object.entries(selector).flatMap(([attribute,value])=>
 [value].flat().map(value=>[attribute,value])).every(([attribute,value])=>
 attribute==="class"
?this.nodeName
?this.classList?.contains(value)
:[this[attribute]].flat().flatMap(list=>list.split(" ")).includes(value)
:this[attribute]===value);
};
};

 export function cursor(node)
{combine
(compose(drop(1),node,node.textContent.length,combine("setStart","collapse"))
,"removeAllRanges","addRange"
)(node.ownerDocument.defaultView.getSelection(),node.ownerDocument.createRange());
};

 export function transform({transform})
{if(string(transform))
 transform={baseVal:[{matrix:new DOMMatrixReadOnly(transform)}]};
 let [x,y]=search.call(transform,{baseVal:{0:{matrix:["e","f"]}}});
 return {x,y};
};

 export function transition(node,style,seconds)
{return !seconds?Object.assign(node.style,style)&&node:compose
((transition,node)=>Object.assign(node.style,{transition})&&node
)(wait((seconds+(Number(style["transition-delay"]?.replace(/[^0-9\.]/g,""))||0))*1000
,node.style.transition
,Object.assign(node.style,{transition:Object.keys(style).map(style=>style+" "+seconds+"s").join(","),...style})&&node));
};

 export function expand(event)
{if(this.className==="spell")
 return [this,demarkup(this)].reduce(({ownerDocument},{for:id})=>
 spell(ownerDocument.querySelector("#"+id)));
};

 export async function spell(block,recursion)
{if(recursion&&!recursion.nodeName)
 exit(Error("recursion argument of "+spell.name+" passed externally: "+typeof recursion));
 if(!block.ownerDocument.contains(block)||["style","script"].includes(block.nodeName.toLowerCase()))
 return block;
 let spelling=!recursion&&await expect((past,{textContent:{length:next}})=>
 past<next,300,2)(block.textContent.length,block);
 if(spelling)
 return block.skip=2,block;
 let nodes=Array.from(block.childNodes).filter(node=>node.nodeName?.toLowerCase()!=="style");
 let textcontents=nodes.map(node=>node.nodeName==="#text"
?[node.textContent,node.textContent=""][0]
:node.style.setProperty("visibility","collapse"));
 let element=block.nodeName==="#text"?block.parentNode:block;
 if(!recursion)
{let expanded=block.ownerDocument.defaultView.getComputedStyle(element).display!=="none";
 let display=expanded?"none":"";
 let {rules,ownerNode:style}=Array.from(block.ownerDocument.styleSheets).find(({ownerNode:style})=>style?.parentNode===block)||{};
 // let rule=rules&&select.call(block,Object.fromEntries(Array.from(rules).map(rule=>
 // [rule.selectorText,rule])));
 !style
?element.style.setProperty("display",display)
:Object.entries({textContent:style/*,cssText:rule*/}).forEach(([field,node])=>
 node[field]=node[field].replace(/display:[^;]+/,"display: "+display));
 await either(expect((block,condition)=>
 // internal scoped style tags may not obey being no browser standard. 
 condition(is("none"))(block.ownerDocument.defaultView.getComputedStyle(block).display)
,500,20)
,fail=>note(Error("updating non-standard internal scoped style tag failed."))
)(element,display==="none"?is:not);
 if(expanded||spelling)return block;
 block.skip=0;
 block.onclick=function(){if("skip" in this)this.skip+=1;};
};
 let origin=recursion||element;
 await collect(each.call(provide(nodes),async (node,index)=>
 !origin.parentNode||origin.ownerDocument.defaultView.getComputedStyle(origin).display==="none"
?undefined
:node.nodeName!=="#text"
?node.style.setProperty("visibility","visible")||spell(node,origin)
:Array.from(textcontents[index]||[]).reduce(record((symbol,index,text)=>origin.skip<2
?compose.call(symbol,wait(origin.skip?0:".:".split("").includes(text[index-1])?1000
:index%Math.floor(Math.random()*3)?index%Math.floor(Math.random()*6)?300:200:100),symbol=>node.textContent+=symbol)
:node.textContent+=text.splice(index).join(""))
,[])));
 if(!recursion)
 delete block.skip;
 return block;
};

 export function destroy(node)
{if(node)
 return Array.from(node.childNodes||[]).forEach(destroy),node.remove?.(),node;
};

 export var textcontent=fragment=>
 Array.from(fragment?.childNodes||[]).reduce((text,fragment)=>
 text+({style:"","#text":fragment.textContent}[fragment.nodeName?.toLowerCase()]??
 textcontent(fragment))
,"");

 export function stylesheet(style,global=true)
{return jss.use(...plugins.map(plugin=>plugin())).createStyleSheet(global?{"@global":style}:style).toString().replace(/^([^\{]+) \{/g,"$1{").replace(/([\{;])\n *([\w\}])/g,"$1$2");
};

 export function css(style,prefix="")
{let rule=prefix&&Object.entries(style).filter(([field])=>
 !"&@".includes(field[0])).reduce((rule,entry,index)=>
 [rule,something(entry[1])?simple(entry[1])
?[""," "][Number(Boolean(index))]+css(...entry.reverse())
:["",";"][Number(Boolean(index))]+entry.join(":"):""].join("")
,prefix+"{")+"}";
 let rules=Object.entries(style).filter(([field])=>
 !prefix||"&@".includes(field[0])).flatMap(([field,value])=>
 field.split(",").flatMap(field=>[value].flat().map(value=>
 [field,value]))).filter(({1:value})=>
 simple(value)).map(([field,value])=>
 field.startsWith("@")
?css(value,field)
:css(value,prefix+field.replace(/^&/,"")));
 return [rule,rules].filter(Boolean).flat().join("\n");
};

 var actions=
 // obsolete. 
 {".defer":
 {load(event)
{if(!this.dataset.subject)
 return;
 let subject=JSON.parse(this.dataset.subject);
 compose(combine(compose("source",fetch,digest),infer()),transform,"over",this,insert)(subject);
}}
 ,".field":{click({target}){form.call(target.closest("form"),{extend:{key:"",value:""}})}}
 ,".carousel":
 {scroll({target})
{let timeout=target.timeout=setTimeout(tick=>
{if(target.timeout!==timeout)return;
 delete target.timeout;
 let to=
[target.scrollLeft,target.getBoundingClientRect().width
].reduce((offset,width)=>Math.round(offset/width)*width);
 let duration=500;
 !function animateScroll(start,change,time,increment)
{time+=increment;
 time/=span/2;
 if(time<1) 
 target.scrollLeft=delta/2*time*time+start;
 else
 target.scrollLeft=-delta/2*(--time*(time-2)-1)+start;
 if(currentTime<duration)
 setTimeout(tick=>animateScroll(start,change,currentTime,increment),increment);
}(target.scrollLeft,to-target.scrollLeft,0,20);
},100);
}}
 };

 export function parse(text,semiotics)
{if(!semiotics)
 exit("no semiotics provided for parsing "+type(text));
 return each.call(provide(Array.from(text)),async function* interpret(text,index,length,syntax)
{let end=index+1===length;
 let trail=syntax.splice(0,2).filter(Boolean);
 let fragments=await semiotics[text]?.(...trail)||semiotics.text(text,...trail);
 syntax.unshift(...fragments.flat());
 let previous=syntax.findIndex(fragment=>trail.includes(fragment));
 if(!previous&&!end)return;
 let next=syntax.slice(0,previous<0?undefined:previous).filter(fragment=>!simple(fragment)).reverse();
 if(!next.length)
 if(end)
 next=[document({span:{"#text":syntax[0].text}})];
 else return;
 let block=syntax.find(fragment=>fragment?.classList?.contains("inline"));
 // block style rules can't be applied to inline elements, hence the back-population of a div. 
 if(block&&!next.includes(block))
 return block.append(...next);
 yield* next;
},text.length,[]);
};

 export var semiotics=
 // pririty determines field to populate. 
 {text(text,last={},...syntax)
{let field=Object.values(semiotics).map(({name})=>name).find(field=>defined(last[field]))||semiotics.text.name;
 let start=!simple(last);
 //let style=[last,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 if(last.tag?.length===0&&!/[\w\d]/.test(text))
 return [{text:last.title+"#"+text},...syntax];
 if(start)
 return [{text},last,...syntax];
 last[field]=[last[field]||"",text].join("");
 return [last,...syntax];
},phrase(last)
{if(!last?.text)
 return last;
 let {text}=last;
 let parenthesized=text.endsWith(")");
 let index=parenthesized
?odd(text.slice(0,-1),"()")?.pop()
:Math.max(..." \n".split("").map(space=>text.lastIndexOf(space)));
 let phrase=text.slice(index+1,parenthesized?-1:undefined);
 return [phrase,text.slice(0,text.length-phrase.length-parenthesized*2)];
},annotate(fragment,label)
{return label?.split(".").reduce((fragment,id,index)=>
 index?(fragment.classList.add(id),fragment):document.call(fragment,{id})
,fragment);
}," ":function terminate(last,past,...syntax)
{let parenthesized=last?.action||string(last?.style);
 if(last?.text||parenthesized)
 return false;
 let [tag,address]="#@".split("").map(field=>last?.[semiotics[field].name]);
 let noise=!/[a-zA-Z]/.test([tag, address].find(Boolean));
 if(noise||!tag&&! address)
 return defined(tag??address)?
[merge([past,{}].find(simple)
,{text:[past.text||"",last.title,defined(tag)?"#":"@"," "].join("")
 ,style:past.style
 }),syntax
]:false;
 let [text]=[tag,address].map(phrase=>phrase?.match(/[\.,\)\?:;]+$/)).find(Boolean)||[""];
 if(text)
 [tag,address]=[tag,address].map(phrase=>phrase?.slice(0,-text.length));
 let next=address
?compose(link,document,tether(capture))(address,last.title)
:Object.entries(qualify(tag)).flat().reduce((tag,qualifiers)=>document({[tag]:
 {"#text":last.title
 ,id:/h\d/.test(tag)?last.title:undefined
 ,...qualifiers
 }}));
 //let style=[past,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 if(simple(past))
 past=document({span:{"#text":past.text}});
 return [{text:text+" "},next,past||[],...syntax];
},"\n":function terminate(last,...syntax)
{let past=this[" "](...arguments).slice?.(1);
 if(!past&&string(last?.text)||string(last?.action)||last?.compound||string(last?.style))
 return false;
 //let style=[last,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 let next={text:[last?.text||"",""].join("\n")};
 return [next,past||(last?.text?[]:last||[]),...syntax];
},"#":function tag(last,...syntax)
{if(last.style||string(last?.link)||last?.action||last?.compound||/^{|:$/.test(last?.style)||last?.text?.endsWith(" "))
 return false;
 return this.phrase(last).reduce?.((title,text)=>
 title&&[{title,tag:""},text?document({span:{"#text":text}}):[],syntax])||
 [merge(last,{tag:""}),...syntax];
},"@":function link(last,...syntax)
{if(last.style||last.action||last.compound)
 return false;
 return this.phrase(last)?.reduce((title,text)=>
 [{title,link:""},text?document({span:{"#text":text}}):[],syntax]);
},"(":function action(last,...syntax)
{if(!last?.tag||last?.compound||last?.style)
 return false;
 return [{action:"",layout:last.tag,title:last.title},syntax];
},")":async function action(last,...syntax)
{if(!last.layout||last?.compound||string(last.style))
 return false;
 let open="()".split("").map(parenthesis=>
 Array.from(last.action?.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return false;
 let [module,feature]=await locate.call(import.meta.url,last.layout);
 let jsons=[...last.action.matchAll(new RegExp(/[{\[]{1}(?:[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/,"mg"))].map(([json])=>json);
 let context=jsons.reduce((context,json)=>
[context,context.pop().split(json).reduce((before,after)=>
 "\"'`".split("").some(quote=>Array.from(before.matchAll(quote)).length%2)
?[before,json,after].join("")
:[before,...JSON.parse("["+json+"]"),after].filter(Boolean))
].flat(),[last.action]).flatMap(term=>string(term)
?Array.from(term.replace(/(^(\n|,| +)|( +|,|\n)$)/g,"")).reduce(([last,...context],symbol,index,{length})=>
[!last.length&&/ |,/.test(symbol)?last:last[0]===symbol
?[...index+1<length?[""]:[],last.substring(1)]
:[last+symbol]
,context
].flat()
,[""]).reverse():[term]);
 let fragment=await buffer(infer(resolve.bind(import.meta.url)),fail=>document({span:{"#text":fail?.stack}}))(module,feature,...context);
 this.annotate(fragment,last.title);
 return [fragment,syntax];
},"{":function style(last,...syntax)
{if(!last||string(last?.text)||last?.compound||string(last?.style))
 return !last||last.text?.at(-1)==="\n"?[{style:"",block:true},document({span:{"#text":last?.text.slice(0,-1)||""}}),syntax]:false;
 let next=this[" "](...arguments);
 if(next||last.nodeName)
 return [{style:""},next?next.slice(1):[last,...syntax]].flat();
},"}":function style(last,past,...syntax)
{//when({style:either(none,string)})(...arguments);
 if(!string(last.style)||string(last.text))
 return false;
 let open="{}".split("").map(parenthesis=>
 Array.from(last.style?.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return false;
 if(!past?.nodeName)
 return [merge(last,{text:""}),simple(past)?document({span:{"#text":past.text}}):past||[],syntax];
 if(!last.style)
 return [{text:""},past,syntax];
 let {style,...fragment}=buffer
(compose(fragment=>"{"+fragment+"}",JSON.parse)
,compose(drop(1),["style"],record)
)(last.style);
 let next=last.block?document({div:{class:"inline"}}):past;
 let selector=qualify(fragment)||qualify(next);
 fragment.style=string(style)
?[last.block?"position:relative;":"",style].join("")
:simple(style)?document({style:
 {[selector]:merge(prune.call(style,([field,style])=>
 /^&/.test(field)||!simple(style)?style:undefined,0,0)
,last.block&&{position:"relative"},0)
 ,...prune.call(style,([field,style])=>
 simple(style)&&!/^&/.test(field)?style:undefined,0,0)
 }}):{};
 document.call(next,fragment);
 return last.block?[next,past,syntax]:[{text:""},next,syntax];
},"[":function compound(last,...syntax)
{if(!string(last.tag)||last.compound)
 return false;
 return [{compound:"[",title:last.title},syntax];
},"]":async function compound(last,...syntax)
{if(!last?.compound)
 return false;
 let compound=[last.compound,"]"].join("");
 let open="[]".split("").map(parenthesis=>
 Array.from(compound.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return false;
 let context=JSON.parse(compound);
 if(context[0]==="this")
 context.splice(0,1,syntax[0]);
 let fragment=await buffer(compose(resolve.bind(import.meta.url),collect),compose(crop(1),"stack",["span","#text"],record,document,collect))(context);
 fragment.forEach(compose(crop(1),last.title,this.annotate));
 return [...fragment,syntax];
}//,"<":function(last,...syntax){if(last.style||last.action)return;return this.text("&lt;",...arguments);}
 //,">":function(last,...syntax){if(last.style||last.action)return;return this.text("&gt;",...arguments);}
 };

 export var tests=
 {document:
 {node:
[{context:[{span:{id:"node","#text":"node"}}]
 ,condition:compose(combine("id","textContent"),when(are("node")))
 }
,{context:[{span:{empty:undefined}}]
 ,condition:compose("outerHTML",when(is("<span></span>")))
 }
,{context:[{span:{empty:null}}]
 ,condition:compose("outerHTML",when(is("<span></span>")))
 }
],multiple:
[{context:[{span:[{},{}]}],condition:compose("childNodes",Array.from,provide,when(are(compose("nodeName","toLowerCase",("span")))))}
,{context:[{span:{},div:{}}],condition:compose("childNodes",Array.from,provide,when(...["span","div"].map(node=>compose("nodeName","toLowerCase",is(node)))))}
],attribute:
 {scope:{span:{}},route:document
 ,context:[{id:"node"}]
 ,condition:compose("id",when(is("node")))
 }
 ,children:
 {scope:{div:{}},route:document
 ,context:[{id:"node",span:{}}]
 ,condition:compose("outerHTML",when(is("<div id=\"node\"><span></span></div>")))
 }
 ,none:{context:[undefined],condition:when(is(null))}
 ,language:
 {context:[{span:{"#text":{en:"node"}}},0,"en"]
 ,condition:compose("outerHTML",when(is("<span>node</span>")))
 }
 ,styled:
[{context:[{span:{style:"display:block"}}]
 ,condition:compose("outerHTML",when(is("<span style=\"display:block\"></span>")))
 }
,{context:[{span:{style:{".span":{"display":"block"}}}}]
 ,condition:compose("outerHTML",when(is("<span><style>.span{display:block}</style></span>")))
 }
],classed:
[{context:[{span:{class:"node"}}]
 ,condition:compose("outerHTML",when(is("<span class=\"node\"></span>")))
 }
,{context:[{span:{class:["node","span"]}}]
 ,condition:compose("outerHTML",when(is("<span class=\"node span\"></span>")))
 }
],namespaced:
 {context:[{svg:{viewBox:"0 0 1 1"}}]
 ,condition:compose(infer("getAttributeNode","viewBox"),"name",when(is("viewBox")))
 }
 ,redundant:
 {scope:{span:{id:"node",span:[{class:"first"},{class:"second"}]}}
 ,route:document
 ,context:[{id:"node",span:[{"#text":"first"},{"#text":"second"}]}]
 ,condition:compose("childNodes",iterate,each(combine("className","textContent")),collect,combine(0.5,-0.5),collect,"flat",when(infer("every",(values,index)=>values.every(is(["first","second"][index])))))
 }
 ,html:
 {context:[{html:{lang:"en",head:
 {title:{"#text":"Error"}
 ,meta:
[{"charset":"utf-8"}
,{"http-equiv":"content-language",content:"en-us"}
,{"http-equiv":"Content-Type",content:"text/html;charset=UTF-8"}
,{name:"theme-color",content:"#000000"}
,{name:"description",content:"Error"}
,{name:"viewport",content:"width=device-width, initial-scale=1"}
],link:[{rel:"icon",type:"image/svg+xml",href:"/svg/animal/worm/document"}]
 ,style:[{"#text":"body{background:black;color:#c62828}"}]
 ,script:[]
 }
 ,body:{center:{"#text":""}}}}]
 ,condition:compose("nodeName",when(is("HTML")))
 }
 }
 ,list:
[{context:[{a:{b:"c",d:["e","f"]}}],terms:
[[
 {"#text":"a",ul:
 {li:
[{"#text":"b",ul:{li:[{"#text":"c"}]}}
,{"#text":"d",ul:{li:[{"#text":"e"},{"#text":"f"}]}}
]}
 }]
],condition:"deepEqual"
 }
],parse:
 {tag:{context:["Figure 1: Author_YEAR#h1 ",semiotics],terms:[collect,1,"nodeName","H1"],condition:"equal"}
 ,link:{context:["Figure 1: Author_YEAR@reference.pdf ",semiotics],terms:[collect,1,infer("getAttribute","role"),stash("link")],condition:"equal"}
 ,image:{context:["Figure 1: Author_YEAR#fragment/media(\"image.png\") ",semiotics],terms:[collect,1,"nodeName","IMG"],condition:"equal"}
 ,action:{context:["Figure 1: title#chart/plot([1,2]) ",semiotics],terms:[collect,1,"nodeName","svg"],condition:"equal"}
 ,composition:{context:['Figure 1: title#[[[1,2]],"chart/plot"] ',semiotics],terms:[collect,1,"nodeName","svg"],condition:"equal"}
 ,reflow:{context:["abc\n{text-align:left}\ndef",semiotics],terms:[collect,1,"nodeName","DIV"],condition:"equal"}
 ,style:["@reference.pdf","@image.png","#span"].map(fragment=>(
 {context:["Figure 1: Author_YEAR"+fragment+"{width:0px;filter:invert(1)} ",semiotics],terms:[collect,1,"style","width","0px"],condition:"equal"
 }))
 ,immediate:{context:["Author_YEAR@image.png{width:100%} ",semiotics],terms:[collect,0],condition:when(is([compose("style","width",is("100%")),compose("nodeName",is("IMG"))]))}
 ,compound:{context:['Author_YEAR@image.png{"style":{"width":"100%","h2":{"margin":0}}}',semiotics],terms:[collect,1],condition:when(compose("textContent",infer("split","\n"),provide,when(compose(infer("endsWith","{width:100%}")),compose(infer("endsWith","{margin:0}")))))}
 ,mixed:{context:["abc\nAuthor_YEAR@reference.pdf\ndef\n{text-align:left}\nghi",semiotics],terms:[collect,3,"nodeName","DIV"],condition:"equal"}
 ,noise:{context:["abc\n{text-align:left}\ndef\ng={h:1};",semiotics],terms:[collect,1,"nodeName","DIV"],condition:"equal"}
 }
 };

