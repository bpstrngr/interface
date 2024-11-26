 import {merge} from "./Blik_2023_search.js";
 import {scaleLinear} from './Bostock_2011_d3.js';

 export var color=
 {velvet:"#750000"
 ,blush:"#EA4C4B"
 ,red:"#c62828"
 ,orange:"#EF7C42"
 ,yellow:"#FFB133"
 ,lemon:"#EAC24D"
 ,bone:"#DBD1B4"
 ,lime:"#9BAA44"
 ,green:"#2e7d32"
 ,sage:"#93b793"
 ,jungle:"#10624C"
 ,blue:"#4285F4"
 ,indigo:"#283593"
 ,service:"#fbbc05"
 ,hazard:"#ea4335"
 ,provider:"#2E7D32"
 ,stakeholder:"#4285F4"
 ,flora:"rgba(46,125,50)"
 ,fauna:"rgba(198,40,40)"
 ,rainbow(...input){this.rainbow=spectrum(...["red","yellow","green","blue"].map(key=>this[key]));return this.rainbow(...input);}
 ,health(...input){this.health=spectrum(...["green","lime","lemon","orange","velvet"].map(key=>this[key]));return this.health(...input);}
 ,google(...input){this.google=spectrum(...["#ea4335","#fbbc05","#2E7D32","#4285F4","rgb(106,68,233)"]);return this.google(...input);}
 };

 export function spectrum(...spectrum)
{let domain=Array.apply(null,Array(spectrum.length));
 domain=domain.map((item,index)=>index/(spectrum.length-1)).reverse();
 return scaleLinear().range(spectrum).domain(domain);
};

 export var fontface=
 {averia:{"font-family":"averia",src:"url(/Sayers_2011_averia.ttf)"}
 ,oswald:{"font-family":"oswald",src:"url(/Vernon_2011_Oswald-Regular.ttf)"}
 ,ranger:{"font-family":"ranger",src:"url(/Blik_2018_calligraphy.ttf)"}
 };

 let material={"box-shadow":"black 0px 0px 10px","&:hover":{"box-shadow":"black 0px 0px 50px"},margin:"1em"};
 let glow={filter:"url(#shadow_white)"};

 var text=
 {glow:{"text-shadow":"white 0px 0px 2px,white 0px 0px 2px",transition:"all 0.3s"}
 };

 let table=
 {"font-size":"inherit",transition:"all 1s"
 ,"&#dashboard tr":{"vertical-align":"top"}
 ,"& tr input[type=checkbox]":
 {appearance:"none","font-family":"inherit",cursor:"pointer",width:"auto","line-height":"1.3em","font-size":"1.5em",margin:0
 ,"&:not(:disabled):hover":{"text-shadow":"rgb(255,255,255) 0px 0px 10px,rgb(255,255,255) 0px 0px 10px,rgb(255,255,255) 0px 0px 10px"}
 ,"&:after":{content:"'✘'",color:"var(--isle)","margin-left":"3px","margin-right":"3px"}
 //,"&:last-of-type:after":{content:"'🔓'"}
 ,"&:focus:after":{"text-shadow":"rgb(255,255,255) 0px 0px 10px, rgb(255,255,255) 0px 0px 10px, rgb(255,255,255) 0px 0px 10px"}
 ,"&:checked:after":{content:"'✓'",color:"var(--highlight)","font-weight":800}
 }
 ,"&.homogenous>tbody>tr":{"flex-direction":"row",width:"90vw","justify-content":"center"}
 ,"&.heterogenous,&.homogenous":
 {position:"relative","font-family":"averia","font-size":"10px",display:"block"
 ,"&>tbody":
 {display:"block"
 ,"&>tr":
 {position:"relative",display:"flex","flex-wrap":"wrap",width:"90vw","justify-content":"center",margin:"auto"
 ,"&>td":{position:"relative","text-align":"center",display:"block","& div":{width:"150px",height:"150px","text-align":"center",margin:"auto",overflow:"hidden"}}
 ,"& svg":{height:"30px"}
 }
 }
 }
 };

 var vignette=
 {position:"relative",width:"fit-content",margin:"auto"
 ,"&>img":{width:"100%"}
 ,"&:before":
 {content:"''",display:"block",position:"absolute",width:"100%",height:"100%","pointer-events":"none"
 ,"box-shadow":Array(8).fill("inset 0 0 80px var(--abyss)").join(",")
 }
 };

 var constant=
 {position:"fixed",left:0,right:0,"margin":"auto",overflow:"visible"
 ,width:"100%",height:"auto","max-width":"600px","max-height":"600px"
 };

 var middle=
 {overflow:"visible"
 ,"min-height":"100vh","max-width":"800px",width:"85%"
 ,margin:"auto","box-sizing":"border-box"
 };

 export var overflow=
 {overflow:"scroll",background:`
 linear-gradient(90deg,var(--abyss) 20%,#ffffff00) center left
,linear-gradient(90deg,#ffffff00,var(--abyss) 80%) center right
,radial-gradient(farthest-side at 100% 50%,var(--text),#00000000 80%) center right
,radial-gradient(farthest-side at 0% 50%,var(--text),#00000000 80%) center left`
 ,"background-size":"40px 100%,40px 100%,10px 120%,10px 120%"
 ,"background-repeat":"no-repeat"
 ,"background-attachment":"local,local,scroll,scroll"
 };

 export var link=
 {"a,span[role='link']":{"text-decoration":"none",position:"relative",color:"#0097a7"}
 };

 var input=
 {transition:"all var(--transition)","text-shadow":"inherit"
 ,"&:focus+ul":{display:"block"}
 ,"&[type=text],&[type=checkbox]":
 {display:"inline-block",outline:"none","background-color":"transparent",border:"none","min-width":"20px","box-sizing":"border-box"
 ,color:"inherit","text-align":"center","font-family":"inherit","font-size":"inherit"
 ,"margin-top":"1.5em"
 ,"&#code":{"-webkit-text-security":"disc"}
 }
 ,"&[type=radio]":{display:"none"}
 ,"&[type=checkbox]":
 {//appearance:"none","font-family":"inherit",cursor:"pointer",width:"auto"
  "&:hover":{"text-shadow":"rgb(255,255,255) 0px 0px 10px,rgb(255,255,255) 0px 0px 10px,rgb(255,255,255) 0px 0px 10px"}
 ,"&:after":{content:"' ?'","margin-left":"3px","margin-right":"3px"}
 ,"&:focus:after":{"text-shadow":"rgb(255,255,255) 0px 0px 10px, rgb(255,255,255) 0px 0px 10px, rgb(255,255,255) 0px 0px 10px"}
 ,"&:checked:after":{content:"'✓'",color:"var(--highlight)"}
 }
 ,"&~svg":{"margin-right":"0.5em"}
 };

 var label=
 {position:"relative",display:"inline-block","white-space":"nowrap","vertical-align":"middle",cursor:"pointer"
 ,"&:hover":{"&>svg":glow,"&>input,&>span[role=input]":text.glow}
 ,"&>svg":{float:"left",height:"1em","vertical-align":"middle",cursor:"pointer",overflow:"visible"}
 ,"&>span:not([role=input])":
 {float:"left",height:"3em","margin-top":"1.5em","white-space":"pre"
 ,"&:not(:empty)":{"&:before":{content:"' '"},"&:after":{content:"' '"}}
 }
 ,"& ul":
 {display:"none","z-index":"2",padding:"0px","margin-bottom":"0px","text-align":"left","pointer-events":"none","list-style-type":"none"
 ,"& ul":{position:"relative",bottom:"initial","max-height":"initial","vertical-align":"top","text-align":"left"}
 ,"& li":
 {position:"relative",display:"inline-block","pointer-events":"all","padding-right":"1em",color:"var(--text)","vertical-align":"top",margin:"auto",left:"0px",right:"0px","white-space":"pre","padding-left":"1em"
 ,"&:hover,&.hover":
 {color:"var(--highlight)"
 ,"& ul":
 {display:"inline-block","white-space":"pre"
 ,"&:hover>li":{display:"block"}
 }
 }
 ,"&>svg":{position:"absolute",height:"1em",left:"0px","margin-left":"0px","margin-right":"0px",transform:"scale(0.9)",fill:"var(--text)"}
 }
 }
 ,"&>ul":
 {position:"fixed","margin-left":"0.6em","max-height":"100%","max-width":"100%","padding-top":"6em",bottom:"6em","box-sizing":"border-box",width:"inherit","overflow":"scroll"//"background-image":"radial-gradient(at center bottom, rgb(17, 17, 17) 0%, rgba(33, 33, 33, 0) 100%)"
 ,"&>li":{display:"block"}
 ,"&:hover":{display:"block"}
 }
 ,"&[focused=true]>ul":{display:"block"}
 ,"&[for=message],&[for=source]":{"&>ul":
 {"text-align":"left",width:"auto","&>li":{"text-shadow":"black 0px 0px 10px","white-space":"nowrap","&>span":{"white-space":"normal"}}
 ,"background-image":"linear-gradient(to right, rgb(17, 17, 17) 0%, rgba(33, 33, 33, 0) 100%)"
 }}
 ,"&[for=message]>ul":
 {display:"block","margin-left":"-5em","max-height":"50vh","min-width":"150px"
 ,"&>li":
 {opacity:0,animation:"fadeout 6s","padding-left":0,"min-height":"4em","white-space":"normal"
 ,"&>img,&>canvas[role=img]":{...material,margin:"1em",height:"2em",float:"left","border-radius":"50%","background-color":"var(--isle)",padding:".5em",margin:".5em .5em 0 .5em"}
 ,"&>div":{color:"var(--isle)"}
 }
 ,"&>li:not(:last-of-type)":{animation:"fadeout 2s"}
 ,"&>span":{position:"fixed",bottom:"1.5em",left:"5.5em",color:"black"}
 ,"&:hover>li":{opacity:1,animation:"fadein 1s"}
 }
 ,"&[for=message]>span.status":{position:"absolute",left:"-0.5em",top:"-1.5em",color:"black"}
 };

 export default
 {middle,material,glow,input,label,link,table,vignette,text
 ,theme:
 {":root":Object.fromEntries(Object.entries(
 {abyss:"#111111",isle:"#303030",text:"#dbd1b4",note:"#7a7564",highlight:"rgb(230,238,156)"
 ,font:"averia",hand:"ranger",form:"3.5em",size:"14px",align:"inherit",transition:"1s"
 }).map(([key,value])=>["--"+key,value]))
 ,"::-webkit-scrollbar":{display:"none"}
 }
 ,body:
 {margin:0,"text-align":"center",overflow:"hidden","font-family":"var(--font)"
 ,"font-size":"var(--size)",color:"var(--text)","background-color":"var(--abyss)"
 ,transition:"all var(--transition)"
 }
 ,a:{"text-decoration":"none",position:"relative",color:"#0097a7"}
 ,blockquote:
 {"&>p:last-child":{"text-transform":"italic","padding-left":"20%","&:before":{content:'"- "',"white-space":"pre"},"&:after":{content:'""'}}
 ,...Object.fromEntries(["before","after"].map(side=>["&>p:"+side,{content:'"\\""'}]))
 }
 ,row:{display:"inline-block",margin:"0 1em",height:"100%","list-style":"none"}
 ,column:{display:"block",margin:"1em 0","list-style":"none"}
 ,shelf:{position:"absolute",bottom:0,left:0,right:0,"text-align":"left"}
 ,radio:
 {"border-radius":"100%","background-color":"black",transform:"scale(0.8)"
 ,"&[checked=true]":
 {display:"none"
 ,"&[for=talk]~label[for=source]":{display:"none"}
 ,"&[for=module]~label[for=message]":{display:"none"}
 }
 }
 ,frame:
 {"white-space":"pre-wrap","overflow-wrap":"break-word",overflow:"scroll"
 ,width:"100vw",height:"100vh","text-align":"var(--align)"
 ,"& h2[onclick],.entry":{cursor:"pointer","&:hover":{transform:"scale(1.2)"}}
 //,"& .entry+span[id]":{position:"relative",overflow:"hidden",display:"none"}
 ,"& span[name]+span":{"white-space":"pre-wrap"}
 // ,"&>span":
 // {"vertical-align":"middle","font-size":"30px","line-height":"30px"
 // ,"&:not([id]).entry":{position:"relative",display:"block",margin:"auto auto 30px",height:"auto",cursor:"pointer"}
 // }
 }
 ,media:
 {overflow:"visible",position:"relative","max-width":"100vw","max-height":"100vh"
 ,"& g.node":
 {"& text":{"pointer-events":"none"}
 ,"& foreignObject":{transform:"tanslate(-5px,-5px)"}
 ,"& body":{background:"transparent"}
 ,"& form":
 {overflow:"scroll"
 ,color:"inherit"
 //,left:x+width+fragment.scrollLeft,top:node.y-10
 ,"font-size":"inherit"
 ,"text-shadow":"black 0px 0px 2px,black 0px 0px 2px,black 0px 0px 2px"
 ,"white-space":"nowrap"
 }
 }
 }
 ,card:
 {".card":
 {...material,margin:"1em",position:"relative",display:"inline-block",transition:"all 0.5s","text-align":"center",cursor:"pointer","border-radius":"50%"
 ,"&:hover":{...material["&:hover"],"&>span.post":{top:-15},"&>svg.trash":{display:"block"}}
 ,"&>svg.trash":{display:"none",position:"absolute",top:5,right:5,"&:hover":{fill:"#b71c1c"}}
 ,"&>p":{"font-size":"1.2em"}
 ,"&>span":{display:"block"}
 ,"&>span.post":{position:"absolute",top:5,left:5,color:"var(--isle)"}
 ,"&>p,&>span":{"&>svg":{display:"none"},"&:hover>svg":{display:"inline"}}
 ,"& select,& input":{"background-color":"transparent",color:"var(--text)"}
 ,"&.record":{padding:"10px","border-radius":"10px","background-color":"var(--isle)"}
 }
 }
 ,multimedialink:{span:{"&[onclick]":{color:"rgb(255,171,0)"}}}
 ,animations:
 {"@keyframes fadeout":{"0%":{opacity:1,display:"block"},"50%":{opacity:1,display:"block"},"100%":{opacity:0,display:"none"}}
 ,"@keyframes fadein":{from:{opacity:0,display:"none"},to:{opacity:1,display:"block"}}
 ,"@keyframes stroke":{"0%":{stroke:"rgb(66,133,244)"},"25%":{stroke:"rgb(222,62,53)"},"50%":{stroke:"rgb(247,194,35)"},"75%":{stroke:"rgb(27,154,89)"},"100%":{stroke:"rgb(66,133,244)"}}
 ,"@keyframes radar":{"0%":{padding:"5px",margin:"15px"},"100%":{padding:"15px",margin:"5px","border-color":"transparent"}}
 ,"@keyframes rotate":{"0%":{transform:"rotate(0deg)"},"100%":{transform:"rotate(360deg)"}}
 ,"@keyframes rotatetilt":{"0%":{transform:"rotateX(60deg) rotate(0deg)"},"100%":{transform:"rotateX(60deg) rotate(360deg)"}}
 ,"@keyframes pulse":Array(5).fill(1).map((scale,index)=>index%2?1.2:1).reduce((pulse,scale,index)=>
 Object.assign(pulse,{[index*25+"%"]:{transform:"scale("+scale+")"}}),{})
 }
 ,wheel:
 {"@keyframes dash":{"0%":{"stroke-dashoffset":187},"50%":{"stroke-dashoffset":1,transform:"rotate(135deg)"},"100%":{"stroke-dashoffset":187,transform:"rotate(450deg)"}}
 ,"svg.wheel":{height:"1em","& circle":{"stroke-dasharray":187,"stroke-dashoffset":0,"transform-origin":"center center",animation:"1.5s ease-in-out 0s infinite normal none running dash, 6s ease-in-out 0s infinite normal none running colors"}}
 //,"svg.wheel":{"& circle":{"stroke-dasharray":187,"stroke-dashoffset":0,"transform-origin":"center center",animation:"1.5s ease-in-out 0s infinite normal none running dash, 6s ease-in-out 0s infinite normal none running colors"}}
 }
 ,goo:
 {"@keyframes waltz":Object.fromEntries(Array(5).fill(70).map((offset,index,{length})=>
[index/(length-1)*100+"%"
,{transform:"translate("+(index%2?offset:0)*(index<2?-1:1)+"%)"}
]))
 ,"@keyframes scaler":Object.fromEntries(Array(3).fill(30).map((r,index,{length})=>
 [index/(length-1)*100+"%",{r:r/(index%2?2:1),"z-index":index%2}]))
 ,"@keyframes fill":Object.fromEntries(
 ["rgb(66,133,244)","rgb(222,62,53)","rgb(247,194,35)","rgb(27,154,89)","rgb(66,133,244)"].map((fill,index,{length})=>
 [index/(length-1)*100+"%",{fill}]))
 ,"svg.wheel":
 {overflow:"visible"
 ,"& circle":
 {width:"50px",height:"50px","z-index":1,overflow:"visible"
 ,"&:first-of-type":{r:15,animation:"6s infinite cubic-bezier(0, 0.5, 1, 0.5) fill,3s infinite cubic-bezier(0.75, 0, 0, 1) waltz"}
 ,"&+circle":{animation:"6s infinite cubic-bezier(0, 0.5, 1, 0.5) fill,1.5s infinite cubic-bezier(0.75, 0, 0, 1) scaler"}
 }
 }
 }
 ,carousel:
 {...vignette
 ,margin:"auto"
 ,"&>div.reel":
 {overflow:"scroll","max-width":"90%",margin:"auto","white-space":"nowrap"
 ,"&>div":{display:"inline-block","white-space":"normal",width:"100%","&>img":{"max-height":"200px"},"&>p":{"white-space":"normal"}}
 }
 ,"&>div.arrow":
 {position:"absolute",top:"50%","border-radius":"50%",padding:"0.5em",cursor:"pointer","z-index":"10","line-height":0
 ,"&:first-of-type":{left:0}
 ,"&:last-of-type":{right:0,transform:"scaleX(-1)"}
 ,"&:hover":{"background-color":"var(--isle)","&>svg>*":{filter:"url(#shadow_white)"}}
 }
 }
 ,audio:
 {display:"inline",margin:"auto",height:"0.6em",outline:"none",background:"none"
 ,"&::-webkit-media-controls-panel":{"background-color":"rgb(35, 35, 35)"}
 ,"&::-webkit-media-controls-time-remaining-display":{"text-shadow":"none"}
 ,"&::-webkit-media-controls-current-time-display":{"text-shadow":"none"}
 }
 ,comment:
 {"font-size":"10px","font-family":"Averia Libre","white-space":"nowrap"
 ,"& img":{"height":"2em","width":"2em","vertical-align":"middle","border-radius":"50%"}
 ,"& svg":{"height":"2em","vertical-align":"middle"}
 ,"& span":{"&+svg":{display:"none"},"&:valid+svg":{display:"inline"}}
 ,"& >span":
 {position:"relative",display:"inline-block",margin:"auto auto auto 7px","font-size":"12px","font-family":"Averia",color:"black",padding:"7px 1em","border-radius":"1em 1em 1em 0px","background-color":"rgba(255, 248, 225,0.5)",outline:"none","white-space":"pre-wrap","max-width":"calc(100vw - 6em)"
 ,"&::before":{content:"",color:"rgba(255, 248, 225, 0.5)",position:"absolute",width:"1em",height:"1em",left:"12px",background:"radial-gradient(1em at 1px 1px, transparent, transparent 1em, currentcolor 1em)","margin-left":"-2em",bottom:"0px"}
 ,"& >div":{position:"absolute",display:"block",right:"10px",color:"rgb(97, 97, 97)","font-size":"7px"}
 }
 }
 ,panel()
{return {...[this.material,this.pill].reduce(merge,{})
 ,width:"100%","font-size":"2em",margin:0,"box-sizing":"border-box","border-radius":"0 0 0 0",transition:"all 0.5s"
 ,"&>label":
 {...this.label
 ,"&>input:focus~svg":Object.fromEntries(Array(3).fill(3*45).map((deg,n)=>["& rect:nth-of-type("+(n+1)+")",{width:n==1?1:0.9,transform:"rotate("+(deg-n*45)+"deg)"}]))
 ,"&:first-of-type":{float:"right","&>svg":{transform:"scale(1.5)"}}
 ,"& rect":{transform:"rotate(0deg)","transform-origin":"center",transition:"all 0.5s"}
 }      };
},pill:{display:"inline-block","border-radius":"100vh",cursor:"pointer"}
 ,codemirror:{"div.cm-gutters":{"background-color":"var(--abyss) !important"}}
 ,socialecologies:
 {".gallery-row":{"white-space":"nowrap",width:"100% !important"}
 ,".gallery-group":{display:"inline-block"}
 }
 ,assistant:{"& input":{"font-size":"20px","font-family":"inherit",color:"rgb(144,164,174)","text-align":"center",border:"none",outline:"none","background-color":"transparent"},"& *":{display:"block",margin:"auto"}}
 ,cloudflare:{"#cf_alert_div>div":{background:"black !important"}}
 };
