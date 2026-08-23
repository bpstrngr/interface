 import smtp from "./Reinman_2015_smtp.js";
 import mailparser from "./Reinman_2011_mailparser.js";
 import {fetch} from "./Blik_2023_interface.js";
 import {note,infer,observe,revert,record,merge,extract} from "./Blik_2023_inference.js";
 import {authorize,persistence} from "./Blik_2024_static.js";

 export default
 {...persistence("Blik_2026_smtp.json")
 ,send:async function put(request,body)
{let {name}=await authorize(request);
 let source=request.headers.host;
 let recipient=request.headers["x-receiver"];
 let domain=recipient.split("@")[1];
 let records=await dns.resolveMx(domain);
 let target=records.sort((past,next)=>past.priority-next.priority)[0].exchange;
 let [helo,from,to]=
 [source,name+"@"+source,recipient].map((tag,index)=>
 ["HELO","MAIL FROM","MAIL TO"][index]+(index?":<":" ")+tag+(index?">":""));
 let [data,content,end]=["DATA",body+"\r\n.","QUIT"];
 let smtp=await revert((resolve,reject,host,port)=>
 observe.call(net.connect(host,port)
,{data(data)
{let code=data.toString().slice(0,3);
 if(code!=="220")
 reject(code);
 resolve(this);
},error(fail){reject(fail);}
 },{once:true}))(target,25);
 revert((resolve,reject,smtp)=>
 observe.call(smtp,{data(response){resolve(response.toString())}},{once:true}))(smtp);
 let responses=await Object.entries({250:helo,250:from,250:to,354:data,250:content,221:end}).reduce(record(infer((responses,smtp,[code,content])=>
 revert((resolve,reject,smtp)=>observe.call(smtp,{async data(data)
{data=data.toString();
 if(data.slice(0,3)!==code)
 reject(data);
 let body={sent:[{to:recipient,timestamp:Date.now(),content:body}]};
 await fetch("/mail/"+author,{method:"put",body,headers:request.headers}).then(response=>
 response.status===200?resolve(code):response.text().then(reject));
}},{once:true}).write(content+"\r\n"))(smtp),smtp)),[]);
}};

 export var open=revert(async function open(close,error,module,host="127.0.0.1",port=25,certifications)
{let contexts=await prune.call(certifications||{},function([domain,{key,cert}],{length})
{return length?arguments[0][1]:command.call(import.meta.url,"tls","createSecureContext",{key,cert});
},0,1);
 Object.entries(contexts).forEach(([domain,context])=>
 certifications[domain].altnames?.forEach(domain=>
 contexts[domain]=context));
 return observe.call(new smtp.SMTPServer(
 {logger:true,banner:host
 ,disabledCommands:['AUTH']
 ,authMethods:['PLAIN','LOGIN','CRAM-MD5']
 ,useXClient:true,useXForward:true
 ,hidePIPELINING:true
 ,size:10*1024*1024
 ,...extract.call(Object.values(certifications||{})[0],["key","cert"])
 ,secure:Boolean(Object.values(contexts).length)
 ,SNICallback(domain,context)
{context(null,contexts[domain]||null);
},onAuth({username,password,method},session,next)
{let user=username==="ranger";
 if(!user)return next(Error(username+" unknown."));
 let valid=method==='CRAM-MD5'
?arguments[0].validatePassword(password)
:password==="0000"
 if(!valid)
 return next(Error('unauthorized'));
 return next(null,{user:'userdata'});
},onMailFrom({address},session,next)
{if(/^deny/i.test(address))
 return next(Error(address+' unavailable.'));
 next();
},onRcptTo({address},session,next)
{if(/^deny/i.test(address))
 return next(Error(address+' unavailable.'));
 let limited=address.toLowerCase()==='almost-full@example.com';
 if(limited&&Number(session.envelope.mailFrom.args.SIZE)>100)
 return next(merge(Error('Insufficient channel storage: '+address),{responseCode:452}));
 next();
},onData(stream,session,next)
{// reader.simpleParser(stream,{}).then(note).catch(note.bind(2));
 //let parser=new mailparser.MailParser();
 let headers=[];
 let message=[];
 observe.call(stream
,{headers(data){headers.push(data);}
 ,data(data){message.push(data);}
 ,async end(done)
{if(stream.sizeExceeded)
 return next(merge(Error("message exceeds fixed maximum message size 10 MB"),{responseCode:552}));
 let from=session.envelope.mailFrom.address;
 let [author]=session.envelope.rcptTo[0].address.split("@")
 let body={[author]:{mail:
[{from,timestamp:Date.now()
 ,headers:is(Map)(headers[0])?Object.fromEntries(headers[0]):Buffer.concat(headers).toString()
 ,content:simple(message[0])?message[0]:Buffer.concat(message).toString()
 }
]}};
 let persistence="./Blik_2026_smtp.json";
 await compose("object",access,body,0,merge,true,slip(persistence),access)(persistence);
 return next();
},error(fail){note.call(1,fail);}
 });
 //stream.pipe(parser);
}}),{error(fail){note.call(1,fail);},close}).listen({port,host},false);
});
