 import {note,prompt,when,pattern,revert,describe,clock,observe,is,has,same,slip,something,compound,refer,infer,tether,wether,collect,provide,route,buffer,differ,compose,combine,either,drop,crop,swap,record,wait,exit,pass,remember,binary,simple,array} from "./Blik_2023_inference.js";
 import {thread,resolve,access,list,window,jsdom,fetch,mime,persist,version,compress,stage} from "./Blik_2023_interface.js";
 import {search,merge,sum,prune} from "./Blik_2023_search.js";
 import {scope} from "./Blik_2023_meta.js";
 import local from "./Blik_2023_host.js";

 export var classified=["*.git*"].map(term=>RegExp("^"+term.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"));
 export var classify=compose(when(either(pattern,infer("every",pattern))),file=>
 [file].flat().forEach(file=>
 classified.push(file)));
 export var permit=(name,classified)=>!classified.some(term=>term.test(name));

 export default
 {async get(request="/")
{if(typeof request!="object")
 request={url:request};
 let {pathname}=await resolve("url","parse",request.url,true);
 //let file=await access("./");
 // if(!file.isDirectory())
 // return access(address,request.query?.encoding||"binary");
 return compose.call
("path","resolve","./",resolve,true,classified,list
,tether(prune,([field,value],path)=>value===null?describe(async function()
{let address=await resolve("path","resolve",[path,field].flat().join("/"));
 if(!permit(address,classified))
 throw Error("Classified");
 return access(address,request.query?.encoding||"binary");
},field):value),pathname.length?{}:scope(this||{}),merge
);
},async put(request)
{let {pathname:address}=await resolve("url","parse","."+request.url,true);
 if(!permit(address,classified))
 throw Error("Classified");
 return persist(request.body,address,request.query?.force);
},delete:async function(request)
{let address=Object.fromEntries(request.headers.origin.split(/:\/+|:/g).map((path,index)=>
 [["protocol","hostname","port"][index],path+(!index?":":"")]));
 let [match,authority]=request.headers.cookie.match(/authority=([^;]*);/)||[];
 let get=path=>new Promise(resolve=>import(address[0].substring(0,-1)).then(({request})=>
 request(note({...address,path,method:"get"}),response=>
 response.setEncoding("utf8").on("data",compose(JSON.parse,resolve))).end())).then(note)
 let {author}=authority&&await get("/authority/"+authority);
 let {rank}=author&&await get("/mind/"+author);
 if(rank!="ranger")
 return Error("unauthorised");
 return purge(path.resolve(...request.path));
}};

 export async function expose(source,parameters,protocol="http",memory)
{let {default:path}=await import("path");
 ({source,parameters,protocol}=await prompt({source,parameters,protocol}));
 let classified=
[source,parameters,...Object.values(parameters||{}).flatMap(({certification})=>
 Object.values(certification||{}).flat()).filter(
 Boolean).map(certification=>path.resolve(certification))
].map(compose(drop(0,1),RegExp));
 classify(classified);
 parameters=await compose(resolve,["default",protocol],tether(route))(parameters);
 let missing=["port",...protocol=="https"?["hmac","distinguishedname"]:[]].filter(key=>!parameters[key]);
 if(missing.length)
 exit("missing "+missing+" in "+arguments[1]);
 // if(await resolve("cluster","isMaster"))
 // return persistence,history,fork(),"process split.";
 encrypt(parameters.hmac);
 let address=[protocol,"//localhost",parameters.port].join(":");
 // let loader thread also import from this interface. 
 thread.postMessage([[address],"interface/jsdom"]);
 await jsdom(address);
 let [agent,{default:routes,broadcast}]=await resolve([protocol,source]);
 let certificates=agent.globalAgent.protocol=="https:"?[certify(Object.values(parameters.certification)[0],parameters.distinguishedname)]:[];
 let virtualize=Object.entries(parameters.certification||{}).slice(1).map(([name,certificate])=>
 compose(name,certify(certificate,parameters.distinguishedname),combine("addContext",crop(1)),drop(1)));
 let report=compose(combine(swap(agent.globalAgent.protocol,"//"),either("_connectionKey",swap(parameters.port))),"/",collect,infer("join",""),"open",note.bind(2));
 return compose
("createServer",parameters.port
,revert((listen,cancel,host,port)=>host.listen(port,infer(listen))),...virtualize
,combine(infer(),report,compose(broadcast,slip("./Blik_2024_room.js","open"),resolve))
,revert((close,cancel,channel)=>observe.call(channel,{close}))
)(agent,...certificates,compose(routes,memory&&{},tether(receive)));
 // function listen(port)
 //{let response={end(body){return {...this.header,body};},setHeader(header){this.header={header}},writeHead(){}};
 // compose(prompt,agent,"url",describe,{headers:{},method:"get"},merge
 //,response,source,memorize,tether(respond),note,swap(this),port,tether(listen))({[agent]:undefined});
 //};
};

 function receive(request)
{let decoder=new TextDecoder("utf-8");
 let body=[];
 observe.call(request
,{data:record(data=>decoder.decode(data)).bind(body)
 ,end:combine(infer((request,body)=>request.body=body.join(""),body),respond.bind(...arguments))
 });
};

 function respond(response,source,memory)
{let route=wether(compose(drop(1),"url",/^http/,"match"),tether(fetch),compose(buffer(tether(recall)),this,stage));
 let retrieve=memory?remember.call(memory,compose(drop(1),route),distinction):route;
 return compose(combine(notify,retrieve),pass(report),drop(1,3),response||this,tether(submit))(source,this);
};

 async function recall(request)
{let method=request.method.toLowerCase();
 let format=either("Content-Type","content-type",swap(undefined))(request);
 let cookie=Object.fromEntries(request.headers?.cookie?.split(/ *; */).map(entry=>entry.split("="))||[]);
 let {query,pathname}=await resolve("url","parse",request.url,true);
 let methodic=pathname==="/"+method;
 if(methodic)
 request.url="/";
 let path=compose
(infer("filter",(step,index)=>(index||step)&&step!==".")
,{get:infer("map",step=>step||"interface")}[method]
)(decodeURIComponent(pathname).split("/"));
 let body=await either(compose(differ(format),resolve,request.body,either("parse",swap(request.body),swap(""))),swap(request.body))(parser);
 return either(tether(route),"error",drop(-1))(this,path,Object.assign(request,{body,path,query,method:methodic?undefined:method,cookie}));
};

 var parser=compose.call
({JSON,"x-www-form-urlencoded":"querystring"}
,Object.entries
,infer("map",compose(combine(compose(0,"toLowerCase",/^/,"application/","replace"),infer(1)),collect))
,Object.fromEntries
);

 function distinction(routes,{url,headers}){let field=url+(headers?.cookie||"");if(this[field]?.status===500)delete this[field];return field;};
 var address=compose(drop(1),combine("url",swap(/^/),either(tether(search,["connection","remoteAddress"]),swap(""))),"replace");
 var color=compose(combine(swap({get:36,put:33,delete:33}),compose(drop(1),"method","toLowerCase")),either(tether(search),swap(35)),"m");
 var notify=compose(combine(swap("\x1b["),color,compose(drop(),clock),swap("@"),address),"...\x1b[0m",collect,infer("join",""),pass(console.log));
 var recolor=compose(combine(crop(1),compose(drop(1),"status",wether(is(200),swap(32),swap(31)))),infer("replace",/[0-9]{2}/),infer("slice",0,-7));
 var redate=compose(combine(infer(),compose(drop(),clock,"@","concat")),infer("replace",/(?:[0-9]{2}[:@]){3}/));
 var inform=compose(drop(1),combine("status",compose("headers",infer("get","Content-Type")),swap("\x1b[0m")));//+": \""+String(body).replace(/^([\s\S]{20})[\s\S]*$/,(...match)=>match[1]+"...")+"\"";
 var report=compose(combine(compose(recolor,redate),inform),collect,infer("join"," "),console.log);

 export async function submit(response)
{let {status,location,cookie}=this;
 let type=this.headers.get("Content-Type");
 let body=await buffer(type===mime("json")?"text":compose("arrayBuffer",buffer=>
 new Uint8Array(buffer).reduce((buffer,bytes,index)=>
 Object.assign(buffer,{[index]:bytes})
,Buffer.alloc(buffer.byteLength))))(this);
 if(is(Error)(body))
 body=note.call(1,body).message,status=500,type=mime("txt");
 let header=compose.call
({status:response.setHeader?status:undefined
 ,"Access-Control-Allow-Origin":"*"
 ,"X-Frame-Options":"DENY"
 ,"Location":location
 ,"Set-Cookie":Object.entries(cookie||{}).map(([key,value])=>key+"="+value).join(";")||undefined
 ,"Content-Type":type
 ,...this.headers
 },JSON.stringify,JSON.parse
);
 response.setHeader?response.writeHead(status,header):response.respond(header);
 return response.end(body);
};

 async function fork()
{// https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 await resolve("cluster","on","exit",(worker,code,signal)=>note.call(code,worker.process.id+" exited with status "+code));
 let os=await import("os");
 let cpus=os.cpus();
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>
 compose.call("cluster","fork",resolve,pass(compose
("id",cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second..."),collect,"/","join",note.bind(1)
)),wait(index*1000)))
,[]);
}

 function persistence()
{let mongo=Object.entries({dbpath:"mongo",logpath:"mongo.log"}).flatMap(([key,value])=>["--"+key,process.execPath+value]);
 return import("child_process").then(({spawn})=>spawn("mongod",[...mongo,"--fork"]));
}

 function history()
{setInterval(done=>list("",".log",logs=>logs.forEach(log=>shrink(log,"replace"))),1000*60*60*24);
 note("\x1b[33marchiving logs daily...\x1b[0m");
}

 async function certify(certification,distinguishedname)
{let [path,url]=await resolve(["path","url"]);
 let location=path.dirname(url.fileURLToPath(import.meta.url));
 let [key,cert]=await Promise.all(certification.map(certificate=>
 buffer(access,swap(null))(path.resolve(location,certificate),true)));
 if([key,cert].every(Boolean))
 return {key,cert};
 note("creating "+certification+"...");
 let {default:forge}=await import("./digitalbazaar_2013_nodeforge.js");
 let rsa=forge.rsa.generateKeyPair(2048);
 let authority=Object.entries(distinguishedname).map(([key,value])=>(
 {[key.match(/^[A-Z]{2}$/)?"shortName":"name"]:key,value}));
 let certificate=forge.createCertificate();
 Object.assign(certificate,{publicKey:rsa.publicKey,serialNumber:"01"});
 Object.assign(certificate.validity,{notBefore:new Date(),notAfter:new Date()});
 certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear()+1);
 certificate.setSubject(authority);
 certificate.setIssuer(authority);
 certificate.setExtensions(
[{name:"basicConstraints",cA:true},{name:"keyUsage",keyCertSign:true,digitalSignature:true,nonRepudiation:true,keyEncipherment:true,dataEncipherment:true}
,{name:"extKeyUsage",serverAuth:true,clientAuth:true,codeSigning:true,emailProtection:true,timeStamping:true}
,{name:"nsCertType",client:true,server:true,email:true,objsign:true,sslCA:true,emailCA:true,objCA:true}
,{name:"subjectAltName",altNames:[{type:6,value:"http://blikpatrik.net"},{type:7,ip:"127.0.0.1"}]}
,{name: 'subjectKeyIdentifier'}
]);
 certificate.sign(rsa.privateKey);
 key=await local.put({url:url.pathToFileURL(path.resolve(location,certification[0])),body:forge.privateKeyToPem(rsa.privateKey)});
 cert=await local.put({url:url.pathToFileURL(path.resolve(location,certification[1])),body:forge.certificateToPem(certificate)});
 [key,cert]=await Promise.all([key,cert].map(certification=>access(certification,true)));
 if([key,cert].some(pair=>pair instanceof Error))
 note("invalid certification:",key,cert)&&process.exit(0);
 return {key,cert};
};

 export var digest=hash=>value=>
 import("crypto").then(({createHash,createHmac})=>
 (Array.isArray(hash)?createHmac(...hash):createHash(hash)).update(value,"utf-8").digest("hex"));

 export var encrypt=value=>digest=digest("sha256",value);

// export async function express(script) {
//   const bootstrapScriptContent = "import('"+script+"').then(({default:peer,reactivate})=>reactivate(peer))";
//   //peer = await import(peer).then(({ default: peer }) => peer);
//   const express=await import("express");
//   const cors=await import("cors");
//   const server=express();
//   const port=4200;
//   const {window}=new JSDOM("",{url:"localhost"});
//   const {renderToPipeableStream}=await import("./facebook_2013_react_dom_server.js");
//   const {createElement:fiber}=await import("./facebook_2013_react.js");
//   const {StaticRouter}=await import("./remix_2014_react_router_dom_server.js");
//   const {default:peer}=await import("./Blik_2023_peer.js");
//   server.use(cors())
//   server.use(express.static("./bundle"));
//   server.use("**",(request,response) => {
//     const stream=renderToPipeableStream(
//       fiber(StaticRouter, {location: request.url, context: {}}, peer),
//       {
//         bootstrapScriptContent,
//         onShellReady(){response.setHeader("Content-Type","text/html");stream.pipe(response);},
//         //onAllReady(){response.setHeader("Content-Type","text/html");stream.pipe(response);},
//         onError(fail){console.error(fail);response.status(500).send(document.call(window,
//         {body:{style:{background: 'black'},'#text':'fail.message'}}
//         ).next());}
//       },
//     );
//   });
//   server.listen(port, () => console.log("Portal listening on port "+port));
// }

//export function expose() {
  // const {createServer}=await import("http");
  // createServer((request, response) => {
  //  response.setHeader('Content-type', 'text/html');
  //  response.on('error', console.error);
  //  let data = createServerData();
  //  const stream = renderToPipeableStream(portal, {
  //    onShellReady(){stream.pipe(response);},
  //    onError(fail){console.error(fail);response.status(500).send("Internal Server Error");}
  //  });
  //}).listen(port, () => console.log('Portal listening on '+port+"..."););
//};

// function serialize(scope){
//   if(scope instanceof Function)
//   return String(scope).replace(/(^function *\w*\([\w,\n]*\)\n* *\{\n*)|(\}$)/g,"");
//   throw Error("can't "+serialize.name+" "+scope);
// }
