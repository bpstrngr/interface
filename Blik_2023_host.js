 import {note,debug,colors,when,stash,flip,functor,string,not,pattern,revert,each,describe,clock,observe,is,has,same,minor,slip,something,compound,infer,tether,whether,collect,provide,buffer,differ,compose,combine,either,drop,crop,swap,wait,exit,pass,binary,simple,array,expect} from "./Blik_2023_inference.js";
 import {loader,resolve,access,locate,prompt,list,window,jsdom,fetch,digest,persist,version,compress,stage,cookies,cookie,feature} from "./Blik_2023_interface.js";
 import {search,merge,sum,prune,extract,encrypt,record,remember,route} from "./Blik_2023_search.js";
 import {mime,bytes} from "./Blik_2023_meta.js";
 import {document} from "./Blik_2023_fragment.js";
 import {animal} from "./Blik_2024_svg.js";
 var {memory}=Object.assign(globalThis,{memory:{}});

 export async function expose(source,protocol,suspend=true)
{({source,protocol}=await prompt({source,protocol}));
 let [module,...fields]=string(protocol)?await locate(protocol.split("/")):[protocol];
 let [{default:routes,relay,syndication,encryption,classify,classified,published,permit},{default:credentials}]=
 await [source,module].reduce(record(module=>
 string(module)?resolve.bind(import.meta.url)(module):{default:module}),[]);
 let {network,port,certification={},distinguishedname,cache}=note(search.call(credentials,fields));
 let agent=await resolve.bind(import.meta.url)(network);
 let [[domain,[signature,certificate]=[]]=[]]=Object.entries(certification);
 let [encrypted,syndicated]=await [encryption,syndication].reduce(record(required=> 
 required?prompt(extract.call(credentials,Object.keys(required))):{}),[]);
 let required={"https:":{domain,signature,certificate}}[agent.globalAgent.protocol];
 ({port,domain,signature,certificate}=await prompt({port,...required}));
 merge(syndication,syndicated);
 merge(certification,required&&{[domain]:[signature,certificate]});
 merge(encryption,prune.call(encrypted,([field,value])=>encrypt(value)));
 merge(globalThis,{cache,published,classified,classify});
 let certificates=Object.values(certification).flat().map(compose(crop(1),slip("path","resolve"),resolve.bind(import.meta.url)));
 await classify?.(module,...certificates);
 // send jsdom composition to loader thread too so it can fetch modules from this interface during eg. server-side rendering.
 let origin=agent.globalAgent.protocol+"//localhost"+":"+port;
 delegate.call(loader,[[origin],"interface/jsdom"]);
 jsdom(origin);
 let certifications=prune.call(certification,([domain,certificates])=>
 certify(certificates,distinguishedname,[domain]),0,0);
 // if(await resolve.bind(import.meta.url)("cluster","isMaster"))return fork();
 var router=compose(combine(whether
(compose("url",/^http/,"match"),fetch
,compose(combine(path,infer()),buffer(route.bind(routes),either(tether(routes.error),crop(1))))
),infer()),stage);
 var immutable=compose
("url",slip("."),"concat"
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
 // for self-signed certificates, assign them to the NODE_EXTRA_CA_CERTS option. 
 pass(compose(domain,certification,"addContext")))
,pass(host=>note.call(2,[host._connectionKey||port," open"].join("")))
,pass(compose(relay,broadcast,resolve.bind(import.meta.url)))
,revert((close,error,channel)=>observe.call(channel,{close,error})&&suspend||close(channel))
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
{let {query,pathname}=new URL(request.url.replace(/^\//,"http://localhost/"));
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
 await resolve.bind(import.meta.url)("cluster","on","exit",(worker,code,signal)=>note.call(code,worker.process.id+" exited with status "+code));
 let os=await import("os");
 let cpus=note(os.cpus());
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>
 compose.call("cluster","fork",resolve.bind(import.meta.url),pass(compose
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

 async function certify(certification,distinguishedname,altnames,duration=1)
{if(!certification)
 return [];
 let [path,url]=await resolve.bind(import.meta.url)(["path","url"]);
 let location=path.dirname(url.fileURLToPath(import.meta.url));
 let [key,cert]=await Promise.all(certification.map(certificate=>
 buffer(access,swap(null))(path.resolve(location,certificate),true)));
 if([key,cert].every(Boolean))
 return {key,cert};
 note("creating "+certification+"...");
 let {default:forge}=await import("./digitalbazaar_2013_nodeforge.js");
 let method=altnames.includes("localhost")?selfsign:authorize;
 let encryption=forge.rsa.generateKeyPair(2048);
 [key,cert]=await method.call(forge,encryption,distinguishedname,duration);
 [key,cert]=await certification.reduce(record((certification,index)=>compose.call
(path.resolve(location,certification),[key,cert][index],true,access,true,access
)),[]);
 return {key,cert};
};

 async function selfsign({privateKey,publicKey},distinguishedname,duration)
{// self-signed certificate. 
 let authority=Object.entries(distinguishedname).map(([key,value])=>(
 {[key.match(/^[A-Z]{2}$/)?"shortName":"name"]:key,value}));
 let altnames={name:"subjectAltName",altNames:[{type:2,value:"localhost"},{type:7,ip:"127.0.0.1"}]};//,{type:6,value:"https://"+distinguishedname.commonName}]};
 let certificate=this.pki.createCertificate();
 let asn1=await resolve.bind(import.meta.url)("crypto","randomBytes",19).then(infer("toString","hex"));
 Object.assign(certificate,{publicKey,serialNumber:"01"+asn1});
 Object.assign(certificate.validity,{notBefore:new Date(),notAfter:new Date()});
 certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear()+duration);
 certificate.setSubject(authority);
 certificate.setIssuer(authority);
 certificate.setExtensions(
[altnames
,{name:"keyUsage",keyCertSign:true,digitalSignature:true,nonRepudiation:true,keyEncipherment:true,dataEncipherment:true}
,{name:"extKeyUsage",serverAuth:true,clientAuth:true,codeSigning:true,emailProtection:true,timeStamping:true}
,{name:"nsCertType",client:true,server:true,email:true,objsign:true,sslCA:true,emailCA:true,objCA:true}
,{name:"basicConstraints",cA:true}
,{name:"subjectKeyIdentifier"}
]);
 certificate.sign(privateKey);
 return Object.entries({privateKey,certificate}).map(([name,value])=>
 this.pki[name+"ToPem"](value));
};

 async function authorize({privateKey,publicKey},distinguishedname)
{let encryption=this.rsa.generateKeyPair(2048);
 let hash=compose(stash(compose(drop(),"crypto","createHash","sha256",resolve.bind(import.meta.url))),flip,"update","digest");
 let {asn1:{Class:{UNIVERSAL},Type:{SEQUENCE,OID,NULL,OCTETSTRING}}}=this;
 let SHA256identifier=this.asn1.create(UNIVERSAL,SEQUENCE,true,
[this.asn1.oidToDer(this.oids.sha256).getBytes(),''
].map(asn1=>this.asn1.create(UNIVERSAL,asn1?OID:NULL,false,asn1)));
 let digestinfo=compose
(slip(UNIVERSAL,OCTETSTRING,false),this.asn1.create,SHA256identifier,flip,collect
,slip(UNIVERSAL,SEQUENCE,true),this.asn1.create
);
 let pad=compose(stash(compose
("length",Math.ceil(encryption.privateKey.n.bitLength()/8),whether
(compose(stash(compose(crop(1),11,sum)),drop(1),minor)
,compose("text longer than encryption modulus",exit)
),flip,each([crop(1),combine(-1)]),-3,sum,slip(String.fromCharCode(0xFF)),"repeat"
)),flip,slip("\x00\x01"),drop(2,2,"\x00"),"concat"
);
 let sign=compose(when(is(Buffer)),"binary","toString",digestinfo,this.asn1.toDer,"getBytes",pad,slip(encryption.privateKey),"RAW","decrypt","binary",Buffer.from);
 let base64url=compose(whether(simple,JSON.stringify),whether(not(is(Buffer)),Buffer.from),infer("toString","base64url"));
 let jwk=["e","n"].map(factor=>encryption.publicKey[factor]).map(factor=>
 base64url(factor.toByteArray().slice(factor.bitLength()===2048))).reduce((e,n)=>(
 {e,kty:"RSA",n}));
 let ACME="https://acme-"+(0?"staging-":"")+"v02.api.letsencrypt.org/acme";
 let acme=compose(note,stash(compose
(stash(compose(swap(ACME+"/new-nonce"),{method:"HEAD"},fetch,"headers","replay-nonce"))
,(url,body,identity,nonce)=>[{alg:"RS256",url,nonce,...identity},body].map(base64url),combine
(compose(infer("join","."),hash,sign,base64url,["signature"],record)
,compose(0,["protected"],record)
,compose(1,["payload"],record)
),collect,infer("reduce",merge),JSON.stringify,["body"],record
,{method:"POST",headers:{"Content-Type":"application/jose+json"}},merge
)),drop(3,1),fetch);
 let account={termsOfServiceAgreed:true};
 let kid=await compose(acme,"headers","location")(ACME+"/new-acct",account,{jwk});
 let identifiers=[{type:"dns",value:distinguishedname.commonName}];
 let [order,{authorizations,finalize}]=await compose(acme,combine(compose("headers","location"),digest))(ACME+"/new-order",{identifiers},{kid});
 let challenges=await compose(infer("reduce",record(compose(drop(1,2),"",{kid},acme,digest,"challenges")),[]),"flat")(authorizations);
 note({challenges});
 let identity=await compose(JSON.stringify,hash,base64url)(jwk);
 let {http,dns,tls}=challenges.reduce((challenges,challenge)=>merge(challenges
,{[challenge.type.match(/^[^-]+/)[0]]:[challenge]},0),{});
 let routes={".well-known":{"acme-challenge":http.map(({token})=>({[token]:[token,identity].join(".")})).reduce(merge)}};
 note({http,routes});
 let host=await expose(routes,{network:"http",port:8000},false);
 await http.reduce(record(({url})=>combine(acme,either
(expect(compose(fetch,digest,note,combine("status","error"),note,whether
(is("invalid"),compose(drop(1),JSON.stringify,Error,exit),is("valid")
)))
,compose(Error,exit)
))(url,{},{kid})),[]);
 for(let url of authorizations)
 await either
(expect(compose(acme,digest,"status",is("valid")),1000*3,40)
,compose(Error,exit)
)(url,"",{kid});
 host.close();
 let authority=Object.entries(distinguishedname).map(([key,value])=>(
 {[key.match(/^[A-Z]{2}$/)?"shortName":"name"]:key,value}));
 let altnames={name:"subjectAltName",altNames:[{type:2,value:distinguishedname.commonName}]};
 let csr=merge(this.pki.createCertificationRequest(),{publicKey});
 csr.setSubject(authority);
 csr.setAttributes([{name:"extensionRequest",extensions:[altnames]}]);
 csr.sign(privateKey,this.md.sha256.create());
 let submission={csr:base64url(Buffer.from(this.asn1.toDer(this.pki.certificationRequestToAsn1(csr)).getBytes(),"binary"))};
 await compose(acme,digest,note)(finalize,submission,{kid});
 let certificate=await either
(expect(compose(acme,digest,whether
(compose("status",is("valid")),compose("certificate",fetch,digest),swap(false)
)),1000*5,12*5)
,compose(Error,exit)
)(order,"",{kid});
 return [this.pki.privateKeyToPem(privateKey),certificate];
};

 export async function broadcast(server,actions)
{let connection=buffer(function connection(host,peer,request)
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
 let {default:{WebSocketServer}}=await import("./einaros_2011_ws.js");
 return compose([{server}],Reflect.construct,{rooms:{}},Object.assign
,{connection},tether(observe))(WebSocketServer);
};

 var anonymous=Object.entries(animal).map(([name,svg])=>
 ({name,icon:"/svg/animal/"+name+"/document"}));

 export async function traverse(source)
{let {default:{interface:html,...routes}}=await resolve.bind(import.meta.url)(source);
 if(!functor(html))
 return;
 return prune.call(routes,([field,value],path)=>
 compose(note,stash(value),flip,tether(html),note)({url:"http://localhost/"+path.join("/")})&&value);
};
