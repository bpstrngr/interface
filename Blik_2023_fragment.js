 import {resolve,modularise,window,fetch,mime} from "./Blik_2023_interface.js";
 import {note,provide,collect,infer,either,each,tether,buffer,differ,compose,refer,record,combine,wether,swap,compound,something,string,defined,simple,exit,route,drop,crop,same,binary,is,array,pdflike} from "./Blik_2023_inference.js";
 import {search,merge,prune} from "./Blik_2023_search.js";
 import {proceduralize} from "./Blik_2023_meta.js";
 import layout,{color} from "./Blik_2023_layout.js";
 var {default:svg}=await resolve("./Blik_2020_svg.json");

 export function document(source,namespace,language)
{if(this)
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
 if(source.nodeName||["NodeList"].includes(source.constructor?.name)||typeof source=="string")
 return source.nodeName?source:window.document.createRange().createContextualFragment(language
?[source.match(new RegExp("#"+language+"(.*)#"+language))||[],source].reduce((match,source)=>match[1]||source)
:source);
 let [fragment,...nodes]=Object.entries(source||{}).reduce(function([fragment,...nodes],[name,value])
{if(!value)return [fragment,...nodes];
 let textnode=name=="#text";
 if(textnode)
 value=!string(value)?value[language]||Object.values(value)[0]:value;
 let dataset=name=="dataset";
 if(dataset)
 return [fragment,...nodes,...Object.entries(metamarkup(value))];
 let child=textnode||value.nodeName;
 if(child)
 return [fragment.appendChild(document(value,namespace,language))&&fragment,...nodes];
 let attribute=["string","number","boolean"].includes(typeof value);
 if(attribute)
 return [fragment,...nodes,[name,value]];
 let defaults=
 {a:{target:"_blank"}
 ,svg:{viewBox:"0 0 1 1",xmlns:namespaces.svg,"xmlns:xlink":namespaces.xlink}
 }[name];
 let values=array(value)?value:[value];
 let children=values.filter(Boolean).map(value=>merge(value,defaults,0)).map(buffer(function(value)
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

 export var metamarkup=object=>object&&
 Object.fromEntries
((object.nodeName)
?Object.entries(object.dataset).map(([key,value])=>
 [key,isNaN(Number(value))?JSON.parse(value):Number(value)])
:Object.entries(object).map(([key,value])=>["data-"+key,isNaN(value)?JSON.stringify(value):String(value)])
);

 export function form(fields,labels)
{let group=Object.entries(fields).reduce((group,[key,value],index)=>
 typeof value=="object"&&!Array.isArray(value)&&!index&&key,false);
 if(group)
 fields=fields[group];
 labels=this&&!labels?JSON.parse(this.dataset.labels):string(labels)?JSON.parse(labels):labels;
 let label=Object.entries(fields).map(([id,value])=>
{if(!defined(value))return;
 let type=wether([is(Date),is(Set),either(array,compound),either(binary,infer("match",/^(true|false)$/))]
,...each(type=>swap(type))("date","radio","select","checkbox","text"))(value);
 let field=
 {for:id,title:id
 ,class:[group,type,{checkbox:value?"checked":""}[type]].filter(Boolean).join(" ")||undefined
 ,input:
 {type:["select","date"].includes(type)?"text":type,id,name:id
 ,value:type==="checkbox"?String(value)==="true":(type==="date")?clock(value,"datetime"):(type==="text"&&value&&String(value))||(array(value)?value[0]:compound(value)?Object.keys(value)[0]:value)
 ,checked:{checkbox:value?value.toString():undefined}[type]
 ,autocomplete:"off"
 }
 ,ul:type!=="text"?type==="date"?clockwork(value):{li:list(value)}:undefined
 ,...tag(labels,typeof labels[id]=="function"?labels[id](value):id)
 };
 return JSON.parse(JSON.stringify(field));
});
 if(this)
 label.filter(Boolean).map(label=>
{let input=this.elements[label.for];
 if(something(input?.value))
 label.input.value=input?.value;
 let entry=document({label})
 let reference=input?.closest("label")||
 Array.from(this.elements).reverse().find(input=>input.closest("label"))?.closest("label")||
 Array.from(this.children).at(-1);
 insert(entry,input?"over":"after",reference);
 if(label.input.type=="text")
 this.elements[label.for]?.dispatchEvent(new window.Event("input",{bubbles:true}));
 return [Array.from(entry.parentNode.children).indexOf(entry),entry];
}).forEach(([order,node],index,labels)=>node.parentNode.insertBefore(node
,labels.slice(index+1).find(([next])=>next<order)?.[1]||node.nextSibling));
 return {label,input:{id:"extend",type:"text",value:"..."}};
};

 export function list(value)
{return prune.call([value].flat(),([field,value])=>!["ul","li","#text"].includes(field)
?compose(infer("map",([field,value],index)=>(
 {"#text":field==index&&string(value)?value:field
 ,ul:value&&(compound(value)||field!=index)?{li:[value]}:undefined
 })),provide)(compound(value)?Object.entries(value):[[field,value]])
:value);
};

 export function fill(fields)
{Object.entries(fields||{}).filter(([field,value])=>
 !compound(value)&&this.elements[field]).forEach(([field,value])=>
 this.elements[field].value=value);
 return Object.fromEntries([...new this.ownerDocument.defaultView.FormData(this)]);
};

 var tag=(labels,id)=>typeof id!="string"
?id
:typeof labels[id]=="object"
?labels[id]
:(labels[id]&&labels[id][0]=="<")
?{"#text":labels[id]}
:{span:{"#text":typeof labels[id]=="string"?labels[id]:id}};

 var modules={};

 export async function transform(resource,{incumbent,...fields})
{if(pdflike(resource))resource=await print(resource);
 if(this)
 form.call(this,{get:{...fields,...simple(resource)||array(resource)&&{source:resource}}})
,fill.call(this,fields);
 let [module,feature="default"]=fields.layout?.split("/")||["./Blik_2023_fragment.js","media"];
 if(!module.includes("_"))
 module=await [2020,new Date().getFullYear()].reduce((min,max)=>
 Array(max-min).fill(max).map((year,index)=>year-index)).flatMap((year)=>
 ["Blik"].map(author=>"./"+[author,year,module].join("_")+".js")).reduce((file,module)=>
 file.catch(fail=>modules[module]=modules[module]||import(module).then(swap(module)))
,Promise.reject());
 let product=await compose(resolve,either(infer(feature,resource,fields,incumbent||window),drop(-1)))(module);
 return product;
 let values=this?.elements?.source?.parentNode?.querySelector("ul");
 if(values)
 d3.select(values).datum(resource.descendants?resource.descendants():fields.source);
 //new Array(file.numpages).reduce((canvas,phase,index)=>file.getPage(index+1).then(page=>
//{let view=page.getViewport({scale:1.5});canvas.width=canvas.width<view.width?view.width:canvas.width;canvas.height=(canvas.height||0)+view.height;
 //page.render({canvasContext:canvas.getContext('2d'),viewport:view});return canvas;
//}),document.createElement('canvas')))
};

 export function print(file)
{return resolve(
["./mozilla_2010_pdf_viewer_brightspace.js"
,"./mozilla_2010_pdf_link_service_brightspace.js"
,"./mozilla_2010_pdf_brightspace.js"
]).then(async function([{PDFViewer},{PDFLinkService},pdf])
{pdf.default.GlobalWorkerOptions.workerSrc="mozilla_2010_pdf_worker_brightspace.js";
 let container=document({"div":{"class":"pdfjs","div":{"id":"viewer"}}});
 let viewer=new PDFViewer(
 {linkService:new PDFLinkService(),container,renderer:"svg"
 ,textLayerMode:0,disableRange:true,forceRendering:true
 });
 viewer.linkService.setViewer(viewer);
 await pdf.getDocument(file).promise.then(pdf=>
 viewer.setDocument(pdf));
 return viewer.container;
});
};

 export function image(src)
{if(/image/i.test(src.nodeName))return src;
 return new Promise((resolve,reject)=>
 Object.assign(document({img:{crossOrigin:"anonymous"}})
,{onload(){resolve(this);}
 ,onerror:reject
 ,src
 }));
 //if(!colors[color])svg.select("circle#"+id).attr("fill",["rgb(",...new Vibrant(this).swatches()["Vibrant"].rgb].reduce((hex,hue,index)=>hex+hue+(index<2?",":")")));
};

 export function canvas(image)
{let canvas=document({canvas:{width:image.naturalWidth,height:image.naturalHeight}});
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
}try{input={source,...JSON.parse(input)}}catch(fail){input={source}};
 let node="h1/h2/h3/h4/h5/h6/h7".split("/").includes(document);
 source=document?node
?defer({layout:document,...input}):await compose(fetch,digest,{layout:document,...input},transform)(source)
:reference(title,source,document||(source==title&&"span"))||match;
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

 export var deselect=source=>source.replace(/[^\w]/g,"_");

 export async function error()
{let error=Array.from(arguments).at(-1);
 let style=await stylesheet({body:{background:"black",color:color.red},center:layout.middle});
 let report=compose.call({center:{"#text":String(error)}},"Error","/svg/worm/document",[],[style],hypertext,document);
 let body=report.outerHTML;
 report.innerHTML="";
 return {body,status:500,type:mime("html")};
};

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
 })
}

 export function media(resource,{incumbent,source,...fields})
{if(source&&[incumbent?.title,incumbent?.parentNode.title].includes(source))
 return document(incumbent.childNodes);
 if(resource.constructor.name==="Buffer")
 resource=new TextDecoder("utf-8").decode(new Uint8Array(resource));
 return resource.nodeName?resource
:simple(resource)?document({pre:{"#text":JSON.stringify(resource,null,2)}})
:resource.startsWith("<")
?window.document.createRange().createContextualFragment(resource)
:deform(resource).then(source=>window.document.createRange().createContextualFragment(source))
}

 export var defer=form=>
 document({"img":
 {onload:"!function expect(){setTimeout(tick=>(typeof dispatch=='undefined'?expect:dispatch).call(this,event),500)}.call(this)"
 ,src:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
 ,"data-subject":JSON.stringify(form)
 ,class:"defer"
 }        });

 var reference=(title,source,layout,elements={"audio":["mp3"],"img":["png","jpg","svg","gif"]})=>document(
 {[layout||Object.keys(elements).find(key=>elements[key].includes(source&&source.slice&&source.slice(-3)))||"a"]:
 {id:title,class:"reference",title,alt:title||source,href:source,src:source,controls:"on"
 ,"#text":(title||source).replace(/_/g," ")
 }
 });

 export function hypertext(body,title,favicon,scripts,styles=[])
{scripts=[scripts].flat().filter(actions=>!compound(actions)||!activate(body,actions));
 let action={type:"module","#text":proceduralize(expose)};
 let script=[action,scripts.map(src=>({src,type:"module"})),body.script||[]].flat();
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
 return infer(insert)(...arguments);//:compose(document,infer(insert,place,target),drop(0,0,fragment,"over"),insert)(wheel);
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
 for(let simulation of [fragment.simulation].flat())
 if(note(Math.floor((1-simulation.alpha())*100),"% throttling "+fragment.getAttribute("title")).next().value<10)
 return throttle(fragment);
 else fragment.simulation.stop();
 return fragment;
});
};

 export function qualify(node)
{// extract css selectors from node/fragment, or vice versa.
 if(typeof node==="string")
 return refer(node.match(/[#\.][^#\.]+/g)?.reduce((node,selector)=>
 merge(node,{[["id","class"]["#.".indexOf(selector[0])]]:[selector.slice(1)]})
,{})||{},node.match(/^[^#\.]+/));
 let name=node.nodeName?.toLowerCase()||"";
 let selectors=name?{id:"#",classList:"."}:{id:'#',class:'.',classed:'.'};
 return name+Object.entries(selectors).flatMap(([attribute,selector])=>
 [attribute==="classList"?Array.from(node[attribute]):node[attribute]].flat().filter(value=>
 string(value)).flatMap((value)=>
 value.split(' ').map((value)=>selector+value))).join('');
};

 export function activate(fragment,actions)
{// dispose actions on node/fragment to event listeners. 
 if(!actions)return fragment;
 if(string(actions))
 return import(actions).then(({default:actions})=>activate(fragment,actions));
 let node=(fragment instanceof window.DocumentFragment)
?Array.from(fragment.childNodes)
:fragment.nodeName
?[fragment]
:fragment;
 let nodes=Object.entries(node).flatMap(([nodename,node])=>
 [node].flat().filter(compound).map(node=>compose
(tether(dispose)
,Object.keys
,infer("map",event=>["on"+event,"window.dispatch.call(this,event)"])
,Object.fromEntries
,node
,(events,node)=>document.call(node,events)
,node=>node.childNodes?Array.from(node.childNodes):node
)(node,actions)
));
 nodes.forEach(infer(activate,actions));
 return fragment;
};

 export function observe(action,register=true)
{// construct event (pair) fragments for extensions (css pseudoclasses for js)
 // and (un)register them directly on bound Node.
 const binary=
 {hover:['mouseover','mouseout']
 ,focus:['focusin','focusout'],
 };
 let propagate=register>1;
 const entries=[action].flat().flatMap((action)=>
 // function names are removed in nextjs builds, so don't use action.name.
 typeof action==='object'?Object.entries(action):[[action?.name,action]]).flatMap(([name,action])=>
 binary[name]?.reduce((start,end)=>
[[start,action]
,[end,function(event){if(!propagate)event.stopPropagation();this.dispatchEvent(new {focus:FocusEvent,hover:MouseEvent}[name](start,event));}]
])||[[name,action]]);
 if(defined(this))
 entries.reduce((node,[event,action])=>(node[(register?'add':'remove')+'EventListener'](event,action),node),this);
 return Object.fromEntries(entries);
};

 export function keyboard(code)
{let [key]=Object.entries({enter:13,escape:27,space:32,leftright:[37,39],updown:[38,40]}).find(({1:codes})=>
 [codes].flat().includes(code))||[];
 return key?{[key]:true}:{};
};

 export function dispose(actions)
{// extract actions disposed on node/fragment. 
 let fragment=!Boolean(this.ownerDocument);
 let [scope]=Object.entries(actions).map(([selector,scope])=>
 [qualify(selector),scope].reduce((selector,scope)=>
[scope,Object.values(selector).every(simple)
?Object.entries(selector).shift()
:["",selector]
]).flat()).find(([scope,name,selector])=>
 (!name||name===(this.nodeName?.toLowerCase()||"body"))&&
 Object.entries(selector).flatMap(([attribute,value])=>
 [value].flat().map(value=>[attribute,value])).every(([attribute,value])=>
 attribute==="class"?fragment
?[this[attribute]].flat().flatMap(list=>list.split(" ")).includes(value)
:this.classList?.contains(value):this[attribute]===value))||[];
 return scope||{};
};

 export function expose()
{// expose actions disposed to event listeners. 
 Object.assign(window,{dispatch(event)
{if(!dispose)
 return event.preventDefault(),setTimeout(dispatch.bind(this,event),500);
 let scope=dispose.call(this,actions);
 console.log({[event.type]:this});
 let action=event.type.replace(/[A-Z]+/g,match=>match.slice(-1).toLowerCase());
 scope[action]?.call(this,event);
 // asynchronous dispatch won't prevent synchronous default. 
}});
 let modules=["./Blik_2023_fragment.js","./actions"].map(module=>import(module));
 var {dispose,actions}=Promise.all(modules).then(([fragment,module])=>
 [dispose,actions]=[fragment.dispose,module.default]);
};

 export async function navigate(node,sibling)
{let path=window.location.pathname.replace(/[a-zA-Z0-9]*\/$/,match=>!node||sibling?"":match)+(node?node+"/":"");
 window.history.pushState({path},null,path);
 window.dispatchEvent(new window.PopStateEvent("popstate",{path}));
};

 export function path(name){return (window.location.pathname+(name||"")).replace(/^\/*|\/*$/g,"");}// regexp bracket matching: */

 export function retreat(){return window.location=window.location.pathname.split("/").filter(Boolean).slice(0,-1).join("/")+"/";}

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

 export var tests=
 {list:
[{context:[{a:{b:"c",d:["e","f"]}}]
 ,terms:[
[{"#text":"a",ul:
 {li:
[{"#text":"b",ul:{li:[{"#text":"c"}]}}
,{"#text":"d",ul:{li:[{"#text":"e"},{"#text":"f"}]}}
]}
 }]
],condition:"deepEqual"
 }
]};
