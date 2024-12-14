 import {note,prompt,when,functor,string,pattern,revert,each,describe,clock,observe,is,has,same,slip,something,compound,infer,tether,wether,collect,provide,route,buffer,differ,compose,combine,either,drop,crop,swap,record,wait,exit,pass,remember,binary,simple,array} from "./Blik_2023_inference.js";
 import {thread,resolve,access,list,window,jsdom,fetch,persist,version,compress,stage,cookies,cookie} from "./Blik_2023_interface.js";
 import {search,merge,sum,prune,extract} from "./Blik_2023_search.js";
 import {scope,mime} from "./Blik_2023_meta.js";
 import local,{classify} from "./Blik_2024_static.js";
 import syndication from "./Blik_2024_syndication.js";
 import {document} from "./Blik_2023_fragment.js";
 import {animal} from "./Blik_2024_svg.js";
 var {memory}=Object.assign(globalThis,{memory});

 export async function expose(source,storage,protocol="http",record)
{let {default:path}=await import("path");
 ({source,storage,protocol}=await prompt({source,storage,protocol}));
 let parameters=await compose(resolve,"default",[protocol],tether(search))(storage);
 let syndicate=await compose(resolve,"default",tether(extract,Object.keys(syndication())))(storage);
 let required=extract.call(parameters,["port"]);
 let {port,hmac,distinguishedname}=await prompt(required);
 let [agent,{default:routes,broadcast}]=await resolve([protocol,source]);
 if(Object.keys(syndicate).length)
 merge(routes,syndication(syndicate));
 let certificates=Object.values(search.call(parameters,([field])=>field==="certification")).flatMap(Object.values).flat();
 // if(await resolve("cluster","isMaster"))
 // return persistence,history,fork();
 await classify(source,storage,...certificates.map(compose(crop(1),path.resolve)));
 let address=[protocol,"//localhost",port].join(":");
 // send jsdom composition declaration to the loader thread so it can fetch modules from this interface too, during eg. server-side rendering. 
 await jsdom(address),thread&&thread.postMessage([[address],"interface/jsdom"]);
 let certification=[await certify(Object.values(parameters.certification||[])[0],parameters.distinguishedname)].flat();
 let virtualize=Object.entries(parameters.certification||{}).slice(1).map(([name,certificate])=>
 compose(name,certify(certificate,parameters.distinguishedname),combine("addContext",crop(1)),drop(1)));
 let report=compose(combine(swap(agent.globalAgent.protocol,"//"),either("_connectionKey",swap(port))),"/",collect,infer("join",""),"open",note.bind(2));
 return compose
("createServer",port
,revert((listen,cancel,host,port)=>host.listen(port,infer(listen))),...virtualize
,pass(report),pass(compose(broadcast,open,resolve))
,revert((close,error,channel)=>observe.call(channel,{close}))
)(agent,...certification,compose(routes,record&&memory,tether(supply)));
};

 function supply(request,response,source,memory)
{let secret=request.method.toLowerCase()!=="get";
 let remote=compose(drop(1),"url",/^http/,"match");
 let decoder=new TextDecoder("utf-8");
 let body=[];
 let resolve=wether
(remote,tether(fetch)
,compose(combine(crop(1),tether(path)),request
,buffer(tether(route),either(compose(drop(3,1),tether(source.error)),crop(1))),request,stage)
);
 observe.call(request
,{data:record(data=>decoder.decode(data)).bind(body)
 ,end:buffer(combine
(infer((request,body)=>request.body=body.join(""),body),compose
(slip(source)
,combine(notify,memory&&!secret?remember.call(memory,compose(drop(1),resolve),distinction):resolve)
,pass(report),drop(1,3),response||request,tether(submit)
)
))});
};

 function distinction(routes,{url,headers})
{// useragent needed in index for eg. dynamic import attributes syntax support. 
 let field=url+JSON.stringify(version(headers));
 if(this[field]?.status===500)delete this[field];
 return field;
};
 var address=compose(drop(1),combine("url",swap(/^/),either(tether(search,["connection","remoteAddress"]),swap(""))),"replace");
 var color=compose(combine(swap({get:36,put:33,delete:33}),compose(drop(1),"method","toLowerCase")),either(tether(search),swap(35)),"m");
 var notify=compose(combine(swap("\x1b["),color,compose(drop(),clock),swap("@"),address),"...\x1b[0m",collect,infer("join",""),pass(console.log));
 var recolor=compose(combine(crop(1),compose(drop(1),"status",wether(is(200),swap(32),swap(31)))),infer("replace",/[0-9]{2}/),infer("slice",0,-7));
 var redate=compose(combine(infer(),compose(drop(),clock,"@","concat")),infer("replace",/(?:[0-9]{2}[:@]){3}/));
 var inform=compose(drop(1),combine("status",compose("headers",infer("get","Content-Type")),swap("\x1b[0m")));//+": \""+String(body).replace(/^([\s\S]{20})[\s\S]*$/,(...match)=>match[1]+"...")+"\"";
 var report=compose(combine(compose(recolor,redate),inform),collect,infer("join"," "),console.log);

 async function path(request)
{let {query,pathname}=await resolve("url","parse",request.url,true);
 let method=request.method.toLowerCase();
 let methodic=pathname==="/"+method;
 if(methodic)
 // root path can't be routed methodically due to necessary leading slash. 
 pathname="";
 let filter=infer("filter",(step,index)=>(index||step)&&step!==".");
 let map={get:infer("map",step=>step||"interface")}[!methodic&&method];
 return compose(filter,map)(decodeURIComponent(pathname).split("/"));
};

 export async function submit(response)
{let {status,location,cookie:cookies}=this;
 let type=this.headers.get("Content-Type");
 let gzip=this.headers.get("Content-Encoding")==="gzip";
 let stream=functor(this.body);
 let body=stream?this.body:await buffer(type===mime("json")&&!gzip?"text":compose("arrayBuffer",buffer=>
 new Uint8Array(buffer).reduce((buffer,bytes,index)=>
 Object.assign(buffer,{[index]:bytes})
,Buffer.alloc(buffer.byteLength))))(this);
 if(is(Error)(body))
 body=note.call(1,body).message,status=500,type=mime("txt");
 let header=compose.call
({status:response.setHeader?status:undefined
 ,"Access-Control-Allow-Origin":"*"
 //,"X-Frame-Options":"DENY"
 ,"Location":location
 ,"Set-Cookie":cookie(cookies)||undefined
 ,"Content-Type":type
 ,...this.headers
 },JSON.stringify,JSON.parse
);
 response.setHeader?response.writeHead(status,header):response.respond(header);
 return stream?body(response):response.end(body);
};

 async function fork()
{// https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 await resolve("cluster","on","exit",(worker,code,signal)=>note.call(code,worker.process.id+" exited with status "+code));
 let os=await import("os");
 let cpus=note(os.cpus());
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>
 compose.call("cluster","fork",resolve,pass(compose
("id",cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second..."),collect,"/","join",note.bind(1)
)),wait(index*1000)))
,[]);
};

 function persistence()
{let mongo=Object.entries({dbpath:"mongo",logpath:"mongo.log"}).flatMap(([key,value])=>["--"+key,process.execPath+value]);
 return import("child_process").then(({spawn})=>spawn("mongod",[...mongo,"--fork"]));
};

 function history()
{setInterval(done=>list("",".log",logs=>logs.forEach(log=>shrink(log,"replace"))),1000*60*60*24);
 note("\x1b[33marchiving logs daily...\x1b[0m");
};

 async function certify(certification,distinguishedname)
{if(!certification)
 return [];
 let [path,url]=await resolve(["path","url"]);
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
 [key,cert]=await certification.reduce(record((certification,index)=>compose.call
(path.resolve(location,certification)
,forge[["privateKey","certificate"][index]+"ToPem"]([rsa.privateKey,certificate][index])
,true,access,true,access
)),[]);
 return {key,cert};
};

 export async function open(server,actions)
{let {default:{WebSocketServer}}=await import("./einaros_2011_ws.js");
 let connection=buffer(function connection(host,peer,request)
{Object.assign(peer
,{author:anonymous[Math.floor(Math.random()*anonymous.length)]
 ,connected:true
 ,interval:setInterval(time=>peer.connected
?merge(peer,{connected:false}).send(JSON.stringify({action:"check"}))
:peer.terminate(),30000)
 });
 observe.call(peer
,{close(){clearInterval(this.interval);note.call(3,this.author.name+" left.");}
 ,error:note.bind(1)
 ,message:infer(buffer
(function(peer,host,event)
{let message=JSON.parse(event.data);
 if(message.action!=="check")
 console.log({from:peer.author.name+"@"+peer._socket.remoteAddress,message});
 return buffer(tether(actions[message.action||"message"]),note.bind(2))(host,message,peer);
},message=>peer.send(JSON.stringify(is(Error)(message)?{error:note.call(1,message).message}:message))
),host)
 });
},note.bind(1));
 return compose([{server}],Reflect.construct,{rooms:{}},Object.assign
,{connection},tether(observe))(WebSocketServer);
};

 var anonymous=Object.entries(animal).map(([name,svg])=>
 ({name,icon:"/svg/animal/"+name+"/document"}));
