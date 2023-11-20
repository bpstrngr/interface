 import JSDOM from "./domenic_2022_jsdom_rollup.js";
 import {note,describe,clock,observe,is,compound,when,pattern,infer,tether,collect,provide,route,buffer,compose,combine,either,drop,swap,record,wait,exit} from "./Blik_2023_inference.js";
 import {prompt,resolve,access,list} from "./Blik_2023_interface.js";
 import {search,merge} from "./Blik_2023_search.js";

 export default
{async get(request,mode)
{mode=request.query?.mode||"binary";
 if(typeof request!="object")
 request={url:request};
 if(/^http/.test(request.url))
 return forward(request.url,request);
 let scope=await module(this||{});
 let path=await import("path");
 let address=request.url.replace(/^\//,"./");
 if(!permit(address,classified))
 throw Error("Classified");
 let file=await access(address);
 if(!file.isDirectory())
 return access(address,1);
 scope=await list(address,true,classified);
 return scope;
}
,put:async function(request)
{let url=path.join(...request.path);
 return await persist(request.body,url,request.query?.force)
}
,delete:async function(request)
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
}
};

 export var {window,fetch}=globalThis.window?globalThis
:{async window(location)
{let {JSDOM}=await compose.call("./domenic_2022_jsdom_rollup.js",resolve,"default");
 await wait(3000);
 return {window}=new JSDOM("",{url:location});
},async fetch(request,header)
{let scope=this||await compose.call("./Blik_2023_host.js",resolve,"default");
 if(typeof request!=="object")
 request=
 {url:request||"",method:"get",...header||{}
 ,response:{}
 ,respond(header){Object.assign(this.response,{header});}
 ,end(response){return Object.assign(this.response,response);}
 };
 let method=(request.method).toLowerCase();
 let address=request.url.replace(/^/,request.connection?.remoteAddress||"");
 let split=compose
("pathname",decodeURIComponent,"/","split"
,infer("filter",(step,index)=>index||step)
,infer("map",step=>method=="get"?step||"interface":step)
);
 let [path,query]=await compose.call("url","parse",request.url,true,resolve,combine(split,"query"));
 let cookie=Object.fromEntries(request.headers?.cookie?.split(/ *; */).map(entry=>entry.split("="))||[]);
 Object.assign(request,{path,query,method,cookie});
 console.log("\x1b["+({get:36,put:33,delete:33}[request.method]||35)+"m"+clock()+"@"+address+"...\x1b[0m");
 let format=buffer(either("Content-Type","content-type"),swap(undefined))(request);
 if(format)
 request.body=compose
(Object.entries
,infer("map",compose(combine(compose(0,"toLowerCase",/^/,"application/","replace"),infer(1)),collect))
,Object.fromEntries
,format,Promise.resolve.bind(Promise)
,request.body,"parse"
,(body,...context)=>context[0]?request.body:body
)({JSON,"x-www-form-urlencoded":await import("querystring")}).catch(note);
 let response=await compose
(combine(swap(scope),"path",either())
,buffer(either(tether(route),"error",drop(-1)),provide)
)(request);
 if(response instanceof Error)note.call(1,response)
 let status=response?response instanceof Error?500:response.status||200:404;
 let success=status<400;
 let body=response instanceof Error?response.message:response?.body??response??"no such file or function";
 let type=response?.type||response?.nodeName?.toLowerCase()||
 request.url.match(/\.([^\.\/]*)$/)?.slice(1)[0]||(compound(response)?"json":"txt");
 let report=(status==200?32:31)+"m"+clock()+"@"+[address,status,type].join(" ")+": ";
 console.log("\x1b["+report+"\x1b[0m");
 return (
 {status,type,body
 ,location:response?.location
 ,cookie:response?.cookie
 ,headers:{get(key){return response?.header[key]}}
 ,json(){return this.text(true)}
 ,text(json)
{if(this.body.constructor?.name=="Buffer")
 return this.body.toString();
 if(window.Element)
 if(this.body instanceof window.Element)
 return this.body.outerHTML;
 if(typeof this.body=="object")
 return json?this.body:JSON.stringify(this.body);
 return json?JSON.parse(this.body):this.body;
},arrayBuffer()
{return this.body.constructor?.name=="Buffer"?this.body:Buffer.from(this.body,"utf-8");
}});
}};

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
 let body=type==="json"?this.text():this.arrayBuffer();
 return response.end(body);
};

 export async function expose(source,parameters,protocol="http",remember)
{let classified=
[arguments[1],...Object.values(parameters||{}).flatMap(({certification})=>
 Object.values(certification||{}).flat()).filter(
 Boolean).map(certification=>path.resolve(certification))
].map(compose(drop(0,1),RegExp));
 classify(classified);
 ({source,parameters,protocol}=await prompt({source,parameters,protocol}));
 ({default:parameters}=await import(parameters));
 let {default:path}=await import("path");
 parameters=search.call(parameters,protocol);
 let cluster=await import("cluster");
 let missing=["port","hmac",...protocol=="https"?["distinguishedname"]:[]].filter(key=>!parameters[key]);
 if(missing.length)
 exit("missing "+missing+" in "+arguments[1]);
 if(false)//cluster.isMaster)
{//let mongo=Object.entries({dbpath:"mongo",logpath:"mongo.log"}).map(([key,value])=>
 //["--"+key,process.execPath+value]).flat();
 //await import("child_process").then(({spawn})=>spawn("mongod",[...mongo,"--fork"]));
 //setInterval(done=>list("",".log",logs=>logs.forEach(log=>shrink(log,"replace"))),1000*60*60*24);
 //note("\x1b[33marchiving logs daily...\x1b[0m");
 //https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 let os=await import("os");
 let cpus=os.cpus();
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>compose.call(wait(index*1000)
,swap(cluster.fork().id+"/"+cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second...")),note.bind(1)))
,[]);
};
 encrypt(parameters.hmac);
 await window([protocol,"//localhost",parameters.port].join(":"));
 protocol=await import(protocol);
 source=await import(source);
 let certificates=protocol.globalAgent.protocol=="https:"?[certify(Object.values(parameters.certification)[0],parameters.distinguishedname)]:[];
 let open=infer("createServer",...certificates,respond);
 function listen(port)
{let agent=protocol.globalAgent.protocol+"//"+(this._connectionKey||port)+"/";
 let response={end(body){return {...this.header,body};},setHeader(header){this.header={header}},writeHead(){}};
 compose(prompt,agent,"url",describe,{headers:{},method:"get"},merge
,response,tether(send),note,swap(this),port,tether(listen))({[agent]:undefined});
};
 let virtualize=Object.entries(parameters.certification||{}).slice(1).map(([name,certificate])=>
 compose(name,certify(certificate),combine("addContext",either()),drop(1)));
 let channel=await compose(open,infer("listen",parameters.port,listen),...virtualize)(protocol);
 //compose("default",protocol.open)(import("./Blik_2020_room.js"));
 return new Promise(resolve=>channel.on("close",resolve));
 function respond(request,response)
{return observe.call(Object.assign(request,{body:""})
,{data(data){this.body+=decoder.write(data);}
 ,end(){send.call(request,response)}
 });
};
 function send(response)
{let distinction=({url,headers})=>url+(headers?.cookie||"");
 let retrieve=remember?compose(record(fetch,distinction),distinction(this)):tether(fetch);
 return compose(retrieve,response||this,tether(submit))(source.default,this);
};
};

 async function certify(certification,distinguishedname)
{let persistence="./Blik_2020_persistence.js";
 let [key,cert]=await Promise.all(certification.map(certificate=>access(certificate,true)));
 if(([key,cert]).every(pair=>pair&&pair.length))
 return {key,cert};
 note("creating "+certification+"...");
 [key,cert]=await import(process.execPath.replace("bin/node","lib/node_modules"+"/node-forge/lib/pki.js")).then(async module=>
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
 key=await persistence.put({url:[certification[0]],body:module.default.privateKeyToPem(rsa.privateKey)});
 cert=await persistence.put({url:[certification[1]],body:module.default.certificateToPem(certificate)});
 note(key,cert)
 return [key,cert];
});
 [key,cert]=await Promise.all([key,cert]);
 if([key,cert].some(pair=>pair instanceof Error))
 note("invalid certification:",key,cert)&&process.exit(0);
 return {key,cert};
};

 var classified=
["*.git*"
].map(term=>RegExp("^"+term.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"));

 export var classify=compose(when(either(pattern,infer("every",pattern))),file=>
 [file].flat().forEach(file=>
 classified.push(file)));

 var permit=(name,classified)=>!classified.some(term=>term.test(name));

export var digest=hash=>value=>
 import("crypto").then(({createHash,createHmac})=>
 (Array.isArray(hash)?createHmac(...hash):createHash(hash)).update(value,"utf-8").digest("hex"));

 export var encrypt=value=>digest=digest("sha256",value);

 export function module(source)
{//return JSON.parse(JSON.stringify(source));
 return Object.fromEntries(Object.entries(source.default||source).map(([key,value])=>
 [key,value&&typeof value=="object"?module(value):value?value.toString():value]))
};

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