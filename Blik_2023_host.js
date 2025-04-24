 import {note,colors,when,functor,string,pattern,revert,each,describe,clock,observe,is,has,same,slip,something,compound,infer,tether,whether,collect,provide,route,buffer,differ,compose,combine,either,drop,crop,swap,record,wait,exit,pass,remember,binary,simple,array} from "./Blik_2023_inference.js";
 import {thread,resolve,access,locate,prompt,list,window,jsdom,fetch,persist,version,compress,stage,cookies,cookie,feature} from "./Blik_2023_interface.js";
 import {search,merge,sum,prune,extract,encrypt} from "./Blik_2023_search.js";
 import {scope,mime,bytes} from "./Blik_2023_meta.js";
 import {document} from "./Blik_2023_fragment.js";
 import {animal} from "./Blik_2024_svg.js";
 var {memory}=Object.assign(globalThis,{memory:{}});

 export async function expose(source,protocol)
{({source,protocol}=await prompt({source,protocol}));
 let [module,...fields]=await locate(protocol.split("/"));
 let [{default:routes,actions,syndication,encryption,classify,classified,published,permit},{default:credentials},agent]=
 await resolve([source,module,fields.at(-1)]);
 let {port,certification={},distinguishedname,cache}=search.call(credentials,fields);
 let [[domain,[signature,certificate]=[]]=[]]=Object.entries(certification);
 let [encrypted,syndicated]=await [encryption,syndication].reduce(record(required=> 
 required?prompt(extract.call(credentials,Object.keys(required))):{}),[]);
 let required={"https:":{domain,signature,certificate}}[agent.globalAgent.protocol];
 ({port,domain,signature,certificate}=await prompt({port,...required}));
 merge(syndication,syndicated);
 merge(certification,required&&{[domain]:[signature,certificate]});
 merge(encryption,prune.call(encrypted,([field,value])=>encrypt(value)));
 merge(globalThis,{cache,published,classified,classify});
 let certificates=Object.values(certification).flat().map(compose(crop(1),slip("path","resolve"),resolve));
 await classify?.(module,...certificates);
 // send jsdom composition loader thread too so it can fetch modules from this interface during eg. server-side rendering.
 let origin=[agent.globalAgent.protocol+"//localhost",port].join(":");
 thread?.postMessage([[origin],"interface/jsdom"]);
 jsdom(origin);
 let certifications=prune.call(certification,([domain,certificates])=>
 certify(certificates,distinguishedname),0,0);
 // if(await resolve("cluster","isMaster"))return fork();
 var router=compose(combine(whether
(compose("url",/^http/,"match"),fetch
,compose(combine(path,infer()),buffer(route.bind(routes),either(compose(tether(routes.error)),crop(1))))
),infer()),stage);
 var immutable=compose
("url",slip("."),"concat",slip("url","parse"),resolve,"pathname"
,combine(...[classified,published].map(list=>compose(list,permit)))
);
 var distinction=({url,headers})=>[url,new URLSearchParams(feature(version(headers)))].join("");
 var respond=compose
(revert(decode,new TextDecoder("utf-8")),provide,combine(whether
(cache&&buffer(combine(compose("method",/get/i,"match"),immutable),swap(false))
,remember.call(cache,compose(drop(1),router),distinction)
,router
),infer()),cache&&pass(bust),tether(submit)
);
 function bust({status},request){if(status===500)delete cache[distinction(request)];}
 return compose
("createServer",port
,revert((listen,cancel,host,port)=>host.listen(port,infer(listen)))
,...Object.entries(certifications).map(([domain,certification])=>
 pass(compose(domain,certification,"addContext")))
,pass(host=>note.call(2,[host._connectionKey||port," open"].join("")))
,pass(compose(actions,broadcast,resolve))
,revert((close,error,channel)=>observe.call(channel,{close}))
)(agent,Object.values(certifications)[0],buffer(respond,compose(note,exit)));
};

 function decode(end,error,decoder,agent,request,response,body=[])
{let color=colors[["yellow","cyan"][Number(/get/i.test(request.method))]];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url,"...",colors.steady].join(""));
 return observe.call(request
,{data:record(data=>decoder.decode(data)).bind(body)
 ,end(){end([request,body.length?body.join(""):undefined,response]);}
 ,finish:note
 ,error
 });
};

 async function path(request)
{let {query,pathname}=await resolve("url","parse",request.url,true);
 let method=request.method.toLowerCase();
 let methodic=pathname==="/"+method;
 return compose
("/","split",infer("slice",1)
,infer("filter",(step,index,{length})=>(index+1/length<1?step:true)&&step!==".")
,{get:infer("map",step=>step||"interface")}[!methodic&&method]
)(decodeURIComponent(methodic?"":pathname));
};

 export async function submit(request,body,response)
{let {status,location,cookie:cookies}=this;
 let type=this.headers.get("Content-Type");
 let gzip=this.headers.get("Content-Encoding")==="gzip";
 let stream=functor(this.body);
 body=stream?this.body:await buffer(type===mime("json")&&!gzip?"text"
:is(Buffer)(this.body)?"body":compose("arrayBuffer",bytes))(this);
 if(is(Error)(body))
 body=note.call(1,body).message,status=500,type=mime("txt");
 let header=compose.call
({status:response?status:undefined
 ,"Access-Control-Allow-Origin":"*"
 //,"X-Frame-Options":"DENY"
 ,"Location":location
 ,"Set-Cookie":cookie(cookies)||undefined
 ,"Content-Type":type
 ,...this.headers
 },JSON.stringify,JSON.parse
);
 response?.writeHead(status,header)||request.respond(header);
 let color=colors[{200:"green"}[status]||"red"];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url," ",type,colors.steady].join(""));
 let target=response||request;
 return stream?body(target):target.end(body);
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
[{name:"subjectAltName",altNames:[{type:6,value:"https://"+distinguishedname.commonName},{type:7,ip:"127.0.0.1"}]}
,{name:"keyUsage",keyCertSign:true,digitalSignature:true,nonRepudiation:true,keyEncipherment:true,dataEncipherment:true}
,{name:"extKeyUsage",serverAuth:true,clientAuth:true,codeSigning:true,emailProtection:true,timeStamping:true}
,{name:"nsCertType",client:true,server:true,email:true,objsign:true,sslCA:true,emailCA:true,objCA:true}
,{name:"basicConstraints",cA:true}
,{name:"subjectKeyIdentifier"}
]);
 certificate.sign(rsa.privateKey);
 [key,cert]=await certification.reduce(record((certification,index)=>compose.call
(path.resolve(location,certification)
,forge[["privateKey","certificate"][index]+"ToPem"]([rsa.privateKey,certificate][index])
,true,access,true,access
)),[]);
 return {key,cert};
};

 export async function broadcast(server,actions)
{let {default:{WebSocketServer}}=await import("./einaros_2011_ws.js");
 let connection=buffer(function connection(host,peer,request)
{Object.assign(peer
,{author:anonymous[Math.floor(Math.random()*anonymous.length)]
 ,connected:true
 ,interval:setInterval(time=>peer.connected
?merge(peer,{connected:false}).send(JSON.stringify({action:"check"}))
:peer.terminate(),60*1000)
 });
 observe.call(peer
,{close(){clearInterval(this.interval);note.call(3,this.author.name+" left.");}
 ,error:note.bind(1)
 ,message:infer(buffer
(function(peer,host,event)
{let message=JSON.parse(event.data);
 if(message.action!=="check")
 console.log({from:peer.author.name+"@"+peer._socket.remoteAddress,message});
 return buffer(tether(actions[message.action]),note.bind(2))(host,message,peer);
},message=>peer.send(JSON.stringify(is(Error)(note(message))?{error:note.call(1,message).message}:message))
),host)
 });
},note.bind(1));
 return compose([{server}],Reflect.construct,{rooms:{}},Object.assign
,{connection},tether(observe))(WebSocketServer);
};

 var anonymous=Object.entries(animal).map(([name,svg])=>
 ({name,icon:"/svg/animal/"+name+"/document"}));
