 import {note,compose,buffer,describe,drop,crop,compound,exit} from "./Blik_2023_inference.js";
 import {access,persist,resolve,list,scope} from "./Blik_2023_interface.js";
 import fragment,{document,hypertext,stylesheet,expose,dispatch,throttle,activate,populate} from "./Blik_2023_fragment.js";
 import {namespace} from "./Blik_2023_meta.js";
 import {merge} from "./Blik_2023_search.js";
 import local from "./Blik_2023_host.js";

 var actions=
 {body:{load:function(){console.log("abc")}}
 };

 export default
 {...local,routes:compose
(crop(1),"get",{spread:"force"},fragment.network,throttle,{style:"background:#222222"},populate
),icon:compose
(drop(),{svg:{viewBox:"0 0 1 1",width:"10px",height:"10px",circle:{cx:"0.5",cy:"0.5",r:"0.3"}}},document
),style:compose
(drop(),{body:{background:"black",color:"white"}},true,stylesheet,"body",describe,{type:"css"},merge
),actions:compose
(drop(),{default:actions},{"./actions":["actions"],"./Blik_2023_fragment.js":[,"dispatch"],"./Blik_2023_search.js":[,"merge"]},String(expose)
,namespace,"body",describe,{type:"js"},merge
),interface:compose
(drop(),{div:{"#text":"Interface"}},"concept","icon","./actions","./style",hypertext,document,actions,activate
)};

 export function module(source)
{return Object.fromEntries(Object.entries(source).map(([field,term])=>
 [field,compound(term)?module(term):term?String(term):term]))
};
