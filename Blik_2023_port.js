 import {note,ring,clone,dependency,debug,bind,float,cede,lift,reduce,produce,deduce,match,unit,unary,sum,map,colors,search,surge,merge,prune,record,remember,route,when,stash,flip,are,functor,string,not,pattern,revert,each,clock,observe,is,has,same,minor,slip,something,compound,infer,tether,whether,collect,rank,buffer,compose,combine,either,drop,crop,swap,wait,exit,pass,binary,simple,array,expect,extract,numeric,flatten} from "./Blik_2023_inference.js";
 import {arrayBuffer,delegate,swarm,command,reload,access,locate,prompt,list,fetch,digest,version,compress,feature,location} from "./Blik_2023_interface.js";
 import {encrypt} from "./Blik_2023_search.js";
 import {mime,bytes,url,relate,cookie,hash} from "./Blik_2023_meta.js";
 import {browser,jsdom} from "./Blik_2023_fragment.js";
 import {animal} from "./Blik_2024_svg.js";
 import {files,remotes} from "./Blik_2026_git.js";
 export var memory={};

 export async function expose(protocol,range,suspend=true)
{({range,protocol}=await prompt({range,protocol}));
 let [module,...fields]=string(protocol)?await locate(protocol):[protocol];
 let [{default:routes,relay,syndication,encryption,classify,classified,published,permit},{default:credentials}]=
 await [range,module].reduce(record(module=>
 string(module)?command.call(import.meta.url,module):{default:module}),[]);
 let {network,port,certification={},cache,mail}=search.call(credentials,fields);
 if(cache)
 merge(memory,await buffer(access,compose(drop(1),infer(access,{},true),"object",access))(cache,"object")||{},1);
 memory=new Proxy(memory
,{set(target,field,value)
{let set=Reflect.set(target,field,value);access(cache,target,true);return set;
},deleteProperty(target,field)
{let deleted=delete target[field];access(cache,target,true);return deleted;
}});
 let [[domain,{key:signature,certificate,distinguishedname}={}]=[]]=Object.entries(certification);
 let [encrypted,syndicated]=await [encryption,syndication].reduce(record(required=>
 required?prompt(extract.call(credentials,Object.keys(required))):{}),[]);
 let agent=await command.call(import.meta.url,network);
 let required={"https:":{domain,signature,certificate,distinguishedname}}[agent.globalAgent.protocol];
 ({port,domain,signature,certificate,distinguishedname}=await prompt({port,...required}));
 merge(syndication,syndicated);
 merge(certification,required&&{[domain]:{key:signature,certificate,distinguishedname}});
 merge(encryption,prune.call(encrypted,([field,value])=>encrypt(value)));
 merge(globalThis,{memory,published,classified,classify});
 let address=await compose.call
(import.meta.url,"os","networkInterfaces",tether(command),Object.values,"flat"
,infer("find",match({family:'IPv4',internal:false})),"address"
);
 let certificates=await Promise.all(Object.values(certification).flatMap(({key,certificate})=>[key,certificate]).map(compose(crop(1),slip("path","resolve"),command.bind(import.meta.url))));
 await classify?.(module,...certificates);
 prune.call(certification,([domain,certification])=>
 domain==="localhost"?merge(certification,{altnames:["127.0.0.1",address]},0):certification,0,0);
 let certifications=await prune.call(certification,function([domain,{key,certificate,distinguishedname,altnames}],{length})
{return length?arguments[0][1]:certify([key,certificate],distinguishedname,[domain,...altnames||[]]);
},0,1);
 await jsdom.call(browser,agent.globalAgent.protocol+"//"+address+":"+port);
 let entry=compose(combine(unbust,variant),index);
 let retrieve=produce(combine(entry,unary),slip(memory),drop(2,0,tether(search)),when(defined),reencode);
 let memorable=bind(each,
[when(match({status:minor(300)}))
,produce(infer("join","/"),slip("/"),"concat",published,permit)
,when(match({method:/get/i}))
]);
 let reference=produce(search(["headers","referer"]),when(string),url,"pathname","imports",collect);
 let persist=produce
(pass(buffer(mapsource))
,pass(produce(deduce(float,memorable),lift))
,drop(2,1),crop(1,combine(entry,buffer(reference,drop()))),lift
,slip(memory),ring
);
 let response=produce
(combine(path,unit),lift
,combine(buffer(route.bind(routes),either(tether(routes.error),crop(1))),unit),lift
,combine(stage,drop(1)),lift
,cache&&pass(buffer(persist))
,crop(1)
);
 let respond=produce
(drop(1),drop(1,0,stash(revert(decode,new TextDecoder("utf-8"))))
,combine(either(cache&&retrieve,response),unit)
,surge,tether(submit)
);
 let scope=new Set(await remotes(location).then(remotes=>remotes.reduce(record(remote=>
 files(remote,"stable",location)),[])).then(files=>files.flat()));
 return compose
("createServer",port
,revert((proceed,cancel,host,port)=>host.listen(port,infer(proceed)))
,...Object.entries(certifications).map(([domain,{key,cert}])=>
 // for self-signed certificates, assign them to the NODE_EXTRA_CA_CERTS option.
 pass(compose(domain,{key,cert},lift,"addContext")))
,pass(host=>note.call(2,[host._connectionKey||port," open"].join("")))
,pass(produce(relay,broadcast,location,scope,memory,cache,monitor))
,mail&&pass(compose(swap(null),address,mail,certifications,command.bind(import.meta.url,"./Blik_2025_email.js","open")))
,revert((close,error,channel)=>observe.call(channel,{close,error})&&suspend||close(channel))
,cede
)(agent,extract.call(await Object.values(certifications)[0],["key","cert"]),buffer(respond,compose(crop(1),note)));
};

 var variant=produce
(search({headers:["sec-fetch-dest","accept"]}),rank,whether(either
(is("script",accept=>!accept?.includes("application/json"))
// Form's service worker expresses script destination with fetch Accept header.
,is("empty",accept=>accept?.includes("text/javascript"))
),swap("module"),swap("content"))
);

 async function monitor(server,location,scope,memory)
{console.log("Monitoring files in "+location+".");
 return command.call(import.meta.url,"fs","watch",location,tether(async function(scope,memory,event,filename)
{if(!scope.has(filename))
 return;
 console.warn("File "+event+": "+filename);
 let file="/"+filename;
 let local=swarm.loader
?await delegate.call(swarm.loader,["interface/modules",{"inference/tether":["inference/dependency",[file,"imports"]]}])
:await dependency.call(modules,file,"imports");
 await reload(local);
 let remote=await [file,...memory[file]?.maps||[]].map(file=>
 dependency.call(memory,file,"imports")).reduce(merge);
 let stale=[Object.keys(remote),flatten(remote).filter(path=>
 memory[path]?.content?.headers["Content-Type"]==="text/html")].flat();
 stale.forEach(path=>delete memory[path]);
 server.clients.forEach(client=>client.readyState===1&&
 client.send(JSON.stringify({action:"bust",modules:remote})));
},scope,memory));
};

 function path(request)
{let {query,pathname}=new URL(request.url.replace(/^\//,"http://localhost/"));
 let method=request.method.toLowerCase();
 let methodic=pathname==="/"+method;
 return compose
("/","split",infer("slice",1)
,infer("filter",(step,index,{length})=>(index+1<length?step:true)&&step!==".")
,{get:infer("map",step=>step||"interface")}[!methodic&&method]
)(decodeURIComponent(methodic?"":pathname));
};

 function unbust(request)
{// bust timestamps are for the client's own module cache only - never the server's.
 let {pathname,searchParams:query}=new URL(request.url,"http://localhost/");
 query.delete("bust");
 return pathname+(query.size?"?"+query:"");
};

 function decode(end,error,decoder,request,body=[])
{let color=colors[["yellow","cyan"][Number(/get/i.test(request.method))]];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url," ",request.headers["sec-fetch-dest"],colors.steady].join(""));
 return observe.call(request
,{data:record(data=>decoder.decode(data)).bind(body)
 ,end(){end(body.length?body.join(""):undefined);}
 ,finish:note
 ,error
 });
};

 function encode(response)
{return compose.call(response,buffer(whether
([is(Error),is(Buffer),has("nodeName")]
,compose(drop(1,0,note.bind(1)),"message")
,compose(["body"],record,tether(arrayBuffer),bytes)
,compose(combine
(whether(match({constructor:{name:"HTMLHtmlElement"}}),swap("<!DOCTYPE html>"),drop())
,whether(match({constructor:{name:"DocumentFragment"}}),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),lift,collect,"","join")
),"stack"));
};

 function reencode(response,request)
{let hash=request?.headers?.["if-none-match"];
 if(hash&&hash===response.headers.ETag)
 return prune.call(response,([field,value])=>field==="content"?"":field==="status"?304:value,0,1);
 let {content}=response;
 if(match({type:"Buffer",data:array})(content))
 content=Buffer.from(content);
 return merge(response,content,["content"]);
};

 export async function stage(response,path,request)
{let agent=version(request.headers);
 let browser="Mozilla/Chrome/Safari/AppleWebKit".split("/").some(has.bind(agent||{}));
 let [specifier,peer]=[request.url,request.headers?.referer];
 let {body:content=response,type,encoding,status,location,headers,cookie:cookies}=response||{};
 let fail=is(Error)(content);
 if(!fail&&!type)
 type=headers?.["Content-Type"]||
 mime(content?.nodeName?.toLowerCase()||(either(simple,array)(content)?"json":is(Uint8Array)(content)&&signature(content)||path.join("/")))||
 mime(content.nodeName?"html":"txt");
 let [js,json]=[type===mime("js"),type===mime("json")];
 if(basic(content))
 content=JSON.stringify(content);
 if(json&&variant(request)==="module")
 // eliminates need for json import attribute from Browsers, like Interface/load from Node. 
 content=Buffer.from("export default "+content+";"),type=mime("js"),js=true;
 content=await encode(content);
 if(browser&&js)
 content=await compress(content),encoding="gzip";
 let etag=await hash(content);
 status=response?fail?500:numeric(status)?status:200:404;
 return {content,status,headers:clone(
 {status,"Content-Type":type,"Content-Encoding":encoding,"ETag":etag
 ,"Set-Cookie":cookies?cookie(cookies):undefined
 ,"Service-Worker-Allowed":js?"/":undefined
 ,"Access-Control-Allow-Origin":"*"
 ,"Location":location
 //,"X-Frame-Options":"DENY"
 ,...headers
 })};
};

 export function submit(request,body,response)
{let {content,status,headers}=this;
 response?.writeHead(status,headers)||request.respond(headers);
 let color=colors[{200:"green",304:"magenta"}[status]||"red"];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url," ",headers["Content-Type"],colors.steady].join(""));
 let target=response||request;
 return functor(content)?content(target):target.end(content);
};

 function mapsource(response,path,request)
{return response.headers.SourceMap&&compose.call
(response.headers.SourceMap,"http"+(request.client.encrypted?"s":"")+"://"+request.headers.host+request.url
,relate,fetch,digest,({sources})=>
 sources.forEach(source=>[request.url,[new URL(source).pathname,"maps"]].reduce((map,maps)=>
 merge(memory,Array.from(new Set([...search.call(memory,maps)||[],map])),maps,1)))
);
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
 let [path,url]=await command.bind(import.meta.url)(["path","url"]);
 let location=path.dirname(url.fileURLToPath(import.meta.url));
 let [key,cert]=await Promise.all(certification.map(certificate=>
 cede(buffer(access,swap(null))(path.resolve(location,certificate),true))));
 if([key,cert].every(Boolean))
 return {key,cert,altnames};
 note("creating "+certification+"...");
 let {default:forge}=await import("./digitalbazaar_2013_nodeforge.js");
 let method=altnames.includes("localhost")?selfsign:authorize;
 let encryption=forge.rsa.generateKeyPair(2048);
 [key,cert]=await method.call(forge,encryption,distinguishedname,duration,altnames);
 [key,cert]=await certification.reduce(record((certification,index)=>compose.call
(path.resolve(location,certification),[key,cert][index],true,access,true,access
)),[]);
 return {key,cert,altnames};
};

 async function selfsign({privateKey,publicKey},distinguishedname,duration,altnames=[])
{// self-signed certificate. 
 let authority=Object.entries(distinguishedname).map(([key,value])=>(
 {[key.match(/^[A-Z]{2}$/)?"shortName":"name"]:key,value}));
 let certificate=this.pki.createCertificate();
 let asn1=await command.bind(import.meta.url)("crypto","randomBytes",19).then(infer("toString","hex"));
 Object.assign(certificate,{publicKey,serialNumber:"01"+asn1});
 Object.assign(certificate.validity,{notBefore:new Date(),notAfter:new Date()});
 certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear()+duration);
 certificate.setSubject(authority);
 certificate.setIssuer(authority);
 certificate.setExtensions(
[{name:"subjectAltName",altNames:altnames.map(altname=>
 [altname,/(\d+\.){3}/.test(altname)].reduce((altname,ip)=>(
 {type:ip?7:2,[ip?"ip":"value"]:altname})))}//,{type:6,value:"https://"+distinguishedname.commonName}]}
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
 let hash=compose(stash(compose(drop(),"crypto","createHash","sha256",command.bind(import.meta.url))),flip,"update","digest");
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
 let acme=compose(stash(compose
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
 let [order,{authorizations,finalize}]=await compose(acme,combine(search(["headers","location"]),digest),lift)(ACME+"/new-order",{identifiers},{kid});
 let challenges=await compose(infer("reduce",record(compose(drop(1,2),"",{kid},acme,digest,"challenges")),[]),"flat")(authorizations);
 let identity=await compose(JSON.stringify,hash,base64url)(jwk);
 let {http,dns,tls}=challenges.reduce((challenges,challenge)=>merge(challenges
,{[challenge.type.match(/^[^-]+/)[0]]:[challenge]},0),{});
 let routes={".well-known":{"acme-challenge":http.map(({token})=>({[token]:[token,identity].join(".")})).reduce(merge)}};
 let host=await expose({network:"http",port:80},routes,false);
 await http.reduce(record(({url})=>combine(acme,either
(expect(compose(fetch,digest,combine("status","error"),whether
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
{let connection=buffer(async function connection(host,peer,request)
{let {author:name}=cookie(request.headers.cookie||"");
 let authorized=name&&await fetch("/author/"+name,{method:"put",headers:{cookie:request.headers.cookie}});
 let record=authorized?.status===200&&await authorized.json();
 Object.assign(peer
,{author:record?extract.call(record,["name","icon"]):anonymous[Math.floor(Math.random()*anonymous.length)]
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
 console.log({from:peer.author.name+"@"+peer._socket.remoteAddress,...message});
 return buffer(tether(actions[message.action]),note.bind(2))(host,message,peer);
},message=>peer.send(JSON.stringify(is(Error)(note(message))?{error:note.call(1,message).message}:message))
),host)
 });
 peer.send(JSON.stringify({action:"message",message:"Signed in as "+peer.author.name}));
},note.bind(1));
 let {default:{WebSocketServer}}=await import("./einaros_2011_ws.js");
 return compose
([{server}],Reflect.construct,{rooms:{}},Object.assign
,{connection},tether(observe)
)(WebSocketServer);
};

 var anonymous=Object.entries(animal).map(([name,svg])=>
 ({name,icon:"/svg/animal/"+name+"/vector"}));

 export async function traverse(source)
{let {default:{interface:html,...routes}}=await command.bind(import.meta.url)(source);
 if(!functor(html))
 return;
 return prune.call(routes,([field,value],path)=>
 compose(note,stash(value),flip,tether(html),note)({url:"http://localhost/"+path.join("/")})&&value);
};
