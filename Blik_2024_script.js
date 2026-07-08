 import {unfold} from "./Blik_2023_search.js";
 import {aphorize,serialize,cookie} from "./Blik_2023_meta.js";
 import {debug,merge,prune,record,stagger,infer,compose,cede,buffer,whether,wait,string,note,basic,defined,drop,modular,observe,extract} from "./Blik_2023_inference.js";
 import {fetch,digest,agent} from "./Blik_2023_interface.js";
 import {window,document,css,capture,dataset,destroy,keyboard} from "./Blik_2023_fragment.js";
 import {EditorState,Compartment} from './haverbeke_2022_codemirror_state.js';
 import {EditorView,ViewPlugin,keymap,lineNumbers,drawSelection} from './haverbeke_2022_codemirror_view.js';
 import {history,defaultKeymap,historyKeymap} from './haverbeke_2022_codemirror_commands.js';
 import {foldGutter,foldKeymap,codeFolding,syntaxHighlighting,defaultHighlightStyle,HighlightStyle,syntaxTree,syntaxTreeAvailable,ensureSyntaxTree,forceParsing,foldable,foldEffect,unfoldAll,foldAll} from './haverbeke_2022_codemirror_language.js';
 import {javascript} from './haverbeke_2022_codemirror_js.js';
 import {StyleModule} from './haverbeke_2022_stylemod.js';
 import {parser as lezer} from "./haverbeke_2022_lezer_js.js"
 import {highlightCode,tags,classHighlighter} from "./haverbeke_2022_lezer_highlight.js";
 var file=new URL(import.meta.url).pathname.replace(/.*\//,"/");
 var highlights=
 {variableName:{color:"#0097a7"}
 ,string:{color:"#43a047"}
 ,regexp:{color:"#43a047"}
 ,number:{color:"#ffb300"}
 ,comment:{color:"#616161"}
 ,keyword:{color:"#770088"}
 };
 var extensions=
[compose.call
(highlights,Object.entries,infer("map",([field,value])=>({tag:tags[field],...value}))
,HighlightStyle.define,syntaxHighlighting
),history(),drawSelection()
,foldGutter(),codeFolding(),javascript()
,keymap.of([defaultKeymap,historyKeymap,foldKeymap].flat())
];

 export default async function script(source,settings={})
{if(this&&!modular(this)||source.constructor.name==="IncomingMessage")
 return {imports:
 {"/Blik_2023_interface.js":["","command","fetch"]
 ,"/Blik_2023_inference.js":["","note","slip","compose","collect","combine","merge","record"]
 ,"/Blik_2023_fragment.js":["","dataset","destroy","size"]
 ,[file]:["script","fold","resize"]
 }
 ,exports:{default:
 {".codemirror":
 {contextrestored(event)
{let {source,...meta}=[dataset(this),{parent:this}].reduce(merge,{});
 Array.from(this.childNodes).forEach(destroy);
 script(source,meta);
},keydown({keyCode,ctrlKey:ctrl,altKey:alt})
{let {s,w,f}=keyboard(keyCode);
 if(alt&&f)
 return arguments[0].preventDefault(),fold.call(this);
 if(alt&&w)
 return compose(stash(({whiteSpace})=>whiteSpace==="pre-wrap"
?{maxWidth:"",whiteSpace:"",wordBreak:""}
:{maxWidth:"calc(100% - 2.5em)",whiteSpace:"pre-wrap",wordBreak:"break-all"}),Object.assign)(this.querySelector(".cm-content").style);
 if(!s||!ctrl)return;
 arguments[0].preventDefault();
 let source=this.querySelector(".cm-content").cmView.view.viewState.state.doc.toString();
 let bytes=new Array(source.length);
 for(let index in source)
 bytes[index]=source.charCodeAt(index);
 var blob=new Blob([new Uint8Array(bytes)],{type:'text/plain'});
 let target=this.dataset.source+"?override=true";
 let buffer=Object.assign(new FileReader()
,{onload:compose
((file,event)=>fetch(target,{method:"put",body:btoa(event.target.result)})
,"text",combine
(body=>fetch("/inspect?module="+this.dataset.source,{method:"put",body})
,compose(["message"],record,{action:"broadcast",room:this.dataset.source},merge
,["data"],record,{bubbles:true},merge,slip("message"),collect,slip(MessageEvent)
,Reflect.construct,slip(this),"dispatchEvent")
)
)})
 buffer.readAsBinaryString(blob);
},...observe({touch(event)
{let {type,touches,isTrusted:start}=event;
 if(!start)
 return this.control?.abort();
 if(touches.length!==2)
 return;
 let width=({touches})=>Array.from(touches).map(({pageX:x,pageY:y})=>[x,y]).reduce(([x1,y1],[x2,y2])=>Math.hypot(x1-x2,y1-y2));
 let unit=width(event);
 let font=size(this.querySelector(".cm-content"));
 merge(this,{control:new AbortController()});
 observe.call(this
,{touchmove(event)
{event.preventDefault();
 resize.call(this,Math.max(1,Math.round(width(event)/unit*font)));
}},{signal:this.control.signal});
}})
 ,wheel(event)
{if(!event.ctrlKey)return;
 event.preventDefault();
 let past=size(this.querySelector(".cm-content"));
 let dy=event.deltaY/4;
 let scale=1-Math.sign(dy)*Math.min(24,Math.abs(dy))
 resize.call(this,Math.max(1,Math.round(past*scale)));
}}
 }}};
 let {author}=cookie.call(window.document);
 let {gutter=true,range,scale
 ,font=author?await compose(fetch,digest,"font")("/author/"+author):""
 ,parent=compose.call
({div:{class:"codemirror",...dataset(settings)}}
,document,spill,lift,crop(1),cede
)}=settings;
 let indentation=new Compartment().of(EditorState.tabSize.of(1));
 let doc=string(source)?settings.source?source:await compose(fetch,digest)(source):JSON.stringify(source);
 if(!string(doc))
 doc=compose(infer(serialize,"json"),buffer(compose(JSON.parse,aphorize),drop(1)))(doc);
 if(range)
 doc=range.reduce((start,end)=>
 doc.split("\n").slice(start,end).join("\n"));
 let size=font?font.size+"px":(scale||1)+"em";
 let theme=new Compartment().of(EditorView.theme(
 {".cm-content":{"text-align":"left","font-family":font.name,"font-size":size}
 ,".cm-gutters":{background:"transparent","font-size":size}
 // gutter heights are calculated dynamically on client-side. 
 ,".cm-gutterElement":{height:"4px !important",color:"var(--note)"}
 ,".cm-gutterElement:not(:first-of-type)":{height:"1.4em !important",transform:"translate(0,-4px)"}
 ,".cm-foldGutter>.cm-gutterElement>span":
 {color:"transparent"
 ,"&:after":{content:"''",display:"block",opacity:".75",transform:"translate(0,-1.1em)",border:".5em solid var(--text)"}
 ,"&[title='Fold line']":{"&:after":{"border-right":".4em solid transparent","border-bottom":".0em solid transparent","border-left":".4em solid transparent","margin-top":".25em"}}
 ,"&[title='Unfold line']":{"&:after":{"border-bottom":".4em solid transparent","border-top":".4em solid transparent","border-right":".0em solid transparent","margin-left":".25em"}}
 }
 ,".cm-foldPlaceholder":{background:"transparent",border:"none"}
 },{dark:true}));
 let folding=defined(settings.fold)&&new Compartment().of(ViewPlugin.fromClass(class {update(update)
{if(!update.geometryChanged)return;
 stagger(update.view.dom.parentNode).then(parent=>
 update.view.dispatch({effects:folding.compartment.reconfigure([])})||
 fold.call(parent,settings.fold));
}}));
 let state=EditorState.create({doc,extensions:
[basetheme,foldtheme,theme,extensions
,folding||[]
,gutter&&lineNumbers({formatNumber(line){return (range?.[0]||gutter)-1+line;}})
].flat()});
 let view=new EditorView({parent,state},window);
 //let style=view.styleModules.flatMap(({rules})=>rules).reverse().join("\n");
 let style=parent.ownerDocument.querySelector("head").querySelector("style");
 if(!globalThis.window)
 parent.prepend(compose.call({style:{"#text":style.textContent}},document,spill,lift,crop(1),cede)),style.remove()
,doc.split("\n").forEach((line,index)=>
 [".cm-line",".cm-lineNumbers>.cm-gutterElement"].map(name=>
 Array.from(parent.querySelectorAll(name))).forEach((lines,gutter)=>
 lines[index+gutter]||Object.assign(lines.at(-1),{textContent:gutter?index+1:line})));
 return capture.call(parent,file+"/module/default/module");
};

 export function resize(next)
{let text=this.querySelector(".cm-content");
 let past=size(text);
 if(next===past)return;
 let {cmView:{view}}=text;
 let theme=view.viewState.state.config.base[2];
 view.dispatch({effects:theme.compartment.reconfigure([EditorView.theme(
 {".cm-content":{"font-size":next+"px"}
 ,".cm-gutters":{"font-size":next+"px"}
 }),theme.inner])});
 let {author}=cookie.call(this);
 if(!author)return;
 buffer(compose
(wait(10000),size,when(is(next)),drop()
,"/author/"+author,{method:"put",body:JSON.stringify({font:{size:next}})},fetch,digest,note
),note)(text);
};

 export async function fold(depth=0)
{let {view}=this.querySelector(".cm-content").cmView;
 let {state}=view.viewState;
 let effects=[];
 //forceParsing(view,state.doc.length,10000);
 ensureSyntaxTree(state,state.doc.length,10000).iterate(
 {enter({stack:{length},from,to})
{let effect=depth<=length?foldable(state,from,to):undefined;
 if(effect)effects.push(foldEffect.of(effect));
},from:0,to:state.doc.length
 });
 view.dispatch({effects});
 this.dataset.fold=depth;
 return this;
};

 export function index(editor)
{if(this&&!modular(this)||editor.constructor.name==="IncomingMessage")
 return {imports:
 {"/Blik_2023_interface.js":["","fetch","digest"]
 ,"/Blik_2023_inference.js":["","note","spill","lift","crop","compose"]
 ,[file]:["script"]
 },exports:{default:
 {".codemirror":
 {click({target})
{if(!target.classList.contains("index"))
 return;
 let source=target.textContent;
 let parent=target.closest(".codemirror");
 compose(fetch,digest,{source,parent},script)(reference);
}}
 }}};
 return compose.call(editor
,{span:
 {class:"index",style:{"@scope":{":scope":
 {display:"block","text-align":"right",overflow:"scroll"
 ,"&>span":{display:"inline-block","white-space":"nowrap",color:"var(--note)"}
 }}}
 ,span:[{"#text":editor.dataset.source}]
 }
 },tether(document),spill,lift,crop(1),file+"/module/index/module",tether(capture));
};

 export function commandline(history,prompt)
{if(this&&!modular(this)||history.constructor.name==="IncomingMessage")
 return {imports:
 {"/Blik_2023_fragment.js":["","keyboard"]
 ,[file]:["script","highlight"]
 },exports:{default:
 {".command":
 {async keydown({target,keyCode})
{let {enter,ctrl}=keyboard(keyCode);
 if(!enter)return;
 if(ctrl)return;
 let command=target.firstChild.nodeValue;
 let event=await eval(command).catch(fail=>fail);
 let [history]=highlight(" ❯ "+[command.split("\n").join("\n ❯ "),JSON.stringify(event)].join("\n"));
 target.parentNode.append(...history.childNodes,target);
 target.firstChild.nodeValue="";
 destroy(history);
 target.ownerDocument.defaultView.scrollTo(0,target.scrollHeight);
}}
 }}};
 return compose.call(history
,{style:{"@scope":{":scope":{overflow:"scroll"}}}
 ,span:
 {class:"command",contenteditable:true,"#text":prompt,style:{"@scope":{":scope":
 {display:"block",outline:"none","&:before":{content:'" ❯ "',color:"var(--note)"}
 }}}
 }
 },tether(document),spill,lift,crop(1),file+"/module/commandline/module",tether(capture));
};

 export function highlight(source)
{let span=[];
 let emit=record((text,classes)=>({"#text":text,class:classes||null})).bind(span);
 let line=span.push.bind(span,{"#text":"\n"});
 highlightCode(source,lezer.parse(source),classHighlighter,emit,line);
 return compose.call({pre:{class:"snippet",span,style:compose.call
(highlights,Object.entries
,infer("map",([field,value])=>[".snippet>.tok-"+field,value])
,Object.fromEntries,{".snippet":
 {width:"100%",margin:0,overflow:"scroll",background:`
 linear-gradient(90deg,var(--abyss) 20%,#ffffff00) center left
,linear-gradient(90deg,#ffffff00,var(--abyss) 80%) center right
,radial-gradient(farthest-side at 100% 50%,var(--text),#00000000 80%) center right
,radial-gradient(farthest-side at 0% 50%,var(--text),#00000000 80%) center left`
 ,"background-size":"40px 100%,40px 100%,10px 120%,10px 120%"
 ,"background-repeat":"no-repeat"
 ,"background-attachment":"local,local,scroll,scroll"
 }},merge
)}},document,spill,lift,crop(1));
};

 var basetheme=EditorView.baseTheme(compose.call
 // internal basetheme from codemirror, not exposed by it to render stylemodules on server-side. could be exposed in source definition.  
({wrap:
 {position: "relative !important",boxSizing: "border-box"
 ,"&.cm-focused":{outline_fallback: "1px dotted #212121",outline: "5px auto -webkit-focus-ring-color"}
 ,display:"flex !important",flexDirection:"column"
 }
 ,scroller:{display: "flex !important",alignItems: "flex-start !important",fontFamily: "monospace",lineHeight: 1.4,height: "100%",overflowX: "auto"}
 ,content: {margin: 0,flexGrow: 2,minHeight: "100%",display: "block",whiteSpace: "pre",boxSizing: "border-box",padding: "4px 0",outline: "none"}
 ,"content@light": { caretColor: "black" }
 ,"content@dark": { caretColor: "white" }
 ,line: {display: "block",padding: "0 2px 0 4px"}
 ,button: {verticalAlign: "middle",color: "inherit",fontSize: "70%",padding: ".2em 1em",borderRadius: "3px"}
 ,"button@light":
 {backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",border: "1px solid #888"
 ,"&:active": {backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"}
 }
 ,"button@dark":
 {backgroundImage: "linear-gradient(#555, #111)",border: "1px solid #888"
 ,"&:active": {backgroundImage: "linear-gradient(#111, #333)"}
 }
 ,textfield: {verticalAlign: "middle",color: "inherit",fontSize: "70%",border: "1px solid silver",padding: ".2em .5em"}
 ,"textfield@light": {backgroundColor: "white"}
 ,"textfield@dark": {border: "1px solid #555",backgroundColor: "inherit"}
 ,secondarySelection: {backgroundColor_fallback: "#3297FD",color_fallback: "white !important",backgroundColor: "Highlight",color: "HighlightText !important"}
 ,secondaryCursor: {display: "inline-block",verticalAlign: "text-top",width: 0,height: "1.15em",margin: "0 -0.7px -.7em"}
 ,"secondaryCursor@light": { borderLeft: "1.4px solid #555" }
 ,"secondaryCursor@dark": { borderLeft: "1.4px solid #ddd" }
 },Object.entries,infer("map",([field,value])=>[".cm-"+field,value]),Object.fromEntries
));

 var foldtheme=EditorView.baseTheme(
{".cm-foldPlaceholder":{backgroundColor: "#eee",border: "1px solid #ddd",color: "#888",borderRadius: ".2em",margin: "0 1px",padding: "0 1px",cursor: "pointer"}
,".cm-foldGutter span": {padding: "0 1px",cursor: "pointer"}
});
