 import {note,compose,buffer,describe,drop,crop,compound,exit,tether} from "./Blik_2023_inference.js";
 import {access,persist,resolve,list,scope} from "./Blik_2023_interface.js";
 import fragment,{document,hypertext,stylesheet,expose,throttle,activate} from "./Blik_2023_fragment.js";
 import {namespace} from "./Blik_2023_meta.js";
 import {merge} from "./Blik_2023_search.js";
 import local from "./Blik_2023_host.js";

 var actions=
 {body:{load:function(){console.log("abc")}}
 };

 var style=
 {body:{background:"black",color:"white"}
 };

 export default
 {...local
 ,routes:compose
(crop(1),"get",{spread:"force"},fragment.network,throttle,{style:"background:#222222"},tether(document)
),interface:compose
(drop(),{div:{"#text":"interface"}},"interface","icon","./actions","./style",hypertext,document,actions,activate
),style:compose
(drop(),style,true,stylesheet,"body",describe,{type:"css"},merge,note
),actions:compose
(drop(),{default:actions},{"./actions":["actions"],"./Blik_2023_search.js":[,"merge"]},String(expose)
,namespace,"body",describe,{type:"js"},merge
),icon:compose
(drop(),{svg:{viewBox:"0 0 1 1",width:"10px",height:"10px",circle:{cx:"0.5",cy:"0.5",r:"0.3"}}},document
)};
