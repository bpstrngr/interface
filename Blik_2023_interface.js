 import {modular,measure,ring,produce,signature,construct,deduce,zap,induce,stash,decide,note,collect,search,merge,prune,route,record,remember,tally,rotate,cede,unit,lift,push,sum,same,are,has,promise,pass,slip,something,observe,functor,describe,expect,control,trace,array,compound,simple,revert,rank,tether,differ,whether,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,numeric,binary,basic,match,wait,string,defined,minor,compose,combine,exit,clock,major,colors,skip,flip,debug,extract,flatten} from "./Blik_2023_inference.js";
 import {file,folder,url,relate,query,path,edit,parser,parse,sanitize,serialize,exports,reexport,mime,coordinates,records} from "./Blik_2023_meta.js";

 export var {protocol,origin,pathname:address}=new URL(import.meta.url);
 export var name=file(address);
 export var location=folder(address);
 export var remote=protocol==="http:";

 export var {loader,import:offload,inspect:inspected}=flags(globalThis.process);
 export var agent=merge({virtual:typeof imports!=="undefined"}
,globalThis.process?.versions
?prune.call(globalThis.process.versions,({1:value})=>string(value)?Number(value.match(/(\.{0,1}\d+){1,2}/)?.[0]):value)
:version(globalThis.window.navigator));
 export var features=feature(agent);
 export var interpreter=agent.node&&await import("vm").then(search(["Module"]));
 export var thread=agent.node&&await import("worker_threads").then(infer("isMainThread"))?0:1;

 export var worker={imports:
 {"/Blik_2023_inference.js":["","revert","search","prune","match","tether","induce","compose","combine","drop","collect","infer","buffer","is","either","string","note","exit","slip","differ","observe","crop","construct","array"]
 }
 ,exports:
 {name:"anonymous"
 ,subscribe(peer,label)
{// receive commands from ./delegate.
 if(swarm[label])
 return console.warn("Worker "+name+" already subscribed to a peer with label: "+label);
 function error(fail){console.log(...arguments);exit(label+" worker error.",fail);}
 observe.call(swarm[label]=peer,{message,error,messageerror:error});
 let notice="Worker "+name+" subscribed \nto commands from "+label;
 return report(peer,notice),notice;
},unsubscribe(label)
{// stop receiving commands.
 if(!swarm[label])
 return exit("Worker "+name+" not subscribed to a peer with label: "+label);
 let peer=swarm[label];
 observe.call(peer,{message,error(fail){exit(label,fail);}},false);
 let notice="Worker "+name+" unsubscribed \nof commands from "+label;
 return report(notice),notice;
},command
 ,message({data,source})
{if(!array(data))
 return console.log(data);
 let [type,id,term,...context]=data;
 if(type!=="command")
 return;
 let inference=infer(...string(term)
?[differ(command.bind(import.meta.url)),import.meta.url,term,...context]
:[compose(recompose,compose,infer("call",...context)),term,import.meta.url]);
 compose
(buffer(inference,crop(1))
,combine
(compose(slip("event",id),collect)
,compose(collect,tether(search,compose(drop(1),search(1),match({constructor:{name:either(is("ArrayBuffer"),is("MessagePort"),is("FileHandle"))}})),false,construct),Object.values)
),slip(source||this),report
)();
},report(peer,...message)
{let channel=peer.controller||peer;
 if(channel.postMessage)
 return channel.postMessage(...message);
 peer.clients?.matchAll({includeUncontrolled:true}).then(clients=>clients.forEach(client=>client.postMessage(...message)))
},feature
 },procedures:{initialize()
{var swarm={};
 // needed for command to infer import attributes. 
 var features=feature(globalThis.navigator);
 induce(peer=>subscribe(peer,"default"))(this||globalThis.self||import("worker_threads").then(({parentPort})=>parentPort));
}}};
 // extract subscription commands to accept command delegation across threads. 
 export var {swarm={},subscribe,message,report}=worker.exports;

 export var authors=["Blik"];
 export var years=[2019,new Date().getFullYear()].reduce((min,max)=>
 Array.from({length:max-min},(year,index)=>max-index));
 export var probe=agent.node?compose(command.bind(import.meta.url,"path","resolve"),command.call(import.meta.url,"fs","promises"),flip,"stat"):command.bind(import.meta.url);
 export var prepend=either(...
 [authors,years].reduce((authors,years)=>authors.flatMap(author=>years.map(year=>
 "/"+author+"_"+year))).map(prefix=>compose
(/^([^\/])/,"./$1","replace",infer(url,address),"pathname",combine(folder,file),drop(1,1,prefix,"_"),"concat",pass(probe)
)));
 export var peer=remember
(compose(drop(1,2),"Agent",{timeout:5*60*1000},command.bind(import.meta.url))
,protocol=>protocol
);

 export var Module=interpreter?compose(stash(compose(tether(locate),true,access)),drop(1),rotate(1),drop(2,0,interpret)):tether(command);
 export var modules={}; // tracking imports in /resolve and /load.
 export var [sources]=await locate("sources.json");
 export var importmap=await Module.call(import.meta.url,sources,"default");
 export var inspection={scope:{}};
 var precedent=compose("resolution",collect,slip(modules),tether(search));
 var modulepath=when(is([match(/^[\/\.]/),not(match(RegExp(sources+"$")))]));
 var format=compose
(combine(unit,compose(swap(importmap),Object.keys)),lift,(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$|\.node$/,"/")].join("/")))||"module",["format"],record
);
 var shortcircuit=compose
(combine(unit,either(compose("url",url,"pathname",decodeURI,modulepath,format),swap({}))),lift,merge
,{shortCircuit:true},merge
,stash(compose(drop(),push(Date),[],Reflect.construct,"getTime",["time"],record)),merge
);

 let {timestamp:reimported}=query(import.meta.url);
 if(agent.node&&!agent.virtual&&!remote&&!thread&&!loader&&!reimported)
 // --import flag offloads loader commands to separate thread unlike
 // --loader, where context is available directly on the primary thread.
 offload
?await register(address).then(async function initialize(loader)
{// reciprocate subscription to commands from loader thread. 
 let samethread=loader.constructor.name==="ModuleHooks";
 if(!samethread)
 subscribe(loader,"loader");
 if(!inspected)return;
 let {debugPort:port}=globalThis.process;
 if(swarm.loader)
 await delegate.call(loader,"inspect",port+1).catch(note);
 await inspect(port).catch(note);
 await attach(port).catch(note);
})
:inference(globalThis.process.argv.slice(2));

 export function command(specifier,...context)
{//if(!string(this))
 //console.warn("Importing without peer module's reference in scope for \""+specifier+"\".\nWill default to \""+location+"/\" (none).");
 if(array(specifier))
 return specifier.reduce(record(compose(drop(1),crop(1),push(...context),command.bind(this))),[]);
 let type=features.json&&!swarm.loader&&specifier.endsWith(".json")?"json":undefined;
 let intercepted=agent.node&&(loader||offload);
 let custom=(intercepted||type)&&prune.call(
 {[features.attributes||features.assertions]:{type
 // swarm.loader prunes irregular attributes, but it will not guard imports from that thread itself. 
 ,peer:swarm?.loader?this||protocol+"//"+location+"/":undefined}
 },({1:value})=>value);
 let module=import(specifier,custom);
 return infer.call(module,...context);
};

 export function inference([module,...context]=globalThis.process.argv.slice(1))
{// delegated by ./resolve on loader thread to infer command line context. 
 // without a loader in scope, the primary module is Interface itself. 
 let complete=swarm.loader?compose
(swap("testing","bundling")
,each(compose(crop(1),delegate.bind(swarm.loader))),lift,are(false)
):compose(combine(testing,bundling),are(false));
 return module
?buffer
(compose(Module.bind(import.meta.url),infer(...context),pass(console.log),expect(complete,5000),swap(0),globalThis.process.exit)
,compose(note.bind(1),swap(1),globalThis.process.exit)
)(module)
:revert.call
(command.call(import.meta.url,"repl","start",{useGlobal:true})
,(exit,fail,line)=>observe.call(line,{exit})
);
};

 export function register(address)
{// register loader thread. 
 if(agent.node>=25.9)
 return command.call(import.meta.url,"module","registerHooks",{resolve,load});
 return compose.call
("worker_threads",command.bind(import.meta.url),tether(search,["MessageChannel"]),[],Reflect.construct
,address,revert(function register(resume,onerror,{port1:near,port2:far},address)
{// observe channel until /initialize reports subscription from its far end from the loader thread. 
 observe.call(near,{message({data}){note.call(2,data),resume(this);},onerror,messageerror:onerror},{once:true});
 command.call(import.meta.url,"module","register",address,import.meta.url,{data:far,transferList:[far]});
})
);
};

 export async function commission(module,peer)
{let ephemeral=functor(module);
 if(ephemeral&&!module.name)
 throw Error("Can't create ephemeral worker for anonymous function.");
 let address=string(module)?module:compose.call
(ephemeral?{exports:{[module.name]:module}}:module,worker,0,merge
,tether(prune,([field,value])=>field!=="imports"?value
:Object.fromEntries(Object.entries(value).map(([field,value])=>
 [protocol+"//"+location+field,value]))),"module",serialize,...agent.node
?[Buffer.from,"base64","toString","data:text/javascript;base64,",flip,"concat",collect,slip(URL),Reflect.construct]
:[{type:"text/javascript"},collect,slip(Blob),Reflect.construct,URL.createObjectURL]
);
 let name=string(module)?module:functor(module)?module.name:module.exports?.name;
 let thread=await compose.call
(agent.node?import("worker_threads"):{Worker},search("Worker")
,[address,{type:"module",name,execArgv:agent.node?process.execArgv.filter(not(match(/^--import/))):undefined}],Reflect.construct
,agent.node?await import("worker_threads").then(({MessageChannel})=>new MessageChannel()):new MessageChannel(),peer
,buffer(resubscribe,compose(note,"stack",exit))
);
 URL.revokeObjectURL(address);
 return ephemeral?delegate.call(thread,module.name,...context):thread;
};

 export var resubscribe=compose
(revert(function anticipate(resume,error,module,{port1:near,port2:far},peer)
{// observe channel until worker reports default subscription.
 observe.call(module,{message({data}){note.call(2,data),resume([this,near,far,peer]);},error,exit:error},{once:true});
}),([module,near,far,peer])=>far
 // supply far end of custom message channel to re-subscribe.
?delegate.call(module,"subscribe",far,peer).then(note.bind(2)).then(subscribed=>
 delegate.call(near,"unsubscribe","default")).then(compose(note.bind(2),swap(near)))
:module
);

 export async function delegate(term,...context)
{// submit command to worker initialized with ./worker/procedures. 
 if(!defined(this))
 exit("No worker bound to "+delegate.name+" "+term+".");
 return control
(new AbortController()
,revert((resume,reject,{signal},worker,...context)=>
 // listen until worker emits request id. 
[function response({target,data,message}={})
{if(message)console.log(...arguments);
 let ephemeral=!Object.values(swarm).includes(target);
 if(ephemeral)target.terminate();
 let [type,id,value]=data||[];
 let expected=id===context[1];
 if({event:expected}[type])
 return is(Error)(value)?reject(value):resume(value);
},context.filter(either(is(ArrayBuffer),match({constructor:{name:/FileHandle|MessagePort/}})))
].reduce((message,transfer)=>
 (observe.call(worker,{message,error:message,messageerror:message},{signal}).controller?.postMessage||worker.postMessage).call(worker.controller||worker,context,transfer)))
,this,"command",crypto.randomUUID(),functor(term)?term.name:term,...context
);
};

 // https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize(primary)
{// called on loader thread upon /register from primary. 
 subscribe(primary,"primary");
 // anticipate subscription reciprocated by primary thread. 
 observe.call(primary,{message:compose(drop(1),"data",wait(1000),note.bind(2))},{once:true});
 //await segmentation();
};

 export async function resolve(specifier,context,next)
{// import module from specifier, infer context if provided. 
 // yield url for each import if --loader/import specified. 
 let interception=next?.name==="nextResolve"||next?.name==="nextStep";
 if(!interception)
 throw Error("calling resolve directly is deprecated. Use command instead.");
 let {importAssertions:assertions,importAttributes:attributes=assertions}=context||{};
 let peer=attributes?.peer||context?.parentURL;
 if(!peer)
 // delegate primary import to primary thread to infer command line context. 
 return swarm.primary?delegate.call(swarm.primary,"inference"):inference();
 if(attributes?.peer)
 // clone immutable context without custom attributes ({peer} overrides parentURL for commands).
 context=prune.call(context,([field,value])=>({peer:undefined}[field]||value));
 let {pathname:absolute,protocol,host,search:suffix}=url(specifier,peer);
 let relation=peer.replace(folder(import.meta.url),"").replace(/\?.*$/,"");
 let relative=agent.node&&"file:"===protocol?"/"+await command.call(import.meta.url,"path","relative",location,absolute):absolute;
 let extend=!protocol.startsWith("http")
?compose(crop(2),stash(immediate),recover,modules,absolute,peer,"call",peer,relate)
:compose(swap(swarm.primary),[[peer,specifier],{"inference/tether":"interface/fetch"},["headers","status"]],tether(delegate),when(is("200")),swap(specifier),peer,relate);
 let precedent=merge(modules,{[relative]:{}},0)[relative];
 let redact=pass(compose(swap(modules),{[relative]:undefined},merge));
 // stamp suffix makes Node ignore precedents in its own record.
 let stamped=/^[\/\.]/.test(specifier)?(path,context)=>next(path+suffix,context):next;
 return precedent.resolution=precedent.resolution||compose
(buffer(stamped,buffer(compose(extend,["url"],record),compose(note.bind(1),redact,exit)))
,shortcircuit,slip(modules),[relative,"resolution"],relation!=="/"&&[relation,"imports"],induce(ring)
,pass(compose(swap(colors.yellow+"export:"+colors.cyan+relative+colors.yellow+" to:"+colors.gray+relation+colors.steady),console.debug))
,cede
)(absolute,context);
};

 export async function locate(specifier)
{// find boundary in deep "module/namespace" paths. 
 let path=array(specifier)?specifier:specifier.split("/");
 let lead=["","."].find(match(path[0]))?.concat("/")||"";
 let [module,feature="default",...route]=path.slice(!!lead);
 let [name,extension="js"]=module.split(".").reverse().flatMap((extension,index,name)=>
 [name.splice(1-name.length).reverse().join("."),...name.filter(Boolean)]);
 module=lead+name+"."+extension;
 route.unshift(module.includes("_")?module:await prepend(module),feature);
 return route.reduce((past,file,index,route,left=route.length-index-1)=>past.catch(fail=>
 probe(route.slice(0,index+1).join("/")||"/").then(file=>left&&agent.node&&file.isDirectory()
?exit(route.join("/")+" is a directory.")
:cede(route.splice(0,index+1).join("/"),...route)))
,Promise.reject());
};

 function immediate({message},source){return message.includes("'"+source+"'");};

 function recover(fail,source,immediate)
{return {ERR_MODULE_NOT_FOUND:!immediate?alias:describe(buffer
(tether(acquire),buffer(compose
(drop(1),whether(is(unary,match(/\.js$/)),compose(drop(1,2),prepend),compose(drop(1,2),extend))
),compose(crop(2),fail,exit))),"recover",source)
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate&&extend
 }[fail.code]||exit(fail);
};

 function extend(absolute)
{return ["","/index"].flatMap(path=>
 ["","js","ts","jsx","tsx","d.ts"].map(extension=>
 absolute+path+(extension?".":"")+extension)).reduce((file,source)=>
 file.catch(fail=>access(source).then(file=>file.isDirectory()?abort(file):source))
,Promise.reject());
};

 async function alias(absolute,target)
{// find potential alias in bundle definition. 
 let path=await import("path");
 let source=path.relative(path.dirname(target),absolute);
 let [format,definition]=Object.entries(importmap).find(([target,definition])=>
 Object.values(simple(definition)?definition:[definition]).some((source,index)=>
 absolute.startsWith(path.join(location,target.replace(/\.js$/,""),String(index)))))||[];
 let namespace=definition&&Object.values(search.call([definition],({1:entry})=>
 array(entry)||string(entry))).flat().find(entry=>entry.alias);
 let alias=namespace?.alias[source];
 return alias?path.resolve(location,alias):exit(Error("no alias for "+source+" in "+target));
};

 export async function acquire(absolute,peer)
{// bundle if not found despite source entry, 
 // redirect to source once available (being, or failed to be bundled). 
 if(!defined(this))
 exit(acquire.name+" requires bound scope to track source imports.");
 let path=await import("path");
 let target=absolute.replace(/\.js$|\.node$/,"");
 let relative=path.relative(location,absolute);
 let definition=importmap[relative];
 if(!definition)
 exit("no source definition for "+absolute);
 let entry=!compound(definition)||array(definition);
 let entries=Object.entries(entry?[definition]:definition).flatMap(function sort([remote,input],index)
{if(remote===index)remote=undefined;
 let entries=!compound(input)||array(input)?[[undefined,input]]:Object.entries(input);
 return entries.map(([branch,input])=>(
 {target,remote,branch,input:[input].flat()
 }));
});
 let input=entries.flatMap(({input},index)=>
 [input].flat().map(input=>[String(index),input])).filter(([index,input])=>string(input));
 let [addon,rust]=[".gyp",".rs"].map(extension=>input[0][1].endsWith(extension));
 let move=compose(absolute,slip(command.call(import.meta.url,"fs","promises")),"rename",swap(absolute));
 let clean=pass(buffer(compose(swap(target),purge,done=>delete this[target]&&note.call(2,"purged sources of "+target+".")),note));
 if(entries.length)
 return compose.call
(path.resolve(location,target,...entries[0].remote
?input.length<2&&!/\/$/.test(input[0][1])
?input[0]:["reexports.js"]:[])
 // target entry indicates source resolution available for re-import. 
,entry=>this[target]=this[target]||compose.call
(target,pass(target=>note.call(2,"Collecting source of \""+relative+"\" for "+peer+"..."))
,buffer(purge),swap(entries)
,buffer(infer("reduce",record(assemble),[]),compose(note.bind(1),clean,exit))
 // temporary re-export of all namespaces for multientry bundle. 
,pass(/reexports\.js$/.test(entry)&&compose
(infer("flatMap",({source})=>source)
,infer("reduce",record(source=>
 compose.call(source,relative,load,"javascript",{source},parse,exports,target,reexport))
,[]),"\n","join",slip(entry),true,access
))
 // perform idempotent source resolution before bundling to support re-imports. 
,pass(parts=>!addon&&!rust
?note.call(3,"Importing source entry of \""+relative+"\" to access before \nbundling for "+peer+": \n"+entry)&&swarm.primary
?delegate.call(swarm.primary,["inference/tether interface/command","inference/undefine"],peer,entry)
:command.call(peer,entry):null)
,slip(entry)
,(addon||rust)&&buffer(addon?make:combine(wasm,drop(1)),compose(note,clean,exit))
,lift,induce(addon
?compose(move,pass(infer(note.bind(2),"addon ready.")),clean)
 // not returning bundle promise after source assembly to unblock immediate resolution from source. 
:compose(skip(buffer
(compose(bundle,slip(absolute),true,access,pass(infer(note.bind(2),"bundle ready.")),clean)
,compose(clean,exit)
)),rust?crop(1):swap(entry),pass(note.bind(3,"Imported source entry of \""+relative+"\" \nfor "+peer+": \n"))))
)
);
};

 async function assemble({remote,branch,input,target},index,{length}={})
{let path=await import("path");
 if(!remote)return input.map(input=>string(input)?path.join(target,input):input);
 let {protocol,host,pathname}=new URL(remote);
 let [,author,name,...route]=decodeURI(pathname).split("/");
 let compressed=route[0]==="tarball"||!["github.com"].some(host.includes.bind(host));
 let [address,...filter]=(protocol+["","",host,author,name,...compressed?route:[]].join("/")).split(" ");
 let depot=path.join(target,String(index))+"/";
 let asset=depot.replace(/\/$/,".tar.gz");
 let local=await access(depot,false).catch(fail=>false);
 await persist({},target);
 if(!local&&remote)
 // download. 
 compressed
?await compose(buffer(access,fail=>
 compose.call(address,buffer(expect(fetch,0,5),compose(remote,note,exit)),response=>response.status===200
?compose("arrayBuffer",Buffer.from,asset,buffer(persist,fail=>note(fail)&&access(asset)))(response)
:produce(combine(swap("Failed to fetch "+remote+":"),"status","text"),"concat",exit)(response))),compressed=>
 compose.call({},depot,persist,swap(asset),pass(infer(decompress,depot,filter)),purge,pass(note.bind(1,"Deleted source: "))))(asset)
:await expect(buffer(command.bind(import.meta.url,"./Blik_2026_git.js","checkout"),combine
(compose(crop(1),[],({stack},record)=>
 record.push(note.call(1,record.length+1+"/5 attempt to checkout "+address+": "+stack)))
,combine(swap(depot),buffer(purge))
,exit
)),0,5)(address,depot,branch,route).catch(note.bind(1)).then(done=>
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
 compose.call(path.dirname(target),script,path.resolve,command.bind(import.meta.url),"default",module=>
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
 path.relative(location,address).split("/")).reduce(([route],[bundle])=>route!==bundle)
?"./"+path.relative(location,path.resolve(relation,alias))
:alias));
 let route=address=>path.relative(location,address).split("/");
 let plugins=await compose.call
 // rollup plugins shall be deprecated in favor of Interface source formats. 
(formats,tether(prune,([field,value])=>/^\./.test(field)?value:undefined,true,1)
,Object.entries,infer("reduce",record(([plugin,settings])=>command.call(import.meta.url,plugin,"default",settings)),
[{transform:(source,address)=>compose.call
("url","pathToFileURL",address,command.bind(import.meta.url),"href"
,{format:formats[route(address)[1]]}
,load,(code,map={mappings:''})=>({code,map})
),resolveId(source,client)
{return client
?/^\./.test(source)
?[path.resolve(path.dirname(client),source),relation].reduce((address,relation)=>
 // ignore external aliases. 
 route(client).reduce((source,entry,index,route)=>
 Object.values(relevant(parts[entry]?.format.alias||
 parts.map(({format})=>format).reduce(merge,{})
,route.splice(2).join("/")))).includes("./"+path.relative(relation,address))
?false
:extend(address.replace(/\/$/,"")))
:null
:null
}}
])
);
 note.call(3,"bundling "+source+"...");
 let {rollup}=await import("./Harris_2015_rollup.js");
 let bundle=await rollup({input,plugins,...format.input});
 let {output:[{code}]}=await bundle.generate({format:"module",inlineDynamicImports:true,...format.output});
 let modifications=Object.values(formats).map(({modify})=>modify).reduce(merge);
 return edit(code,modifications);
};

 export function relevant(scope,term)
{return Object.fromEntries(Object.entries(scope).flatMap(([field,value])=>!string(value)
?["ends","starts"].some(side=>term[side+"With"](field))?Object.entries(value):[]
:[[field,value]]));
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

 async function wasm(source,parts)
{// compile a Rust crate to wasm32 (cargo) then process it through wasm-bindgen for a js binding.
 let edits=parts.map(({format})=>format?.edit).filter(Boolean).reduce(merge,{});
 if(Object.keys(edits).length)
 await compose(edits,edit,slip(source),true,access)(await access(source,true));
 let attempts=folder(source).split("/").map((field,index,path,base=path.slice(0,path.length-index-1))=>
 compose(slip(base.join("/")),"concat",stash(infer(access,true))));
 let [cargo,manifest]=await either(...attempts)("/Cargo.toml");
 if(!manifest)
 exit(Error("no Cargo.toml found above "+source));
 let {1:target}=manifest.match(/name = "(.*)"/);
 let workspace=await command.call(import.meta.url,"os","tmpdir")+"/"+target+"-target";
 await spawn.call(true,"rustup","target","add","wasm32-unknown-unknown");
 await spawn.call(true,"cargo","build","--manifest-path",cargo,"--target","wasm32-unknown-unknown","--target-dir",workspace,"--release");
 let lockfile=await access(folder(cargo)+"/Cargo.lock","binary").then(String);
 let {1:bindgen}=lockfile.match(/name = "wasm-bindgen"\nversion = "(.*)"/);
 let binder=workspace+"/wasm-bindgen";
 await access(binder).catch(fail=>produce
(fetch,"arrayBuffer",Buffer.from,binder,"wasm-bindgen",decompress
,0o755,command.bind(import.meta.url,"fs","chmodSync")
)("https://github.com/wasm-bindgen/wasm-bindgen/releases/download/"+bindgen+"/wasm-bindgen-"+bindgen+"-"
+{"linux-x64":"x86_64-unknown-linux-musl","linux-arm64":"aarch64-unknown-linux-gnu"
 ,"darwin-x64":"x86_64-apple-darwin","darwin-arm64":"aarch64-apple-darwin"
 ,"win32-x64":"x86_64-pc-windows-msvc"
 }[globalThis.process.platform+"-"+globalThis.process.arch]+".tar.gz"));
 let entry=workspace+"/wasm32-unknown-unknown/release/"+target.replace(/-/g,"_")+".wasm";
 await buffer(compose(spawn.bind(true),note),exit)(binder,entry,"--target","web","--out-dir",path(relate("./pkg",cargo)),"--out-name","index");
 //await command.call(import.meta.url,"fs","promises","rm",workspace,{recursive:true,force:true});
 let [local]=source.replace(location+"/","").split("/");
 await persist(await access(path(relate("./pkg/index_bg.wasm",cargo)),"binary"),location+"/"+local+".wasm",true);
 return path(relate("./pkg/index.js",cargo));
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

 export async function load(source,context,next)
{// access source as module specifier. 
 let {protocol,host,pathname:absolute}=await url(source);
 let relative="file:"===protocol?"/"+await command.call(import.meta.url,"path","relative",location,absolute):absolute;
 let loading=next?.name==="nextLoad";
 let precedent=loading&&modules[relative]?.module;
 if(precedent)
 return precedent.source?.length===0
 // buffer is mysteriously cleared sometimes, eg. in reimport for tests without a vm flag below. 
?access(precedent.responseURL,1).then(source=>
 Object.assign(precedent,{source}))
:precedent;
 if(string(context))
 context={format:context};
 if(loading)
 // clone immutable context without custom attributes ("peer" used in interface/command to track direct invocation). 
 context=prune.call(context,([field,value])=>field==="peer"?undefined:value);
 let {format,importAssertions:assertions={},importAttributes:attributes=assertions}=context||{};
 let syntax=attributes.type||mime(absolute)?.replace(/.*\//,"");
 var shortcircuit=compose({shortCircuit:true},merge,slip(modules),[relative,"module"],ring);
 if(/^https*/.test(source))
 return compose.call(source,fetch,"text",source=>({source,format:/\.json$/.test(source)?"json":"module"}),shortcircuit,cede);
 [context,attributes,format,syntax]=await profile(absolute,context,attributes,format,syntax);
 let native=["json","module","wasm","builtin","commonjs",undefined].includes(format);
 if(native&&next)
 return compose(next,whether(match({format:"addon"}),infer(merge,{source:null})),shortcircuit,skip(check),cede)(source,context);
 let [index,sparse]=relative.split("/").slice(1).reduce((folder,entry,index,relative)=>
 [entry,relative.splice(2).join("/")]);
 let bundling=compound(format);
 let {comment,...definition}=
[{syntax}
,bundling?format:
[Object.values(importmap[format]||{})[index]||importmap[format]||{}
].reduce(function flat(entries,source)
{return [entries,!compound(source)||array(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(compound).map(entry=>
 // replace only applies during bundling. use "edit" to modify sources. 
 merge(entry,{replace:undefined,modify:undefined}))
].flat().reduce(merge);
 syntax=definition.syntax;
 let foreign=!["javascript"].includes(syntax)||Object.keys(definition).length>1;
 // parse foreign to serialize standard syntax. without native interpreter to call (next), all syntax are foreign. 
 let edits=relevant(definition.edit||{},sparse);
 if(syntax==="json")
 syntax="module",edits["^((?:.*[\n$])*)"]="export default $1";
 let patriate=foreign?parser[format]||compose
(infer(parse,syntax,{source}),definition,sanitize,serialize
,"javascript",{source},parse,serialize):unit;
 let module=await buffer
(compose(access,edits,edit,patriate,cede)
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&wait(1000)(fail).then(exit)
// access reads the real file off disk, so it needs the query-free path too.
)(absolute,true);
 return next?compose.call(module,source=>(
 {source,format:{json:"json"}[syntax]||"module"
 }),shortcircuit,cede):module;
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
 await buffer(require,commonjs=>is(Error)(commonjs)&&
 Object.assign(context,{format:format="module"}))(source);
 return [context,attributes,format,syntax];
};

 export var recompose=produce
 // composition declarations: [[context],"module/name module/name",{"module/name":[argument,{"module/name":{}}]}]
(whether(modular,drop(1)),zap,each(produce(crop(1),lift,decide
({reduce:[string,produce(each([produce(crop(1),infer("split"," "))]),lift,zap,each(produce
(crop(1),lift,flip,combine(crop(1),tether(locate)),lift,drop(2,0,tether(command)),crop(1,collect),tether(search)
)),lift,flip,tether(produce))]
 ,induce:[simple,produce(each([Object.entries]),zap,each(produce
(crop(1),lift,each([compose(crop(1),"flat")]),command.bind(import.meta.url,import.meta.url,"recompose"),infer,"call"
)),lift)]
 ,context:[array,rank]
 ,else:crop(1)
 }
))),lift
);

 export async function interpret(source,specifier,context={},depth=0)
{// uses --experimental-vm-modules 
 if(modular(source))
 return source;
 let {attributes,target}=specifier;
 if(simple(specifier))null
,{specifier}=specifier;
 let {SourceTextModule,SyntheticModule,createContext,isContext}=await import("vm");
 let {protocol,host,port,pathname:identifier,href:address}=url(specifier);
 if(target)
 merge(modules[target],{imports:new Set([identifier])},0);
 let precedent=context.imports?.[identifier];
 if(precedent)
 return precedent;
 let builtin=protocol==="node:";
 if(!source&&!builtin)null
,{source}=modules[identifier]?.module||
 await expect(buffer(load,compose(note.bind(1),whether
(compose(swap(identifier),bundling)
,compose(crop(1),slip("awaiting bundle to "+interpret.name),undefine)
))),3000)(address,{importAttributes:attributes});
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
(specifier=>command.call(import.meta.url,"path","resolve",identifier,"..",specifier)
,identifier=>protocol+"//"+host+identifier
),crop(1)),drop(2)),lift,(specifier,attributes,depth)=>
 interpret(null,{specifier,attributes,target:identifier},context,depth)
);
 let cachedData=await modules[identifier]?.virtual;
 let module=builtin
?await import(identifier).then(module=>new SyntheticModule(Object.keys(module),function()
{Object.entries(module).reduce((module,entry)=>
 module.setExport(...entry)||module
,this);
},{identifier,context}))
:new SourceTextModule(source||""
,{identifier,context,cachedData
 ,importModuleDynamically:compose(crop(3),push(0),link,"namespace")
 ,initializeImportMeta:infer(merge,{url:address})
 });
 merge(context.imports,module,[identifier]);
 let links=await module.moduleRequests?.reduce(record(compose
(drop(1),combine("specifier",swap(module),"attributes"),lift,push(depth+1),link,cede
)),[]);
 module.linkRequests
?await module.linkRequests?.(links)
:await module.link(compose(crop(3),push(depth+1),link,cede))?.catch(undefine);
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
 return scope.tests=compose
(buffer(swarm.primary?delegate.bind(swarm.primary,"test"):test,infer("cause"))
,crop(1),disclose,["tests"],record,slip(scope),merge
)(scope.responseURL);
};

 export async function prompt(...context)
{// request context from client interface.
 let {stdin:input,stdout:output}=globalThis.process;
 let {createInterface}=await import("readline");
 let interfaces=[{input,output}].map(createInterface);
 let entries=context.flat().flatMap(term=>compound(term)?Object.entries(term):[[term]]);
 entries=await entries.reduce(record(([field,term])=>
 control(new AbortController(),revert((resolve,reject,abortion,...interfaces)=>
 term?resolve(term):interfaces.forEach(infer("question",field+":"
,combine(compose(swap(abortion),"abort"),resolve)))),...interfaces).then(term=>
 [field,term]))
,[]);
 return compose(each("close"),swap(Object.fromEntries(entries)),cede)(...interfaces);
};

 export function patch(repository,patches)
{return [patches].flat().reduce(record(compose
(drop(1,2),true,access
,command.bind(import.meta.url,"./Blik_2026_git.js","patch")
,push(repository)
,command.bind(import.meta.url,"./Blik_2026_git.js","apply")
)),[]);
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
 command.call(import.meta.url,"zlib","gzip",buffer,(fail,buffer)=>fail?reject(fail):revert(buffer)));

 export async function decompress(source,target,filter=[])
{let buffer=string(source)?await access(source,"binary"):source;
 let zip=signature(buffer)==="zip";
 filter=[filter].flat();
 if(zip)
 buffer=await(globalThis.DecompressionStream
?compose(gzip=>["writ","read"].map(stream=>
 gzip[stream+"able"]["get"+stream.replace(/^./,infer("toUpperCase"))+"er"]())
,([writable,readable])=>(writable.write(buffer),writable.close(),readable)
,combine(unary,"read"),[],0,induce(async function read(readable,{done,value},expanded,size)
{while(!done)
 expanded.push(value),size+=value.byteLength,{done,value}=await readable.read();
 return expanded.reduce((buffer,array,index,arrays)=>
 buffer.set(array,size+=arrays[index-1]?.byteLength??-size)||buffer
,new Uint8Array(size));
}))(new DecompressionStream("gzip"))
:revert((decompress,reject,buffer)=>
 command.bind(import.meta.url)("zlib","gunzip",buffer,(fail,buffer)=>fail?reject(fail):decompress(buffer)))(buffer));
 let tar=signature(buffer)==="tar";
 if(!tar)
 return buffer;
 let tarstream=await import("stream").then(({Duplex})=>
 [new Duplex(),buffer,null].reduce((duplex,buffer)=>(
 duplex.push(buffer),duplex)));
 let extractor=await import("./isaacs_2011_node-tar.js").then(({Parser})=>new Parser());
 let matched=[];
 let prefix="extracting ";
 let pathspace=(globalThis.process.stdout.columns??100)-prefix.length;
 let folder=await revert((resolve,reject,stream,folder)=>observe.call(stream
,{entry(entry)
{if(filter?.length&&!filter.some(filter=>entry.path.includes(filter)))
 return entry.resume();
 (swarm.primary?delegate.bind(swarm.primary,"print"):print)(entry.path.slice(0,pathspace),prefix.length);
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
 }))(tarstream.pipe(extractor),{},globalThis.process.stdout.write(prefix));
 if(target)
 return persist(Object.values(folder)[0],target);
};

 export function print(message,indent=0)
{if(swarm.primary)
 return delegate.call(swarm.primary,"print",message,indent).catch(note);
 globalThis.process.stdout.cursorTo?.(indent);
 globalThis.process.stdout.clearLine?.(1);
 globalThis.process.stdout.write(string(message)?message:JSON.stringify(message));
};

 export async function list(file,recursive=true,exclude=[])
{let wildcard=file.split("/").at(-1).includes("*");
 if(wildcard)
 return file.split("/").reduce(compose(drop(3),path=>
[new RegExp(path.pop().replace("*",".*"))
,list(path.splice(0).join("/"),recursive,exclude)
],rank,(name,files)=>prune.call(files,([file,entry])=>
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
{if(!path.includes(location))throw Error("Refusing to purge outside of location: "+path);
 return compose.call(command.call(import.meta.url,"fs","promises"),infer("rm",path,{recursive:true,force:true}),swap(path));
};

 export function compile(source,format)
{return compose.call(source,load,parse,format,serialize);
};

 export function bundling(source)
{return Object.entries(modules).some(([field,{resolution}])=>
 (!source||source.startsWith(field))&&promise(resolution));
};

 export function testing(source)
{return Object.entries(modules).some(([field,{module}])=>
 (!source||source.startsWith(field))&&promise(module?.tests));
};

 export async function require(path)
{// to be deprecated in favor of commonjs compilation. 
 let instance=require.instance;
 //path=new URL(note(path)).pathname;
 if(instance)
 return instance(path);
 require.instance=await command.call(import.meta.url,"module","createRequire",import.meta.url);
 return require.instance(path);
};

 export async function socket(address,window)
{window.socket?.close();
 var {protocol,host,pathname}=new URL(address);
 let WebSocket=globalThis.WebSocket||
 await import("./einaros_2011_ws.js").then(({default:WebSocket})=>WebSocket);
 let socket=is(WebSocket)(this)?this:new WebSocket(protocol.replace(/^http/,"ws")+"//"+host+pathname);
 return revert((resolve,reject,socket,window)=>Object.assign(socket
,{onopen({target}){console.warn("Websocket open: ",target);}
 ,onerror({target}){console.warn("Websocket not available at "+target.url);reject(target);}
 ,onclose({target}){console.warn("Websocket closed: ",target);}
 ,onmessage(event){window.postMessage(event.data,window.location.origin);resolve(this);}
 }))(socket,window).then(socket=>window.socket=socket);
};

 export function listen(action,message)
{// revert message events on bound socket to terminate listening. 
 return control(new AbortController(),revert
((resume,reject,{signal},socket,message,call)=>
 call(observe.call(socket,{message(response)
{action.call(this,JSON.parse(response.data),message,resume,reject);
}},{signal}))
),this,message,message?infer("send",JSON.stringify(message)):infer());
};

 export function bust(file){return [file].flat().map(file=>delete modules[file]);};

 async function* crawl(modules)
{yield* Object.entries(modules).map(async function*([file,peer])
{let peers=Object.keys(peer);
 let terminal=!peers.length;
 yield each.call(rank(terminal?[undefined]:peers),peer=>
 [peer&&relate("."+peer,import.meta.url),"."+file].reduce((peer,specifier)=>
 compose(buffer(command.bind(peer)),module=>[specifier,module,peer])(specifier)));
 if(!terminal)
 yield crawl(peer);
});
};

 export async function reload(modules)
{// Export declarations updated over CDP, expressions by 'reexpress' exports.
 let live=await produce(crawl,spill,surge,collect)(modules);
 let changed=Object.keys(modules);
 let peers=Array.from(new Set(Object.values(modules).flatMap(peers=>flatten(peers))));
 console.warn("Redeclaring functions in "+changed+".\nPeers may need reexpression: "+peers);
 if(agent.node)
 swarm.loader?await delegate.call(swarm.loader,"bust",changed):await bust(changed);
 else
 // serviceworker cache tests conditional fetch against server memory, but only checks itself periodically. 
 await compose.call(await navigator.serviceWorker?.getRegistrations()||[]
,infer("forEach",registration=>
 [registration.active,registration.waiting,registration.installing].filter(Boolean).forEach(worker=>
 changed.includes(worker.scriptURL.replace(location.origin,""))&&
 registration.update())));
 await changed.reduce(record(redeclare),[]);
 // timestamp suffix busts V8's own resolution cache,
 // stripped by Interface/resolve for its own record.
 return live.reduce(record(async([specifier,module,peer],index)=>
 module?.reexpress&&module.reexpress(console.log("Reexpressing "+specifier)||await command.call(peer,specifier+"?bust="+Date.now()))),[]);
};

 export async function fetch(request,{method,body,headers}={})
{if(globalThis.window)
 return globalThis.window.fetch(...arguments);
 let address=string(request)?request:request[is(URL)(request)?"href":"url"];
 if(/^[\/\.]+/.test(address))
 address=relate(address,!this?await command.call(import.meta.url,"./Blik_2023_fragment.js","window").then(({location:{origin}})=>origin):this);
 let {protocol,host,hostname,pathname,search,port}=new URL(address);
 if(protocol==="file:")
 return access(pathname,"binary").then(body=>
 stage({body,status:200,headers,type:mime(pathname)},address));
 return revert((respond,reject,request,body)=>compose
(infer(command.bind(import.meta.url),"request",request,function forward(response)
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
 {path:pathname+search,port,headers
 ,method:method||request?.method?.toUpperCase()||"GET"
 ,agent:await peer(protocol.replace(/:/,""))
 },body||request.body);
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
(whether(match({constructor:{name:"HTMLHtmlElement"}}),swap("<!DOCTYPE html>"),drop())
,whether(match({constructor:{name:"DocumentFragment"}}),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),lift,collect,"","join")
,whether(has("body"),infer(Reflect.get,"body"),infer())
)(response));
 if(json&&!basic(body))
 body=cede(buffer(JSON.parse,swap(""))(serialize(body.constructor?.name=="Buffer"?body.toString():body)));
 if(js&&importing&&!features.assertions)
 body=(string(body)?body:body.toString()).replace(/(import\([^,\)]+),(.*?\(.*?\))*[^\)]*/,"$1");
 if(json&&simple(body))
 body=JSON.stringify(prune.call(body,([field,value],path,trace)=>
 functor(value)?null:trace.includes(value)?path:value));
 if(json&&importing)
 body=Buffer.from("export default "+body+";"),headers["Content-Type"]=mime("js"),js=true;
 if(browser&&js&&headers["content-encoding"]!=="gzip"&&headers["Content-Encoding"]!=="gzip")
 body=await compress(body),headers["Content-Encoding"]="gzip";
 if(response?.nodeName)
 await command.bind(import.meta.url)("./Blik_2023_fragment.js","destroy",response);
 return (
 {status,body,location:request.url,cookie,headers
 ,text,arrayBuffer,json(){return this.text(true);}
 });
};

 export async function text(json=false)
{if(!binary(json))json=false;
 let buffer=this.body.constructor?.name==="Buffer";
 let text=buffer?Buffer.from(await this.arrayBuffer()).toString("utf-8"):this.body;
 if(compound(text))
 return json?text:JSON.stringify(text);
 return json?JSON.parse(text):text;
};

 export async function arrayBuffer()
{// if(simple(this.body))
 // return compose(JSON.stringify(this.body),"encode","buffer")(new TextEncoder());
 let gzip=Array(2).fill("Content-Encoding").find((field,index)=>this.headers?.get(index?field.toLowerCase():field)==="gzip");
 let body=gzip?Buffer.from(await decompress(this.body)):this.body;
 if(body?.constructor?.name==="Buffer")
 return compose
(new Uint8Array(new ArrayBuffer(body.length))
,(buffer,array)=>{for(let i=0;i<array.length;i++){array[i]=buffer[i]};return array}
,"buffer"
)(body);
 return Buffer.from(body??"","utf-8");
};

 export var script=compose
(combine(fetch,unit),lift,whether
(match({status:200})
,compose(combine(compose(crop(1),"text"),drop(1,2)),lift,interpret)
,compose(crop(1),"text",Error,exit)
)
);

 export var digest=produce
 // read response in its specified format. 
 // Response objects may be imitated, hence not when(is(Response)). 
(when(has(["status","text","json","headers"]))
,whether(produce("status",minor(400)),infer(),produce("text",Error,exit))
,whether(match({headers:{"Content-Encoding":"gzip"}}),compose(decompress))
,combine(unit,produce("headers",infer("get","Content-Type"),";","split",0,infer
((type,xml)=>produce.call(
 {json:"json",pdf:"arrayBuffer"
 ,csv:produce("text",records),svg:produce("text",type,xml),xml:produce("text",type,xml)
 ,png:"blob",jpg:"blob",png:"blob"
 },Object.entries,infer("map",([field,value])=>[mime(field),value]),Object.fromEntries)[type]
,function xml(text,mime)
{return command.call(import.meta.url,"./Blik_2023_fragment.js","window").then(({document,DOMParser})=>mime==="text/html"
?document.createRange().createContextualFragment(text)
:new DOMParser().parseFromString(text,mime).documentElement);
}))),lift
,(response,parser)=>infer.call(response,parser||"text")
);

 export var ingest=produce
(combine(compose(either("Content-Type","content-type",swap(undefined)),slip(compose.call
({JSON,"x-www-form-urlencoded":"querystring"}
,Object.entries
,infer("map",compose(combine(compose(0,"toLowerCase",/^/,"application/","replace"),infer(1)),collect))
,Object.fromEntries
)),tether(differ),command.bind(import.meta.url)),"body")
,either("parse",drop(1),swap(""))
);

 export async function spawn(...context)
{// bound scope defines output color: undefined=quiet, other=default
 note.call(3,...context,"...");
 let process=await command.call(import.meta.url,"child_process","spawn",context.shift(),context);
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

 export function inspect(port,host="localhost")
{// restart inspector to trigger a DevTools switch back to the main thread in case open.
 let controller=new AbortController();
 compose(wait(3000),[Error("Can't inspect at "+host+":"+port+": timed out.")],"abort")(controller);
 return compose
(command.bind(import.meta.url),pass("close")
,port,host,pass(infer("open")),drop(1,0,controller)
,infer(control,compose(drop(1),inspector,slip("Inspect: \n"),"concat",note.bind("cyan")))
)("node:inspector");
};

 function post(session,method,params,sessionId)
{// send one CDP command, resolving with its matching {id} response - the same
 // flat-session shape either side of attach() needs, over a plain WebSocket.
 let id=session.id=(session.id||0)+1;
 return listen.call(session,function(message,{id},resume,reject)
{if(message.id===id)
 (message.error?reject:resume)(message.result||message.error.message);
},{id,sessionId,method,params});
};

 export async function attach(port,host="localhost")
{// isomorphic CDP session over a raw WebSocket - identical whether `port` names
 // the server's own --inspect port or the browser's --remote-debugging-port.
 if(inspection.session)
 return inspection.session;
 // a page can't read its own browser's /json cross-origin (Chrome never grants
 // it, by design) - Static's /inspect route fetches it server-side instead.
 let controller=new AbortController();
 compose(wait(3000),[Error("Inspecting "+host+":"+port+" timed out.")],"abort")(controller);
 let {webSocketDebuggerUrl:url,id:targetId}=await control(controller,compose(drop(1),fetch,"text",JSON.parse,targets=>globalThis.window
?targets.find(({url})=>url===window.location.href)
:targets[0]),globalThis.window?"/inspect":"http://"+host+":"+port+"/json");
 let WebSocket=globalThis.WebSocket||
 await import("./einaros_2011_ws.js").then(({default:WebSocket})=>WebSocket);
 let session=new WebSocket(url);
 await revert((resolve,reject,session)=>
 observe.call(session,{open:resolve,error:reject},{once:true}))(session);
 observe.call(session,{message({data})
{let message=JSON.parse(data);
 if(message.method!=="Debugger.scriptParsed")
 return;
 inspection.scope[message.params.url]=message.params.scriptId;
 console.debug(colors.dim+"Inspecting module:\n "+message.params.url+colors.steady);
}});
 let {sessionId}=await post(session,"Target.attachToTarget",{targetId,flatten:true}).catch(debug);
 await post(session,"Debugger.enable",{},sessionId);
 console.log("Inspecting: "+url+".");
 return inspection.session={session,sessionId};
};

 export async function redeclare(path)
{let url=relate("."+path,import.meta.url);
 let scriptId=inspection.scope[url];
 if(!scriptId)
 return;
 let {session,sessionId}=await attach();
 return fetch(path).then(digest).then(scriptSource=>post(session,"Debugger.setScriptSource",{scriptId,scriptSource},sessionId)).then(({status})=>
 status==="BlockedByTopLevelEsModuleChange"&&console.warn("Failed to redeclare "+path+": reexpression needed."));
};

 export async function segmentation()
{// Report internal segfault errors (occurs with experimental features like "vm" in node22). 
 if(!await compose.call(resolve("vm"),has("Module")))
 exit(Error("Segmentation error traces are only needed for --experimental-vm-modules."));
 return compose("default","registerHandler")(import("./Shiranuit_2021_segfault.node"));
};

 export function feature(agent)
{return agent&&prune.call
({attributes:{node:21,Chrome:138}
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
{let agent=cede(either("user-agent","userAgent",swap(undefined))(navigator));
 let device=/\((.*?)\)/.exec(agent)?.[1]?.split(";").reduce(function(platform)
{return {[platform]:arguments[3].splice(1).join(";")};
})||{};
 let entries=agent?.match(/[\w\.]+\/(\.{0,1}\d+){1,2}/g)?.map(agent=>agent.split("/"))||
 [[agent]];
 return entries.map(([name,version])=>({[name]:Number(version)})).reduce(merge,device);
};

 export function flags({execArgv=[]}={})
{return Object.fromEntries(execArgv.filter(match(/^--/)).map(flag=>
 merge(flag.slice(2).split(/ |=/),{1:true},0)));
};

 async function distribute()
{// https://github.com/nodejs/node/issues/35158
 //if(!process.argv[1])process.argv[1]=import.meta.url;
 if(!await command.call(import.meta.url,"cluster","isMaster"))
 return;
 await command.call(import.meta.url,"cluster","on","exit",(worker,code,signal)=>note.call(code,worker.process.id+" exited with status "+code));
 let os=await import("os");
 let cpus=os.cpus();
 if(!cpus.length)
 cpus=[{model:os.platform()}];
 return cpus.reduce(record((cpu,index,cpus)=>
 compose.call("cluster","fork",command.bind(import.meta.url),pass(compose
("id",cpus.length+" "+cpu.model+(!cpus[index+1]?"":"\nnext fork in a second..."),collect,"/","join",note.bind(1)
)),wait(index*1000)))
,[]);
};

 export async function reset()
{let bundles=Object.keys(importmap);
 note("Bundles: "+bundles.join(" "));
 let [confirm]=Object.values(await prompt({"Delete all?":undefined}));
 if(!confirm)return;
 return Promise.all(bundles.map(file=>
 file&&purge("./"+file)));
};

 export async function test(namespace,tests,target=namespace)
{// compose tests defined in namespace. 
 if(string(namespace))
 namespace=await command(namespace);
 tests=tests||namespace.tests||{};
 let assert=await import("assert");
 let noncondition=either(not(defined),simple,is([array,infer("some",({condition})=>condition)]));
 let fails=await [tests].reduce(function test(term,tests,depth,path)
{let {scope,context=[],route=[],terms=[],condition,benchmark}=tests;
 benchmark=benchmark&&measure(path.join("/"))
 return noncondition(condition)
?compose(Object.entries,infer("reduce",record(([name,tests])=>
 test(term[name]??term,tests,depth+1,[depth?path:[],name].flat())),[]),"flat")(tests)
:buffer(compose
(...[route].flat(),benchmark
,buffer(scope?tether(term):term),benchmark
,...[terms].flat(),assert[condition]||condition,swap({})
),({stack})=>(benchmark?.(),{[path.join("/")]:stack}))(...[context].flat());
},namespace);
 fails=fails.reduce(merge,{});
 let format=compose((item,order,items)=>
 [item,order,Math.max(...items.map(({length})=>length))]
,([item,order,length])=>
 item+(order%Math.floor(globalThis.process.stdout.columns/length)
?" ".repeat(length-item.length):"\n"));
 let report=[fails,tests,namespace].map((subject,index)=>
 Object.keys(subject).map(index?field=>field:field=>field.match(/(.*?)(\/|$)/)[1])
).map((names,index,groups,past=groups.slice(0,index).flat())=>
 names.filter(name=>!past.includes(name))
).map((names,index)=>names.length&&
["\x1b["+["31mFAIL:","32mPASS:","34mSKIP:"][index]
,...names.slice(0,index>1?15:undefined).concat(index>1&&names.length>15?"...":[])
].map(format).join("")).filter(Boolean).join("\n")+"\x1b[0m\n";
 let {length}=Object.keys(fails);
 let groups={[colors[length?"red":"green"]+"Tested "+target+colors.steady]:[report,fails]};
 return length?exit("Failed tests on "+target,disclose(groups)):groups;
};

 export function disclose(groups)
{Object.entries(groups).forEach(([group,logs])=>
[console.groupCollapsed(group)
,[logs].flat().forEach(log=>string(log)?console.log(log):disclose(log))
,console.groupEnd()
]);
 return groups;
};

 export var tests=
 {command:
[{scope:true,context:["http://localhost:8000/test","/"+name],condition:when(is(modular))}
,{scope:true,context:[import.meta.url,import.meta.url,"tests"],terms:[entry=>rank([entry,tests]),Object.is],condition:"ok"}
,{scope:true,context:[import.meta.url,import.meta.url],terms:[swap(swarm.loader,"modules"),tether(delegate),"/"+name,has("imports")],condition:"ok"}
],access:
[{context:[import.meta.url],terms:[value=>typeof value,"object"],condition:"equal"},
 {context:[import.meta.url,true],terms:[value=>typeof value,"string"],condition:"equal"}
],load:
[{context:[import.meta.url],terms:[" import","startsWith"],condition:"ok"}
]};

 if(agent.node&&!agent.virtual&&!remote)
 // expose functions for procedural use. 
[import.meta.url,"./Blik_2023_inference.js","./Blik_2023_search.js"
].forEach(produce(crop(1),command.bind(import.meta.url),globalThis,flip,Object.assign));
