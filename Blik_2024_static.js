 import {note,compose,buffer,refer,drop,crop,compound,exit,tether} from "./Blik_2023_inference.js";
 import {access,persist,resolve,list,mime,modularise} from "./Blik_2023_interface.js";
 import {document,hypertext,stylesheet,expose,throttle,activate,error} from "./Blik_2023_fragment.js";
 import {serialize,scope} from "./Blik_2023_meta.js";
 import {merge} from "./Blik_2023_search.js";
 import local from "./Blik_2023_host.js";

 var actions=
 {body:{load:function(){console.log("abc")}}
 };

 var style=
 {body:{background:"black",color:"white"}
 };

 export default
 {...local,error
 ,interface:compose
(crop(1),"get",routes=>({pre:{"#text":JSON.stringify(routes,null,2)}}),"interface","icon","./actions","./style",hypertext,document,actions,activate
),style:compose
(drop(),style,true,stylesheet,"body",refer,{type:"css"},merge
),actions:compose
(drop(),{exports:{default:actions},imports:{"./actions":["actions"],"./Blik_2023_search.js":[,"merge"]}}
,serialize,"body",refer,{type:mime("js")},merge
),icon:compose
(drop(),{svg:{viewBox:"0 0 1 1",width:"10px",height:"10px",circle:{cx:"0.5",cy:"0.5",r:"0.3"}}},document
),scope(request){return compose("toString",[".",request.path].flat().slice(0,-1).join("/"),modularise,"namespace",scope)(this);}
 };
