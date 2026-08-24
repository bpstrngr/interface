 import smtp from "./Reinman_2015_smtp.js";
 import mailparser from "./Reinman_2011_mailparser.js";
 import nodemailer from "./Reinman_2011_nodemailer.js";
 import {fetch} from "./Blik_2023_interface.js";
 import {note,infer,observe,revert,record,merge,extract,remember} from "./Blik_2023_inference.js";
 import {authorize,persistence,classify} from "./Blik_2024_static.js";
 export var signature={dkim:undefined};

 export default
 {...persistence("Blik_2026_smtp.json")
 ,send:async function put(request,text)
{let {name}=await authorize(request);
 let source=request.headers.host;
 let from=[name,source].join("@");
 let subject=request.headers["x-subject"];
 let to=request.headers["x-receiver"];
 let domain=to.split("@")[1];
 if(domain!=="source")
 exit("Outgoing mail blocked until PTR (reverse DNS) record from IPS is secured.");
 let records=await command.call(import.meta.url,"dns","resolveMx",domain);
 let host=records.sort((past,next)=>past.priority-next.priority)[0].exchange;
 let mail=await nodemailer.createTransport({host,port:25,secure:false,dkim:
 {domainName:source,keySelector:"default",privateKey:signature.dkim
 ,cacheDir:"/tmp",cacheTreshold:100*1024
 ,skipFields:"message-id:date"//https://nodemailer.com/dkim#5-skip-mutable-headers
 }}).sendMail({from,to,subject,text});
 let body={sent:[mail]};
 return fetch("/mail/"+author,{method:"put",body,headers:request.headers}).then(sent=>
 mail);
}};

 export var open=revert(async function open(close,error,module,host="127.0.0.1",port=25,certifications)
{let contexts=await prune.call(certifications||{},function([domain,{key,cert}],{length})
{return length?arguments[0][1]:command.call(import.meta.url,"tls","createSecureContext",{key,cert});
},0,1);
 Object.entries(contexts).forEach(([domain,context])=>
 certifications[domain].altnames?.forEach(domain=>
 contexts[domain]=context));
 let altnames=Object.entries(certifications).flatMap(([domain,{altnames}])=>[domain,altnames]);
 return observe.call(new smtp.SMTPServer(
 {logger:true,banner:Object.keys(certifications||{})[0]||host
 ,disabledCommands:['AUTH']
 ,authMethods:['PLAIN','LOGIN','CRAM-MD5']
 ,useXClient:true,useXForward:true
 ,hidePIPELINING:true
 ,size:10*1024*1024
 ,...extract.call(Object.values(certifications||{})[0],["key","cert"])
 ,secure:Boolean(Object.values(contexts).length)
 ,SNICallback(domain,context)
{context(null,contexts[domain]||null);
// },onAuth({username,password,method},session,next)
// {let user=username==="ranger";
//  if(!user)return next(Error(username+" unknown."));
//  let valid=method==='CRAM-MD5'
// ?arguments[0].validatePassword(password)
// :password==="0000"
//  if(!valid)
//  return next(Error('unauthorized'));
//  return next(null,{user:'userdata'});
},async onMailFrom({address},session,next)
{let [name,domain]=address.split("@");
 let ip=session.remoteAddress;
 let ptr=session.clientHostname;
 if(!ptr||ptr===ip)
 next(Error(" Reverse-DNS lookup of PTR record failed for:"+ip));
 let records=await revert((resolve,reject,domain)=>
 command.call(import.meta.url,"dns","resolveMx",domain,(fail,records)=>
 fail?reject(fail):resolve(records)))(domain).catch(note);
 if(records.code)
 next(Error(records));
 let mta=records.sort((past,next)=>past.priority-next.priority)[0].exchange;
 let {dkim,spf,arc,dmarc,bimi,receivedChain,headers}=
 await command.call(import.meta.url,"./Reinman_2020_mailauth.js","default").then(({spf})=>spf(
 {trustReceived:true
 //,ip,helo
 ,sender:address,mta
 //,resolver:async(name,rr)=>await dns.promises.resolve(name, rr),
 }));
 next();
},async onRcptTo({address},session,next)
{let [name,domain]=address.split("@");
 let author=await fetch("/author/"+name).then(response=>
 response.status===200&&response.json());
 if(!author)
 return next(Error(" Recipient not found: "+name));
 // if(Number(session.envelope.mailFrom.args.SIZE)>100)
 // return next(merge(Error('Insufficient channel storage: '+address),{responseCode:452}));
 next();
},onData(stream,session,next)
{// reader.simpleParser(stream,{}).then(note).catch(note.bind(2));
 let content=[];
 observe.call(stream
,{data(part){content.push(part);}
 ,async end(done)
{if(stream.sizeExceeded)
 return next(merge(Error("message exceeds fixed maximum message size 10 MB"),{responseCode:552}));
 let validity=await command.call(import.meta.url,"./Reinman_2020_mailauth.js","authenticate",Buffer.concat(content));
 let parser=new mailparser.MailParser({skipTextToHtml:true});
 let headers=[];
 let attachment=[];
 let attachments={};
 let [message]=await import("stream").then(revert((resolve,reject,{Readable},message)=>
 observe.call(new Readable().from(Buffer.concat(content)).pipe(parser)
,{headers(part){headers.push(part);}
 ,data(part)
{if(part.type==="attachment")
 return attachment=[],observe.call(part.content
,{data(part){attachment.push(part);}
 ,end(){attachments[part.filename]=Buffer.concat(attachment),part.release();}
 });
 message.push(part);
},end(){resolve(message);}
 ,error(fail){reject(fail);}
 }),[]));
 let from=session.envelope.mailFrom.address;
 let authors=session.envelope.rcptTo.map(({address})=>
 address.split("@")[0]);
 let mail={mail:
[{from,timestamp:Date.now()
 ,headers:is(Map)(headers[0])?Object.fromEntries(headers[0]):Buffer.concat(headers).toString()
 ,content
 }
]};
 let records=Object.fromEntries(authors.map(author=>[author,mail]));
 let persistence="./Blik_2026_smtp.json";
 await compose("object",access,records,0,merge,true,slip(persistence),access)(persistence);
 return next();
},error(fail){note.call(1,fail);}
 });
 //stream.pipe(parser);
}}),{error(fail){note.call(1,fail);},close}).listen({port,host},false);
});
