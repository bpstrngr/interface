 import {note,collect,spread,search,merge,prune,route,record,remember,tally,cede,unit,lift,push,sum,same,are,has,promise,pass,slip,something,observe,functor,describe,expect,control,trace,array,compound,simple,apply,stream,revert,rank,tether,differ,whether,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,numeric,binary,basic,match,wait,string,defined,minor,compose,combine,exit,clock,major,colors,skip,flip,debug,relevant,extract} from "./Blik_2023_inference.js";
 import {stringify,edit,parse as records} from "./Blik_2023_search.js";
 import {parser,parse,sanitize,serialize,exports,reexport,mime,coordinates} from "./Blik_2023_meta.js";

 export var {pathname:address,protocol}=new URL(import.meta.url);
 export var location=folder(address);
 export var name=file(address);
 export var remote=protocol==="http:";

 export var agent=merge({virtual:typeof imports!=="undefined"}
,globalThis.process?.versions
?prune.call(globalThis.process.versions,({1:value})=>string(value)?Number(value.match(/(\.{0,1}\d+){1,2}/)[0]):value)
:version(globalThis.navigator));
 export var features=feature(agent);
 export var thread=agent.node&&await import("worker_threads").then(infer("isMainThread"))?0:1;

 // --import flag registers loader module on separate thread unlike 
 // --loader, where context is available directly on the primary thread. 
 export var {import:loader,loader:legacy,inspect:inspected}=commandline();
 export var [sources]=await locate.call(import.meta.url,"sources","json");
 export var sourcemap=await resolve.call(import.meta.url,sources,"default");
 export var scope={};// tracking imports in /resolve and /load. 
 export var peer=remember(compose(drop(1,2),"Agent",{timeout:5*60*1000},note.bind(3),resolve.bind(import.meta.url)),protocol=>protocol);
 export var {window,fetch}=agent.node?{fetch:freefetch}:globalThis;

 export var worker=
 {imports:
 {"/Blik_2023_inference.js":["","revert","compose","combine","drop","collect","infer","buffer","is","note","exit","slip","differ","observe"]
 }
 ,procedures:{async expose()
{// expose worker to commands from ./delegate. 
 var address=import.meta.url;
 var worker=this||globalThis.self||await import("worker_threads").then(({parentPort})=>parentPort);
 var error=infer("postMessage");
 observe.call(worker,{message,error}).postMessage("Worker ready: "+address);
 async function message({data})
{if(data.port1)
 return observe.call(worker=data.port1,{message,error}).postMessage("Worker ready: "+address);
 if(!Array.isArray(data))
 return console.log(data);
 let [id,term,...context]=data;
 compose.call
(import(address),buffer(string(term)
?differ(term,...context)
:compose(swap(term),resolve.bind(address)),crop(1))
//,whether(string,infer(),JSON.stringify),whether(string,compose(TextEncoder.prototype.encode.bind(new TextEncoder()),"buffer"),infer())
,combine
(compose(slip(id),collect)
,compose(collect,tether(search,compose(drop(1),1,either(is(ArrayBuffer)))),Object.values)
),worker.postMessage.bind(worker)
);
};
}}
 };

 export var browser={imports:
 {"/Domenic_2010_jsdom.js":["JSDOM"]
 ,"/Blik_2023_interface.js":["","inspect"]
 }
 ,exports:
 {configure(url)
{if(!browser)
 note.call(3,"loading browser client at "+url+"...")
,browser=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 else browser.reconfigure({url});
 window=browser.window;
 fetch=window.fetch;
 note.call(3,"navigated browser to "+url);
},origin(){return browser?.window.location.origin;}
 }
 ,procedures:{async initialize()
{var browser,window,fetch;
 inspect(process.debugPort+2);
}}};

 if(agent.node&&!agent.virtual&&!remote&&!thread)
 browser=await delegate(browser,"browser")
,loader=loader?await register(address):legacy
,inspected&&inspect(globalThis.process.debugPort);

 export async function delegate(term,...context)
{// submit command to worker initialized with ./worker/procedures. 
 when(either(string,array,functor,defined(this)&&has(["exports"])))(term);
 if(defined(this))
 return control(new AbortController()
,revert((resume,reject,{signal},worker,...context)=>
 // listen until worker emits request id. 
[function message({target,data,type,message}={})
{let ephemeral=![globalThis.worker,loader,browser].includes(target);
 if(ephemeral)target.terminate();
 let [id,value]=data||[];
 if(id===context[0])
 return resume(message?Error(message):value);
},context.filter(is(ArrayBuffer))
].reduce((message,transfer)=>
 observe.call(worker,{message,error:message},{signal}).postMessage(context,transfer)))
,this,crypto.randomUUID(),functor(term)?term.name:term,...context);
 let ephemeral=functor(term);
 if(ephemeral&&!term.name)
 throw Error("Can't create ephemeral worker for anonymous function.");
 let address=string(term)?term:compose.call
(ephemeral?{exports:{[term.name]:term}}:term,worker,0,merge
,tether(prune,([field,value])=>field!=="imports"?value
:Object.fromEntries(Object.entries(value).map(([field,value])=>
 [protocol+"//"+location+field,value]))),"module",serialize,...agent.node
?[Buffer.from,"base64","toString","data:text/javascript;base64,",flip,"concat",collect,slip(URL),Reflect.construct]
:[{type:"text/javascript"},collect,slip(Blob),Reflect.construct,URL.createObjectURL]
);
 let module=await compose
(lift,search("Worker"),[address
,{type:"module",name:context[0]
 ,execArgv:process.execArgv.filter(not(match(/^--import/)))
 }],Reflect.construct,agent.node?await import("worker_threads").then(({MessageChannel})=>new MessageChannel()):{},buffer
(revert((resume,error,module,{port1,port2})=>
 port1&&!module.postMessage({port1},[port1])&&
 observe.call(port2||module,{error,exit:error,message({data})
{note.call(2,data),resume(this);
}},{once:true}))
,compose("stack",exit)
)
)(agent.node?import("worker_threads"):{Worker});
 URL.revokeObjectURL(address);
 return ephemeral?delegate.bind(module,term.name,...context):module;
};

 export function register(address)
{// register loader thread. 
 return compose.call
("worker_threads",resolve.bind(import.meta.url),tether(search,["MessageChannel"]),[],Reflect.construct
,address,revert(async function register(resume,onerror,{port1:loader,port2:primary},address)
{//await segmentation();
 await worker.procedures.expose.call(loader);
 observe.call(loader,{message:compose(crop(1),resume),onerror,messageerror:onerror},{once:true});
 resolve.call(import.meta.url,"module","register",address,import.meta.url,{data:[primary,browser],transferList:[primary,browser]});
})
);
};

 export function command([module,...context]=globalThis.process.argv.slice(1))
{// delegated by ./resolve on loader thread to infer command line context. 
 let observe=compose(swap("bundling","testing"),each(compose(crop(1),delegate.bind(this))),lift,are(false));
 return buffer(compose
(when(tally(1)),resolve.bind(import.meta.url),note.bind(2)
,compound(this)&&pass(expect(observe,5000))
,wait(60*10*1000)
),compose(note.bind(1),wait(60*1000),swap(1),globalThis.process.exit))(
 // without a loader in scope, the primary module is Interface itself. 
 ...this?[module,...context]:module?.endsWith(name)?context:[]);
};

 export async function prompt(...context)
{// request context from client interface, 
 // or offer it to the client (syncing the cli 
 // with debugPort and customizing it don't work yet). 
 let {createInterface}=await import("readline");
 let {stdin:input,stdout:output}=globalThis.process;
 let socket=await buffer.call
(resolve.call(import.meta.url,"net","connect",globalThis.process.debugPort)
,revert((connect,error,connection)=>observe.call(connection,{connect:infer(connect),error}))
,compose(note,swap("debug port unavailable for "+prompt.name),note.bind(1))
);
 let interfaces=[{input,output}/*,socket&&{input:socket,output:socket}||[]*/].flat().map(createInterface);
 let entries=context.flat().flatMap(term=>compound(term)?Object.entries(term):[[term]]);
 entries=await entries.reduce(cede(record(([field,term])=>
 control(new AbortController(),cede(revert((resolve,reject,abortion,...interfaces)=>
 term?resolve(term):interfaces.forEach(infer("question",field+":"
,combine(compose(note,swap(abortion),"abort"),resolve))))),...interfaces).then(term=>
 [field,term])))
,[]);
 return cede(compose(each("close"),swap(Object.fromEntries(entries))))(...interfaces);
};

 // https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize(sockets)
{// called on loader thread upon registration from main. 
 [loader,browser]=sockets;
 await worker.procedures.expose.call(loader);
 if(inspected)
 await inspect(globalThis.process.debugPort+1,"localhost");
};

 var precedent=compose(crop(1),"resolution",collect,slip(scope),tether(search));
 var recover=compose
(combine(({message},source)=>message.includes("'"+source+"'"),drop(3,2)),lift
,(immediate,fail,source,target,scope)=>(
 {ERR_MODULE_NOT_FOUND:immediate?acquire:divert
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate&&extend
 }[fail.code]?.call(scope,source,target))||exit(fail)
);
 var request=compose
(crop(1),fetch,when(match({status:200})),search(["headers","location"])
,address=>({url:window.location.origin+address})
);
 var respecify=compose("url",collect,slip(URL),Reflect.construct,"pathname",decodeURI);
 var modulepath=when(is([match(/^[\/\.]/),not(match(RegExp(sources+"$")))]));
 var format=compose
(combine(unit,2,compose(swap(sourcemap),Object.keys)),lift,(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$|\.node$/,"/")].join("/")))||"module",["format"],record
);
 var shortcircuit=compose
(combine(unit,either(buffer(compose(respecify,modulepath,format)),swap({}))),lift,merge
,{shortCircuit:true},merge,["resolution"],record
);

 export async function resolve(source,context,next)
{// import module from source, infer context if provided. 
 // use as --loader/import module to do for each import. 
 if(compound(source))
 // program declaration. 
 return denote.call(this,...arguments);
 when(string)(source);
 let {importAssertions:assertions,importAttributes:attributes=assertions}=context||{};
 let peer=attributes?.peer||context?.parentURL;
 if(attributes?.peer)
 // clone immutable context without custom attributes (peer tracks bound url for commands). 
 context=prune.call(context,([field,value])=>field==="peer"?undefined:value);
 let command=next?.name!=="nextResolve";
 let primary=!command&&!peer;
 if(primary&&loader&&thread)
 // delegate primary import to primary thread to infer command line context. 
 return delegate.call(loader,"command",source);
 let target=peer?decodeURI(new URL(peer).pathname):address;
 let {protocol,host,pathname:absolute}=await url(source,target.replace(/\/[^/]*$/,""));
 let [relative,reverse]=await [absolute,target].reduce(record(async relation=>agent.node&&
 "file:"===protocol?"/"+await resolve.call(import.meta.url,"path","relative",location,relation):relation),[]);
 if(command&&!string(this))
 console.warn("Resolution invoked without peer module's reference in scope for \""+source+"\".\nWill default to \""+location+"/\" (no scope).");
 if(!command)
 return compose(either(precedent,compose
(drop(1,0,absolute),buffer(next,buffer
(compose(target,scope,recover,infer(resolve.bind(peer),context,next))
,compose(swap(source),request)
)),shortcircuit,{imports:new Set()},merge,[relative],record
,slip(scope),0,merge,[relative,"resolution"],tether(search)
,pass(compose(swap(colors.yellow+"export:"+colors.cyan+relative+colors.yellow+" to:"+colors.gray+reverse+colors.steady),console.log))
)),target===location+"/"?undefined:pass(compose
(swap(scope),{[target.replace(location,"")]:{imports:new Set([relative])}},0,merge
)),cede())(relative,context);
 let type=source.endsWith(".json")?"json":undefined;
 let custom=(compound(loader)||type)&&prune.call(
 {[features.attributes||features.assertions]:{type,peer:compound(loader)?this||"file://"+location+"/":undefined}
 },({1:value})=>value);

 let module=import(source,custom);
 [source,...context]=primary?globalThis.process.argv.slice(1):Array.from(arguments);
 let inference=infer.call(module,...context);
 if(!primary)
 return cede.call(inference);
 let suspense=!globalThis.process.execArgv.includes("--watch")?10*60*1000:0;
 return compose.call(inference,note,wait(suspense),drop(),0,globalThis.process.exit); 
};

 async function url(source,relation)
{let url=compose(collect,slip(URL),Reflect.construct);
 return /^[\/\.]/.test(source)?agent.node
?await resolve.call(import.meta.url,"url","pathToFileURL",source)
:new URL("file://"+source.replace(/^[\/\.]+/,relation+"/"))
:cede(either(url,compose(/^/,"node:","replace",url)))(source)
};
 export function folder(address){return address.replace(/\/[^/]*$/,"");};
 export function file(address){return address.replace(/.*\//,"");};

 function extend(absolute)
{return [".js","js","ts","d.ts",".jsx",".tsx"].map((extension,index)=>
 index?[absolute,"index."+extension].join("/"):absolute+extension).reduce((first,second,index,all)=>
 [...all.splice(index),first]).reduce((file,source)=>
 file.catch(fail=>access(source).then(file=>source))
,Promise.reject());
};

 async function divert(absolute,target)
{// find potential alias in bundle definition. 
 let path=await import("path");
 let source=path.relative(path.dirname(target),absolute);
 let [format,definition]=Object.entries(sourcemap).find(([target,definition])=>
 Object.values(typeof definition!=="object"||Array.isArray(definition)?[definition]:definition).some((source,index)=>
 absolute.startsWith(path.join(location,target.replace(/\.js$/,""),String(index)))))||[];
 let namespace=definition&&Object.values(search.call([definition],({1:entry})=>
 Array.isArray(entry)||typeof entry==="string")).flat().find(entry=>entry.alias);
 let alias=namespace?.alias[source];
 return alias?path.resolve(location,alias):exit(Error("no alias for "+source+" in "+target));
};

 export async function acquire(absolute,dependent)
{// bundle if not found despite source entry, 
 // redirect to source once available (being, or failed to be bundled). 
 if(!defined(this))
 exit([acquire.name,"requires bound scope to track source imports."].join(" "));
 let path=await import("path");
 let target=absolute.replace(/\.js$|\.node$/,"");
 let relative=path.relative(location,absolute);
 let definition=await either(relative,swap({}))(sourcemap);
 let entry=!compound(definition)||array(definition);
 let entries=Object.entries(entry?[definition]:definition).flatMap(function sort([remote,input],index)
{if(remote===index)remote=undefined;
 let entries=!compound(input)||array(input)?[[undefined,input]]:Object.entries(input);
 return entries.map(([branch,input])=>(
 {target,remote,branch,input:[input].flat()
 }));
});
 let input=entries.flatMap(({input})=>input).filter(string);
 let binding=/\.gyp$/.test(input[0]);
 let clean=pass(buffer(compose(swap(target),purge,done=>delete this[target]&&note.call(2,"purged sources of "+target+".")),note));
 if(entries.length)
 return compose.call
(path.resolve(location,...entries[0].remote?
[target,!input.some((input,index)=>index||/\/$/.test(input))
?"0/"+input.find(string):"reexports.js"
]:[])
 // target entry indicates source resolution available for re-import. 
,entry=>this[target]=this[target]||compose.call
(target,pass(target=>note.call(2,"Collecting source of \""+relative+"\" for "+dependent+"..."))
,buffer(purge),swap(entries)
,buffer(infer("reduce",record(assemble),[]),compose(clean,exit))
 // temporary re-export of all namespaces for multientry bundle. 
,pass(/reexports\.js$/.test(entry)&&compose
(infer("flatMap",({source})=>source)
,infer("reduce",record(source=>
 compose.call(source,relative,load,"javascript",{source},parse,exports,target,reexport))
,[]),"\n","join",slip(entry),true,access
))
 // perform idempotent source resolution before bundling to support re-imports. 
,pass(parts=>!binding&&buffer(resolve.bind(import.meta.url),note)(entry))
,slip(entry)
,binding
?buffer
(compose(make,absolute,slip(resolve.bind(import.meta.url)("fs","promises")),"rename",swap(absolute),pass(infer(note.bind(2),"bundle ready.")),clean)
,compose(clean,exit)
)
 // not returning bundle promise after source assembly to unblock immediate resolution from source. 
:compose(skip(buffer
(compose(bundle,slip(absolute),true,access,pass(infer(note.bind(2),"bundle ready.")),clean)
,compose(clean,exit)
)),swap(entry),pass(note.bind(3,"Accessing source entry of \""+relative+"\" for "+dependent+":\n ")))
)
);
 let sloppy=!/\.(js|json)$/.test(absolute)&&
 await ["js","ts","tsx","d.ts"].map(extension=>absolute+"."+extension).reduce((module,file)=>
 module.catch(fail=>access(file).then(present=>file))
,Promise.reject()).catch(fail=>false);
 return sloppy||exit("no source definition for "+absolute);
};

 async function assemble({remote,branch,input,target},index,{length}={})
{let path=await import("path");
 if(!remote)return input.map(input=>string(input)?path.join(target,input):input);
 let [protocol,host,author,name,...route]=remote?.match(/(.*:\/\/)(.*)/).slice(1).reduce((protocol,address)=>
 [protocol,...address.split("/")])||[];
 let compressed=route[0]==="tarball"||!["github.com"].some(host.includes.bind(host));
 let address=protocol+[host,author,name,...compressed?route:[]].join("/");
 let depot=path.join(target,String(index))+"/";
 let asset=depot.replace(/\/$/,".tar.gz");
 let local=await access(depot,false).catch(fail=>false);
 await persist({},target)
 if(!local&&remote)
 // download. 
 compressed
?await compose(buffer(access,fail=>
 compose.call(remote,buffer(expect(fetch,0,5),compose(remote,note,exit)),response=>response.status===200
?compose("arrayBuffer",Buffer.from,asset,buffer(persist,fail=>note(fail)&&access(asset)))(response)
:exit(response.status))),compressed=>
 compose.call({},depot,persist,swap(asset),decompress,depot,decompress,swap(asset),purge,pass(note.bind(1,"Deleted source: "))))(asset)
:await expect(buffer(checkout,combine
(compose(crop(1),[],({stack},record)=>
 record.push(note.call(1,record.length+1+"/5 attempt to checkout "+address+": "+stack)))
,combine(swap(depot),buffer(purge))
,exit
)),0,5)(address,depot,branch,route).catch(note).then(done=>
 access(depot,false).then(done=>note.call(2,"Downloaded source from",address,"to",depot)).catch(fail=>exit(done)));
 let relation=remote?depot:location;
 let entries=await [input].flat().reduce(record(input=>string(input)
?infer("map",input=>path.join(relation,input))(/\/$/.test(input)
?compose.call(path.join(relation,input),list,note,Object.keys
,infer("map",name=>path.join(input,name)),infer("filter",name=>/\.js$/.test(name)))
:[input])
:input)
,[]);
 let {source=[],format=[],patches=[]}=[entries.flat()].flat().map(function sort(part)
{let field=string(part)?/\.patch$/.test(part)?"patches":"source":"format";
 return {[field]:[part]};
}).reduce((entries,entry)=>merge(entries,entry,0),{});
 format=format.reduce(merge,{});
 if(source.length)
 await patch(path.dirname(source[0]),patches);
 let scripts=[format.scripts].flat().filter(Boolean);
 if(scripts.length)
 await scripts.reduce(record(script=>
 note.call(3,"running "+script+" for "+target+"...")&&
 compose.call(path.dirname(target),script,path.resolve,resolve.bind(import.meta.url),"default",module=>
 note.call(2,script+" for "+target+":",module)))
,[]).catch(combine(note.bind(1,scripts.join(", ")+":"),exit));
 return {source,format};
};

 export async function bundle(source,parts)
{if(!source)return;
 let [input,...multientry]=[source].flat();
 if(multientry.length)
 throw Error("Bundling requires singular entry point. Multiple sources must be exposed through reexports.");
 let path=await import("path");
 let relation=path.dirname(input);
 let formats=parts.map(({format})=>prune.call(format,([field,alias],trace)=>
 trace.slice(-2).includes("alias")&&string(alias)&&/^\./.test(alias)&&
 // aliases are relative to "location", so offset external ones (not sharing bundle route) 
 // to "relation" in transform to match by reference for exclusion in resolution below. 
 [path.resolve(location,alias),relation].map(address=>
 path.relative(location,address).split("/")).reduce(([route],[bundle])=>
 route!==bundle)
?"./"+path.relative(location,path.resolve(relation,alias))
:alias));
 let route=address=>path.relative(location,address).split("/");
 let plugins=await compose.call
 // rollup plugins shall be deprecated in favor of Interface source formats. 
(formats,tether(prune,([field,value])=>/^\./.test(field)?value:undefined,true,1)
,Object.entries,infer("reduce",record(([plugin,settings])=>resolve.bind(import.meta.url)(plugin,"default",settings)),
[{name:"interface"
 ,transform:(source,address)=>compose.call
("url","pathToFileURL",address,resolve.bind(import.meta.url),"href"
,{format:formats[route(address)[1]]}
,load,(code,map={mappings:''})=>({code,map})
),resolveId:(source,client)=>client
?/^\./.test(source)
?route(client).reduce((source,entry,index,route)=>
 Object.values(relevant(parts[entry]?.format.alias||parts.map(({format})=>format).reduce(merge,{}),route.splice(2).join("/")))).includes("./"+path.relative(relation,path.resolve(path.dirname(client),source)))
?false
:["","/index.js","/index.ts",".js",".ts",".jsx",".tsx"].map(extension=>
 path.resolve(path.dirname(client),source.replace(/\/$/,"")+extension)).reduce((source,alias)=>
 source.then(source=>source||access(alias).then(file=>file.isDirectory()?exit():alias).catch(fail=>null))
,Promise.resolve(null))
:null
:null
 }
])
);
 note.call(3,"bundling "+source+"...");
 let {rollup}=await import("./Harris_2015_rollup.js");
 let bundle=await rollup({input,plugins,...format.input});
 let {output:[{code}]}=await bundle.generate({format:"module",inlineDynamicImports:true,...format.output});
 return code;
};

 async function make(source,parts)
{let path=source.split("/");
 let file=path.pop();
 let binding=await access(source,true);
 let edits=parts.map(({format})=>format?.edit).filter(Boolean).reduce(merge,{});
 if(Object.keys(edits).length)
 await compose(edits,edit,slip(source),true,access)(binding);
 let {1:target}=binding.match(/"target_name": *"(.*)"/);
 await buffer(compose(spawn.bind(true),note),exit)("node-gyp","-C",path.join("/"),"configure","build");
 return path.join("/")+"/build/Release/"+target+".node";
};

 export async function load(source,context,next)
{// access source as module specifier. 
 let {protocol,host,pathname:absolute}=await url(source,address.replace(/\/[^/]*$/,""));
 let relative="file:"===protocol?"/"+await resolve.call(import.meta.url,"path","relative",location,absolute):absolute;
 let loading=next?.name==="nextLoad";
 let precedent=loading&&scope[relative]?.module;
 if(precedent)
 return precedent.source?.length===0
 // buffer is mysteriously cleared sometimes, eg. in reimport for tests without a vm flag below. 
?access(precedent.responseURL,1).then(source=>
 Object.assign(precedent,{source}))
:precedent;
 if(string(context))
 context={format:context};
 if(loading)
 // clone immutable context without custom attributes ("peer" used in interface/resolve to track direct invocation). 
 context=prune.call(context,([field,value])=>field==="peer"?undefined:value);
 let {format,importAttributes:attributes,importAssertions:assertion}=context||{};
 attributes=assertion||attributes||{};
 let syntax=attributes?.type||mime(source)?.replace(/.*\//,"");
 // persist shortCircuit on scope to support loading from source while bundling. 
 var shortcircuit=compose({shortCircuit:true},merge,[relative,"module"],record,slip(scope),0,merge,relative,"module");
 if(!format&&/^https*/.test(source))
 return cede(compose(fetch,"text",source=>({source,format:/\.json$/.test(source)?"json":"module"}),shortcircuit))(source);
 [context,attributes,format,syntax]=await profile(source,context,attributes,format,syntax)
 let native=["json","module","wasm","builtin","commonjs",undefined].includes(format);
 if(native&&next)
 return compose(next,whether(match({format:"addon"}),infer(merge,{source:null})),shortcircuit,skip(check),cede())(source,context);
 let [index,sparse]=relative.split("/").reduce((folder,entry,index,relative)=>
 [entry,relative.splice(2).join("/")]);
 let {comment,...definition}=
[{syntax}
,compound(format)?format||{}:
[Object.values(sourcemap[format]||{})[index]||sourcemap[format]||{}
].reduce(function flat(entries,source)
{return [entries,!compound(source)||array(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(compound).map(entry=>
 // replacement definitions only apply to bundle output. use "edit" to modify loading sources. 
 merge(entry,{replace:undefined}))
].flat().reduce(merge);
 syntax=definition.syntax;
 let foreign=!["javascript"].includes(syntax)||Object.keys(definition).length>1;
 // parse foreign to serialize standard syntax. without native interpretter to call (next), all syntax are foreign. 
 // using acorn's Parser methods (parse) until semiotic reducer is complete. 
 let edits=relevant(definition.edit||{},sparse);
 if(syntax==="json")
 syntax="module",edits["^((?:.*[\n$])*)"]="export default $1";
 let patriate=foreign?parser[format]||compose
(infer(parse,syntax,{source}),definition,sanitize,serialize
,"javascript",{source},parse,serialize):infer();
 let module=await buffer
(compose(access,edits,edit,patriate,cede())
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&wait(1000)(fail).then(exit)
)(source,true);
 if(next)
 return compose(source=>(
 {source,format:{json:"json"}[syntax]||"module"
 }),shortcircuit,cede())(module);
 return module;
};

 export async function profile(source,context,attributes,format,syntax)
{if(syntax==="json"&&format!==syntax)
 Object.assign(context,{format:format=syntax});
 if(format==="json"&&attributes.type!==format)
 // bypass need for static import attributes. 
 Object.assign(attributes,{type:format});
 if(format!=="builtin"&&/^node:/.test(source))
 // builtin format is sometimes omitted by nodejs. 
 Object.assign(context,{format:format="builtin"});
 if(!format&&/\.ts$/.test(source))
 Object.assign(context,{format:format="typescript"});
 if(format==="module"&&/\.glsl\.js$/.test(source))
 Object.assign(context,{format:syntax=format="shader"});
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await buffer(require,commonjs=>is(Error)(note(commonjs))&&
 Object.assign(context,{format:format="module"}))(source);
 return [context,attributes,format,syntax];
};

 export function lambda(term)
{return compose
(when(string),crop(1)," ","split",rank,each(compose
(crop(1),locate.bind(this),rank,each([module=>resolve.call(this,module)]),lift,Reflect.get
)),lift,collect,infer("reverse")
,infer("reduce",(past,next)=>next(past))
)(term);
};

 export function recompose(term)
{when(simple)(...arguments);
 return lift(...Object.entries(term).map(compose
(entry=>entry.flat(),infer("map",term=>
 whether.call(term,[string,simple,array],lambda.bind(this),recompose.bind(this),rank))
,rank,lift,(term,...context)=>term(...context),cede()
)));
};

 export function denote(source)
{// composition declarations: ["module/name",[context],{"module/name":[argument,{"module/name":{}}]},"module/name"]
 return array(source)&&!source.some(not(string))
?source.reduce(record(source=>
 resolve.call(this,source,...Array.from(arguments).slice(1)))
,[])
:agent.node&&!thread
?exit("Resolving composition declarations not allowed on main thread.")
:compose(infer("reduce",record(term=>
 whether([string,simple],lambda.bind(this),recompose.bind(this),unit)(term))
,[]),"flat",rank,tether(compose))(source);
};

 export async function locate(action,extension="js")
{if(array(action))
 return action.reduce((stat,file,index,path)=>stat.catch(async fail=>infer.call
(resolve.call(import.meta.url,"fs","promises"),"stat"
,await resolve.call(import.meta.url,"path","resolve",path.slice(0,index+1).join("/")||"/")
).then(file=>
 file.isDirectory()&&defined(path[index+1])?exit():[path.splice(0,index+1).join("/"),...path]))
,Promise.reject());
 let lead=["/","./"].find(lead=>action.startsWith(lead))||"";
 let [module,feature="default",...path]=action.replace(lead,"").split("/");
 if(!lead&&!module.includes("_"))
 module=await cede(either
(...[2020,new Date().getFullYear()].reduce((min,max)=>
 Array.from({length:max-min},(year,index)=>max-index)).flatMap(year=>
 ["Blik"].map(author=>"./"+[author,year,module].join("_")+"."+extension)).map((module,index,{length},left=length-index-1)=>buffer
(compose(swap(module),resolve.bind(this),swap(module))
,left?drop():compose("message",note.bind(1),exit)
))
))(undefined);
 return [lead+module,feature,...path];
};

 export async function interpret(source,specifier,context={},depth=0)
{// uses --experimental-vm-modules 
 if(modular(source))
 return source;
 let {attributes,target}=specifier;
 if(simple(specifier))null
,{specifier}=specifier;
 let {SourceTextModule,SyntheticModule,createContext,isContext}=await import("vm");
 let parse=compose(collect,slip(URL),Reflect.construct);
 let {protocol,host,port,pathname:identifier,href:url}=/^[\/\.]/.test(specifier)
?await resolve.call(import.meta.url,"url","pathToFileURL",specifier)
:cede(either(parse,compose(/^/,"node:","replace",parse)))(specifier);
 if(target)
 merge(scope[target],{imports:new Set([identifier])},0);
 let precedent=context.imports?.[identifier];
 if(precedent)
 return precedent;
 let builtin=protocol==="node:";
 if(!source&&!builtin)null
,{source}=scope[identifier]?.module||
 await expect(buffer(load,compose(note.bind(1),whether
(compose(swap(identifier),bundling)
,compose(crop(1),slip("awaiting bundle to "+interpret.name),undefine)
))),3000)(url,{importAttributes:attributes});
 if(attributes?.type==="json"||specifier?.endsWith(".json"))
 source="export default "+source;
 if(!isContext(context))
 context=createContext(
 {imports:{},URL,Object,Blob,Reflect,Buffer,TextEncoder,TextDecoder
 ,setTimeout,setInterval
 ,global,performance,process:
 {env:{},argv:[],execArgv:[],stdout:globalThis.process.stdout,stderr:globalThis.process.stderr
 ,version:globalThis.process.version,versions:globalThis.process.versions
 ,nextTick(term){term();}
 }//,globalThis,navigator:{},crypto
 //,isNaN,Object,Function,Promise,String,Array,Boolean,ArrayBuffer
 //,Math,Error,JSON,Date,Symbol,ReadableStream,WritableStream,RegExp
 ,...context
 });
 let link=compose
(combine(whether(match(/^[\/\.]/),compose
(specifier=>resolve.call(import.meta.url,"path","resolve",identifier,"..",specifier)
,identifier=>protocol+"//"+host+identifier
),crop(1)),drop(2)),lift,(specifier,attributes,depth)=>
 interpret(null,{specifier,attributes,target:identifier},context,depth)
);
 let cachedData=await scope[identifier]?.virtual;
 let module=builtin
?await import(identifier).then(module=>new SyntheticModule(Object.keys(module),function()
{Object.entries(module).reduce((module,entry)=>
 module.setExport(...entry)||module
,this);
},{identifier,context}))
:new SourceTextModule(source||""
,{identifier,context,cachedData
 ,importModuleDynamically:compose(crop(3),push(0),link,"namespace")
 ,initializeImportMeta:infer(merge,{url})
 });
 merge(context.imports,module,[identifier]);
 let links=await module.moduleRequests?.reduce(record(compose
(drop(1),combine("specifier",swap(module),"attributes"),lift,push(depth+1),link,cede()
)),[]);
 module.linkRequests
?await module.linkRequests?.(links)
:await module.link(compose(crop(3),push(depth+1),link,cede()))?.catch(undefine);
 // if(!builtin)
 // merge(scope,module.createCachedData(),[identifier,"virtual"]);
 if(!depth)
 module.instantiate?.()
,await module.evaluate().catch(compose({[identifier]:module},exit));
 return module;
};

 function check(scope)
{if(scope.format!=="module"||scope.tests||!scope.responseURL)
 return scope;
 let target=new URL(scope.responseURL).pathname;
 return compose(buffer
(compose(whether
(false//compose.call(resolve("vm"),has("Module"))
 // modularization multiplies fragment.js for some reason, and their contexts break tests yet.  
,compose(true,access,target,interpret,"namespace")
,resolve.bind("file://"+location)
),module=>scope.tests=module.tests&&compose(buffer(test),tests=>scope.tests=tests)(module,module.tests,target))
,compose(crop(1),target,note.bind(1))
))(target);
};

 export async function checkout(remote,target,branch,path)
{// git clone remote branch to target, restricted to subfolder if present. (to be replaced with js-git)
 if(!/^http/.test(remote))
 return fs.cp(remote,target,{dereference:true,recursive:true}).then(copy=>branch&&spawn.call(0,"git","-C",target,"checkout",branch));
 let commit=branch.length===40&&!/[^a-z0-9]/.test(branch);
 let clone=await spawn.call(0,"git","clone","--depth=1",...path.length?["--no-checkout","--sparse","--filter=tree:0"]:[]
,...commit?["--no-checkout","-c","remote.origin.fetch=+"+branch+":refs/remotes/origin/"+branch]:branch?["--single-branch","--branch",branch]:[]
,remote,target);
 if(commit)
 clone=await spawn.call(0,"git","-C",target,"checkout",branch);
 if(!path.length)
 return target;
 clone=await spawn.call(0,"git","-C",target,"sparse-checkout","add",...[path.join("/").split(" ")].flat());
 if(!commit&&branch)
 clone=await spawn.call(0,"git","-C",target,"checkout",branch);
 return target;
};

 export function patch(repository,patch)
{return [patch].flat().reduce(record(patch=>spawn("git","-C",repository,"apply",patch)),[]);
};

 export async function shrink(log,replace)
{let stash=access(log,"binary");
 let zlib=await import("zlib");
 try{let buffer=zlib.gzipSync(JSON.stringify(stash));}catch(fail){debug(fail);}
 let descriptor=save(log.replace(".log","_"+Date.now()+".gz.b64"),buffer.toString('base64'),"force");
 if(replace)
 erase(log);
 return debug(descriptor)
};

 export var compress=revert((revert,reject,buffer)=>
 resolve.call(import.meta.url,"zlib","gzip",buffer,(fail,buffer)=>fail?reject(fail):revert(buffer)));

 export async function decompress(source,target)
{let [buffer,zip,tar]=string(source)
?[await access(buffer,"binary"),[/\.(gz|zip)$/,/\.tar$/].map(pattern=>pattern.test(buffer))].flat()
:[source,true];
 if(zip)
 return globalThis.DecompressionStream
?compose(gzip=>["writ","read"].map(stream=>
 gzip[stream+"able"]["get"+stream.replace(/^./,infer("toUpperCase"))+"er"]())
,([writable,readable])=>(writable.write(buffer),writable.close(),readable)
,combine(infer(),"read"),[],0
,async function read(readable,{done,value},expanded,size)
{while(!done)
 expanded.push(value),size+=value.byteLength,{done,value}=await readable.read();
 return expanded.reduce((buffer,array,index,arrays)=>
 buffer.set(array,size+=arrays[index-1]?.byteLength??-size)||buffer
,new Uint8Array(size));
})(new DecompressionStream("gzip"))
:revert((decompress,reject,buffer)=>
 resolve.bind(import.meta.url)("zlib","gunzip",buffer,(fail,buffer)=>fail?reject(fail):decompress(buffer)))(buffer);
 let tarstream=await import("stream").then(({Duplex})=>
 [new Duplex(),buffer,null].reduce((duplex,buffer)=>(
 duplex.push(buffer),duplex)));
 let extractor=await import("./isaacs_2011_node-tar.js").then(({Parser})=>new Parser());
 let folder={};
 let prefix="extracting ";
 let pathspace=globalThis.process.stdout.columns-prefix.length;
 await revert((resolve,reject,stream)=>observe.call(stream
,{entry(entry)
{globalThis.process.stdout.cursorTo?.(prefix.length);
 globalThis.process.stdout.clearLine?.(1);
 globalThis.process.stdout.write(entry.path.slice(0,pathspace));
 entry.on("data",function(data){this.push(data.toString("utf-8"))}.bind(
 entry.path.match(/^(.*)\/(.*)/).slice(1).map(path=>
 path.split("/")).reduce((path,[file])=>
 path.reduce((folder,path)=>folder[path]=folder[path]||{}
,folder)[file]=entry.type=="Directory"
?undefined
:entry.type=="SymbolicLink"
?["export *,{default} from \""+entry.linkpath+"\";"]
:[])))
},close(){console.log("\nextracted "+target+".");resolve(folder)}
 }))(tarstream.pipe(extractor),globalThis.process.stdout.write(prefix));
 if(target)
 return persist(Object.values(folder)[0],target);
 /*try
{file=fs.createReadStream(file);
 console.log(...arguments)
 output=fs.createWriteStream(output);
 return new Promise((resolve,reject)=>
 file.pipe(zlib.createGunzip()).pipe(output).on("finish",fail=>
 fail?reject(fail):resolve(output)));
}catch(fail)
{return note(fail);
}*/
};

 export async function access(file,encoding,content)
{// access folder/file's metadata, content with specified encoding, or overwrite its content. 
 if(!string(file))
 file=file.path;
 when(string)(file);
 if(file.startsWith("http"))
 return compose(fetch,whether(compose("status",is(200)),"text",compose("text",exit)))(file);
 if(/^file:\/\//.test(file))
 file=new URL(file).pathname;
 let {promises:fs}=await import("fs");
 if(!encoding)
 return merge(await fs.stat(file),{path:file});
 if(/\/$/.test(file))
 return fs.readdir(file,{withFileTypes:true});
 if(content)
 return fs.writeFile(file,...binary(content)
?[basic(encoding)?JSON.stringify(encoding):encoding,'utf8']
:[content,encoding]).then(written=>file);
 let buffer=await fs.readFile(file);
 if(["binary",1].includes(encoding))
 return buffer;
 content=buffer.toString([true,"object"].includes(encoding)?"utf8":encoding);
 if(encoding==="object")
 return JSON.parse(content);
 return content;
};

 export async function list(file,recursive=true,exclude=[])
{let wildcard=file.split("/").at(-1).includes("*");
 if(wildcard)
 return file.split("/").reduce(compose(drop(3),path=>
[new RegExp(path.pop().replace("*",".*"))
,list(path.splice(0).join("/"),recursive,exclude)
],rank,(name,files)=>prune.call(note(files),([file,entry])=>
 name.test(file)?entry:undefined,0,0)));
 if(!/\/$/.test(file))
 file=file.replace(/$/,"/");
 let {promises:fs}=await import("fs");
 let files=await fs.readdir(file)//,{withFileTypes:true});
 files=await files.reduce(record(name=>
 buffer(compose(fs.stat,{name},merge),swap(undefined))(file+name)),[]);
 let entries=await files.reduce(record(entry=>
 !exclude.some(exclusion=>RegExp(exclusion).test(file+entry.name))
?entry.isDirectory()?recursive
?list(file+entry.name+"/",recursive,exclude).then(files=>[entry.name,files])
:[]
:[entry.name,null]
:[])
,[]);
 return Object.fromEntries(entries);
};

 export async function persist(body,path,force)
{if(!path)
 exit(Error("Unspecified persistence target"));
 if(!is(Buffer)(body))
 if(typeof body!=="string")
 return persist("",path.replace(/[^\/]$/,end=>end+"/")).then(path=>
 Object.entries(body).reduce((folder,[field,file])=>
 folder.then(folder=>file
?Array.isArray(file)
?persist(file.join(""),path+field).catch(fail=>fail.message)
:persist(file,path+field+"/").catch(({message})=>({}))
:null).then(file=>Object.assign(folder,{[field]:file}))
,Promise.resolve({})));
 let {promises:fs}=await import("fs");
 let directory=/\/$/.test(path);
 if(directory)return fs.mkdir(path).catch(fail=>fail).then(done=>path);
 let transaction=force?fs.appendFile:fs.writeFile;
 let descriptor=await fs.open(path,"wx").catch(fail=>fail);
 globalThis.process.stdout.clearLine?.();
 globalThis.process.stdout.write(("\rwriting "+path).slice(0,globalThis.process.stdout.columns));
 if(!is(Error)(descriptor))
 return await descriptor.writeFile(body).finally(descriptor.close.bind(descriptor)).then(write=>path);
 if(!force)throw descriptor;
 let append={append:"a"}[force];
 descriptor=await fs.open(path,append||"r+");
 if(descriptor instanceof Error)return descriptor;
 let close=descriptor.close.bind(descriptor);
 if(!append)
 await descriptor.truncate().catch(combine(close,exit));
 await transaction.call(fs,descriptor,body,"utf8").finally(close);
 return path;
};

 export function purge(path)
{return compose(path,{recursive:true,force:true},"rm",swap(path))(resolve.bind(import.meta.url)("fs","promises"));
};

 export var compile=compose(drop(1),load,parse,serialize);

 export function bundling(source)
{return Object.entries(scope).some(([field,module])=>
 (!source||source.startsWith(field))&&promise(module));
};

 export function testing(source)
{return Object.entries(scope).some(([field,{module}])=>
 (!source||source.startsWith(field))&&promise(module?.tests));
};

 export async function require(path)
{// to be deprecated in favor of commonjs compilation. 
 let instance=require.instance;
 //path=new URL(note(path)).pathname;
 if(instance)
 return instance(path);
 require.instance=await resolve("module","createRequire",import.meta.url);
 return require.instance(path);
};

 export async function socket(address,onmessage)
{var {protocol,host,pathname}=new URL(address);
 let WebSocket=globalThis.WebSocket||
 await import("./einaros_2011_ws.js").then(({default:WebSocket})=>WebSocket);
 let socket=is(WebSocket)(this)?this:new WebSocket(protocol.replace(/^http/,"ws")+"//"+host+pathname);
 return revert((resolve,reject,socket,onmessage)=>Object.assign(socket
,{async onopen({target})
{console.warn("Websocket open: ",target);
 let {author:name}=cookies(globalThis.window?.document?.cookie||"");
 if(name)
 this.send(JSON.stringify({action:"sign",name}));
 resolve(this);
},onerror({target}){console.warn("Websocket not available at "+target.url);reject(target);}
 ,onclose({target}){console.warn("Websocket closed: ",target);}
 ,onmessage
 }))(socket,onmessage);
};

 export function listen(action,message)
{// revert message events on bound socket to terminate listening. 
 return control(new AbortController(),revert
((resume,reject,{signal},events,message,call)=>
 call(observe.call(events,{message(response)
{action.call(this,JSON.parse(response.data),message,resume,reject);
}},{signal}))
),this,message,message?infer("send",JSON.stringify(message)):infer());
};

 export async function infrastructure()
{return prune.call(scope,([field,{imports=[]}])=>
 field?Array.from(imports):undefined,0,0);
};

 async function freefetch(request,{method,body,headers}={})
{let remote=/^http/.test(request);
 let url=string(request)?!remote
?!browser
?exit("No browser thread for local origin request. No server context for "+request+"?")
:[window.location.origin,request?.replace(/^[\.\/]+/,"")||""].join("/")
:request:request.url;
 let {protocol,host,hostname,pathname,search,port}=new URL(url);
 return revert((respond,reject,request,body)=>compose
(infer(resolve.bind(import.meta.url),"request",request,function forward(response)
{let {statusCode:status,headers}=response;
 let body=[];
 observe.call(response
,{data:record(body=>body).bind(body)
 ,error:compose(note,reject)
 ,end:compose
(swap(body),body=>Buffer.concat(body,sum(body.map(({length})=>length))),buffer([302,308].includes(status)
?compose(swap({...request,url:headers.location}),fetch)
:compose(body=>({body,status,headers,type:headers["content-type"]}),request,stage)
,reject),respond
)});
})
,tether(observe
,{error(fail){this.destroy();reject(fail);}
 ,timeout(fail){this.destroy();reject(fail||Error("timeout: "+this.path));}
 ,close:infer("destroy")
 }),body,"end"
)(request.agent.protocol.replace(/:/,"")))(
 {host,hostname,path:pathname+search,port
 ,headers:{origin:[protocol,host].join("//"),...headers}
 ,method:method||request?.method?.toUpperCase()||"GET"
 ,agent:await peer(protocol.replace(/:/,""))
 },body||request.body);
};

 export async function jsdom(url)
{if(this)
 return this.reconfigure({url})
,fetch=freefetch.bind(this.window)
,note.call(3,"navigated browser to "+url);
 return window=revert(async function(expose,reject,url)
{note.call(3,"loading browser client at "+url+"...")
 let {JSDOM}=await resolve.call(import.meta.url,"./Domenic_2010_jsdom.js","default");
 let browser=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 jsdom=jsdom.bind(browser);
 let {protocol,hostname,port}=new URL(url);
 let name=["fetch",protocol.replace(":",""),hostname,port].join("_");
 fetch=describe(freefetch.bind(browser.window),name);
 note.call(3,"navigated browser to "+url);
 expose(window=browser.window);
})(url);
};

 export async function stage(response,request)
{let agent=version(request.headers);
 let features=feature(agent);
 let browser="Mozilla/Chrome/Safari/AppleWebKit".split("/").some(has.bind(agent||{}));
 let direct=request.headers?.referer?.endsWith(request.url)===false;
 let importing=!direct&&request?.headers?.["sec-fetch-dest"]==="script";
 let fail=is(Error)(response);
 let type=!fail&&response?.type||response.headers?.["Content-Type"]||mime(response?.nodeName?.toLowerCase()||(either(simple,array)(response)?"json":path(request)))||mime(response.nodeName?"html":"txt");
 let [js,json]=[type===mime("js"),type===mime("json")];
 let status=response?fail?500:response.status||200:404;
 let success=status<400;
 let cookie=response?.body&&response?.cookie;
 let headers={"Content-Type":type,...response.headers,get(key){return this[key];}};
 let body=cede(whether
([fail,has("nodeName"),something]
,"message"
,compose(combine
(whether(is(window?.HTMLHtmlElement),swap("<!DOCTYPE html>"),drop())
,whether(is(window?.DocumentFragment),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),collect,"","join")
,whether(has("body"),infer(Reflect.get,"body"),infer())
))(response);
 if(json&&!basic(body))
 body=JSON.parse(serialize(body.constructor?.name=="Buffer"?body.toString():body));
 if(js&&importing&&!features.assertions)
 body=(string(body)?body:body.toString()).replace(/(import\([^,\)]+),(.*?\(.*?\))*[^\)]*/,"$1");
 if(json&&simple(body))
 body=JSON.stringify(prune.call(body,([field,value],path,trace)=>
 functor(value)?null:trace.includes(value)?path:value));
 if(json&&importing&&!features.json)
 body=Buffer.from("export default "+body+";"),headers["Content-Type"]=mime("js"),js=true;
 if(browser&&js)
 body=await compress(body),headers["Content-Encoding"]="gzip";
 if(response?.nodeName)
 await resolve.bind(import.meta.url)("./Blik_2023_fragment.js","destroy",response);
 return (
 {status,body,location:request.url,cookie,headers
 ,json(){return this.text(true);}
 ,async text(json=false)
{if(!binary(json))json=false;
 let buffer=this.body.constructor?.name==="Buffer";
 let gzip=Array(2).fill("Content-Encoding").find((field,index)=>this.headers?.get(index?field.toLowerCase():field)==="gzip");
 let text=buffer?(gzip?Buffer.from(await decompress(this.body)):this.body).toString():this.body;
 if(compound(text))
 return json?text:JSON.stringify(text);
 return json?JSON.parse(text):text;
},async arrayBuffer()
{let gzip=this.headers["Content-Encoding"]==="gzip";
 // if(simple(this.body))
 // return compose(JSON.stringify(this.body),"encode","buffer")(new TextEncoder());
 if(this.body?.constructor?.name==="Buffer")
 return compose
(new Uint8Array(new ArrayBuffer(this.body.length))
,(buffer,array)=>{for(let i=0;i<array.length;i++){array[i]=buffer[i]};return array}
,"buffer"
)(this.body);
 return Buffer.from(this.body??"","utf-8");
}});
};

 export var script=compose
(combine(fetch,infer()),whether
(match({status:200})
,compose(combine(compose(crop(1),"text"),drop(1,2)),interpret)
,compose(crop(1),"text",Error,exit)
)
);

 export var digest=compose
 // read response in its specified format. 
 // Response objects may be imitated, hence not when(is(Response)). 
(when(has(["status","text","json","headers"]))
,whether(compose("status",not(minor(400))),compose("text",Error,exit),infer())
,combine(infer(),compose("headers",infer("get","Content-Type"),infer
((type,xml)=>compose.call(
 {json:"json",pdf:"arrayBuffer"
 ,csv:compose("text",records),svg:compose("text",type,xml),xml:compose("text",type,xml)
 ,png:"blob",jpg:"blob",png:"blob"
 },Object.entries,rank
 ,each(([field,value])=>[mime(field),value]),collect,Object.fromEntries)[type]
,(text,mime)=>mime==="text/html"
?window.document.createRange().createContextualFragment(text)
:new window.DOMParser().parseFromString(text,mime).documentElement
)))
,(response,parser)=>infer.call(response,parser||"text")
);

 export var ingest=compose
(combine(compose(either("Content-Type","content-type",swap(undefined)),slip(compose.call
({JSON,"x-www-form-urlencoded":"querystring"}
,Object.entries
,infer("map",compose(combine(compose(0,"toLowerCase",/^/,"application/","replace"),infer(1)),collect))
,Object.fromEntries
)),tether(differ),resolve.bind(import.meta.url)),"body")
,either("parse",drop(1),swap(""))
);

 export var cookie=cookie=>string(cookie)?cookies(window.document.cookie)[cookie]:Object.entries(cookie||{}).map(([field,value])=>field+"="+value).join(";");
 export var cookies=buffer(compose(when(string),/ *; */,"split",rank,each(entry=>entry.split("=")),collect,Object.fromEntries),swap({}));
 export var query=compose
(when(string)
,whether(compose("/","startsWith"),path=>window.location.origin+path,infer())
,collect,slip(URL),Reflect.construct,"searchParams","entries",Array.from,Object.fromEntries
,tether(prune,([field,value])=>[true,false].find(boolean=>String(boolean)===value)??value,0,0)
);
 export function path(request)
{let address=!string(request)?"http://"+request.headers.host+request.url:request;
 return new URL(address).pathname.replace(/^\/*|\/*$/g,"");
};

 export async function spawn(command,...context)
{// bound scope defines output color: undefined=quiet, other=default
 note.call(3,command,...context,"...");
 let process=await resolve.bind(import.meta.url)("child_process","spawn",command,context);
 return revert((resolve,reject,process,output)=>
[[process,{exit:exit=>exit?reject(Error(exit)):resolve(output.join("\n"))}]
,...this?["out","err"].map((stream,index)=>
[process["std"+stream]
,{data:compose
(drop(1),data=>data.toString("utf8"),pass(console[index?"error":"log"])
,slip(output),"push"
)}
]):[]
].forEach(([stream,actions])=>
 observe.call(stream,actions)))(process,[]);
};

 export function clientwidth(){return globalThis.process.stdout.columns;};

 export function inspector(port,host)
{return compose(fetch,"json",0,"devtoolsFrontendUrl")("http://"+host+":"+port+"/json");
};

 export function inspect(port)
{// restart inspector to trigger a DevTools switch back to the main thread in case open. 
 return compose
(resolve.bind(import.meta.url),pass("close"),pass(compose(port,"localhost","open"))
,infer(Reflect.get,"Session"),[],Reflect.construct,{inspectorNotification:note},tether(observe)
)("node:inspector")
,compose(inspector,slip("Inspect: \n"),"concat",note.bind("cyan"))(port,"localhost");
};

 export async function segmentation()
{// Report internal segfault errors (occurs with experimental features like "vm" in node22). 
 if(!await compose.call(resolve("vm"),has("Module")))
 exit(Error("Segmentation error traces are only needed for --experimental-vm-modules."));
 return compose("default","registerHandler")(import("./Shiranuit_2021_segfault.node"));
};

 export function feature(agent)
{return agent&&prune.call
({attributes:{node:21,Chrome:123}
 ,assertions:{node:16.14,Chrome:91,Firefox:Infinity}
 ,json:{Chrome:125,Firefox:Infinity}
 },([feature,condition])=>
[true,Object.keys(condition).find(name=>agent[name])
].filter(Boolean).reduce((value,name)=>
 condition[name]<=agent[name])&&(
 {attributes:"with",assertions:"assert"}[feature]||true)
);
};

 export function version(navigator)
{let [agent]=either("user-agent","userAgent",swap(undefined))(navigator);
 let device=/\((.*?)\)/.exec(agent)?.[1]?.split(";").reduce(function(platform)
{return {[platform]:arguments[3].splice(1).join(";")};
})||{};
 let entries=agent?.match(/[\w\.]+\/(\.{0,1}\d+){1,2}/g)?.map(agent=>agent.split("/"))||
 [[agent]];
 return entries.map(([name,version])=>({[name]:Number(version)})).reduce(merge,device);
};

 export function commandline()
{return agent.node&&Object.fromEntries(globalThis.process.execArgv.filter(match(/^--/)).map(flag=>
 merge(flag.slice(2).split(/ |=/),{1:true},0)))||{};
};

 async function distribute()
{// https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 if(!await resolve.call(import.meta.url,"cluster","isMaster"))
 return;
 await resolve.call(import.meta.url,"cluster","on","exit",(worker,code,signal)=>note.call(code,worker.process.id+" exited with status "+code));
 let os=await import("os");
 let cpus=os.cpus();
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>
 compose.call("cluster","fork",resolve.bind(import.meta.url),pass(compose
("id",cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second..."),collect,"/","join",note.bind(1)
)),wait(index*1000)))
,[]);
};

 export async function test(namespace,tests,target=namespace)
{// compose tests defined in namespace. 
 if(string(namespace))
 namespace=await import(namespace);
 tests=tests||namespace.tests||{};
 let assert=await import("assert");
 let noncondition=either
(not(defined),simple,is([array,infer("some",({condition})=>condition)])
);
 let fails=await [tests].reduce(function test(module,tests,depth,path)
{let {scope,context=[],route=[],terms=[],condition}=tests;
 return noncondition(condition)
?compose(Object.entries,infer("reduce",record(([term,tests])=>
 test(module[term]??module,tests,depth+1,[depth?path:[],term].flat())),[]),"flat")(tests)
:buffer(compose
(...[route].flat()
,buffer(scope?tether(module):module)
,...[terms].flat(),assert[condition]||condition,swap({})
),({stack})=>({[path.join("/")]:stack}))(...[context].flat());
},namespace);
 fails=fails.reduce(merge,{});
 let format=compose((item,order,items)=>
 [item,order,Math.max(...items.map(({length})=>length))]
,([item,order,length])=>
 item+(order%Math.floor(globalThis.process.stdout.columns/length)
? " ".repeat(length-item.length):"\n"));
 let report=[fails,tests,namespace].map((subject,index)=>
["\x1b["+["31mFAIL:","32mPASS:","34mSKIP:"][index]
,...Object.keys(subject).map(index?field=>field:field=>field.match(/(.*?)(\/|$)/)[1])
]).map((subject,index,subjects)=>
 subject.filter(test=>
 !subjects.slice(0,index).flat().includes(test)).slice(0,15).concat(subject.length<16
?(!subject.length?"-":[])
:"...").map(format).join("")).filter(subject=>subject.length>11).join("\n")+"\x1b[0m\n";
 let {length}=Object.keys(fails);
 console.groupCollapsed(colors[length?"red":"green"]+"Tested "+target+colors.steady);
 console.log(report);
 Object.entries(fails).forEach(([field,value])=>(
 console.groupCollapsed(field),console.log(value),console.groupEnd()));
 console.groupEnd();
 return length?exit("Tests failed on "+target):report;
};

 export var tests=
 {access:
[{context:[import.meta.url],terms:[value=>typeof value,"object"],condition:"equal"},
 {context:[import.meta.url,true],terms:[value=>typeof value,"string"],condition:"equal"}
],resolve:
[{scope:import.meta.url,context:[import.meta.url,"tests"],terms:[entry=>rank([entry,tests]),Object.is],condition:"ok"}
,{scope:import.meta.url,context:[import.meta.url],terms:[swap(scope),address,has("imports")],condition:"ok"}
],load:
[{context:[import.meta.url],terms:[" import","startsWith"],condition:"ok"}
]};

 if(agent.node&&!remote)
 // expose functions for procedural use. 
[import.meta.url,"./Blik_2023_inference.js","./Blik_2023_search.js"
].forEach(compose(crop(1),resolve.bind(import.meta.url),globalThis,flip,Object.assign));
