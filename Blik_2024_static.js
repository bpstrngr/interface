 import {note,compose,buffer,when,infer,combine,drop,slip,crop,swap,pass,compound,exit,tether,either,wether,record,describe,string,pattern,major,match,has,is} from "./Blik_2023_inference.js";
 import {access,persist,purge,resolve,list,modularise,cookies,cookie} from "./Blik_2023_interface.js";
 import {document,hypertext,stylesheet,expose,throttle,activate,error} from "./Blik_2023_fragment.js";
 import {serialize,scope,mime} from "./Blik_2023_meta.js";
 import {search,merge,prune,random,extract} from "./Blik_2023_search.js";

 export var classified=["*.git*"].map(term=>RegExp("^"+term.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"));
 export var classify=compose(when(either(string,pattern)),classified.push.bind(classified));
 export function permit(name,classified=classified)
{return !classified.some(term=>string(term)?term===name:term.test(name))||
 exit(Error("Classified"));
};

 var actions=
 {body:{load:function(){console.log("abc")}}
 };

 var style=
 {body:{background:"black",color:"white"}
 };

 let path=compose("url",true,slip("url","parse"),resolve,"pathname");
 let format=either(tether(search,["query","format"]),swap("binary"));

 export default
 {get:compose(combine(compose
(swap("path","resolve","./"),resolve,true,classified,list
,tether(prune,([field,value],path)=>value===null
?describe(compose(drop(1),format,slip([path,field].flat().join("/")),pass(permit,classified),access),field):value)
),compose
(combine(compose(drop(1),path),crop(1))
,wether(compose("length",major(1)),swap({}),compose(drop(1),infer(scope,([field,value])=>serialize(value,field))))
)),merge)
 ,put:compose
(drop(1)
,pass(authorize,"ranger")
,combine(crop(1),compose(path,pass(permit)),tether(search,["query","force"]))
,note//,wether("body",persist,compose(drop(1),purge))
),error
 ,interface:compose
(crop(1),"get",routes=>({pre:{"#text":JSON.stringify(routes,null,2)}}),"interface","icon","./actions","./style",hypertext,document,actions,activate
),style:compose
(drop(),style,true,stylesheet,["body"],record,{type:"css"},merge
),actions:compose
(drop(),{exports:{default:actions},imports:{"./actions":["actions"],"./Blik_2023_search.js":[,"merge"]}}
,serialize,["body"],record,{type:mime("js")},merge
),icon:compose
(drop(),{svg:{viewBox:"0 0 1 1",width:"10px",height:"10px",circle:{cx:"0.5",cy:"0.5",r:"0.3"}}},document
),scope(request)
{return compose.call
(this,"toString","."+request.url.replace(/\/scope.*/,"")
,buffer(modularise,compose(note,exit)),either("namespace",crop(1)),infer(scope,([field,value])=>serialize(value,null))
);
}};

 export function persistence(resource,fields)
{classify(resource);
 return (
 {get:async function(request)
{let route=request?.url?.split("/")||request||[];
 let records=await buffer
(compose("object",access)
,wether(compose("code",is("ENOENT")),compose(drop(1),"{}",true,access,"object",access),exit)
)(resource);
 records=prune.call(records,([field,value])=>request&&["signature","code"].includes(field)?undefined:value,0,2);
 return prune.call(records,([field,value],path)=>path.at(-1)==="pub"&&route.length>4
?compose(swap(field),"binary",pass(permit,classified),access):value);
},put:async function(request)
{let {signature}=cookies(request.headers.cookie||"");
 let body=await prune.call(JSON.parse(request.body)
,([field,value])=>fields[field]?.(value)||value);
 when(has(Object.keys(fields)))(body);
 let {2:name}=request.url.split("/");
 let credentials=extract.call(body,Object.keys(fields));
 let anonymous=!signature&&!Object.keys(credentials).length;
 if(anonymous)
 exit(Error("missing "+Object.keys(credentials)+" or signature for "+name));
 let records=await this.get();
 let record=search.call(records,name);
 let put=Date.now();
 let expiry=1000*60*60;
 let expired=put-record?.put>expiry;
 let mismatch=signature
?signature!==record.signature||expired
:Object.entries(credentials).find(([field,value])=>value!==record[field])?.[0];
 if(mismatch)
 exit(Error(mismatch+" not authorized."));
 signature=signature&&expired?signature:random(20);
 record=[record,body,{signature,put}].reduce(merge);
 merge(records,record,name);
 await access(resource,JSON.stringify(records),true);
 record=prune.call(record,([field,value])=>["signature","code"].includes(field)?undefined:value,0,1);
 return merge(records
,{cookie:{signature,path:"/",expires:new Date(record.put+expiry).toUTCString(),httponly:true,samesite:true}
 ,body:record
 },name);
},resource // exposed for host to classify it publicly, for when it's hard-coded in a route declaration otherwise. 
 });
};

 export function validate(entry,template)
{let mistakes=Object.entries(template).reduce((mistakes,[key,validate])=>
 validate(entry[key])?mistakes:mistakes.concat(key),[]);
 if(mistakes.length)
 throw Error("invalid "+mistakes);
};

 async function authorize(request,authority)
{when(defined)(authority);
 let {signature}=cookie(request.headers);
 let {author}=signature&&await compose(fetch,"json")("/signature/"+signature);
 let {rank}=author&&await compose(fetch,"json")("/author/"+author);
 if(rank!=authority)
 exit(Error("unauthorised"));
};
