 import {merge} from "./Blik_2023_search.js";

 export default async function collaborate(source,settings)
{let {default:CodeMirror}=await import('./haverbeke_2020_codemirror.js')
 globalThis.CodeMirror=CodeMirror;
 let mode=await import('./haverbeke_2020_codemirror_jsmode.js')
 //if(!Array.prototype.find.call(document.styleSheets[0].rules,rule=>rule.selectorText==".CodeMirror-scroll"))document.styleSheets[0].addRule(".CodeMirror-scroll","width:100vw");
 if(document.onkeydown!==suppresssave)document.onkeydown=suppresssave;
 let rooms=merge(window,{rooms:{}}).rooms;
 if(!rooms[settings.end])
{rooms[settings.end]=CodeMirror(document.createElement("div"),{lineNumbers:true,mode:"text",theme:"monokai",lineWrapping:true,cursorHeight:1,indentUnit:2,indentWithTabs:false,tabSize:2,foldGutter:["CodeMirror-linenumbers","CodeMirror-foldgutter"],minimap:true,autoCloseBrackets:true,matchBrackets:true,extraKeys:{"Ctrl-S":contribute,"Ctrl-/":"undo"}});
 if(!window.mirrorstyle)
{window.mirrorstyle=document.head.appendChild(document.createElement("style"));window.mirrorstyle.textContent=mirrorstyle;
 //("rel","stylesheet");window.mirrorstyle.href="./codemirror_2019/codemirror-5.48.4/lib/codemirror.css";
 window.monokai=document.head.appendChild(document.createElement("style"));window.monokai.textContent=monokai;
  //("rel","stylesheet");window.monokai.href="./codemirror_2019/codemirror-5.48.4/theme/monokai.css";
}//document.styleSheets[0].insertRule(Array.prototype.reduce.call(document.styleSheets[0].rules,(ruletext,rule,index)=>{if(rule.selectorText!=".cm-s-monokai.CodeMirror")return ruletext;document.styleSheets[0].removeRule(index);return ruletext},".cm-s-monokai.CodeMirror{position:absolute;background-color:transparent;text-align:left; height:"+window.innerHeight+"px;width:"+window.innerWidth+"px;"));
 rooms[settings.end].setValue(typeof source=="string"?source:JSON.stringify(source));
 rooms[settings.end].socket=io.connect(window.location.origin);
 rooms[settings.end].socket.emit("apply",settings.end);
 rooms[settings.end].socket.on("welcome",socket=>console.log("welcome aboard:",socket));
 rooms[settings.end].socket.on("enter",({guest,subject})=>console.log(guest,"joined",subject));
 rooms[settings.end].socket.on("join",guest=>console.log(guest,"arrived"));
 rooms[settings.end].socket.on("leave",guest=>console.log(guest,"left"));
 rooms[settings.end].socket.on("save",({author,subject,content})=>subject?author!=socket[subject].socket.id?socket[subject].setValue(decodeURIComponent(escape(atob(content)))):window.Tone.Transport.start():console.log("failed"));
}console.log(rooms[settings.end]);
 note(rooms[settings.end].display.wrapper.id=settings.end)
 return rooms[settings.end].display.wrapper;
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
//})
}
 
 function contribute(instance)
{let buffer=new FileReader();
 let parcel=unescape(encodeURIComponent(instance.getValue()));console.log(parcel)
 let parcelarray=new Array(parcel.length);
 for(let i=0;i<parcel.length;i++){parcelarray[i]=parcel.charCodeAt(i);};console.log(parcelarray)
 let bytes=new Uint8Array(parcelarray);console.log(bytes)
 var blob=new Blob([bytes],{type:'text/plain'});
 buffer.onload=function(event)
{instance.socket.emit("save",{subject:instance.display.wrapper.id,content:btoa(event.target.result)})
 buffer.readAsBinaryString(blob);
}
}

 function suppresssave(e){e=e||window.event;if(!e.ctrlKey)return;switch(e.which||e.keyCode){case 83:case 87:e.preventDefault();e.stopPropagation();break;}};

 var monokai=`.cm-s-monokai.CodeMirror { background: #272822; color: #f8f8f2; }
.cm-s-monokai div.CodeMirror-selected { background: #49483E; }
.cm-s-monokai .CodeMirror-line::selection, .cm-s-monokai .CodeMirror-line > span::selection, .cm-s-monokai .CodeMirror-line > span > span::selection { background: rgba(73, 72, 62, .99); }
.cm-s-monokai .CodeMirror-line::-moz-selection, .cm-s-monokai .CodeMirror-line > span::-moz-selection, .cm-s-monokai .CodeMirror-line > span > span::-moz-selection { background: rgba(73, 72, 62, .99); }
.cm-s-monokai .CodeMirror-gutters { background: #272822; border-right: 0px; }
.cm-s-monokai .CodeMirror-guttermarker { color: white; }
.cm-s-monokai .CodeMirror-guttermarker-subtle { color: #d0d0d0; }
.cm-s-monokai .CodeMirror-linenumber { color: #d0d0d0; }
.cm-s-monokai .CodeMirror-cursor { border-left: 1px solid #f8f8f0; }

.cm-s-monokai span.cm-comment { color: #75715e; }
.cm-s-monokai span.cm-atom { color: #ae81ff; }
.cm-s-monokai span.cm-number { color: #ae81ff; }

.cm-s-monokai span.cm-comment.cm-attribute { color: #97b757; }
.cm-s-monokai span.cm-comment.cm-def { color: #bc9262; }
.cm-s-monokai span.cm-comment.cm-tag { color: #bc6283; }
.cm-s-monokai span.cm-comment.cm-type { color: #5998a6; }

.cm-s-monokai span.cm-property, .cm-s-monokai span.cm-attribute { color: #a6e22e; }
.cm-s-monokai span.cm-keyword { color: #f92672; }
.cm-s-monokai span.cm-builtin { color: #66d9ef; }
.cm-s-monokai span.cm-string { color: #e6db74; }

.cm-s-monokai span.cm-variable { color: #f8f8f2; }
.cm-s-monokai span.cm-variable-2 { color: #9effff; }
.cm-s-monokai span.cm-variable-3, .cm-s-monokai span.cm-type { color: #66d9ef; }
.cm-s-monokai span.cm-def { color: #fd971f; }
.cm-s-monokai span.cm-bracket { color: #f8f8f2; }
.cm-s-monokai span.cm-tag { color: #f92672; }
.cm-s-monokai span.cm-header { color: #ae81ff; }
.cm-s-monokai span.cm-link { color: #ae81ff; }
.cm-s-monokai span.cm-error { background: #f92672; color: #f8f8f0; }

.cm-s-monokai .CodeMirror-activeline-background { background: #373831; }
.cm-s-monokai .CodeMirror-matchingbracket {
  text-decoration: underline;
  color: white !important;
}`;

var codemirror=`/* BASICS */

.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: monospace;
  height: 300px;
  color: black;
  direction: ltr;
}

/* PADDING */

.CodeMirror-lines {
  padding: 4px 0; /* Vertical padding around content */
}
.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
  padding: 0 4px; /* Horizontal padding of content */
}

.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  background-color: white; /* The little square between H and V scrollbars */
}

/* GUTTER */

.CodeMirror-gutters {
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}
.CodeMirror-linenumbers {}
.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999;
  white-space: nowrap;
}

.CodeMirror-guttermarker { color: black; }
.CodeMirror-guttermarker-subtle { color: #999; }

/* CURSOR */

.CodeMirror-cursor {
  border-left: 1px solid black;
  border-right: none;
  width: 0;
}
/* Shown when moving in bi-directional text */
.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver;
}
.cm-fat-cursor .CodeMirror-cursor {
  width: auto;
  border: 0 !important;
  background: #7e7;
}
.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1;
}
.cm-fat-cursor-mark {
  background-color: rgba(20, 255, 20, 0.5);
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
}
.cm-animate-fat-cursor {
  width: auto;
  border: 0;
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
  background-color: #7e7;
}
@-moz-keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}
@-webkit-keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}
@keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}

/* Can style cursor different in overwrite (non-insert) mode */
.CodeMirror-overwrite .CodeMirror-cursor {}

.cm-tab { display: inline-block; text-decoration: inherit; }

.CodeMirror-rulers {
  position: absolute;
  left: 0; right: 0; top: -50px; bottom: 0;
  overflow: hidden;
}
.CodeMirror-ruler {
  border-left: 1px solid #ccc;
  top: 0; bottom: 0;
  position: absolute;
}

/* DEFAULT THEME */

.cm-s-default .cm-header {color: blue;}
.cm-s-default .cm-quote {color: #090;}
.cm-negative {color: #d44;}
.cm-positive {color: #292;}
.cm-header, .cm-strong {font-weight: bold;}
.cm-em {font-style: italic;}
.cm-link {text-decoration: underline;}
.cm-strikethrough {text-decoration: line-through;}

.cm-s-default .cm-keyword {color: #708;}
.cm-s-default .cm-atom {color: #219;}
.cm-s-default .cm-number {color: #164;}
.cm-s-default .cm-def {color: #00f;}
.cm-s-default .cm-variable,
.cm-s-default .cm-punctuation,
.cm-s-default .cm-property,
.cm-s-default .cm-operator {}
.cm-s-default .cm-variable-2 {color: #05a;}
.cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
.cm-s-default .cm-comment {color: #a50;}
.cm-s-default .cm-string {color: #a11;}
.cm-s-default .cm-string-2 {color: #f50;}
.cm-s-default .cm-meta {color: #555;}
.cm-s-default .cm-qualifier {color: #555;}
.cm-s-default .cm-builtin {color: #30a;}
.cm-s-default .cm-bracket {color: #997;}
.cm-s-default .cm-tag {color: #170;}
.cm-s-default .cm-attribute {color: #00c;}
.cm-s-default .cm-hr {color: #999;}
.cm-s-default .cm-link {color: #00c;}

.cm-s-default .cm-error {color: #f00;}
.cm-invalidchar {color: #f00;}

.CodeMirror-composing { border-bottom: 2px solid; }

/* Default styles for common addons */

div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}
div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}
.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
.CodeMirror-activeline-background {background: #e8f2ff;}

/* STOP */

/* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

.CodeMirror {
  position: relative;
  overflow: hidden;
  background: white;
}

.CodeMirror-scroll {
  overflow: scroll !important; /* Things will break if this is overridden */
  /* 30px is the magic margin used to hide the element's real scrollbars */
  /* See overflow: hidden in .CodeMirror */
  margin-bottom: -30px; margin-right: -30px;
  padding-bottom: 30px;
  height: 100%;
  outline: none; /* Prevent dragging from highlighting the element */
  position: relative;
}
.CodeMirror-sizer {
  position: relative;
  border-right: 30px solid transparent;
}

/* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */
.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  position: absolute;
  z-index: 6;
  display: none;
}
.CodeMirror-vscrollbar {
  right: 0; top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.CodeMirror-hscrollbar {
  bottom: 0; left: 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.CodeMirror-scrollbar-filler {
  right: 0; bottom: 0;
}
.CodeMirror-gutter-filler {
  left: 0; bottom: 0;
}

.CodeMirror-gutters {
  position: absolute; left: 0; top: 0;
  min-height: 100%;
  z-index: 3;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -30px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: none !important;
  border: none !important;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0; bottom: 0;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-gutter-wrapper ::selection { background-color: transparent }
.CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

.CodeMirror-lines {
  cursor: text;
  min-height: 1px; /* prevents collapsing before first draw */
}
.CodeMirror pre.CodeMirror-line,
.CodeMirror pre.CodeMirror-line-like {
  /* Reset some styles that the rest of the page might have set */
  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-variant-ligatures: contextual;
  font-variant-ligatures: contextual;
}
.CodeMirror-wrap pre.CodeMirror-line,
.CodeMirror-wrap pre.CodeMirror-line-like {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  z-index: 0;
}

.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  padding: 0.1px; /* Force widget margins to stay inside of the container */
}

.CodeMirror-widget {}

.CodeMirror-rtl pre { direction: rtl; }

.CodeMirror-code {
  outline: none;
}

/* Force content-box sizing for the elements where we expect it */
.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.CodeMirror-cursor {
  position: absolute;
  pointer-events: none;
}
.CodeMirror-measure pre { position: static; }

div.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3;
}
div.CodeMirror-dragcursors {
  visibility: visible;
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible;
}

.CodeMirror-selected { background: #d9d9d9; }
.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
.CodeMirror-crosshair { cursor: crosshair; }
.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

.cm-searching {
  background-color: #ffa;
  background-color: rgba(255, 255, 0, .4);
}

/* Used to force a border model for a node */
.cm-force-border { padding-right: .1px; }

@media print {
  /* Hide the cursor when printing */
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}

/* See issue #2901 */
.cm-tab-wrap-hack:after { content: ''; }

/* Help users use markselection to safely style text background */
span.CodeMirror-selectedtext { background: none; }`;