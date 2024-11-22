 import {locate,resolve,modularise,agent,virtual,window,jsdom,fetch,digest} from "./Blik_2023_interface.js";
 import {note,wait,observe,provide,collect,slip,infer,either,each,pass,tether,buffer,differ,compose,revert,record,combine,wether,swap,compound,something,string,basic,functor,defined,simple,exit,route,drop,crop,same,major,binary,is,not,array,pdflike,when,expect,generator,clock} from "./Blik_2023_inference.js";
 import {search,merge,prune,extract} from "./Blik_2023_search.js";
 import {serialize,proceduralize,mime,data} from "./Blik_2023_meta.js";
 import layout,{color} from "./Blik_2023_layout.js";
 import syndication from "./Blik_2024_syndication.js";
 // var [jss,...plugins]=await resolve(["","nested","extend","global"].map(plugin=>
 // ["./Isonen_2014_jss",plugin].filter(Boolean).join("_")+".js")).then(modules=>
 // modules.map(module=>module.default||module));
 if(!window&&!virtual)
 // tests require a browser ready. 
 await jsdom("http://localhost:80/");

 export function document(source,namespace,language)
{if(this?.nodeName)
 return (source.nodeName?[source]:(Symbol.iterator in source)?Array.from(source):Object.entries(source)).reduce((node,entry)=>(entry.nodeName
?!node.nodeName
?node[entry.nodeName]=entry.nodeValue
:node.appendChild(entry)
:entry.reduce((qualifier,value)=>value&&Object.keys(value).some(isNaN)
?compose
(infer("concat",node.nodeName?Array.from(node.childNodes).filter(({nodeName})=>RegExp(nodeName,"i").test(qualifier)):node[qualifier])
,infer("map",compose(crop(1),value,tether(document)))
)([])
:!node.nodeName
?node[qualifier]=value
:node[(value??false)&&"setAttribute"+(qualifier.split(":")[1]?"NS":"")||"removeAttribute"](...
[qualifier.split(":").reduce((namespace,name)=>
 [namespaces[namespace],qualifier])
].flat(),value)),node)
,this);
 if(source.nodeName||["NodeList"].includes(source.constructor?.name)||string(source))
 return source.nodeName?source:string(source)?window.document.createTextNode(source)
:window.document.createRange().createContextualFragment(language
?[source.match(new RegExp("#"+language+"(.*)#"+language))||[],source].reduce((match,source)=>match[1]||source)
:source);
 let [fragment,...nodes]=Object.entries(source||{}).reduce(function([fragment,...nodes],[name,value])
{if(!value)return [fragment,...nodes];
 if(functor(value))
 value=value.call(source);
 let {textnode,dataset}={textnode:name=="#text",dataset:name=="dataset"};
 if(textnode)
 value=!string(value)?value[language]||Object.values(value)[0]:value;
 if(dataset)
 return [fragment,...nodes,...Object.entries(metamarkup(value))];
 let child=textnode||value.nodeName;
 if(child)
 return [fragment.appendChild(document(value,namespace,language))&&fragment,...nodes];
 let attribute=["string","number","boolean"].includes(typeof value);
 if(attribute)
 return [fragment,...nodes,[name,value]];
 let classlist=name==="class"&&array(value);
 if(classlist)
 return [fragment,...nodes,[name,value.join(" ")]];
 let defaults=
 {a:{target:"_blank"}
 ,svg:{viewBox:"0 0 1 1",xmlns:namespaces.svg,"xmlns:xlink":namespaces.xlink}
 }[name];
 let children=[value].flat().filter(Boolean).map(value=>
 merge(value,defaults,0)).map(buffer(function(value)
{let qualifier=value.xmlns?name:[name,namespace].find(qualifier=>namespaces[qualifier]);
 let specification=namespaces[qualifier]||value.xmlns;
 let suffix=specification?"NS":"";
 let node=window.document["createElement"+suffix](...[specification,name].filter(Boolean));
 let fragment=document(value,qualifier,language);
 document.call(node,fragment);
 return node;
},fail=>fail.stack));
 fragment.append(...children);
 return [fragment,...nodes];
},[new window.DocumentFragment()]);
 fragment=fragment.childNodes.length==1?fragment.firstChild:fragment;
 return nodes.length?provide([fragment,...nodes]):fragment;
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
 [field,compose(infer("getAttribute",field),wether(isNaN,crop(1),Number))(node)]));
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
?Object.entries(object.dataset).map(([key,value])=>[key,isNaN(value)?JSON.parse(value):Number(value)])
:Object.entries(object).map(([key,value])=>["data-"+key,isNaN(value)?JSON.stringify(value):String(value)])
);
};

 export function list(value)
{return prune.call([value].flat(),([field,value])=>!["ul","li","#text"].includes(field)
?compose(infer("map",([field,value],index)=>(
 {"#text":field==index&&string(value)?value:field
 ,ul:value&&(compound(value)||field!=index)?{li:[value]}:undefined
 })),provide)(compound(value)?Object.entries(value):[[field,value]])
:value);
};

 function tag(labels,id)
{return !string(id)?id:compound(labels[id])?labels[id]:(labels[id]&&labels[id][0]==="<")
?{"#text":labels[id]}:{"#text":string(labels[id])?labels[id]:id};
};

 export function form(fields={},labels)
{let group=Object.entries(fields).reduce((group,[key,value],index)=>
 typeof value=="object"&&!Array.isArray(value)&&!index&&key,false);
 if(group)
 fields=fields[group];
 if(!labels)
 labels=this?.dataset?.labels&&JSON.parse(this.dataset.labels)||{};
 let label=Object.entries(fields).map(([id,value])=>
{if(!defined(value))return;
 let type=wether([is(Date),is(Set),either(array,compound),either(binary,infer("match",/^(true|false)$/))]
,...["date","radio","select","checkbox","text"].map(type=>swap(type)))(value);
 return JSON.parse(JSON.stringify(
 {for:id,title:id
 ,class:[group,type,{checkbox:value?"checked":""}[type]].filter(Boolean).join(" ")||undefined
 ,span:
[defined(value)
?{role:"input",contenteditable:true,id,name:id
 ,type:["select","date"].includes(type)?"text":type
 ,"#text":type==="checkbox"?String(value)==="true":(type==="date")?clock(value,"datetime"):(type==="text"&&value&&String(value))||
 (array(value)?value[0]:compound(value)?Object.keys(value)[0]:value)
 ,checked:{checkbox:value?value.toString():undefined}[type]
 ,autocomplete:"off"
 }:undefined
,tag(labels,functor(labels?.[id])?labels[id](value):id)
],ul:type!=="text"?type==="date"?clockwork(value):{li:list(value)}:undefined
 }));
});
 if(this)
 label.filter(Boolean).map(label=>
{let input=this.querySelector("span[name="+label.for+"]");
 if(!label.span)
 input?.parentNode.childNodes.forEach(node=>
 label[node.nodeName.toLowerCase()]=node);
 let past=input?.textContent;
 if(something(past))
 label.span[0]["#text"]=past;
 let elements=this.querySelectorAll("span[role=input]");
 let reference=input?.closest("label")||
 Array.from(elements).reverse().find(input=>input.closest("label"))?.closest("label")||
 this.lastChild;
 let entry=document({label});
 insert(entry,input?"over":"after",reference);
 if(label.span.type=="text")
 this.querySelector("[name="+label.for+"]")?.dispatchEvent(new window.Event("input",{bubbles:true}));
 return [Array.from(entry.parentNode.children).indexOf(entry),entry];
}).forEach(([order,node],index,labels)=>node.parentNode.insertBefore(node
,labels.slice(index+1).find(([next])=>next<order)?.[1]||node.nextSibling));
 return {label};
};

 export function fill(fields)
{if(!simple(fields))
 return compose(Array.from
,infer("filter",input=>!fields||input.parentNode.classList.contains(fields))
,infer("map",input=>[input.getAttribute("name"),input.textContent])
,Object.fromEntries)(this.querySelectorAll("span[role=input]"));
 if(fields)
 Object.entries(fields||{}).filter(([field,value])=>
 !compound(value)&&this.querySelector("[name="+field+"]")).forEach(([field,value])=>
 this.querySelector("span[name="+field+"]").textContent=value);
 return fill.call(this,this.getAttribute("method"));
};

 export function profile(resource)
{let source=basic(resource)&&{source:resource};
 let fragment={fragment:"media",script:null,chart:"plot",network:null};
 return {...source,fragment};
};

 export async function transform(resource,{fragment,incumbent,...fields})
{let [module,feature]=await locate(fragment);
 let fail=compose(crop(1),note.bind(1),"message",document);
 return buffer(resolve,fail)(module,feature,resource,fields,incumbent||window);
};

 export function media(resource,{incumbent,source,...fields}={})
{if(pdflike(resource))
 return print(resource);
 if(resource instanceof ArrayBuffer||resource.constructor.name==="Buffer")
 resource=new TextDecoder("utf-8").decode(new Uint8Array(resource));
 return simple(resource)
?document({span:{style:"white-space:pre;","#text":JSON.stringify(resource,null,2)}})
:resource.startsWith("<")
?window.document.createRange().createContextualFragment(resource)
:parse(resource,semiotics);
};

 export function defer(form)
{return document(
 {"img":
 {onload:"!function expect(){setTimeout(tick=>(typeof dispatch=='undefined'?expect:dispatch).call(this,event),500)}.call(this)"
 ,src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
 ,"data-subject":JSON.stringify(form)
 ,class:"defer"
 }
 });
};

 export function reference(title,source,layout,elements={audio:["mp3"],video:["mp4","webm"],img:["png","jpg","svg","gif"]})
{let url=/^http/.test(source)?source:[window.location.origin,source.replace(/^\/*/,"")].join("/");
 let [extension]=/[^\.]+$/.exec(new URL(url).pathname)||[];
 let tag=layout||extension&&Object.keys(elements).find(key=>
 elements[key].includes(extension))||"a";
 let target=/^#/.test(source)?"":undefined;
 return document(
 {[tag]:
 {id:title,class:"reference",title,alt:title||source,href:source,src:source,controls:"on",target
 ,"#text":(title||source).replace(/_/g," ")
 }
 });
};

 export function hypertext(body,title,favicon,scripts,styles=[])
{scripts=[scripts].flat().filter(actions=>!compound(actions)||!activate(body,actions));
 let script=[scripts.map(src=>
[typeof src==="function"?{"#text":proceduralize(src)}:/^\./.test(src)?{src}:{"#text":src}
,{type:"module",defer:true}
].reduce(merge)),body.script||[]].flat();
 let [link,style]=[styles].flat().reduce((nodes,style,index)=>
 nodes[index=+/{|}/.test(style)].push(index?{"#text":style}:{rel:"stylesheet",type:"text/css",href:style})&&nodes
,[[],[]]);
 link.push({rel:"icon",type:"image/svg+xml",href:favicon||"favicon.ico"})
 return {html:
 {head:
 {title:{"#text":title}
 //,"base":{"href":"/"}
 ,meta:
[{charset:"utf-8"}
,{"http-equiv":"content-language",content:"en-us"}
,{"http-equiv":"Content-Type",content:"text/html;charset=UTF-8"}
,{name:"theme-color",content:"#000000"}
,{name:"description",content:""}
,{name:"viewport",content:"width=device-width, initial-scale=1"}
],link,style,script
//,{"#text":"setInterval(done=>fetch('/authority',{method:'POST',headers:sessionStorage.getItem('authority')}).then(done=>console.log(done)),1000*60)"}
 }
 ,body
 }      };
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

 export function qualify(node)
{// extract css selectors from node/fragment, or vice versa. 
 when(defined)(node);
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
 "["+[name,value].join("=")+"]").join("");
 return name+Object.entries(selectors).flatMap(([attribute,selector])=>
 [attribute==="classList"?Array.from(node[attribute]):node[attribute]].flat().filter(value=>
 value?.length).flatMap(value=>
 value.split(' ').map(value=>selector+value))).join('')+attributes;
};

 export function print(file)
{return resolve(
["./mozilla_2010_pdf_viewer_brightspace.js"
,"./mozilla_2010_pdf_link_service_brightspace.js"
,"./mozilla_2010_pdf_brightspace.js"
]).then(function([{PDFViewer},{PDFLinkService},pdf])
{pdf.default.GlobalWorkerOptions.workerSrc="mozilla_2010_pdf_worker_brightspace.js";
 let viewer=new PDFViewer(
 {linkService:new PDFLinkService(),renderer:"svg"
 ,textLayerMode:0,disableRange:true,forceRendering:true
 ,container:document({div:
 {class:"pdfjs",style:"margin:auto;width:90vw;height:670px;overflow:scroll;"
 ,div:{id:"viewer"}
 }})
 });
 viewer.linkService.setViewer(viewer);
 pdf.getDocument(file).promise.then(combine
(viewer.setDocument.bind(viewer)
,compose(1,"getPage",1,"getViewport",combine("width","height"),note
,(width,height)=>viewer.container.append(document({style:{"#text":css(
 {"div.pdfjs":
 {"&:hover":{transform:"scale(1.1)"}
 ,"&>div#viewer":
 {width:"100%",height:"100%"
 ,"&>div.page":
 {margin:"auto",width:"100% !important",height:"unset !important","aspect-ratio":width/height
 ,"background-image":"url('icon/blackboard.png')"
 ,"&>.loadingIcon":{content:"",fill:"red","border-radius":"50%",width:"20px",height:"20px"}
 ,"&~div.page>div.canvasWrapper>svg image":{opacity:0.3}
 ,"&>div.canvasWrapper":
 {width:"unset !important",height:"unset !important"
 ,"&>svg":{width:"100% !important",height:"auto !important"}
 ,"&>svg tspan":{fill:"var(--text,#dbd1b4)"}
 ,"&>svg image":{opacity:0.3}
 ,"&>svg path":{fill:"rgba(33,33,33,0.533)"}
 }
 }
 }
 }
 })}})))
));
 return viewer.container;
});
};

 export function image(src,alt)
{if(/image/i.test(src.nodeName))return src;
 return new Promise((resolve,reject)=>
 compose.call(document({img:{crossOrigin:"anonymous"}})
,{onload(){resolve(this);}
 ,onerror:reject
 ,src,alt
 },Object.assign,globalThis.window?undefined:infer("dispatchEvent",new window.Event("load"))));
 //if(!colors[color])svg.select("circle#"+id).attr("fill",["rgb(",...new Vibrant(this).swatches()["Vibrant"].rgb].reduce((hex,hue,index)=>hex+hue+(index<2?",":")")));
};

 export function canvas(image)
{let canvas=document({canvas:
 {role:"img","aria-label":image.getAttribute("alt")
 ,width:image.naturalWidth,height:image.naturalHeight
 }});
 canvas.getContext("2d")?.drawImage(image,0,0)||
 compose(tether(document),{canvas:{load:null}},activate)(canvas,{"data-source":image.getAttribute("src")});
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
 overflow.forEach(wether(major(0),(overflow,index)=>
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

 export async function error(request)
{when(is(Error))(this);
 let style=await css({body:{background:"black",color:color.red},"div#frame":layout.middle});
 let report=compose.call({center:{"#text":this.stack}},"Error","/svg/worm/document",[],[style],hypertext,document);
 let body=report.outerHTML;
 report.innerHTML="";
 return {body,status:500,type:mime("html")};
};

 export async function consume([source,common],index)
{return compose
(buffer(compose(fetch,"json"),fail=>({fail}))
,feed=>({common,source,...feed})
)(source);
};

 export function syndicate({source,common,...feed})
{return either("items","posts","data",swap([]))(feed).map(next=>
 Object.assign(next
,{author:next.author?.name||common?.author?.name||source.substring(0,source.search(/_\d\d/)).replace("_"," & ")
 ,avatar:common?.icon||next.avatar||next.author?.avatar_URL||feed.feed?.image
 ,post:either("createdTime","pubDate","created_time","date",swap(0))(next)||
 next.source?.substring(next.source.search(/_\d\d/)+1,next.source?.search(/\d\d_/)+2).split("").map((digit,index,date)=>{if([3,6].includes(index))date.splice(index+1,0,"-");return digit}).join("")
 ,source:next.id||next.site_ID||next.source
 ,title:next.title||next.message||next.source?.substring(next.source?.search(/\d\d_/)+3).replace(/\.txt/g,"").replace(/_/g," ")
 ,content:next.content
 ,media:next.enclosure&&next.enclosure.link
 }));
};

 export async function feed({name,icon,pub,sub},{source})
{let items=Object.entries(pub).map(([source,common])=>({source,common}))
 let feed=await compose.call
({source:source+"/pub",feed:{image:icon},items,common:{icon,author:{name}}}
,combine(author,compose(each(syndicate)
,collect,"flat"
,infer("sort",({post:past},{post:next})=>new Date(next)-new Date(past)),"reverse"
,provide,each(article)))
,collect,"flat",infer("reduce",compose(pass("appendChild"),crop(1)))
);
 let peer=document({div:
 {...await compose(Object.entries,provide,each(consume),each(author),collect)(sub)
 }});
 return [feed,peer].flat();
};

 async function author({source,common,...feed},index)
{let src=common?.icon||feed?.feed?.image;
 let material=prune.call(layout.material,([field,value],{length})=>
 field==="&:hover"?{...value,animation:"blink .5s ease-out"}:value);
 return document(
 {span:
 {class:"feed",source:common?.source||source
 ,style:index?undefined:{"#text":css(
 {"@keyframes blink":{"0%":{"box-shadow":"black 0 0 10px"},"33%":{"box-shadow":"var(--text) 0 0 10px"},"66%":{"box-shadow":"black 0 0 10px"},"100%":{"box-shadow":"revert-layer"}}
 ,".feed":
 {...material,display:"inline-block","vertical-align":"middle"
 ,"max-width":"20em",transition:".3s",background:"#202020","border-radius":"1.5em"
 ,position:"relative"
 }
 })}
 ,span:
 {class:"title",style:index?undefined:{"#text":css({".feed .title":
 {display:"block",cursor:"pointer",padding:"0.5em","text-align":"center"
 ,"&>span":
 {"white-space":"pre-wrap",color:"var(--note)"
 ,"&:first-of-type":{color:"var(--text)","&:hover":layout.text.glow,"&+span":{display:"block","text-align":"left"}}
 }
 ,"& canvas":{width:"2em",height:"2em","border-radius":"1em","vertical-align":"middle","&+span:before":{content:"' '"}}
 ,"& span[role=link]":{display:"block","text-align":"right",color:"var(--note)","font-style":"italic","&:hover":layout.text.glow,"&:before":{content:"' - '"}}
 }})}
 ,span:await 
[common?.author?.name||common?.title||feed?.feed?.author||feed?.feed?.title,feed?.feed?.description||common?.description].reduce(async(author,description)=>
[{class:"author"
 ,canvas:src&&await buffer(compose(image,canvas),swap(undefined))(src)
 ,span:{"#text":author?.replace(/&amp;/g,match=>({"&amp;":"&"}[match]))}
 }
,author!==description&&description&&
 {class:"spell"
 ,"#text":description,style:"display:none"
 ,link:await compose(address=>link&&link(address),pass(activate,"./actions"))(feed?.feed?.link)
 }
].flat())
 }
 }
 });
};

 export function link(source,title)
{return document({span:{role:"link",source,"#text":title||source}});
};

 export async function article(item,index)
{return document(
 {style:index?undefined:
 {"#text":await css({".article":
 {color:"#b71c1c",display:"block","white-space":"pre-wrap",cursor:"pointer",padding:"0.5em"
 ,"&>img":{"border-radius":"50%",height:"1em","vertical-align":"bottom"}
 ,"&>span":{color:"var(--text)",display:"block"}
 ,"&:hover>span":layout.text.glow
 ,"&+span":{"text-align":"left","& img":{"max-width":"100%",height:"auto"},"& audio":layout.audio}
 }})
 }
 ,span:
 {span:
 {class:"article",source:item.source,platform:item.platform,index:String(index)
 ,img:{title:item.author,src:item.avatar}
 ,"#text":" "+(item.post?clock(new Date(item.post),"date"):item.name.substring(5,13))
 ,span:{"#text":item.title+"\n"}
 }
 }
 });
};

 export async function featurefacebook()
{let module=await import("//connect.facebook.net/en_US/sdk.js");
 let {default:svg}=await resolve("/Blik_2020_svg.json");
 let {default:awesome}=await resolve("/blessochampion_2019_awesomesvgs.json");
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
 resolve(facebook)
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

 export function activate(fragment,actions,path=[])
{// dispose actions on node/fragment to event listeners. 
 if(!actions)
 return fragment;
 if(string(actions))
 return import(actions).then(({default:actions})=>activate(fragment,actions));
 let node=fragment instanceof window.DocumentFragment
?Array.from(fragment.childNodes)
:fragment.nodeName
?[fragment]
:fragment;
 let dispatch=proceduralize(function(){dispatch.call(this,event)});
 let nodes=Object.entries(node).flatMap(([nodename,node])=>
 [node].flat().filter(compound).map(node=>compose
(tether(select)
,Object.keys
,infer("map",event=>["on"+event,dispatch])
,Object.fromEntries
,node
,(events,node)=>document.call(node,events)
,node=>node.childNodes?Array.from(node.childNodes):node
)(node,actions)
));
 nodes.forEach(infer(activate,actions,path.concat(node?.nodeName)));
 return fragment;
};

 export function keyboard(code)
{let [key]=Object.entries({enter:13,escape:27,space:32,leftright:[37,39],updown:[38,40]}).find(({1:codes})=>
 [codes].flat().includes(code))||[];
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

 export function focus(node)
{combine
(compose(drop(1),node,node.textContent.length,combine("setStart","collapse"))
,"removeAllRanges","addRange"
)(node.ownerDocument.defaultView.getSelection(),node.ownerDocument.createRange());
};

 export function expose()
{// route events to disposed actions. 
 let window=globalThis;
 var {protocol,host}=window.location;
 let socket=["ws",/s/.test(protocol)?"s":"","://",host].join("");
 Object.assign(window
,{worker:import("/Blik_2023_interface.js").then(({delegate})=>delegate("/worker")).then(worker=>
 Object.assign(window,{worker})).catch(fail=>
 Object.assign(window,{worker:console.warn("Worker not available at /worker.")}))
 ,socket:Object.assign(new WebSocket(socket),{onmessage(event)
{let message=JSON.parse(event.data);
 console.log("receive",message);
 peer[message.action]?.call(this,message,window);
}})
 ,dispatch(){/*deprecated*/}
//  ,dispatch(event,buffering)
// {if(!select||!actions)
//  // asynchronizing event dispatch unblocks its synchronous default. 
//  return buffering||event.defaultPrevented||event.preventDefault()||
//  console.warn("buffering "+event.type+" event on",this)
// ,setTimeout(window.dispatch.bind(this,event,true),500);
//  console.info({[event.type]:event.target,scope:this});
//  let scope=select.call(this,actions);
//  let action=event.type.replace(/[A-Z]+/g,match=>match.slice(-1).toLowerCase());
//  scope[action]?.call(this,event);
 });
 var {actions}=import("/actions").then(module=>report(actions=module.default));
 //var {select}=import("/Blik_2023_fragment.js").then(module=>select=module.select);
 var {peer}=import("/peer").then(module=>peer=module);
 Promise.all(["/Blik_2023_interface.js","/Blik_2023_inference.js","/Blik_2023_search.js","/Blik_2023_fragment.js"].map(module=>
 import(module))).then(([{resolve},{provide,collect,infer,compose,match,is},{merge},{css}])=>
 Object.assign(window,{resolve,provide,collect,infer,compose,match,is,merge,css}));
 let exclusion=
[["motion","orientation"].map(sensor=>"device"+sensor)
,["start","run","end","cancel"].map(state=>"transition"+state)
].flat().map(event=>"on"+event);
 let events=Object.keys(window).filter(event=>
 event.startsWith("on")&&!exclusion.includes(event)).map(event=>
 event.replace(/^on/,""));
 events.forEach(event=>window.addEventListener(event,dispatch));
 function dispatch(event,buffering)
{if(!actions)
 // asynchronizing event dispatch unblocks its synchronous default unless prevented. 
 return setTimeout(dispatch.bind(this,event,true),500)&&
 buffering||event.defaultPrevented||event.preventDefault()||console.warn(
 {["waiting for actions to dispatch "+event.type+" event from"]:event.target});
 let target=event.target.document?.body||event.target.body||event.target;
 let scopes=Object.entries(actions).filter(([selector,actions])=>
 actions[event.type]&&target.closest(selector));
 scopes.map(([selector,actions])=>
 [target.closest(selector),actions[event.type]]).forEach(([scope,action])=>
 console.log({[event.type]:target,scope})||
 action.call(scope,event));
};
 function report(actions)
{console.groupCollapsed("routing all propagated events to actions by scoped selector");
 console.log(Object.fromEntries(Object.entries(actions).map(([selector,actions])=>[selector,Object.keys(actions)])));
 console.log(events.sort().join(" "));
 console.groupEnd();
};
};

 export function dispose(){if(globalThis.window)Object.assign(window.actions,actions);}

 export async function navigate(node,sibling)
{let path=window.location.pathname.replace(/[a-zA-Z0-9]*\/$/,match=>!node||sibling?"":match)+(node?node+"/":"");
 window.history.pushState({path},null,path);
 window.dispatchEvent(new window.PopStateEvent("popstate",{path}));
};

 export function retreat(){return window.location=window.location.pathname.split("/").filter(Boolean).slice(0,-1).join("/")+"/";}

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
 let {source,title,src}=demarkup(this,["source","title","src"]);
 if(/^#/.test(src))
 return;
 event.preventDefault();
 source===title
?insert(document(source),"under",this)&&this.removeAttribute('source')
:collect(each.call((/^http/.test(src)
?compose(["iframe","src"],record,{a:{href:src,"#text":src,style:"position:absolute;left:51vw;bottom:1em;transform:rotate(-90deg);transform-origin:left;width:460px;overflow:scroll;white-space:nowrap"}},merge,document)
:compose(fetch,digest,{source:src},transform,["div"],record,document))(src)
,compose(pass(compose("childNodes",0,{style:"display:block;width:80%;height:470px;margin:auto;border-radius:15px;"},note,tether(document)))
,note,fragment=>compose.call(fragment,"under",this,insert,"parentNode",{source:title},tether(document)))));
};

 export async function spell(block,recursion)
{if(recursion&&!recursion.nodeName)
 exit(Error("recursion argument of "+spell.name+" passed externally: "+typeof recursion));
 let spelling=!recursion&&await expect((past,{textContent:{length:next}})=>
 past<next,300,2)(block.textContent.length,block);
 if(spelling)
 return block.skip=2,block;
 let nodes=Array.from(block.childNodes).filter(node=>node.nodeName?.toLowerCase()!=="style");
 let textcontents=nodes.map(node=>node.nodeName==="#text"
?[node.textContent,node.textContent=""][0]
:node.style.setProperty("visibility","collapse"));
 if(!recursion)
{let expanded=block.ownerDocument.defaultView.getComputedStyle(block).display!=="none";
 let display=expanded?"none":"";
 let {rules,ownerNode:style}=Array.from(block.ownerDocument.styleSheets).find(({ownerNode:style})=>style?.parentNode===block)||{};
 // let rule=rules&&select.call(block,Object.fromEntries(Array.from(rules).map(rule=>
 // [rule.selectorText,rule])));
 !style
?block.style.setProperty("display",display)
:Object.entries({textContent:style/*,cssText:rule*/}).forEach(([field,node])=>
 node[field]=node[field].replace(/display:[^;]+/,"display: "+display));
 await either(expect((block,condition)=>
 // internal scoped style tags may not obey being no browser standard. 
 condition(is("none"))(block.ownerDocument.defaultView.getComputedStyle(block).display)
,500,2)
,fail=>exit(Error("updating non-standard internal scoped style tag failed."))
)(block,display==="none"?is:not);
 if(expanded||spelling)return;
 block.skip=0;
 block.onclick=function(){if("skip" in this)this.skip+=1;};
};
 let origin=recursion||block;
 await collect(each.call(provide(nodes),async (node,index)=>
 !origin.parentNode||origin.ownerDocument.defaultView.getComputedStyle(origin)==="none"
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

 export var namespaces=
 {xml:"http://www.w3.org/XML/1998/namespace"
 ,xlink:"http://www.w3.org/1999/xlink"
 ,xmlns:"http://www.w3.org/2000/xmlns/"
 ,xhtml:"http://www.w3.org/1999/xhtml"
 ,svg:"http://www.w3.org/2000/svg"
 };

 export function stylesheet(style,global=true)
{return jss.use(...plugins.map(plugin=>plugin())).createStyleSheet(global?{"@global":style}:style).toString().replace(/^([^\{]+) \{/g,"$1{").replace(/([\{;])\n *([\w\}])/g,"$1$2");
};

 export function css(style,prefix="")
{let rule=prefix&&Object.entries(style).filter(([field])=>
 !field.startsWith("&")).reduce((rule,entry,index)=>
 [rule,something(entry[1])?simple(entry[1])
?[""," "][Number(Boolean(index))]+css(...entry.reverse())
:["",";"][Number(Boolean(index))]+entry.join(":"):""].join("")
,prefix+"{")+"}";
 let rules=Object.entries(style).filter(([field])=>
 !prefix||field.startsWith("&")).flatMap(([field,value])=>
 field.split(",").flatMap(field=>[value].flat().map(value=>[field,value]))).filter(({1:value})=>
 simple(value)).map(([field,value])=>
 css(value,prefix+field.replace(/^&/,"")));
 return [rule,rules].filter(Boolean).flat().join("\n");
};

 export function parse(text,semiotics)
{if(!semiotics)
 exit("no semiotics provided for parsing text");
 return each.call(provide(Array.from(text)),async function* interpret(text,index,length,syntax)
{let fragments=await semiotics[text]?.(...syntax)||
 semiotics.text(text,...syntax);
 fragments=fragments.flat();
 let past=fragments.findIndex(fragment=>syntax.includes(fragment));
 let last=index+1===length;
 if(!past&&!last)return;
 Object.assign(syntax,fragments);
 let next=fragments.slice(0,past<0?undefined:past).filter(fragment=>!simple(fragment)).reverse();
 if(!next.length)
 if(last)
 next=[document({span:{"#text":fragments[0].text}})];
 else return;
 let block=fragments.find(fragment=>fragment?.classList?.contains("inline"));
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
 let style=[last,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 if(last.tag?.length===0&&!/[\w\d]/.test(text))
 return [{text:last.title+"#"+text,style},...syntax];
 if(start)
 return [{text,style},last,...syntax];
 last[field]=[last[field]||"",text].join("");
 return [last,...syntax];
},phrase(last)
{if(!last?.text)
 return last;
 let {text}=last;
 let parenthesized=text.endsWith(")");
 let index=parenthesized
?Array.from(text).reduce((open,symbol,index,{length})=>
 index+1<length?(open[{"(":"push",")":"pop"}[symbol]]?.(index),open):open.pop(),[])
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
 let [tag,link]="#@".split("").map(field=>last?.[semiotics[field].name]);
 let noise=!/[a-zA-Z]/.test([tag,link].find(Boolean));
 if(noise||!tag&&!link)
 return defined(tag??link)
?[merge([past,{}].find(simple),{text:[past.text||"",last.title,defined(tag)?"#":"@"," "].join(""),style:past.style}),syntax]
:false;
 let [text]=[tag,link].map(phrase=>phrase?.match(/[\.,\)\?:;]+$/)).find(Boolean)||[""];
 if(text)
 [tag,link]=[tag,link].map(phrase=>phrase?.slice(0,-text.length));
 let next=link
?reference(last.title,link)
:Object.entries(qualify(tag)).flat().reduce((tag,qualifiers)=>
 document({[tag]:{["#text"]:last.title.replace(/_/g," "),...qualifiers}}));
 //let style=[past,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 if(simple(past))
 past=document({span:{"#text":past.text}});
 return [{text:text+" "},next,past||[],syntax];
},"\n":function terminate(last,...syntax)
{let past=this[" "](...arguments).slice?.(1);
 if(!past&&string(last?.text)||string(last?.action)||last?.compound||string(last?.style))
 return false;
 let style=[last,...syntax].find(fragment=>simple(fragment)&&fragment.style)?.style;
 let next={text:[last?.text||"","\n"].join(""),style};
 return [next,past||[last?.text?[]:last],syntax];
},"#":function tag(last,...syntax)
{if(last.style||string(last?.link)||last?.action||last?.compound||/^{|:$/.test(last?.style)||last?.text?.endsWith(" "))
 return false;
 return this.phrase(last).reduce?.((title,text)=>
 title&&[{title,tag:""},text?document({span:{"#text":text}}):[],syntax])||
 [merge(last,{tag:""}),...syntax];
},"@":function link(last,...syntax)
{return this.phrase(last)?.reduce((title,text)=>
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
 let [module,feature]=await locate(last.layout);
 let jsons=[...last.action.matchAll(new RegExp(/[{\[]{1}(?:[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/,"mg"))].map(([json])=>json);
 let context=jsons.reduce((context,json)=>
[context,context.pop().split(json).reduce((before,after)=>
 "\"'`".split("").some(quote=>Array.from(before.matchAll(quote)).length%2)
?[before,json,after].join("")
:[before,JSON.parse(json),after].filter(Boolean))
].flat(),[last.action]).flatMap(term=>string(term)
?Array.from(term.replace(/(^(\n|,| +)|( +|,|\n)$)/g,"")).reduce(([last,...context],symbol,index,{length})=>
[!last.length&&/ |,/.test(symbol)?last:last[0]===symbol
?[...index+1<length?[""]:[],last.substring(1)]
:[last+symbol]
,context
].flat()
,[""]).reverse():[term]);
 let fragment=await buffer(infer(resolve),fail=>document({span:{"#text":fail?.stack}}))(module,feature,...context);
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
 let style=buffer(compose(style=>"{"+style+"}",JSON.parse),drop(1))(last.style);
 if(!style)
 return [{text:""},past,syntax];
 let fragment=defined(style.style)
?compose.call(style,({style,...fragment})=>fragment)
:undefined;
 style=compose(style=>simple(style)
?{"#text":css(
 {[qualify(fragment)]:merge(style,last.block?{position:"relative"}:{},0)
 })}
:(last.block?"position:relative;":"")+style)(style.style??style);
 let jss=simple(style);
 if(last.block)
 return [document({div:{class:"inline",style,...fragment}}),past,syntax];
 document.call(past,!jss?{style,...fragment}:fragment);
 let next=jss?document({style}):[];
 return [{text:""},next,past,syntax];
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
 let fragment=await buffer(infer(resolve),compose(note,crop(1)))(JSON.parse(compound));
 this.annotate(fragment,last.title);
 return [fragment,syntax];
},"<":function(last,...syntax){if(last.style||last.action)return;return this.text("&lt;",...arguments);}
 ,">":function(last,...syntax){if(last.style||last.action)return;return this.text("&gt;",...arguments);}
 };

 export var tests=
 {list:
[{context:[{a:{b:"c",d:["e","f"]}}]
 ,terms:[
[{"#text":"a",ul:
 {li:
[{"#text":"b",ul:{li:[{"#text":"c"}]}}
,{"#text":"d",ul:{li:[{"#text":"e"},{"#text":"f"}]}}
]}
 }
]]
 ,condition:"deepEqual"
 }
],parse:
 {tag:{context:["Figure 1: Author_YEAR#h1 ",semiotics],terms:[collect,1,"nodeName","H1"],condition:"equal"}
 ,link:{context:["Figure 1: Author_YEAR@reference.pdf ",semiotics],terms:[collect,1,"nodeName","A"],condition:"equal"}
 ,insert:{context:["Figure 1: Author_YEAR@reference.pdf#insert ",semiotics],terms:[collect,1,"nodeName","A"],condition:"equal"}
 ,image:{context:["Figure 1: Author_YEAR@image.png ",semiotics],terms:[collect,1,"nodeName","IMG"],condition:"equal"}
 ,action:{context:["Figure 1: title#chart/plot([1,2]) ",semiotics],terms:[collect,1,"nodeName","svg"],condition:"equal"}
 ,composition:{context:['Figure 1: title#[[[1,2]],"chart/plot"] ',semiotics],terms:[collect,1,"nodeName","svg"],condition:"equal"}
 ,reflow:{context:["abc\n{text-align:left}\ndef",semiotics],terms:[collect,1,"nodeName","DIV"],condition:"equal"}
 ,style:["@reference.pdf","@image.png","#span"].map(fragment=>({context:["Figure 1: Author_YEAR"+fragment+"{width:0px;filter:invert(1)} ",semiotics],terms:[collect,1,"style","width","0px"],condition:"equal"}))
 ,immediate:{context:["Author_YEAR@image.png{width:100%} ",semiotics],terms:[collect,0],condition:when(is(compose("style","width",is("100%")),compose(note,"nodeName",is("IMG"))))}
 ,mixed:{context:["abc\nAuthor_YEAR@reference.pdf\ndef\n{text-align:left}\nghi",semiotics],terms:[collect,3,"nodeName","DIV"],condition:"equal"}
 ,noise:{context:["abc\n{text-align:left}\ndef\ng={h:1};",semiotics],terms:[collect,1,"nodeName","DIV"],condition:"equal"}
 }
 };

