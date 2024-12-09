 import {note,compose,buffer,when,collect,infer,combine,remember,drop,slip,differ,crop,each,swap,pass,not,compound,exit,tether,either,wether,record,describe,string,pattern,major,match,has,is,are} from "./Blik_2023_inference.js";
 import {access,persist,purge,resolve,list,modularise,cookies,cookie,query,fetch,path} from "./Blik_2023_interface.js";
 import {document,hypertext,stylesheet,expose,throttle,activate,error} from "./Blik_2023_fragment.js";
 import {serialize,scope,mime} from "./Blik_2023_meta.js";
 import {search,merge,prune,random,extract} from "./Blik_2023_search.js";

 export var classified=["*.git*"].map(term=>RegExp("^"+term.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"));
 export var classify=compose
(when(are(either(string,pattern)))
,each(wether(string,compose(crop(1),slip("path","resolve"),resolve),infer()))
,classified.push.bind(classified)
);
 export var published=[];
 export var publish=compose
(when(are(either(string,pattern)))
,each(wether(string,compose(crop(1),slip("path","resolve"),resolve),infer()))
,published.push.bind(published)
);
 export async function permit(name,list,inclusive)
{let path=await resolve("path","resolve",name);
 let includes=list.some(term=>string(term)?term===path:term.test(path));
 return (inclusive?includes:!includes)||exit(Error(inclusive?"Unauthorized":"Classified"));
};

 var actions=
 {body:{load:function(){console.log("abc")}}
 };

 var style=
 {body:{background:"black",color:"white"}
 };

 let format=compose("url",query,either("format",swap("binary")));

 export default
 {get:compose(combine(compose
(swap("path","resolve","./"),resolve,true,classified,remember(compose(drop(1),list))
,tether(prune,([field,value],path)=>value===null
?describe(compose(drop(1),combine
(compose(swap([path,field].flat().join("/")),pass(permit,classified)),format
),access),field):value)
),compose
(combine(compose(drop(1),"url",slip("url","parse"),resolve,"pathname"),crop(1))
,wether(is("/get"),compose(drop(1),infer(scope,([field,value])=>
 /[()]/.test(value.name)?value.name:serialize(value,null))),swap({}))
)),merge)
 ,put:compose
(drop(1)
,pass(compose(path,slip("path","resolve","./"),resolve,published,true,permit))
,wether(buffer(compose("body",JSON.parse,Object.keys,"length",major(0)),swap(false)),infer(),pass(authorize,"ranger"))
,combine
(compose(path,slip("path","resolve","./"),resolve,pass(permit,classified))
,compose("body",JSON.parse)
,compose("url",query,buffer(differ("overwrite"),swap(undefined)))
)
,combine
(crop(1)
,compose(wether
(drop(-1),drop(1,2)
,compose(combine(buffer(compose(crop(1),infer(access,true),JSON.parse),swap({})),drop(1,2)),0,merge)
),JSON.stringify)
)
,true,access,"object",combine(access,compose(crop(1),slip("path","relative","./"),resolve,collect)),record
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
,buffer(modularise,compose(note,exit)),either("namespace",crop(1)),infer(scope,([field,value])=>"data:text/javascript;"+serialize(value,field))
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
?compose(swap(field),pass(permit,classified),"binary",access):value);
},put:async function(request)
{let {2:name}=request.url.split("/");
 let {signature}=cookies(request.headers.cookie||"");
 let body=await prune.call(JSON.parse(request.body)
,([field,value])=>fields[field]?.(value)||value);
 when(has(Object.keys(fields)))(body);
 let credentials=extract.call(body,Object.keys(fields));
 let anonymous=!signature&&!Object.keys(credentials).length;
 if(anonymous)
 exit(Error("missing "+Object.keys(credentials)+" or signature for "+name));
 let records=await this.get();
 let record=search.call(records,name);
 let mismatch=Object.entries(credentials).find(([field,value])=>value!==record[field])?.[0];
 if(mismatch)
 exit(Error(mismatch+" not authorized."));
 let unauthorised=!signature||signature!==record.signature;
 if(!body.code&&unauthorised)
 exit(Error("invalid signature."));
 let put=Date.now();
 let expiry=1000*60*60;
 let expired=put-record?.put>expiry;
 signature=signature&&!expired?signature:random(20);
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
 let author=await compose(fetch,"json")(request);
 if(author.rank!==authority)
 exit(Error("unauthorised"));
};
