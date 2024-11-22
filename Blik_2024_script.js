 import {merge} from "./Blik_2023_search.js";
 import {aphorize} from "./Blik_2023_meta.js";
 import {infer,compose,buffer,record,wait,string,note} from "./Blik_2023_inference.js";
 import {window,fetch,digest} from "./Blik_2023_interface.js";
 import {document,css} from "./Blik_2023_fragment.js";
 import {EditorState,Compartment} from './haverbeke_2022_codemirror_state.js';
 import {EditorView,keymap,lineNumbers,drawSelection} from './haverbeke_2022_codemirror_view.js';
 import {history,defaultKeymap,historyKeymap} from './haverbeke_2022_codemirror_commands.js';
 import {foldGutter,foldKeymap,codeFolding,syntaxHighlighting,defaultHighlightStyle,HighlightStyle} from './haverbeke_2022_codemirror_language.js';
 import {javascript} from './haverbeke_2022_codemirror_js.js';
 import {StyleModule} from './haverbeke_2022_stylemod.js';
 import {parser} from "./haverbeke_2022_lezer_js.js"
 import {highlightCode,tags,classHighlighter} from "./haverbeke_2022_lezer_highlight.js";
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
),lineNumbers(),history(),drawSelection()
,foldGutter(),codeFolding(),javascript()
,keymap.of([defaultKeymap,historyKeymap,foldKeymap].flat())
 ];

 export default async function(source,settings={})
{let parent=document({div:{}});
 //let language=(new Compartment).of(js());
 let indentation=(new Compartment).of(EditorState.tabSize.of(1));
 let doc=string(source)?settings.source?source:await compose(fetch,digest)(source):JSON.stringify(source);
 if(!string(doc))doc=aphorize(doc);
 let theme=EditorView.theme({".cm-gutters":{background:"transparent"}},{dark:true});
 let state=EditorState.create({doc,extensions:[theme,extensions].flat()});
 let view=new EditorView({parent,state},window);
 //note(view)
 //parent.append(document({style:{"#text":view.styleModules.flatMap(({rules})=>rules).join("\n")}}));
 return parent;
};

 export function highlight(source)
{let fragment=[];
 let emit=record((text,classes)=>classes?{class:classes,"#text":text}:text).bind(fragment);
 let line=fragment.push.bind(fragment,"\n");
 highlightCode(source,parser.parse(source),classHighlighter,emit,line);
 return document({pre:{class:"snippet",span:fragment,style:{"#text":compose.call
(highlights
,Object.entries,infer("map",([field,value])=>[".snippet>.tok-"+field,value]),Object.fromEntries
,{".snippet":{width:"100%",margin:0}
 },merge,css
)}}});
};

 export async function collaborate(source,settings={})
{//if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText==".CodeMirror-scroll"))document.styleSheets[0].addRule(".CodeMirror-scroll","width:100vw");
 // if(globalThis.document.onkeydown!==suppresssave)
 // globalThis.document.onkeydown=suppresssave;
 source=string(source)?settings.source?source:await compose(fetch,digest)(source):JSON.stringify(source);
 let worksheet=CodeMirror(document({div:{}})
,{lineNumbers:true,mode:"text",theme:"monokai",lineWrapping:true
 ,cursorHeight:1,indentUnit:2,indentWithTabs:false,tabSize:2
 ,foldGutter:["CodeMirror-linenumbers","CodeMirror-foldgutter"]
 ,minimap:true,autoCloseBrackets:true,matchBrackets:true
 ,extraKeys:{"Ctrl-S":contribute,"Ctrl-/":"undo"}
 });
  //("rel","stylesheet");window.monokai.href="./codemirror_2019/codemirror-5.48.4/theme/monokai.css";
 //document.styleSheets[0].insertRule(Array.prototype.reduce.call(document.styleSheets[0].rules,(ruletext,rule,index)=>{if(rule.selectorText!=".cm-s-monokai.CodeMirror")return ruletext;document.styleSheets[0].removeRule(index);return ruletext},".cm-s-monokai.CodeMirror{position:absolute;background-color:transparent;text-align:left; height:"+window.innerHeight+"px;width:"+window.innerWidth+"px;"));
 worksheet.setValue(source);
 // rooms[settings.end].socket.on("welcome",socket=>console.log("welcome aboard:",socket));
 // rooms[settings.end].socket.on("enter",({guest,subject})=>console.log(guest,"joined",subject));
 // rooms[settings.end].socket.on("join",guest=>console.log(guest,"arrived"));
 // rooms[settings.end].socket.on("leave",guest=>console.log(guest,"left"));
 // rooms[settings.end].socket.on("save",({author,subject,content})=>subject?author!=socket[subject].socket.id?socket[subject].setValue(decodeURIComponent(escape(atob(content)))):window.Tone.Transport.start():console.log("failed"));
 let {wrapper}=worksheet.display;
 wrapper.id=settings.source;
 wrapper.append(document({style:{"#text":[codemirror,monokai].join("\n")}}));
 return wrapper;
/*else
{console.info("opening",label.textContent)
 if(!window.mirrors)window.mirrors={};
 else if(Object.keys(mirrors).reduce((present,key)=>
{if(key==label.id)return window[key].replaceChild(document.createRange().createContextualFragment(awesome["fas fa-book-open"]).firstChild,window[key].lastChild).onclick=tunemirror;
 window[key].replaceChild(document.createRange().createContextualFragment(awesome["fas fa-journal-whills"]).firstChild,window[key].lastChild);mirrors[key].display.wrapper.style.display="none";return present
},false))
 return mirrors[label.id].display.wrapper.style.display="block";
 spin(label,true);
 if(typeof CodeMirror=="undefined")await import('./codemirror_2019/codemirror-5.48.4/lib/codemirror.js').then(response=>import('./codemirror_2019/codemirror-5.48.4/mode/javascript/javascript.js').then(mode=>
{//if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText==".CodeMirror-sizer"))document.styleSheets[0].addRule(".CodeMirror-sizer","margin-left:0");
 if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText==".CodeMirror-scroll"))document.styleSheets[0].addRule(".CodeMirror-scroll","width:100vw");
 return response
}))//.then(response=>response.CodeMirror)'//.then(response=>response.CodeMirror)
 gapi.client.request(
{'path':'/drive/v2/files/'+label.id,'method':'GET',callback:function(response)
{if(document.onkeydown!==suppresssave)document.onkeydown=suppresssave;
 if(!window.mirrorstyle){window.mirrorstyle=document.head.appendChild(document.createElement("link"));window.mirrorstyle.setAttribute("rel","stylesheet");window.mirrorstyle.href="./codemirror_2019/codemirror-5.48.4/lib/codemirror.css";}
 if(!window.monokai)
{window.monokai=document.head.appendChild(document.createElement("link"));window.monokai.setAttribute("rel","stylesheet");window.monokai.href="./codemirror_2019/codemirror-5.48.4/theme/monokai.css";
 document.styleSheets[0].insertRule(Array.prototype.reduce.call(document.styleSheets[0].rules,(ruletext,rule,index)=>{if(rule.selectorText!=".cm-s-monokai.CodeMirror")return ruletext;document.styleSheets[0].removeRule(index);return ruletext},".cm-s-monokai.CodeMirror{position:absolute;background-color:transparent;text-align:left; height:"+window.innerHeight+"px;width:"+window.innerWidth+"px;"));
 //if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText==".cm-s-monokai.CodeMirror"))document.styleSheets[0].addRule()
}
 mirrors[response.id]=mirrors[response.id]||CodeMirror(document.body,{lineNumbers:true,mode:"text",theme:"monokai",lineWrapping:true,cursorHeight:1,indentUnit:2,indentWithTabs:false,tabSize:2,foldGutter:["CodeMirror-linenumbers","CodeMirror-foldgutter"],minimap:true,autoCloseBrackets:true,matchBrackets:true,extraKeys:{"Ctrl-S":publishfile,"Ctrl-/":"undo"}});
 mirrors[response.id].display.wrapper.name=response.id;
 mirrors[response.id].display.wrapper.style.fontSize="12px"
 fetch(response.downloadUrl,{"headers":{"Authorization":"Bearer "+gapi.auth.getToken().access_token}}).then(file=>file.text()).then(text=>
{spin(label);label.appendChild(document.createRange().createContextualFragment(awesome["fas fa-book-open"]).firstChild).onclick=tunemirror;
 mirrors[response.id].setValue(text)
})
 //console.log(mirrors[response.id])
 /*if(!window.cartridge)document.body.appendChild(document.createElement("div")).id="cartridge";
 if(!window.livepress)window.livepress=new MutationObserver(mutations=>console.log(mutations)).observe(window.cartridge,{attributes:false,childList:true,characterData:false});
 if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText=="#cartridge"))document.styleSheets[0].addRule("#cartridge","position:absolute;text-align:left;display:block;width:100vw;height:100vh;overflow:scroll;font-size:20px;z-index:0");
 cartridge.contentEditable="true";
 cartridge.setAttribute("name",click.target.id);
 cartridge.textContent="";
 cartridge.textContent=text;*/
//});
};
 
 function contribute(instance)
{let parcel=unescape(encodeURIComponent(instance.getValue()));
 let parcelarray=new Array(parcel.length);
 for(let i=0;i<parcel.length;i++){parcelarray[i]=parcel.charCodeAt(i);};
 let bytes=new Uint8Array(parcelarray);
 var blob=new Blob([bytes],{type:'text/plain'});
 let buffer=new FileReader();
 buffer.onload=function(event)
{globalThis.postMessage(
 {action:"put"
 ,subject:instance.display.wrapper.id
 ,content:btoa(event.target.result)
 },globalThis.origin);
};
 buffer.readAsBinaryString(blob);
};

 function suppresssave(e)
{e=e||window.event;if(!e.ctrlKey)return;
 switch(e.which||e.keyCode)
{case 83:case 87:e.preventDefault();e.stopPropagation();break;
}
};