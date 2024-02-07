 import {note,prompt,describe,revert,clock,observe,is,has,same,something,compound,infer,tether,wether,collect,provide,route,buffer,compose,combine,either,drop,crop,swap,record,wait,exit} from "./Blik_2023_inference.js";
 import local,{resolve,access,list,classify} from "./Blik_2023_interface.js";
 import {search,merge,sum} from "./Blik_2023_search.js";

 export async function expose(source,parameters,protocol="http",remember)
{let {default:path}=await import("path");
 ({source,parameters,protocol}=await prompt({source,parameters,protocol}));
 let classified=
[arguments[1],...Object.values(parameters||{}).flatMap(({certification})=>
 Object.values(certification||{}).flat()).filter(
 Boolean).map(certification=>path.resolve(certification))
].map(compose(drop(0,1),RegExp));
 classify(classified);
 parameters=await compose(resolve,["default",protocol],tether(route))(parameters);
 let missing=["port",...protocol=="https"?["hmac","distinguishedname"]:[]].filter(key=>!parameters[key]);
 if(missing.length)
 exit("missing "+missing+" in "+arguments[1]);
 //if(await resolve("cluster","isMaster"))return persistence(),history(),fork();
 encrypt(parameters.hmac);
 await window([protocol,"//localhost",parameters.port].join(":"));
 [protocol,source]=await resolve([protocol,source]);
 let certificates=protocol.globalAgent.protocol=="https:"?[certify(Object.values(parameters.certification)[0],parameters.distinguishedname)]:[];
 let virtualize=Object.entries(parameters.certification||{}).slice(1).map(([name,certificate])=>
 compose(name,certify(certificate),combine("addContext",crop(1)),drop(1)));
 let report=compose(combine(swap(protocol.globalAgent.protocol,"//"),either("_connectionKey",swap(parameters.port))),"/",collect,infer("join",""),"open",note.bind(2));
 return compose
("createServer",parameters.port
,revert((listen,host,port)=>infer("listen")(host,port,infer(listen))),...virtualize
,combine(infer(),report)
,revert((close,channel)=>observe.call(channel,{close}))
)(protocol,...certificates,compose(source,remember,tether(receive)));
 // compose("default",protocol.open)(import("./Blik_2020_room.js"));
 // function listen(port)
 //{let response={end(body){return {...this.header,body};},setHeader(header){this.header={header}},writeHead(){}};
 // compose(prompt,agent,"url",describe,{headers:{},method:"get"},merge
 //,response,source,remember,tether(respond),note,swap(this),port,tether(listen))({[agent]:undefined});
 //};
};

 function receive(request){observe.call(request,{data(data){this.body+=decoder.write(data);},end:respond.bind(...arguments)});}

 function respond(response,source,remember)
{let distinction=({url,headers})=>url+(headers?.cookie||"");
 let retrieve=remember?compose(record(fetch,distinction),distinction(this)):tether(fetch);
 return compose(retrieve,response||this,tether(submit))(source.default,this);
};

 export var {window,fetch}=globalThis.window?globalThis
:{async window(location)
{let {JSDOM}=await resolve("./domenic_2022_jsdom_rollup.js","default");
 return {window}=Reflect.construct(JSDOM,["",{url:location}]);
},async fetch(request)
{if(!compound(request))request=
 {end(response){return Object.assign(this.response,response);}
 ,respond(header){Object.assign(this.response,{header});}
 ,response:{},url:request||"",method:"get",...header||{}
 };
 let address=request.url.replace(/^/,request.connection?.remoteAddress||"");
 let method=request.method.toLowerCase();
 console.log("\x1b["+({get:36,put:33,delete:33}[method]||35)+"m"+clock()+"@"+address+"...\x1b[0m");
 let format=either("Content-Type","content-type",swap(undefined))(request);
 let cookie=Object.fromEntries(request.headers?.cookie?.split(/ *; */).map(entry=>entry.split("="))||[]);
 let {query,pathname}=await resolve("url","parse",request.url,true);
 let path=compose
(infer("filter",(step,index)=>(index||step)&&step!==".")
,{get:infer("map",step=>step||"interface")}[method]
)(decodeURIComponent(pathname).split("/"));
 let body=await parser[format]?.parse(request.body)||request.body||"";
 request=Object.assign(request,{body,path,query,method,cookie});
 let response=await buffer(either(tether(route),"error",drop(-1)))(this||local,request.path,request);
 let fail=is(Error)(response);
 body=wether([fail,has("nodeName"),something],"message","outerHTML",either("body",crop(1)),swap("missing source: \""+request.path+"\""))(response);
 let type=!fail?response?.type||response?.nodeName?.toLowerCase()||request.url.match(/\.([^\.\/]*)$/)?.slice(1)[0]||(compound(response)?"json":"txt"):"txt";
 let status=response?fail?500:response.status||200:404;
 let success=status<400;
 let report=(status==200?32:31)+"m"+clock()+"@"+[address,status,type].join(" ")+": \""+String(body).replace(/^([\s\S]{20})[\s\S]*$/,(...match)=>match[1]+"...")+"\"";
 console.log("\x1b["+report+"\x1b[0m");
 return (
 {status,type,body
 ,location:response?.location
 ,cookie:response?.cookie
 ,headers:{get(key){return response?.header[key];}}
 ,json(){return this.text(true);}
 ,text(json)
{if(this.body.constructor?.name=="Buffer")
 return this.body.toString();
 if(typeof this.body=="object")
 return json?this.body:JSON.stringify(this.body);
 return json?JSON.parse(this.body):this.body;
},arrayBuffer()
{return Promise.resolve(this.body.constructor?.name=="Buffer"?this.body:Buffer.from(this.body,"utf-8"));
}});
}};

 var parser=compose.call
({JSON,"x-www-form-urlencoded":await import("querystring")}
,Object.entries
,infer("map",compose(combine(compose(0,"toLowerCase",/^/,"application/","replace"),1),collect))
,Object.fromEntries
);

 export function submit(response)
{let {type,status,location,cookie}=this;
 let header=compose.call
({status:response.setHeader?status:undefined
 ,"Access-Control-Allow-Origin":"*"
 ,"X-Frame-Options":"DENY"
 ,"Location":location
 ,"Set-Cookie":Object.entries(cookie||{}).map(([key,value])=>key+"="+value).join(";")||undefined
 ,"Content-Type":mime(type)
 },JSON.stringify,JSON.parse
);
 response.setHeader?response.writeHead(status,header):response.respond(header);
 let body=wether(compose("type",same("json")),"text","arrayBuffer");
 return compose(body,response.end.bind(response))(this);
};

 export function forward(file,request)
{if(request)request.method=request.method?.toUpperCase()||"GET";
 let protocol=file.match(/[^:]*/)?.[0];
 request={method:"GET",...request,...new URL(file)};
 return new Promise(resolve=>compose.call
(import(protocol)
,infer("request",file,response=>
{let {location}=response.headers;
 if(location)
 console.log(request.url,"redirected to",location,"...");
 let body=[];
 response.on("data",record(body=>body).bind(body));
 response.on("end",end=>location
?compose.call(location,request,forward,resolve)
:resolve(
 {body:Buffer.concat(body,sum(body.map(({length})=>length)))
 ,status:response.statusCode
 ,type:response.headers["content-type"]
 ,headers:{get:compose("toLowerCase",infer.bind(response.headers))}
 ,json:()=>Promise.resolve(JSON.parse(body))
 ,text:()=>Promise.resolve(body||response.statusMessage)
 }));
})
,combine(infer("write",String(request.body||"")),"end")
));
};

 async function fork()
{//https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 let os=await import("os");
 let cpus=os.cpus();
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>compose.call(wait(index*1000)
,swap(cluster.fork().id+"/"+cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second...")),note.bind(1)))
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
{let path=await import("path");
 let location=await compose(resolve,path.dirname)("url","fileURLToPath",import.meta.url);
 let [key,cert]=await Promise.all(certification.map(certificate=>
 buffer(access,swap(null))(path.resolve(location,certificate),true)));
 if([key,cert].every(Boolean))
 return {key,cert};
 note("creating "+certification+"...");
 [key,cert]=await import("./digitalbazaar_2013_nodeforge.js").then(async module=>
{let rsa=module.default.rsa.generateKeyPair(2048);
 let authority=Object.entries(distinguishedname).map(([key,value])=>(
 {[key.match(/^[A-Z]{2}$/)?"shortName":"name"]:key,value}));
 let certificate=module.default.createCertificate();
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
 key=await local.put({url:path.resolve(location,certification[0]),body:module.default.privateKeyToPem(rsa.privateKey)});
 cert=await local.put({url:path.resolve(location,certification[1]),body:module.default.certificateToPem(certificate)});
 return Promise.all([key,cert].map(certification=>access(certification,true)));
});
 [key,cert]=await Promise.all([key,cert]);
 if([key,cert].some(pair=>pair instanceof Error))
 note("invalid certification:",key,cert)&&process.exit(0);
 return {key,cert};
};

export var digest=hash=>value=>
 import("crypto").then(({createHash,createHmac})=>
 (Array.isArray(hash)?createHmac(...hash):createHash(hash)).update(value,"utf-8").digest("hex"));

 export var encrypt=value=>digest=digest("sha256",value);

 export var mime=compose
(infer("replace",/.*\./,"")
,{text:{plain:["txt"],javascript:["js","cjs"],typescript:["ts"],"":["html","css"]}
 ,image:{jpeg:["jpg","jpeg"],"x-icon":"ico","svg+xml":"svg","":["gif","png"]}
 ,audio:{mpeg:"mp3"}
 }
,(extension,mime)=>
 Object.entries(mime).reduce((mime,[type,subtypes])=>mime||
 Object.entries(subtypes).reduce((mime,[subtype,extensions])=>mime||
 [extensions].flat().includes(extension)&&
 [type,subtype||extension]
,mime)
,extension.includes("/")&&extension.split("/"))||
 ["application",extension]
,infer("join","/")
);

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
