 import {note,debug,sum,map,colors,search,surge,merge,prune,record,remember,route,when,stash,flip,are,functor,string,not,pattern,revert,each,clock,observe,is,has,same,minor,slip,something,compound,infer,tether,whether,collect,rank,buffer,compose,combine,either,drop,crop,swap,wait,exit,pass,binary,simple,array,expect,extract} from "./Blik_2023_inference.js";
 import {name as loader,arrayBuffer,delegate,swarm,command,access,locate,prompt,list,fetch,digest,version,compress,stage,feature} from "./Blik_2023_interface.js";
 import {encrypt} from "./Blik_2023_search.js";
 import {mime,bytes,url,cookie} from "./Blik_2023_meta.js";
 import {browser,jsdom} from "./Blik_2023_fragment.js";
 import {animal} from "./Blik_2024_svg.js";

 export async function expose(protocol,range,suspend=true)
{({range,protocol}=await prompt({range,protocol}));
 let [module,...fields]=string(protocol)?await locate(protocol):[protocol];
 let [{default:routes,relay,syndication,encryption,classify,classified,published,permit},{default:credentials}]=
 await [range,module].reduce(record(module=>
 string(module)?command.call(import.meta.url,module):{default:module}),[]);
 let {network,port,certification={},distinguishedname,cache}=search.call(credentials,fields);
 let memory=cache&&await buffer(access,compose(infer(access,{},true),"object",access))(cache,"object");
 let [[domain,[signature,certificate]=[]]=[]]=Object.entries(certification);
 let [encrypted,syndicated]=await [encryption,syndication].reduce(record(required=>
 required?prompt(extract.call(credentials,Object.keys(required))):{}),[]);
 let agent=await command.call(import.meta.url,network);
 let required={"https:":{domain,signature,certificate}}[agent.globalAgent.protocol];
 ({port,domain,signature,certificate}=await prompt({port,...required}));
 merge(syndication,syndicated);
 merge(certification,required&&{[domain]:[signature,certificate]});
 merge(encryption,prune.call(encrypted,([field,value])=>encrypt(value)));
 merge(globalThis,{memory,published,classified,classify});
 let certificates=await Promise.all(Object.values(certification).flat().map(compose(crop(1),slip("path","resolve"),command.bind(import.meta.url))));
 await classify?.(module,...certificates);
 let certifications=prune.call(certification,([domain,certificates])=>
 certify(certificates,distinguishedname,[domain]),0,0);
 await jsdom.call(browser,agent.globalAgent.protocol+"//localhost"+":"+port);
 var cachable=each([unit,compose(infer("join","/"),slip("/"),"concat",published,permit),when(match({method:/get/i}))]);
 var response=compose
(combine(path,unit),lift
,combine(buffer(route.bind(routes),either(tether(routes.error),crop(1))),unit),lift
,combine(describe,drop(1)),lift
,cache&&pass(buffer(compose(pass(compose(cachable,lift)),pass(persist,memory,cache))))
,crop(1)
);
 var respond=compose
(drop(1),drop(1,0,stash(revert(decode,new TextDecoder("utf-8")))),combine
(either(cache&&compose(distinction,slip(memory),tether(search),reencode),response)
,unit
),surge,tether(submit)
);
 return compose
("createServer",port
,revert((proceed,cancel,host,port)=>host.listen(port,infer(proceed)))
,...Object.entries(certifications).map(([domain,certification])=>
 // for self-signed certificates, assign them to the NODE_EXTRA_CA_CERTS option. 
 pass(compose(domain,certification,lift,"addContext")))
,pass(host=>note.call(2,[host._connectionKey||port," open"].join("")))
,pass(compose(relay,broadcast))
,revert((close,error,channel)=>observe.call(channel,{close,error})&&suspend||close(channel))
,cede
)(agent,await Object.values(certifications)[0],buffer(respond,compose(crop(1),note)));
};

 function distinction({url,headers})
{return url+Object.values(feature(version(headers))).map(Boolean).map(Number).join("");
};

 function persist(response,memory,cache,path,request)
{merge(memory,response,distinction(request));
 return access(cache,memory,true);
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

 function decode(end,error,decoder,request,body=[])
{let color=colors[["yellow","cyan"][Number(/get/i.test(request.method))]];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url,"...",colors.steady].join(""));
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
,compose(note.bind(1),"message")
,compose(["body"],record,tether(arrayBuffer),bytes)
,compose(combine
(whether(match({constructor:{name:"HTMLHtmlElement"}}),swap("<!DOCTYPE html>"),drop())
,whether(match({constructor:{name:"DocumentFragment"}}),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),lift,collect,"","join")
),"stack"));
};

 function reencode(response)
{let {content,header}=response;
 let json=header["Content-Type"]===mime("json");
 if(match({type:"Buffer",data:array})(content))
 content=Buffer.from(content);
 return merge(response,content,["content"]);
};

 export async function describe(response,path,request)
{let agent=version(request.headers);
 let features=feature(agent);
 let browser="Mozilla/Chrome/Safari/AppleWebKit".split("/").some(has.bind(agent||{}));
 let direct=request.headers?.referer?.endsWith(request.url)===false;
 let importing=!direct&&request?.headers?.["sec-fetch-dest"]==="script";
 let {body:content=response,type,status,location,headers,cookie:cookies}=response||{};
 let fail=is(Error)(content);
 type=!fail&&type||headers?.["Content-Type"]||mime(content?.nodeName?.toLowerCase()||(either(simple,array)(response)?"json":path.join("/")))||mime(content.nodeName?"html":"txt");
 let [js,json]=[type===mime("js"),type===mime("json")];
 if(basic(content))
 content=JSON.stringify(content);
 if(json&&importing&&!features.json)
 content=Buffer.from("export default "+content+";"),type=mime("js"),js=true;
 content=await encode(content);
 status=response?fail?500:response.status||200:404;
 return {content,status
 ,header:JSON.parse(JSON.stringify({status
 ,"Access-Control-Allow-Origin":"*"
 //,"X-Frame-Options":"DENY"
 ,"Location":location
 ,"Set-Cookie":cookies?cookie(cookies):undefined
 ,"Content-Type":type
 ,...headers
 }))
 };
};

 export function submit(request,body,response)
{let {content,status,header}=this;
 response?.writeHead(status,header)||request.respond(header);
 let color=colors[{200:"green"}[status]||"red"];
 console.log([color,clock(),"@",request.connection?.remoteAddress||"",request.url," ",header["Content-Type"],colors.steady].join(""));
 let target=response||request;
 return functor(content)?content(target):target.end(content);
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
 let asn1=await command.bind(import.meta.url)("crypto","randomBytes",19).then(infer("toString","hex"));
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
 note({http,routes});
 let host=await expose(routes,{network:"http",port:80},false);
 await http.reduce(record(({url})=>combine(acme,either
(expect(compose(fetch,digest,note,combine("status","error"),whether
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
 return compose
([{server}],Reflect.construct,{rooms:{}},Object.assign
,{connection},tether(observe)
)(WebSocketServer);
};

 var anonymous=Object.entries(animal).map(([name,svg])=>
 ({name,icon:"/svg/animal/"+name+"/document"}));

 export async function traverse(source)
{let {default:{interface:html,...routes}}=await command.bind(import.meta.url)(source);
 if(!functor(html))
 return;
 return prune.call(routes,([field,value],path)=>
 compose(note,stash(value),flip,tether(html),note)({url:"http://localhost/"+path.join("/")})&&value);
};
