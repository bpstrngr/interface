 import {locate,command,recompose,delegate,agent,thread,fetch as freefetch,digest} from "./Blik_2023_interface.js";
 import {note,induce,index,describe,decide,produce,colors,wait,stagger,search,merge,prune,record,route,observe,rank,constant,rotate,deduce,lift,fold,collect,slip,spill,push,infer,either,each,pass,tether,surge,flush,buffer,differ,compose,some,flip,skip,stash,revert,combine,whether,swap,compound,something,string,basic,minor,functor,promise,defined,undefine,simple,iterable,exit,drop,crop,odd,same,major,binary,match,is,are,has,not,numeric,array,pdf,when,debug,expect,generator,plural,native,clock,type,complex,heritage,prototype,expressions,cede,extract,fields,instance,yank} from "./Blik_2023_inference.js";
 import {unfold} from "./Blik_2023_search.js";
 import {serialize,proceduralize,mime,data,file,relate,cookie,query} from "./Blik_2023_meta.js";
 import * as layout from "./Blik_2023_layout.js";
 import {color} from "./Blik_2023_layout.js";
 var address=new URL(import.meta.url).pathname;
 export const name=file(address);

 export var namespaces=
 {xml:"http://www.w3.org/XML/1998/namespace"
 ,xlink:"http://www.w3.org/1999/xlink"
 ,xmlns:"http://www.w3.org/2000/xmlns/"
 ,xhtml:"http://www.w3.org/1999/xhtml"
 ,svg:"http://www.w3.org/2000/svg"
 ,viewBox:"http://www.w3.org/2000/svg"
 };

 export var browser=!globalThis.window
?agent.node&&!thread&&!agent.virtual&&
 await jsdom("http://localhost:80/")
:globalThis;
 export var {window}=browser||{};
 export var {fetch}=window||{};

 export var worker={imports:
 {"/Domenic_2010_jsdom.js":["jsdom"]
 ,"/Blik_2023_interface.js":["","inspect","interpret","access"]
 }
 ,exports:
 {async configure(url)
{let {JSDOM}=await jsdom;
 if(!browser)
 note.call(3,"loading browser client at "+url+"...")
,browser=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 else browser.reconfigure({url});
 window=browser.window;
 fetch=window.fetch;
 note.call(3,"navigated browser to "+url);
},origin(){return browser?.window.location.origin;}
 ,async fragments()
{let module="./Blik_2023_fragment.js";
 let fragments=await interpret(await access(module,"string"),module,{window});
 console.log(fragments)
}}
 ,procedures:{async initialize()
{var browser,window,fetch;
 inspect(process.debugPort+2);
}}};

 export async function jsdom(url)
{if(this)
 return this.reconfigure({url}),{window}=this,{fetch}=window
,note.call(3,"navigated browser to "+url);
 return window=revert(async function(expose,reject,url)
{note.call(3,"loading browser client at "+url+"...")
 let {JSDOM}=await command.call(import.meta.url,"./Domenic_2010_jsdom.js","default");
 let browser=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 jsdom=jsdom.bind(browser);
 let {protocol,hostname,port}=new URL(url);
 let name=["fetch",protocol.replace(":",""),hostname,port].join("_");
 fetch=describe(freefetch.bind(browser.window),name);
 note.call(3,"navigated browser to "+url);
 expose(window=browser.window);
})(url);
};

 export function* document(fragment,namespace,language)
{// yield document nodes and suspended generators of their descendants from a fragment declaration. 
 let bound=is(window.Element)(this);
 if(bound)
 yield this;
 let scope=bound?this:Reflect.construct(window.DocumentFragment,[]);
 let loop=infer(document.bind(scope),namespace,language);
 let insert=append.bind(scope);
 yield each.call(fragment||{},decide(
 {node:[simple,compose(Object.entries,rank,each(compose(each([rank]),lift,drop(2,0,flip),crop(3),push(namespace,language,scope),populate)),lift)]
 ,text:[string,compose(slip(scope),tether(text),insert)]
 ,plural:[array,compose(rank,loop)]
 ,promise:[promise,induce(loop)]
 ,generator:[plural,loop]
 ,ready:[is(window.NodeList),compose(rank,each(insert))]
 ,rest:[something,insert]
 ,else:drop()
 }))
};

 var populate=buffer(decide(
 {text:
[is(something,"#text"),function(content,field,context,namespace,language,scope)
{return append.call(scope,text.call(scope,simple(content)?content[language]||Object.values(content)[0]:content,context))
}
],dataset:
[is(simple,"dataset")
,produce((content,field,context,namespace,language,scope)=>
 rank([scope,dataset(content),namespace,language]),tether(document),drop(1),lift,lift)
],actions:
[is(string,"data-actions")
,produce(drop(-1,1),flip,tether(capture),infer("getAttributeNode","data-actions"))
],class:
[is(array,"class")
,produce(drop(3,2),each([infer("join"," "),produce(crop(1),collect)]),lift,drop(2,0,record),rotate(1),tether(document),drop(1))
],plural:
[compound
,produce
((node,name,path,...context)=>[node].flat().filter(something).map((node,index)=>[node,name,index,...context]),rank
,each(produce
(crop(-1),each([rank]),lift
,whether(is([simple,not(has("#text"))],"style"),each([produce
(crop(1),whether(either(has("id"),has("class")),combine
(tether(extract,["id","class","fragment"],true)
,swap("\n/*# disabled-sourceMappingURL=./jssmap?id=")
,compose(["style"],record,qualify,infer("slice",5),encodeURIComponent),swap("&fragment="),compose(search("fragment"),encodeURIComponent),swap("*/")
,extract(["id","class","fragment"])
),{}),lift,drop(1,0,css),drop(-1,0,compose(infer("concat"),["#text"],record)),merge
)])),lift
,rotate(1),combine(crop(1),tether(element))
,lift,drop(2,0,tether(append))
)),lift
)
],attribute:
[either(string,numeric,binary)
,function attach(content,field,context,namespace,language,scope)
{return append.call(scope,attribute(content,field,namespace));
}],null:
[is(null)
,produce(drop(3,2),drop(1),rotate(1),0,tether(descend),infer("forEach",destroy),drop())
],else:drop()
 })
,produce(each(["stack"]),rotate(1),drop(4,3),combine(crop(1),tether(text)),lift,tether(append)));

 export function create(type,name,namespace)
{return window?.document["create"+type+(namespace?"NS":"")](...[namespace||[],name].flat());
};

 function element({drop,sort,update=true,...value},name,index,namespace,language)
{if(is(window.EventTarget)(arguments[0]))
 return arguments[0];
 value=merge(value
,{a:{target:"_blank"}
 ,svg:{viewBox:"0 0 1 1",xmlns:namespaces.svg,"xmlns:xlink":namespaces.xlink}
 }[name],0);
 let node=is(window.EventTarget)(this)&&update&&infer.call
(qualify({[name]:value}),
(selector,index
,specified=selector.length-name.length
,nodes=buffer(descend.bind(this),constant([]))(selector,0)
)=>(update==="last"||specified)?nodes.at(-1):nodes[index]||
 specified&&descend.call(this,name,0).find(node=>
 match({id:value.id,class:value.class},demarkup(node,["id","class"])))
,index
);
 if(update==="last"&&node?.nextSibling)
 node=undefined;
 if(!node)
 node=create("Element",name,value.xmlns||namespaces[name]||namespaces[namespace]||namespace);
 if(drop)
 return node.remove(),rank([]);
 if(sort===0)
 this.prepend(node);
 return document.call(node,value,node.namespaceURI,language);
};

 function attribute(value,name,namespace)
{namespace=namespaces[name.split(":")[0]]||namespaces[namespace]||namespace;
 return Object.assign(create("Attribute",name,namespace),{value});
};

 function text(content,context)
{let precedent=Array.from(this.childNodes||[]).filter(({nodeType:type})=>type===3);
 if(precedent.length)
 return Object.assign(precedent[0],{nodeValue:content});
 return this.ownerDocument.createTextNode(content);
};

 export function append(node,...nodes)
{if(nodes.length)
 return yank([node,...nodes].map(node=>append.call(this,node)));
 if(!is(window.Node)(node))
 return;
 let attribute=node.nodeType===2;
 if(attribute)
 this[(node.specified?"set":"remove")+"Attribute"](node.name,node.value);
 if(!attribute&&!this.contains(node))
 this.appendChild(node);
 return node;
};

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
 [field,cede(whether(numeric,Number,crop(1))(node.getAttribute(field)))]));
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

 export function dataset(object)
{return object&&Object.fromEntries
(object.nodeName
?Object.entries(object.dataset).map(([key,value])=>
 [key,cede(whether(isNaN,buffer(JSON.parse,drop(1)),parseFloat)(value))])
:Object.entries(object).map(([key,value])=>["data-"+key,compound(value)?JSON.stringify(value):String(value)])
);
};

 var entrify=whether(compose(Object.values,either(compose("length",is(0)),infer("some",simple))),Object.entries,compose("",flip,index,index));
 export function qualify(node,full=true)
{// extract css selectors from node/fragment, or vice versa. 
 when(defined)(node);
 if(simple(node))
 return compose.call
(node,entrify
,([[name,{id,class:group,classed}={}]=[]])=>
[name,string(id)?"#"+id:""
,[group,classed].flat().filter(string).filter(Boolean).flatMap(group=>
 "."+group.split(" ").join(".")||[])
].flat().join("")
);
 if(string(node))
 return record(
[node.match(/^[^\[]*([#\.][^#\.\[\]]+)*/g)?.flatMap(selector=>
 selector.replace(/^[^#.]*/,"").split(".")).reduce((node,selector)=>merge(node
,{[["id","class"][selector[0]==="#"?0:1]]:
 [detext(selector.replace(/^#/,"").replace(/^'+|'+$/g,""))][selector[0]==="#"?"join":"concat"]()
 })
,{})||{}
,node.match(/\[[^=]+?=\'?.*?\'\]/g)?.reduce((node,selector)=>
 merge(node,Object.assign(Array(2).fill(undefined),selector.slice(1,-1).split("=")).reduce((attribute,value)=>(
 {[attribute]:value.replace(/^'+|'+$/g,"")})))
,{})||{}
].reduce(merge)
,node.match(/^[^#\.\[\]]+/)||[]);
 let name=node.nodeName?.toLowerCase()||"";
 let selectors=name?{id:"#",classList:"."}:{id:'#',class:'.',classed:'.'};
 let attributes=full?Array.from(node.attributes||[]).filter(({name})=>
 !["id","class","style"].includes(name.toLowerCase())&&!name.startsWith("on")&&!name.includes(":")).map(({name,value})=>
 "["+[name,value].join("='")+"']").join(""):"";
 return name+Object.entries(selectors).flatMap(([attribute,selector])=>
[attribute==="classList"?Array.from(node[attribute]):["class","className"].includes(attribute)
?node[attribute]?.split?.(' ')||[]:node[attribute]
].flat().filter(value=>
 string(value)&&value?.length).map(value=>selector+value)).join('')+attributes;
};

 export default media;

 export function media(resource,{source,...fields}={})
{if(is(window.EventTarget)(resource))
 return resource;
 if(is(ArrayBuffer)(resource))
 resource=new Uint8Array(resource);
 if(pdf(resource))
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

 export function hypertext(body,{title,icon,styles=[],scripts=[],worker="/worker/module",serviceworker="/Blik_2023_form.js/module/serviceworker/module",websocket="/relay/module",inspect=9222}={})
{if(this)
 return {imports:
 {"/Blik_2023_fragment.js":["","capture","image","canvas","insert"]
 ,"/Blik_2023_inference.js":["","infer","buffer","compose","observe"]
 ,"/Blik_2023_interface.js":["","command","socket","attach","commission"]
 ,"/Blik_2023_meta.js":["","url","path","query"]
 ,[websocket]:["actions"]
 }
 ,exports:
 {default:
 {body:
 {load(event)
{if(this!==event.target.body)
 // ignore propagated load events.
 return;
 console.info("Document content loaded.",{readyState:document.readyState,timestamp:event.timeStamp,deferred:performance.now()-event.timeStamp,resources:performance.getEntriesByType("resource").length});
 this.querySelectorAll("[data-actions]").forEach(scope=>capture.call(scope)&&
 scope.dispatchEvent(new scope.ownerDocument.defaultView.Event("contextrestored")));
 Promise.all(["interface","inference","search","fragment","meta"].map(module=>
 "/Blik_2023_"+module+".js").map(module=>import(module))).then(modules=>modules.forEach(module=>
 Object.assign(globalThis,Object.fromEntries(Object.entries(module).filter(([field])=>
 !Object.hasOwn(globalThis,field))))));
 socket(window.location.origin,window).then(socket=>
 socket.send(JSON.stringify({action:"join",room:path(window.location.href)})));;
 window.worker=commission(this.dataset.worker).then(worker=>
 window.worker=worker);
 window.serviceworker=navigator.serviceWorker.register(this.dataset.serviceworker,{type:"module",scope:"/"}).then(registration=>
 window.serviceworker=registration);
 observe.call(navigator.serviceWorker
,{controllerchange:update=>this.dispatchEvent(new MessageEvent("message",{data:{action:"message",message:"Updated — refresh to apply."},bubbles:true}))}
,{once:true});
 attach(this.dataset.inspect).catch(fail=>
 console.warn("failed to attach CDP session on port "+this.dataset.inspect,fail));
},popstate(event)
{//note(event);this.document.forms[0]?.dispatchEvent(new Event("submit"));
},async message(event)
{if(event.source)return inbound.call(this,event);
 let {data:message}=event;
 let window=this.ownerDocument.defaultView;
 if(!message.room)
 message.room=path(window.location.href);
 console.info("send",message);
 if(!window.socket||window.socket.readyState===3)
 await socket(window.location.origin,window).then(socket=>
 window.socket.send(JSON.stringify({action:"join",room:path(window.location.href)})));
 window.socket.send(JSON.stringify(message));
},beforeprint(event)
{console.log(this.querySelector("#composer"),this.querySelector("#frame"));
},afterprint(event)
{console.log(this.querySelector("#composer"),this.querySelector("#frame"));
}}
 }
 ,inbound(event)
{let message=JSON.parse(event.data);
 if(message.action!=="check")
 console.log("receive",message);
 actions[message.action]?.call(event.target.socket,message,event.target);
}}};
 let activation=
 {exports:{capture,merge,heritage,dispatch,defer,prototype,type,something,defined,simple,compound,array,string,construct,instance}
 ,procedures:function()
{window.addEventListener("beforeinstallprompt",event=>(window.installprompt=event).preventDefault());
 console.info("Document parsed.",{readyState:document.readyState,elapsed:performance.now(),scripts:document.scripts.length,images:document.images.length});
 capture.call(window.document.body);
}};
 let [link,style]=[styles].flat().reduce((nodes,style,index)=>merge(nodes
,{[index=+/{|}/.test(style)]:
[index?string(style)?{"#text":style}:style:{rel:"stylesheet",type:"text/css",href:style}
]})
,[[],[]]);
 link.push({rel:"icon",type:"image/svg+xml",href:icon||"favicon.ico"},{rel:"manifest",href:"/manifest"})
 let script=[activation,scripts].flat().flatMap(src=>
[{type:"module",defer:true}
,/^\./.test(src)?{src}:{"#text":string(src)?src:functor(src)?proceduralize(src):serialize(src,"module")}
].reduce(merge));
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
 let actions=["",name,"module",hypertext.name,"module"].join("/");
 body=merge(body,{dataset:{worker,serviceworker,websocket,inspect}});
 capture.call({body},actions);
 return {html:{lang:"en",head,body}};
};

 export function capture(module=this?.dataset.actions)
{// register events to be routed to actions scoped by selector (eg. {#form:{submit(){}}}).
 if(!module)
 return console.warn("No actions defined to capture on:",this),this;
 let fragment=this?.constructor?.name==="Object";
 let actions=fragment?[]:JSON.parse(this.dataset.actions||"[]");
 if(this)try{module=JSON.parse(module);}catch(fail){};
 if(fragment||globalThis!==globalThis.window)
 // Re-invoke on client to capture events.
 return fragment
?prune.call(this,({1:value})=>merge(value,{dataset:{actions:[module].flat()}}),0,0)
:this.dataset.actions=JSON.stringify(Array.from(new Set([actions,module].flat())))
,this;
 let scope=this===this.ownerDocument.body?this.ownerDocument.defaultView:this;
 let specifiers=new Set([module].flat());
 this.dataset.actions=JSON.stringify(Array.from(new Set([actions,module].flat())));
 let captured=capture.captured||(capture.captured=new WeakMap());
 let already=captured.get(scope)||new Set();
 if([...specifiers].every(specifier=>already.has(specifier)))
 return this;
 console.log({["Actions defined on fragment:"]:scope});
 captured.set(scope,already.union(specifiers));
 this.style.cursor="wait";
 actions=Promise.all([module].flat().map(module=>
 import(module).then(({default:module})=>module))).then(modules=>
 modules.reduce((past,next)=>merge(past,next,0),{}));
 let refer=defer.bind(actions);
 let deferred=new Set(heritage(scope).filter(event=>event.startsWith?.("on")));
 deferred=deferred.union(new Set(["focusout","focusin","message"].map(event=>"on"+event)));
 deferred=deferred.difference(new Set(
[["motion","orientation","orientationabsolute"].map(sensor=>"device"+sensor)
,["start","run","end","cancel"].map(state=>"transition"+state)
,"unhandledrejection","pagereveal","pageshow","beforeinstallprompt","unload"
].flat().map(event=>"on"+event)));
 deferred.forEach(event=>scope.addEventListener(event.slice(2),refer,{passive:false}));
 actions.then(actions=>
 new Set(Object.values(actions).flatMap(Object.keys)).forEach(event=>
 scope.addEventListener(event,dispatch.bind(actions),{passive:false}))||
 this.style.removeProperty("cursor")||
 console.groupCollapsed("\x1b[32mrouting all propagated events to actions from scope:\x1b[0m\n",{fragment:scope})||
 console.log({[this.ownerDocument.defaultView.location.origin+module]:actions})||
 console.groupEnd()).then(ready=>
 deferred.forEach(event=>scope.removeEventListener(event.slice(2),refer)));
 return this;
};

 export function dispatch(event)
{let target=event.target.document?.body||event.target.body||event.target;
 if(target.nodeType===3)target=target.parentNode;
 return Object.entries(this).flatMap(([selector,actions])=>
 [selector,actions[event.type]].reduce((selector,action)=>
 action&&[target.closest(selector),action].reduce((scope,action)=>
 scope&&[[scope,action]]))||[]).map(([scope,action])=>
 console.debug({[event.type+(event.isTrusted?" (trusted)":"")]:action,scope})||
 action.call(scope,event));
};

 export function defer(event)
{// preventdefault to block synchronous dispatch in favor of asynchronous action. Rescue event before destruction on block. 
 event.preventDefault();
 event=Object.fromEntries("type/target/keyCode/isTrusted/bubbles/srcElement/timeStamp".split("/").map(field=>
 [field,event[field]]));
 this.then(actions=>dispatch.call(actions,event));
 console.debug({["captured "+event.type+" event from"]:[event.target,event]});
};

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
 })),rank)(compound(value)?Object.entries(value):[[field,value]])
:value);
};

 export function split(text)
{return compose.call({div:{li:list(text.split("\n"))}},document,spill,lift,crop(1));
};

 export var annotate=(fields,labels)=>labels
?prune.call(fields,([field,value])=>defined(labels[field])?{label:labels[field],value}:value,0,0)
:exit("no labels passed to"+annotate.name+" fields.");

 export function field(entry)
{if(entry?.constructor?.name==="IncomingMessage")
 return {imports:
 {"/Blik_2023_interface.js":["","command","locate","digest"]
 ,"/Blik_2023_inference.js":";note;unit;merge;route;record;search;prune;spill;debug;expect;compose;combine;pass;stash;trace;drop;crop;slip;infer;tether;whether;wait;observe;buffer;swap;when;array;has;each;differ;rank;collect;is;match;basic;defined;functor;extract".split(";")
 ,"/Blik_2023_fragment.js":";* as fragment;document;form;progress;image;canvas;demarkup;insert;navigate;detransform;transform;stretch;vectorspace;error;drillresize;deselect;namespaces;keyboard;spell;expand;parse;semiotics;destroy;reference;fill;qualify;cursor;capture;css;focus;drag;list".split(";")
 ,"/Blik_2023_layout.js":["* as layout"]
 ,"/Blik_2023_meta.js":["","domain","url","cookie","query","path"]
 ,"/Blik_2023_search.js":["","unfold"]
 ,"/Blik_2024_svg.js":"* as svg"
 }
 ,exports:{default:
 {span:
 {keydown(event)
{let {target,key,keyCode,ctrlKey}=event;
 let {enter,backspace,escape,updown,leftright}=keyboard(keyCode);
 if(escape)
 return target.dispatchEvent(new Event("blur",{bubbles:true}));
 let values=this.closest("[title]").querySelector("ul");
 let selection=Array.from(values?.querySelectorAll("li.hover")||[]);
 let current=selection.at(-1);
 if(enter)
 return event.preventDefault()
,selection.length?selection.pop().click():target.dispatchEvent(new Event("submit",{bubbles:true}));
 if(values&&updown)
 return compose(infer("querySelectorAll",":scope>li"),Array.from
 ,infer("filter",li=>li.style.display!=="none")
 ,list=>list.at((list.indexOf(current)+(keyCode===38?-1:1))%list.length)
 ,pick=>[current?.classList.remove("hover"),pick?.classList.add("hover"),pick?.firstChild.scrollIntoView({block:"nearest"})]
 )(current?current.parentNode.closest("ul"):values);
 if(values&&leftright&&current)
 return keyCode===39
?["ul","ul>li"].map(node=>current.querySelector(":scope>"+node)?.classList.add("hover"))
:current.parentNode.closest("li")&&[current,current.parentNode].forEach(node=>node.classList.remove("hover"));
},focusout()
{this.closest("[title]").querySelector("ul")?.querySelectorAll("li.hover").forEach(li=>
 li.classList.remove("hover"));
}}
 ,"[role=checkbox]":
 {click({target})
{compose.call(target,{"aria-checked":this.getAttribute("aria-checked")==="false"},tether(document),spill,lift);
},keydown({keyCode,target})
{let {space}=keyboard(keyCode);
 if(!space)return;
 this.dispatchEvent(new Event("click",{bubbles:true}));
}}
 ,li:
 {click({target})
{if(target.nodeName.toLowerCase()!=="span")
 return;
 let label=this.closest("[title]");
 let input=label.querySelector("span[role=menu]");
 input.textContent=unfold.call(target.closest("li")
,li=>li.parentNode.closest("li")).filter(Boolean).map(li=>
 li.childNodes[0].textContent).reverse().join("/");
 input.dispatchEvent(new Event("blur",{bubbles:true})); 
 input.closest("[role=form]").dispatchEvent(new Event("submit",{bubbles:true}));
}}
 }}};
 let [title,value]=entry;
 [title,{label=title,value=entry[1]}]=[title,value||{}]??{};
 if(!defined(value))
 return [];
 let [text,type]=decide(merge(prune.call(
 {textbox:[string,whether(is(defined),infer(),swap(""))]
 ,checkbox:[either(binary,match(/^(true|false)$/)),undefine]
 ,menu:[basic,undefine]
 ,radio:[is(Set),undefine]
 ,time:[is(Date),"datetime",clock]
 },([type,[condition,...text]])=>
 [condition,compose(...text,type)],0,0)
,{else:unit}))(value);
 return {id:title,title,span:
[{"#text":label}
,{class:title,name:title,tabindex:"0",contenteditable:type!=="checkbox"
 ,"aria-checked":{checkbox:value}[type]
 ,role:type,"#text":text
 }
],ul:compound(value)?{li:list(value)}:type==="time"?clockwork(value):null
 ,drop:value===null
 ,dataset:{actions:["",name,"module",field.name,"module"].join("/")}
 };
};

 export function form(fields={},method)
{let groups=Object.entries(fields).filter(([field,value])=>simple(value));
 if(!method&&groups.length)
 return yank(groups.map(([method,fields])=>form.call(this,fields,method)));
 let span=Object.entries(fields).flatMap(field).map(infer(merge,{class:method}));
 let style=[{"@scope":{":scope":
 {"&>span[title]":
 {...layout.label
 ,"&>span[name]":layout.input
 ,"& ul":
 {position:"fixed",display:"none",padding:"0px","margin-bottom":"0px","margin-left":"0.6em","max-height":"100%","max-width":"100%"
 ,"z-index":"2","text-align":"left","pointer-events":"none","list-style-type":"none"
 ,"box-sizing":"border-box",width:"inherit","overflow":"scroll","white-space":"nowrap"
 ,color:"var(--abyss)","font-weight":"bold","text-shadow":Array(25).fill("var(--note) 0px 0px .25em").join()
 ,"& ul":{position:"relative",bottom:"initial","max-height":"initial","vertical-align":"top","text-align":"left"}
 ,"&:hover,&.hover":{">li":{display:"block"}}
 }
 ,"& li":
 {position:"relative",display:"inline-block","pointer-events":"all","padding-right":"1em","vertical-align":"top"
 ,margin:"auto",left:"0px",right:"0px","padding-left":"1em"
 ,"&>svg":{position:"absolute",height:"1em",left:"0px","margin-left":"0px","margin-right":"0px",transform:"scale(0.9)",fill:"var(--text)"}
 ,"&:hover,&.hover":
 {"&>span":{color:"var(--highlight)","white-space":"pre"}
 ,"&>ul":{display:"inline-block"}
 }
 }
 ,"&>ul>li":{display:"block"}
 // ,"&>span[role=list]":
 // {position:"fixed",display:"none",padding:"0px","bottom":"6em"
 // ,"max-height":"100%","max-width":"100%",overflow:"scroll"
 // ,"&>span":{margin:"0.25em 0em"}
 // }
 }
 }}}];
 return {role:"form",style,method,span};
};

 export function fill(fields)
{if(!simple(fields))
 return compose
(Array.from
,fields&&infer("filter",input=>
 input.parentNode.classList.contains(fields))
,infer("map",input=>(
 {[input.parentNode.className]:
 {[input.getAttribute("name")]:input.role==="checkbox"
?input.getAttribute("aria-checked")==="true"
:input.textContent
 }
 }))
,infer("reduce",merge)
)(this.querySelectorAll("span[contenteditable]"));
 if(fields)
 Object.entries(fields||{}).map(([field,value])=>
 [!compound(value)&&this.querySelector("[name="+field+"]"),value]).forEach(([input,value])=>
 input&&compose(tether(document),spill,lift)(input,{[input.role==="checkbox"?"aria-checked":"#text"]:value}));
 return fill.call(this,this.getAttribute("method"));
};

 // export function dispatch(form)
// {return document(
//  {"img":
//  {onload:"!function expect(){setTimeout(tick=>(typeof dispatch=='undefined'?expect:dispatch).call(this,event),500)}.call(this)"
//  ,src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
//  ,"data-subject":JSON.stringify(form)
//  ,class:"defer"
//  }
//  });
// };

 export function insert(fragment,place,target)
{// deprecated in favor of document.call(target,{fragment}) - place inferred from fragment signature. 
 if(!fragment)return target;
 let {over,before,after,under}={[place]:true};
 if(fragment instanceof Promise)
 return infer(insert)(...arguments);
 //:compose(document,infer(insert,place,target),drop(0,0,fragment,"over"),insert)(wheel);
 console.info(globalThis.window?{fragment,[place]:target}:{fragment:fragment.nodeName,[place]:target.nodeName});
 if(plural(fragment))
 return surge(each.call(fragment,function drill(fragment)
{return plural(fragment)?flush(fragment):insert(fragment,place,target);
}));
 let orphan=fragment instanceof window.DocumentFragment;
 let fragments=[orphan?Array.from(fragment.childNodes):fragment].flat();
 if(under)
 return Array.from(target.childNodes).map(child=>destroy(child))
,rank(fragments.map(fragment=>target.appendChild(fragment)));
 let [sibling,edge]=before?["previous","prepend"]:["next","appendChild"];
 let method=target[sibling+"Sibling"]?"insertBefore":edge;
 if(target.parentNode)
 target.parentNode[method](fragment.documentElement||fragment,before?target:target.nextSibling);
 if(over&&fragment!==target)
 destroy(target);
 return rank(fragments);
};

 export function throttle(fragment,progress=0)
{if(!fragment?.simulation)return fragment;
 return new Promise(resolve=>setTimeout(time=>resolve(fragment),2000)).then(fragment=>
{for(let simulation of [fragment.simulation].flat())
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
{return command.call(import.meta.url,
["/mozilla_2010_pdf_viewer_brightspace.js"
,"/mozilla_2010_pdf_link_service_brightspace.js"
,"/mozilla_2010_pdf_brightspace.js"
]).then(function([{PDFViewer},{PDFLinkService},pdf])
{pdf.default.GlobalWorkerOptions.workerSrc="/mozilla_2010_pdf_worker_brightspace.js";
 let viewer=new PDFViewer(
 {linkService:new PDFLinkService(),renderer:"svg"
 ,textLayerMode:0,disableRange:true,forceRendering:true
 ,container:compose.call({div:
 {class:"pdfjs",style:"margin:auto;height:100%;overflow:scroll;"
 ,div:{id:"viewer"}
 }},document,spill,lift,crop(1),cede)
 });
 viewer.linkService.setViewer(viewer);
 pdf.getDocument(file).promise.then(combine
(viewer.setDocument.bind(viewer)
,compose(1,"getPage",1,"getViewport",combine("width","height")
,(width,height)=>({style:{"@scope":{":scope":
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
 }}}
 }),slip(viewer.container),note,tether(document),spill,lift)
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

 export function image(source,alt,defer)
{if(/image/i.test(source?.nodeName))return source;
 let src=is(Blob)(source)?URL.createObjectURL(source):source;
 let [img]=compose(document,spill,lift)({img:{}});//crossOrigin:"anonymous"}})
 if(defer)
 return cede(spill(document.call(img,{src,alt})));
 return cede(revert((command,reject,img,src,alt)=>compose.call
(img
,{onload(){if(/^blob:/.test(this.src))URL.revokeObjectURL(this.src);command(this,...arguments);}
 ,onerror(){if(/^blob:/.test(this.src))URL.revokeObjectURL(this.src);reject(this,...arguments);}
 ,src,alt
 },Object.assign
,globalThis.window?undefined:infer("dispatchEvent",new window.Event("load"))
))(img,src,alt));
 //if(!colors[color])svg.select("circle#"+id).attr("fill",["rgb(",...new Vibrant(this).swatches()["Vibrant"].rgb].reduce((hex,hue,index)=>hex+hue+(index<2?",":")")));
};

 export function canvas(image)
{if(this)
 return {imports:
 {"/Blik_2023_inference.js":["","compose","infer"]
 ,"/Blik_2023_fragment.js":["","image","canvas","insert"]
 }
 ,exports:{default:
 {"canvas[role=img]":
 {contextrestored(event)
{let [src,alt]=["data-source","aria-label"].map(this.getAttribute.bind(this));
 compose(image,canvas,infer(insert,"over",this))(src,alt);
}}
 }}};
 let {naturalWidth:width,naturalHeight:height}=image;
 let [fragment]=compose(document,spill,lift)({canvas:
 {role:"img","aria-label":image.getAttribute("alt")
 ,width,height
 }});
 let frame=fragment.getContext("2d");
 if(!frame)
 spill(document.call(fragment
,{style:"background:repeating-linear-gradient(135deg,black,black 2px,transparent 2px,transparent 4px"
 ,dataset:
 {source:image.getAttribute("src")
 ,actions:["",name,"module",canvas.name,"module"].join("/")
 }
 }));
 else frame.drawImage(image,0,0);
 return fragment;
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

 export function rasterize(image,scale=2)
{const svgData=new XMLSerializer().serializeToString(image);
 const src="data:image/svg+xml;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(svgData)));
 return Object.assign(observe.call(new Image(),{load()
{let {naturalWidth:width,naturalHeight:height}=this;
 const canvas=document.createElement('canvas');
 [width,height]=[width,height].map(size=>size*scale);
 canvas.setAttribute('width',width);
 canvas.setAttribute('height',height);
 const context=canvas.getContext('2d');
 context.drawImage(this,0,0,width,height);
 //image.after(Object.assign(new Image(),{src:canvas.toDataURL('image/png')}))
 var link=document.createElement("a");
 link.download=image.getAttribute("title");
 link.href=canvas.toDataURL('image/png');
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
}},{once:true}),{src});
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

 export function size(node)
{return Number(window.getComputedStyle(node).fontSize.replace("px",""));
};

 export function snap()
{let {width:limitx,height:limity}=this.parentNode.getBoundingClientRect();
 let {left,top,width,height}=this.getBoundingClientRect();
 let overflow=[-left,-top,left+width-limitx,top+height-limity];
 overflow.forEach(whether(major(0),(overflow,index)=>
 this.style[index%2?"top":"left"]=Number(this.style[index%2?"top":"left"].match(/\d+/)?.[0])+overflow*(index<2||-1)+"px",infer()));
};

 export var drag=observe({point({x,y,isTrusted:click,pointerId})
{merge(this,{drag:click&&{x,y},style:{transition:"none",cursor:click?"grabbing":"grab"},control:!click||this.control?this.control?.abort():new AbortController()});
 let size=this.getBoundingClientRect();
 [x,y]=Object.entries({x:"width",y:"height"}).map(([ext,int])=>size[ext]+size[int]/2);
 let {width,height}=this.parentNode.getBoundingClientRect();
 let {margin}=this.ownerDocument.defaultView.getComputedStyle(this);
 let gap=parseFloat(margin)*2;
 let divide=[width-size.width-gap,height-size.height-gap];
 let [left,top]=[width,height].map((range,index)=>[x,y][index]<range/2);
 if(!click)
 return [transform(this.style.transform),Object.entries({right:!left,top})].reduce(({x,y},invert)=>
 merge(this.style,{transform:"translate("+invert.map(([name,state])=>
 this.classList.contains(name)!==this.classList.toggle(name,state)).map((invert,index)=>
 [x,y][index]+divide[index]*(invert?[x,y][index]<0?1:-1:0)).map(x=>Math.floor(x)+"px")+")"}))&&
 merge(this.style,{transition:"transform 1s",transform:"none"});
 observe.call(this
,{touchmove(event){if(event.cancelable)event.preventDefault();}
 ,pointermove(event)
{if(pointerId)pointerId=this.setPointerCapture(pointerId);
 let {clientX:x,clientY:y}=event;
 let [dx,dy]=[this.drag,this.drag={x,y}].reduce(({x:x0,y:y0},{x,y})=>[x-x0,y-y0]);
 [x,y]=[divide,transform(this.style.transform)].reduce(([width,height],{x,y})=>
 [x,y].map((side,index)=>
 Math[[left,top][index]?"min":"max"]
([width,height][index]*([left,top][index]||-1)
,Math[[left,top][index]?"max":"min"](0,side+[dx,dy][index])
).toFixed(1)));
 merge(this.style,{transform:"translate("+[x,y].map(side=>side+"px")+")"});
}},{signal:this.control.signal});
}});


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

 export function deselect(term){return term.replace(/[^\w-]/g,char=>"_"+char.charCodeAt(0).toString(16)+"_");};

 export async function error(path,request)
{when(is(Error))(this);
 // if(!request.headers?.referer?.endsWith(request.url))
 // return this;
 console.error(this)
 if(!request.headers?.accept?.split(",").includes("text/html"))
 return {body:this.stack,status:500};
 let style=await css({body:{background:"black",color:color.red}});
 let [report]=compose.call({div:{id:"frame",style:"white-space:pre-wrap","#text":this.stack}},"Error","/svg/animal/worm/vector",[],[style],hypertext,document,surge);
 let body=report.outerHTML;
 destroy(report);
 return {body,status:500,type:mime("html")};
};

 export function link(address,title=address,redirect)
{if(this)
 return {imports:
 {"/Blik_2023_inference.js":["","compose","each","pass","infer","record","merge"]
 ,"/Blik_2023_interface.js":["","fetch","digest"]
 ,"/Blik_2023_fragment.js":["","document","demarkup","insert","destroy"]
 }
 ,exports:
 {default:
 {"[role=link]":
 {click()
{let address=this.getAttribute("data-address");
 let {pathname,hash}=new URL(address);
 if(hash&&match(this.ownerDocument.defaultView.location,{pathname}))
 return merge(this.ownerDocument.defaultView.location,{hash});
 let redirect=this.classList.contains("redirect")?"_blank":undefined;
 if(redirect)
 return this.ownerDocument.defaultView.open(address,redirect);
 let {1:extension}=pathname.match(/\.([^\/]+)$/)||[];
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
 ,left:"100%",bottom:"0",transform:"rotate(-90deg) translateY(0.5em)"
 ,"transform-origin":"left",width:"450px"
 ,overflow:"scroll","white-space":"nowrap"
 }}}
 ,"#text":address
 }},merge)
:compose(fetch,digest,{source:address},media,["span"],record);
 return compose
(buffer
(compose(fragment,["span"],record,style,merge,document,spill,lift,crop(1),infer(insert,"after",this))
,drop()
),pass(compose(swap(this),{style:{pointerEvents:null,animation:null}},merge))
)(address);
}}
 }
 }
 };
 address=/^http/.test(address)?address:relate(address,window.location.origin+window.location.pathname);
 let {1:extension}=new URL(address).pathname.match(/\.([^\/]+)$/)||[];
 let [format]=extension&&fields(
 {audio:["mp3"],video:["mp4","webm"]
 ,img:["png","jpg","jpeg","svg","gif","webp"]
 },value=>value.includes(extension))||[];
 if(format)
 return format==="img"?image(address,title,true):{[format]:{src:address,alt:title}};
 return capture.call
({span:
 {role:"link",class:fields({redirect})
 ,style:{"@scope":
 {":scope":{color:"#0097a7",cursor:"pointer","&:hover":{"text-shadow":"0 0 8px var(--text)"}}
 ,"@keyframes glow":
 {"0%":{"text-shadow":"0 0 0 var(--text)"}
 ,"50%":{"text-shadow":"0 0 8px var(--text)"}
 ,"100%":{"text-shadow":"0 0 0 var(--text)"}
 }
 }}
 ,"data-address":address
 ,"#text":title
 }
 }
,["",name,"module",link.name,"module"].join("/")
);
};

 export function reference(title,source,layout,elements={audio:["mp3"],video:["mp4","webm"],img:["png","jpg","jpeg","svg","gif","webp"]})
{let url=/^http/.test(source)?source:[window.location.origin,source.replace(/^\/*/,"")].join("/");
 let [extension]=/[^\.]+$/.exec(new URL(url).pathname)||[];
 let tag=layout||extension&&Object.keys(elements).find(key=>
 elements[key].includes(extension))||"span";
 let target=/^#/.test(source)?"":undefined;
 return compose(document,spill,lift,crop(1))(
 {[tag]:
 {id:title.replace(" ","_"),role:"link"
 ,title:title&&source,alt:title||source
 ,href:source
 ,src:source,controls:"on",target
 ,"#text":title||source
 }
 });
};

 export function stylerules(selector)
{return Array.from(window.document.styleSheets).flatMap(({rules})=>
 Array.from(rules)).filter(({selectorText})=>selectorText?.includes(selector));
};

 export async function message({icon,name,put,comment,message=comment},{length:index}={})
{if(this)
 return {imports:
 {"/Blik_2023_inference.js":["","compose","spill","lift","observe","match","major"]
 ,"/Blik_2023_interface.js":["","fetch"]
 ,"/Blik_2023_fragment.js":["","document","memory"]
 ,"/Blik_2024_svg.js":"* as svg"
 }
 ,exports:{default:
 {".message>span:first-of-type":
 {...observe({hover({isTrusted:hover,relatedTarget})
{if(this.contains(relatedTarget))return;
 if(!hover)
 return [this.querySelector(".actions")].forEach(function remove(node){node&&remove(node.nextSibling),node?.remove();});
 let name=this.parentNode.querySelector(".name").textContent;
 let author=memory("author",match({expires:major(Date.now())}));
 if(name!==author?.name&&author?.rank!=="ranger")
 return;
 let [actions]=compose(document,spill,lift)({span:{class:"actions",style:"width:0",svg:
 {role:"button",viewBox:"0 0 448 512"
 ,...svg.effect.shadow_amber
 ,path:{d:"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"}
 }}});
 this.firstChild.after(actions);
 actions.style.width="auto";
}})
 }
 ,".message svg[role=button]":
 {async click()
{let [,resource,...source]=this.closest(".messages").dataset.source.split("/");
 let message=this.closest(".message");
 let {index}=message.dataset;
 let body=JSON.stringify({[source.join("/")]:{[index]:null}});
 let comments=await fetch("/"+resource+"?override=true",{method:"put",body});
 if(comments.status!==200)return;
 let style=message.querySelector("style");
 if(style)
 (message.nextSibling||message.previousSibling)?.append(style);
 [message.previousSibling].forEach(function decrement(node){if(!node)return;decrement(node.previousSibling);node.dataset.index-=1;});
 message.remove();
}}
 }}
 };
 return (
 {class:"message","data-index":String(index)
 ,style:{"@scope":{":scope":
 {display:"block","text-align":"left","white-space":"nowrap"
 ,...[{},layout.dropcap,{"&>span":
 {"&:first-of-type":
 {"vertical-align":"top"
 ,"& img,& svg,& canvas[role=img]":
 {...layout.material,margin:0,position:"relative","z-index":1
 ,"border-radius":"50%","background-color":"var(--isle)"
 }
 ,"&>span.actions":
 {...layout.material,margin:0,position:"absolute",display:"inline-block","margin-left":"-2.5em","padding-left":"2.5em","border-radius":"2em",background:"var(--isle)","pointer-events":"none"
 ,"&>svg":{width:"1.5em",height:"1.5em",margin:"0","pointer-events":"auto","&:hover":layout.glow.amber}
 }
 }
 ,"&>span":
 {"vertical-align":"top"
 ,"&.title":{"white-space":"nowrap","&>span":{"&.name":{"font-weight":"bold"},"&.time":{color:"var(--isle)","&:before":{content:"' '"}}}}
 ,"&:not(.title)":{display:"block","white-space":"normal"}
 }
 }}].reduce(merge)
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
 let chapters=unfold.call(fragment,compose("childNodes",Array.from)).flatMap((node,index,nodes)=>
 nodes.splice(0,Infinity,nodes.splice(0,nodes.indexOf(target)+1))).filter(node=>
 /h\d/.test(node.nodeName.toLowerCase()));
 let top=Math.min(...chapters.map(node=>Number(node.nodeName.at(-1))));
 let tree=chapters.reduce(function fold(tree,node,index,chapters)
{let depth=node.nodeName.at(-1)-top;
 let path=[tree].flatMap(function last(tree)
{let [field,value]=Object.entries(tree).at(-1)||[];
 return value?[field,last(value)].flat():[];
});
 return merge(tree,{},[path.slice(0,depth),node.textContent].flat());
},{});
 return compose.call(
 {ol:
 {li:prune.call(list(tree),([field,value])=>
 field!=="span"||!value?.["#text"]?value
:{a:
 {"#text":value["#text"]
 ,"href":"#"+detext(value["#text"])
 ,target:null
 ,style:"display:block;white-space:pre;font-weight:bold;"
 }
 })
 ,style:{"@scope":{":scope":{"list-style-type":"none",["& ul"]:{"list-style-type":"none"}}}}
 }
 },document,spill,lift,crop(1),infer(insert,"after",target));
 // target.parentNode.insertBefore(document(
 // {a:chapters.map(node=>(
 // {"#text":" ".repeat(node.nodeName.at(-1))+node.textContent
 // ,"href":"#"+encodeURIComponent(node.textContent)
 // ,target:null
 // ,style:"display:block;white-space:pre;font-weight:bold;"
 // }))
 // }),target.nextSibling);
};

 export function focus(node)
{combine.call
(unit(node.ownerDocument.defaultView.getSelection(),node.ownerDocument.createRange())
,compose(drop(1),node,node.textContent.length,combine("setStart","collapse"))
,"removeAllRanges","addRange"
);
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

 export function transform(node)
{if(!node)node="translate(0,0) scale(1)";
 let value=string(node)?{matrix:new DOMMatrixReadOnly(node)}:node.transform.baseVal.consolidate();
 if(!value)return {x:0,y:0,k:1};
 let {matrix:{a,b,c,d,e:x,f:y}}=value;
 // from private method in d3-interpolate/transform/decompose.js.
 let scaleX=Math.sqrt(a*a+b*b);
 if(scaleX)(a/=scaleX),(b/=scaleX);
 let skewX=a*c+b*d;
 if(skewX)
 c-=a*skewX,d-=b*skewX;
 const scaleY=Math.sqrt(c*c+d*d);
 if(scaleY)(c/=scaleY),(d/=scaleY),(skewX/=scaleY);
 if(a*d<b*c)[a,b,skewX,scaleX]=[-a,-b,-skewX,-scaleX];
 return {x,y,k:Math.max(scaleX,scaleY),rotate:(Math.atan2(b,a)*180)/Math.PI,skewX:(Math.atan(skewX)*180)/Math.PI,scaleX:scaleX,scaleY:scaleY}
};

 export function transition(node,style,seconds)
{return !seconds?Object.assign(node.style,style)&&node:compose
(wait((seconds+(Number(style["transition-delay"]?.replace(/[^0-9\.]/g,""))||0))*1000)
,(transition,node)=>Object.assign(node.style,{transition})&&node
)(node.style.transition
,Object.assign(node.style,{transition:Object.keys(style).map(style=>style+" "+seconds+"s").join(","),...style})&&node);
};

 export function memory(key,condition)
{// localStorage entry, self-evicting once condition (a preservation check) fails to match it.
 // no localStorage server-side (SSR) - nothing to preserve there either.
 let {localStorage}=globalThis;
 if(!localStorage)
 return undefined;
 let value=JSON.parse(localStorage.getItem(key)||"null");
 return value&&(!condition||condition(value))?value:localStorage.removeItem(key);
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
 let spelling=!recursion&&
 await expect((past,{textContent:{length:next}})=>past<next,300,2)(block.textContent.length,block);
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
 await either
(expect((block,condition)=>
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
 await lift(spill(each.call(rank(nodes),async (node,{length:index})=>
 !origin.parentNode||origin.ownerDocument.defaultView.getComputedStyle(origin).display==="none"
?undefined
:node.nodeName!=="#text"
?node.style.setProperty("visibility","visible")||spell(node,origin)
:Array.from(textcontents[index]||[]).reduce(record((symbol,index,text)=>origin.skip<2
?compose.call(symbol,wait(origin.skip?0:".:".split("").includes(text[index-1])?1000
:index%Math.floor(Math.random()*3)?index%Math.floor(Math.random()*6)?300:200:100),symbol=>node.textContent+=symbol)
:node.textContent+=text.splice(index).join(""))
,[]))));
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
{let styles=prefix&&Object.entries(style).filter(([field])=>
 field[0]!=="@");
 let rule=styles.length&&styles.reduce((rule,entry,index)=>
[rule,something(entry[1])?["",";"][Number(Boolean(index))]+(simple(entry[1])
?css(...entry.reverse())
:entry.join(":")):""
].join("")
,prefix+"{")+"}";
 let rules=Object.entries(style).filter(([field])=>
 !prefix||field[0]==="@").flatMap(([field,value])=>
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

 export function detext(text){return text.replace(/\W/g,"_");};

 export async function* parse(source,semiotics=semiotics)
{if(!semiotics)
 exit("no semiotics provided for parsing "+type(source));
 let [index,{length},syntax,last]=[-1,source,[{}]];
 for(let text of source)
{let [next,fragment]=[await semiotics[text]?.(syntax,last)||semiotics.text(text,syntax,last)].flat();
 ++index,[next,fragment].forEach((term,index)=>
 term&&syntax.splice(index,1,term));
 if(!index)
 yield {style:{"@scope":{":scope>.block":{display:"block"}}}}
 let block={"data-range":index,class:"block",update:"last"};
 if(fragment)
 last=yield stagger({span:{...block,...simple(fragment)?fragment:{fragment}}});
 if(index+1===length&&next.text)
 yield {span:{...block,span:{update:false,"#text":next.text}}};
};
};

 export var semiotics=
 // return [last,past] pair to label and yield or false to skip.
 // priority determines field to populate on last. 
 {text(text,[last={}])
{let field=Object.values(semiotics).map(({name})=>name).find(field=>defined(last[field]))||semiotics.text.name;
 let start=!field;
 if(last.tag?.length===0&&!/[\w\d]/.test(text))// untag
 field="text",text=last.title+"#"+text,merge(last,{tag:undefined,title:undefined});
 last[field]=[last[field]||"",text].join("");
 return last;
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
 simple(fragment)
?prune.call(fragment,([field,value])=>
 merge(value,{[index?"class":"id"]:id}),0,0)
:flush(...document.call(fragment,{[index?"class":"id"]:id}))
,fragment)||fragment;
}," ":function terminate([last,past])
{let parenthesized=last?.context||string(last?.style);
 if(last?.text||parenthesized)
 return;
 let [tag,address]="#@".split("").map(field=>last?.[semiotics[field].name]);
 let noise=!/[a-zA-Z]/.test([tag,address].find(Boolean));
 if(noise||!tag&&!address)
 return defined(tag??address)?[merge(last
,{text:[last.text||last.title||"",defined(tag)?"#":"@"," "].join("")
 ,style:last.style
 })]:false;
 let [text]=[tag,address].map(phrase=>phrase?.match(/[\.,\)\?:;]+$/)).find(Boolean)||[""];
 if(text)
 [tag,address]=[tag,address].map(phrase=>phrase?.slice(0,-text.length));
 let next=address
?compose(link,spill,lift,crop(1),{span:{id:detext(last.title),update:false}},merge)(address,last.title)
:Object.entries(qualify(tag)).flat().reduce((tag,qualifiers)=>({[tag]:
 {id:/h\d/.test(tag)?detext(last.title):undefined
 ,update:false
 ,"#text":last.title
 ,...qualifiers
 }}));
 return [{text:text+" "},next];
},"\n":function terminate([last,past])
{let next=this[" "](...arguments)?.[1];
 if(!next&&string(last?.text)||string(last?.context)||last?.compound||string(last?.style))
 return;
 let block=past?.class==="block"&&match({},last);
 return [{text:[last?.text||"",block?"":"\n"].join("")},next];
},"#":function tag([last,past])
{if(last.style||string(last?.link)||last?.context||last?.compound||/^{|:$/.test(last?.style)||last?.text?.endsWith(" "))
 return false;
 return this.phrase(last).reduce?.((title,text)=>
 title&&[{title,tag:""},text&&{span:{update:false,"#text":text}}])||
 [merge(last,{compose:true,tag:""})];
},"@":function link([last])
{if(last.style||last.context||last.compound||last.text?.endsWith(" "))
 return;
 return this.phrase(last)?.reduce((title,text)=>
 [{title,link:""},text&&{span:{update:false,"#text":text}}]);
},"(":function context([last])
{if(!last?.tag||last?.compound||last?.style)
 return false;
 return {context:"",action:last.tag,title:last.title};
},")":async function context([last])
{if(last?.compound||string(last.style??last.text)||match({},last))
 return false;
 let open="()".split("").map(parenthesis=>
 Array.from(last.context?.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return false;
 if(string(last?.link||last?.tag))
 return merge(this[" "](...arguments),{0:{text:")"}});
 let jsons=[...last.context?.matchAll(expressions.json)||[]].map(([json])=>json);
 let terms=(context,json)=>
[context,context.pop().split(json).reduce((before,after)=>
 "\"'`".split("").some(quote=>Array.from(before.matchAll(quote)).length%2)
?[before,json,after].join("")
:[before,...JSON.parse("["+json+"]"),after].filter(Boolean))
].flat();
 let split=([last,...context],symbol,index,{length})=>
[!last.length&&/ |,/.test(symbol)?last:last[0]===symbol
?[...index+1<length?[""]:[],last.substring(1)]
:[last+symbol]
,context
].flat();
 let context=jsons.reduce(terms,[last.context]).flatMap(term=>string(term)
?Array.from(term.replace(/(^(\n|,| +)|( +|,|\n)$)/g,"")).reduce(split,[""]).reverse()
:[term]);
 let evaluate=compose(locate.bind(window.origin),push(...context),command.bind(window.origin));
 let fragment=await compose
(buffer(evaluate,fail=>({span:{update:false,"#text":fail?.stack}}))
,each(infer(this.annotate,last.title)),cede
)(last.action);
 return [{},fragment];
},"{":function style([last,past])
{if(!last||string(last?.text)||last?.compound||string(last?.style))
 return !last||last.text?.at(-1)==="\n"?
[{style:"",block:true},{span:{update:false,"#text":last?.text||""}}
]:false;
 let next=this[" "](...arguments);
 if(next||past?.nodeName)
 return [{style:""},next?next.slice(1):[]].flat();
},"}":function style([last,past])
{if(!string(last.style)||string(last.text))
 return;
 let open="{}".split("").map(parenthesis=>
 Array.from(last.style?.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return;
 if(!last.style)
 return {};
 let next=last.block?{class:"block",update:false}:qualify(qualify(past));
 let {style,...fragment}=buffer
(compose(fragment=>"{"+fragment+"}",JSON.parse)
,compose(drop(1),["style"],record)
)(last.style);
 let stylesheet=!style&&Object.keys(fragment).length;
 if(stylesheet)
 [style,fragment]=[fragment,{}];
 fragment.style=string(style)
?[last.block?"display:block;position:relative;":"",style].join("")
:simple(style)
?{[qualify(fragment)||qualify(next)]:
 merge(prune.call(style,([field,style])=>
 /^&/.test(field)||!simple(style)?style:undefined,0,0)
,last.block&&{display:"block",position:"relative"},0)
 ,...prune.call(style,([field,style])=>
 simple(style)&&!/^&/.test(field)?style:undefined,0,0)
 }
:{};
 return [{},last.block?merge(next,fragment):prune.call(next,({1:next})=>
 simple(next)?[next,fragment,{update:"last"}].reduce(merge):next,0,0)];
},"[":function compound([last])
{if(!string(last.tag)||string(last.context)||last.compound)
 return;
 return {compound:"[",title:last.title,compose:last.compose};
},"]":async function compound([last,past],term)
{if(!last?.compound)
 return;
 let compound=[last.compound,"]"].join("");
 let open="[]".split("").map(parenthesis=>
 Array.from(compound.matchAll("\\"+parenthesis)||[]).length).reduce((open,close)=>
 close<open);
 if(open)
 return;
 let context=JSON.parse(compound.replace(/`([\s\S]*)`/,(multiline,string)=>
 // normalize multiline string quotations. 
 "\""+string.replace("\\","\\\\").replace(/\n/g,"\\n").replace(/"/g,"\\\"")+"\""));
 if(context[0]==="this"||last.compose)
 context.splice(0,last.compose?0:1,Array.from(term.querySelectorAll(qualify(past))).at(-1));
 let fragment=await compose(buffer
(compose(recompose,compose,"call")
,compose(crop(1),"stack",["span","#text"],record,{span:{update:false}},merge)
),each(infer(this.annotate,last.title)),cede)(context,import.meta.url);
 return [{},fragment];
}//,"<":function(last,...syntax){if(last.style||last.context)return;return this.text("&lt;",...arguments);}
 //,">":function(last,...syntax){if(last.style||last.context)return;return this.text("&gt;",...arguments);}
 };

 export var tests=
 {document:
 {node:
[{extend:{scope:true,context:[{div:{}}],route:[document,surge,crop(1),{span:{id:"span"}}],terms:[is(window?.HTMLDivElement,plural)],condition:"ok"}
 ,suspend:{context:[{div:{id:"div"},span:{id:"span"}}],terms:[lift,lift,is(window?.HTMLDivElement,plural,window?.HTMLSpanElement,plural)],condition:"ok"}
 ,descend:{context:[{div:{id:"div"},span:{id:"span"}}],terms:[lift,lift,lift,lift,is(window?.HTMLDivElement,window?.Attr,window?.HTMLSpanElement,window?.Attr)],condition:"ok"}
 ,disjunct:{context:rank([{span:{id:"span",a:1}},{span:{id:"span",b:2}}]),terms:[spill,lift,"outerHTML"],condition:when(is("<span id=\"span\" a=\"1\" b=\"2\"></span>"))}
 }
,{context:[{span:{id:"node","#text":"node"}}]
 ,condition:compose(surge,combine("id","textContent"),when(are("node")))
 }
,{context:[{span:{empty:undefined}}]
 ,condition:compose(surge,"outerHTML",when(is("<span></span>")))
 }
,{context:[{span:{empty:null}}]
 ,condition:compose(surge,"outerHTML",when(is("<span></span>")))
 }
],multiple:
[{context:[{span:{},div:{}}],condition:compose(surge,when(...["span","div"].map(node=>compose("nodeName","toLowerCase",is(node)))))}
,{context:[{span:[{},{}]}],terms:[surge,each(compose("nodeName","toLowerCase"))],condition:when(is("span","span"))}
,{context:[{style:[{"@scope":{}},{"@scope":{}}]}],terms:[lift,lift,flush,each(compose("nodeName","toLowerCase"))],condition:when(is("style","style"))}
],attribute:
[{scope:true
 ,context:[{span:{}}]
 ,route:[document,surge,{id:"node"}]
 ,condition:compose(surge,"id",when(is("node")))
 }
,{context:[{script:{defer:true}}]
 ,condition:compose(surge,"outerHTML",when(is("<script defer=\"true\"></script>")))
 }
],children:
 {scope:true
 ,context:[{div:{}}]
 ,route:[document,surge,{id:"node",span:{}}]
 ,condition:compose(surge,"outerHTML",when(is("<div id=\"node\"><span></span></div>")))
 }
 ,extend:
 {scope:true
 ,context:[{div:{span:{id:"a",class:"span"}}}]
 ,route:[document,surge,crop(1),{span:{class:"span","#text":"text"}}]
 ,condition:compose(surge,"outerHTML",when(is("<div><span id=\"a\" class=\"span\">text</span></div>")))
 }
 ,none:{context:[undefined],terms:[surge],condition:when(is(undefined))}
 ,language:
 {context:[{span:{"#text":{en:"node"}}},0,"en"]
 ,condition:compose(surge,"outerHTML",when(is("<span>node</span>")))
 }
 ,styled:
[{context:[{span:{style:"display:block"}}]
 ,condition:compose(surge,"outerHTML",when(is("<span style=\"display:block\"></span>")))
 }
,{context:[{span:{style:{".span":{"display":"block"}}}}]
 ,terms:[surge,"outerHTML"]
 ,condition:when(is("<span><style>.span{display:block}</style></span>"))
 }
,{context:[{span:{style:[{"@scope":{":scope":{color:"red"}},id:"composer-style",fragment:"/module/function"}]}}]
 ,terms:[surge,"outerHTML"]
 ,condition:when(is("<span><style id=\"composer-style\" fragment=\"/module/function\">@scope{:scope{color:red}}\n/*# sourceMappingURL=./jssmap?id=#composer-style&fragment=/module/function*/</style></span>"))
 }
],classed:
[{context:[{span:{class:"node"}}]
 ,condition:compose(surge,"outerHTML",when(is("<span class=\"node\"></span>")))
 }
,{context:[{span:{class:["node","span"]}}]
 ,terms:[spill,lift,"outerHTML"]
 ,condition:when(is("<span class=\"node span\"></span>"))
 }
],namespaced:
 {context:[{svg:{viewBox:"0 0 1 1"}}]
 ,condition:compose(surge,infer("getAttributeNode","viewBox"),"name",when(is("viewBox")))
 }
 ,redundant:
 {scope:true
 ,context:[{span:{id:"node",span:[{class:"first"},{class:"second"}]}}]
 ,route:[document,surge,crop(1),{id:"node",span:[{"#text":"first"},{"#text":"second"}]}]
 ,condition:compose(surge,"childNodes",rank,each(combine("className","textContent")),collect,combine(0.5,-0.5),collect,"flat",when(infer("every",(values,index)=>values.every(is(["first","second"][index])))))
 }
 ,html:
 {context:
[{html:
 {lang:"en",head:
 {title:{"#text":"Error"}
 ,meta:[{"charset":"utf-8"}]
 ,link:[{rel:"icon",type:"image/svg+xml",href:"/svg/animal/worm/vector"}]
 ,style:[{"#text":"body{background:black;color:#c62828}"}]
 ,script:[]
 }
 ,body:{center:{"#text":""}}
 }
 }
],condition:compose(surge,"nodeName",when(is("HTML")))
 }
 ,drop:
 {scope:true
 ,context:[{span:{span:{id:"a"}}}]
 ,route:[document,surge,crop(1),{span:{id:"a",drop:true}}]
 ,terms:[surge,"childNodes","length",0]
 ,condition:"equal"
 }
 ,async:
 {context:[{span:Promise.resolve({id:"a"})}]
 ,terms:[surge,crop(1),infer("getAttribute","id"),"a"]
 ,condition:"equal"
 }
 ,actions:
 {context:[{span:{dataset:{actions:"/module"}}}]
 ,terms:[spill,lift,crop(1),"outerHTML"]
 ,condition:when(is("<span data-actions=\"[&quot;/module&quot;]\"></span>"))
 }
 }
 ,list:
[{context:[{a:{b:"c",d:["e","f"]}}],terms:[
[{span:{"#text":"a"},ul:
 {li:
[{span:{"#text":"b"},ul:{li:[{span:{"#text":"c"}}]}}
,{span:{"#text":"d"},ul:{li:[{span:{"#text":"e"}},{span:{"#text":"f"}}]}}
]}
 }
]]
 ,condition:"deepEqual"
 }
],parse:
 {tag:{context:["abc A#h1 ",semiotics],terms:[lift],condition:when(...
[{style:{"@scope":{":scope>.block":{display:"block"}}}}
,{span:{class:"block",update:"last",span:{update:false,"#text":"abc "}}}
,{span:{class:"block",update:"last",h1:{update:false,id:"A","#text":"A"}}}
,{span:{class:"block",update:"last",span:{update:"last","#text":" "}}}
].map(fragment=>match(fragment)))}
 ,link:{context:["abc Author_YEAR@reference.pdf ",semiotics],terms:[collect,2],condition:when(match({span:{span:{role:"link"}}}))}
 ,image:{context:["abc Author_YEAR@image.png ",semiotics],terms:[collect,2,"span","fragment","nodeName"],condition:when(match(/img/i))}
 ,action:{context:["abc title#chart/plot([1,2]) ",semiotics],terms:[collect,2,"span","fragment","nodeName"],condition:when(match(/svg/i))}
 ,composition:{context:['abc title#[[[1,2]],"chart/plot"] ',semiotics],terms:[collect,2,"span","fragment","nodeName",/svg/i],condition:when(match)}
 ,reflow:{context:["abc\n{text-align:left}\ndef",semiotics],terms:[collect,2,"span","style","display:block;position:relative;text-align:left"],condition:"equal"}
 ,style:["@reference.pdf","#span"].map(fragment=>(
 {context:["abc A"+fragment+"{width:0px;filter:invert(1)} ",semiotics]
 ,terms:[collect,3,"span","span","style","width:0px;filter:invert(1)"]
 ,condition:"equal"
 }))
 ,stylerule:{context:["A@image.png{width:100%} ",semiotics],terms:[collect,2,"span","img","style",string],condition:"ok"}
 ,stylesheet:{context:['A@image.png{"style":{"@scope":{":scope":{"width":"100%"}},"h2":{"margin":0}}}',semiotics],terms:[collect,2,search(["span","img","style","@scope"]),simple],condition:"ok"}
 ,mixed:{context:["abc\nA@reference.pdf\ndef\n{text-align:left}\nghi",semiotics],terms:[collect,"length",6],condition:"equal"}
 ,noise:{context:["abc\n{text-align:left}\ndef\ng={h:1};",semiotics],terms:[collect,3,"span","span","span","#text","def\ng={h:1};"],condition:"equal"}
 }
 ,css:
[{context:[{".span":{"display":"block"}}],condition:when(is(".span{display:block}"))}
,{context:[{".a":{color:"red","&:hover":{color:"blue"}}}],condition:when(is(".a{color:red;&:hover{color:blue}}"))}
,{context:[{".a":{color:"red","&:hover,&.hover":{color:"blue"}}}],condition:when(is(".a{color:red;&:hover,&.hover{color:blue}}"))}
,{context:[{"@scope":{":scope":{color:"red","&:hover":{color:"blue"}}}}],condition:when(is("@scope{:scope{color:red;&:hover{color:blue}}}"))}
,{context:[{toolbar:{"&>span":{"&.title":{"white-space":"nowrap"},"&:not(.title)":{display:"block"}}}}],condition:when(is("toolbar{&>span{&.title{white-space:nowrap};&:not(.title){display:block}}}"))}
]
 };
