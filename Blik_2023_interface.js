 import {note,collect,prompt,same,has,promise,pass,slip,something,observe,describe,remember,expect,control,trace,array,compound,simple,apply,stream,record,revert,provide,tether,differ,wether,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,numeric,binary,basic,match,wait,string,defined,compose,combine,exit,clock,route,major} from "./Blik_2023_inference.js";
 import {sum,merge,stringify,search,edit,prune,parse as records,relevant} from "./Blik_2023_search.js";
 import {parse,sanitize,serialize,exports,reexport,test,mime,coordinates} from "./Blik_2023_meta.js";

 export const address=new URL(import.meta.url).pathname;
 export const location=address.replace(/\/[^/]*$/,"");//path.dirname(address);
 export const file=address.replace(/.*\//,"");//path.basename(address);
 export const virtual=typeof imports!=="undefined";// modularise tracks imports in context. 
 export const agent=globalThis.process
?prune.call(process.versions,({1:value})=>string(value)?Number(value.match(/(\.{0,1}\d+){1,2}/)[0]):value)
:version(globalThis.navigator);
 export var {window,fetch}=globalThis.window?globalThis:{fetch:freefetch};
 var log=console.log;

 export function version(navigator)
{return ["user-agent","userAgent"].reduce((agent,field)=>
 agent||navigator?.[field],undefined)?.match(/[\w\.]+\/(\.{0,1}\d+){1,2}/g).map(agent=>
 agent.split("/")).map(([name,version])=>({[name]:Number(version)})).reduce(merge);
};

 export var feature=agent=>agent&&prune.call
({attributes:{node:21,Chrome:123}
 ,assertions:{node:16.14,Chrome:91,Firefox:Infinity}
 ,json:{Chrome:125,Firefox:Infinity}
 },([feature,condition])=>
 [true,Object.keys(condition).find(name=>agent[name])].filter(Boolean).reduce((value,name)=>
 condition[name]<=agent[name])
);

 var sources="./Blik_2023_sources.json";
 export var scope={};

 // --import flag registers loader module on separate thread unlike 
 // --loader, where context is available directly on the primary thread. 
 export var [thread,loader]=["import","loader"].map(name=>agent.node&&
 process.execArgv.some(flag=>new RegExp("^--"+name+"[= ][^ ]*"+file).test(flag)));

 if(!virtual&&thread&&await resolve("worker_threads","isMainThread"))
 // register loader thread. 
 await compose.call
("worker_threads",resolve,["MessageChannel"],tether(search),[],Reflect.construct
 // draft to forward logs to inspector. 
 // ,resolve("net","connect",process.debugPort).then(inspector=>new Promise((resolve,reject)=>
 //  observe.call(inspector,{connect(){resolve(infer.bind(this,"write"))},error(){resolve()}})))
,revert(function register(message,onerror,{port1,port2})
{// promise resolves on message from registration port. 
 observe.call(thread=port1,{message,onerror});
 resolve("module","register",address,import.meta.url,{data:{socket:port2},transferList:[port2]});
}),"data",note.bind(2)
,drop(),globalThis
,{collect,provide,drop,crop,infer,differ,buffer,compose,either,wether,tether,resolve,sum,search,prune,merge,record
 },0,merge
),wether
(compose(collect,"length",major(0))
,either(compose(resolve,note.bind(2)),compose(note.bind(1),wait(60*1000),exit))
,infer()
)(...process.argv.slice(1));

 if(!thread&&!loader&&agent.node&&process.argv[1]?.endsWith(file))
 // without either loader flag, context begins at second index. 
 resolve(...process.argv.slice(2));


 // https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize({socket:thread})
{thread.postMessage("Module loader registered:\n"+import.meta.url);
 // receive composition declarations through thread.postMessage. 
 observe.call(thread,{message({data:composition}){resolve(composition);}});
 //console.log=combine(compose(drop(1),console.log),socket.postMessage.bind(socket));
};

 export var locate=async function locate(action)
{let relative=/^\.*\//.test(action);
 let [module,feature="default"]=action?.replace(/^\.*\//,"").split("/")||["./Blik_2023_fragment.js","media"];
 if(!relative&&!module.includes("_"))
 module=await [2020,new Date().getFullYear()].reduce((min,max)=>
 Array(max-min).fill(max).map((year,index)=>year-index)).flatMap(year=>
 ["Blik"].map(author=>[author,year,module].join("_")+".js")).reduce((file,module)=>
 file.catch(fail=>this[module]=this[module]||import("./"+module).then(swap("./"+module)))
,Promise.reject());
 return [module,feature];
}.bind({});

 var precedent=compose(crop(1),"resolution",collect,slip(scope),tether(search));

 var recovery=compose
(combine(crop(1),({message},source)=>message.includes("'"+source+"'"))
,(fail,immediate)=>(
 {ERR_MODULE_NOT_FOUND:immediate?acquire:divert
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate&&extend
 }[fail.code])||exit(fail)
);

 var remote=compose
(address=>fetch(address),when(compose("status",is(200))),"headers","location"
,address=>({url:window.location.origin+address})
);

 var respecify=compose("url",collect,slip(URL),Reflect.construct,"pathname",decodeURI);
 var modulepath=when(is([match(/^[\/\.]/),not(match(RegExp(sources+"$")))]));
 var format=compose
(combine(infer(),compose(swap(sources),"default",resolve,Object.keys)),(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$/,"/")].join("/"))),["format"],record
);
 var shortcircuit=compose
(combine(infer(),either(buffer(compose(respecify,modulepath,format)),swap({}))),merge
,{shortCircuit:true},merge,["resolution"],record
);

 export async function resolve(source,context,next)
{// import module from source, infer context if provided. 
 // use as --loader/import module to do for each import. 
 // (https://nodejs.org/api/esm.html#esm_loaders). 
 if(compound(source))
 return array(source)&&!source.some(module=>!string(module))
?source.reduce(record(source=>resolve(source,context,next)),[])
 // composition declarations: ["module/name",[context],"module/name"]
:agent.node&&!thread
?exit(Error("Resolving composition declarations not allowed on main thread."))
:compose(infer("reduce",record(term=>string(term)
?compose(locate,([module,action])=>[resolve(module),action],provide,Reflect.get)(term)
:[term].flat()),[]),"flat",provide,tether(compose))(source);
 if(!string(source))
 return exit(Error("can't resolve type "+typeof source));
 let internal=context?.parentURL;
 let loading=next?.name==="nextResolve";
 let primary=loading&&!internal;
 if(primary&&thread&&!await resolve("worker_threads","isMainThread"))
 // suppress primary import on loader thread (registered with --import) in favor of explicit inference with context available only on the main one. 
 return next("worker_threads",context);
 let command=!loading||!internal;
 let target=internal?decodeURI(new URL(internal).pathname):address;
 let relation=target.replace(/\/[^/]*$/,"");
 let absolute=source;
 let [url,path]=[/^file:/.test(source),/^[\/\.]/.test(source)];
 if(url)absolute=await resolve("url","fileURLToPath",source);
 if(path)absolute=!agent.node
?relation+"/"+source.replace(/^[\/\.]+/,"")
:await resolve("path","resolve",relation,source)
 if(internal)
 merge(scope,{[target]:{imports:new Set([absolute])}},0);
 let json=source.endsWith(".json")||undefined;
 let recover=compose(recovery,infer("call",scope,absolute,target),infer(resolve,context,next));
 let module=command
?import(source,json&&{[feature(agent).attributes?"with":"assert"]:{type:"json"}})
:either(precedent,compose
(either(buffer(next,buffer(recover)),compose(swap(source),remote))
,shortcircuit,{imports:new Set()},merge,[absolute],record,slip(scope),merge
,[absolute,"resolution"],tether(search)
))(absolute,context);
 if(loading&&internal)
 return module;
 [source,...context]=primary?process.argv.slice(1):Array.from(arguments);
 let inference=infer(...context)(module);
 if(!primary)
 return inference;
 let suspense=!process.execArgv.includes("--watch")?10*60*1000:0;
 return compose(note,wait(suspense),drop(),0,process.exit)(inference);
};

 function extend(absolute)
{return [".js","js","ts","d.ts",".jsx",".tsx"].map((extension,index)=>
 index?[absolute,"index."+extension].join("/"):absolute+extension).reduce((first,second,index,all)=>
 [...all.splice(index),first]).reduce((file,source)=>
 file.catch(fail=>access(source).then(file=>source))
,Promise.reject());
};

 async function divert(absolute,target)
{// find potential alias in bundle definition. 
 let {default:modules}=await import(sources);
 let path=await import("path");
 let source=path.relative(path.dirname(target),absolute);
 let [format,definition]=Object.entries(modules).find(([target,definition])=>
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
 let target=absolute.replace(/\.js$/,"");
 let relative=path.relative(location,absolute);
 let definition=await compose("default",resolve,either(relative,swap({})))(sources);
 let entry=!compound(definition)||array(definition);
 let entries=Object.entries(entry?[definition]:definition).flatMap(function sort([remote,input],index)
{if(remote==index)remote=undefined;
 let entries=!compound(input)||array(input)?[[undefined,input]]:Object.entries(input);
 return entries.map(([branch,input])=>({remote,branch,input:[input].flat(),target}));
});
 if(entries.length)
 return compose.call
(entries,([{remote,input},...parts])=>path.resolve(location,...remote?
[target,[input,parts.flatMap(({input})=>input)].flat().filter(string).length<2
?"0/"+input.find(string)
:"reexports.js"
]:[])
 // target entry indicates source resolution available for re-import. 
,entry=>this[target]=this[target]||compose.call
(target,pass(target=>note.call(2,"Collecting source of \""+relative+"\" for",dependent+"..."))
,buffer(purge),swap(entries)
,buffer(infer("reduce",record(assemble),[]),fail=>purge(target).finally(done=>exit(fail)))
 // temporary re-export of all namespaces for multientry bundle. 
,pass(/reexports\.js$/.test(entry)&&compose
(infer("flatMap",({source})=>source)
,infer("reduce",record(source=>
 compose.call(source,relative,load,"javascript",{source},parse,exports,target,reexport))
,[]),"\n","join",slip(entry),true,access
))
 // perform idempotent source resolution before bundling to support re-imports. 
,pass(parts=>resolve(entry).catch(note))
,parts=>compose.call
(entry,parts,bundle,slip(absolute),true,access,"bundle ready.",note.bind(2)
).finally(done=>purge(target))&&
 // not returning bundle promise after source assembly to unblock immediate resolution from source. 
 entry
)
,pass(note.bind(3,"Accessing source entry of \""+relative+"\" for "+dependent+":\n "))
);
 let sloppy=!/\.(js|json)$/.test(absolute)&&
 await ["js","ts","tsx","d.ts"].map(extension=>absolute+"."+extension).reduce((module,file)=>
 module.catch(fail=>access(file).then(present=>file))
,Promise.reject()).catch(fail=>false);
 return sloppy||exit(Error("no source definition for "+absolute));
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
 let entries=await [input].flat().reduce(record(input=>typeof input==="string"
?Promise.resolve(/\/$/.test(input)
?access(path.join(relation,input),true).then(files=>
 files.map(({name})=>path.join(input,name)).filter(name=>/\.js$/.test(name)))
:[input]).then(input=>input.map(input=>path.join(relation,input)))
:input)
,[]);
 let {source=[],format=[],patches=[]}=[entries.flat()].flat().map(function sort(part)
{let field=typeof part=="string"?(/\.patch$/.test(part)?"patches":"source"):"format";
 return { [field]: [part] };
}).reduce((entries,entry)=>merge(entries,entry,0), {});
 format=format.reduce(merge,{});
 await patch(path.dirname(source[0]), patches);
 let scripts=[format.scripts].flat().filter(Boolean);
 if(scripts.length)
 await scripts.reduce(record(script=>
 note.call(3,"running "+script+" for "+target+"...")&&
 compose.call(path.dirname(target),script,path.resolve,resolve,"default",module=>
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
,Object.entries,infer("reduce",record(([plugin,settings])=>resolve(plugin,"default",settings)),
[{name:"interface"
 ,transform:(source,address)=>compose.call
("url","pathToFileURL",address,resolve,"href"
,{format:formats[route(address)[1]]}
,load,code=>({code,map:{mappings:''}})
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

 export async function load(source,context,next)
{// access source as module specifier, ie. 
 // compose(source,true,access,interpret,format,sanitize,serialize,modularize). 
 //let version=process.versions.node.split(".")[0];
 let target=/^file:/.test(source)?await resolve("url","fileURLToPath",source):source;
 let precedent=scope[target]?.module;
 if(precedent&&next?.name==="nextLoad")
 return check(precedent.source?.length===0
 // buffer is mysteriously cleared sometimes, eg. in reimport for tests below. 
?access(precedent.responseURL,1).then(source=>Object.assign(precedent,{source}))
:precedent);
 if(string(context))
 context={format:context};
 let {format,importAttributes:attributes,importAssertions:assertion}=context||{};
 attributes=assertion||attributes||{};
 let syntax=attributes?.type||mime(source)?.replace(/.*\//,"");
 // persist shortCircuit on scope to support loading from source while bundling. 
 var shortcircuit=compose({shortCircuit:true},merge,[target,"module"],record,slip(scope),merge,target,"module");
 if(!format&&/^https*/.test(source))
 return compose.call(source,fetch,"text",source=>({source,format:/\.json$/.test(source)?"json":"module"}),shortcircuit);
 if(syntax==="json"&&format!==syntax)
 Object.assign(context,{format:format=syntax});
 if(format==="json"&&attributes.type!==format)
 // bypass need for static import attributes. 
 Object.assign(attributes,{type:format});
 if(format!=="builtin"&&/^node:/.test(source))
 // builtin format is sometimes omitted by nodejs. 
 Object.assign(context,{format:format="builtin"});
 if(!format&&/\.ts$/.test(source))
 Object.assign(context,{format:format="typescript"});
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await require(target).catch(fail=>
 Object.assign(context,{format:format="module"}));
 let native=["json","module","wasm","builtin","commonjs",undefined].includes(format);
 if(native&&next)
 return compose.call(source,context,next,shortcircuit,check);
 let relative=await resolve("path","relative",location,target);
 let [index,sparse]=relative.split("/").reduce((folder,entry,index,relative)=>
 [entry,relative.splice(2).join("/")]);
 let {comment,...definition}=
[{syntax}
,typeof format==="object"?format||{}:await import(sources).then(sources=>
 [Object.values(sources.default[format]||{})[index]||sources.default[format]||{}].reduce(function flat(entries,source)
{return [entries,!compound(source)||array(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(compound).map(entry=>
 // replacement definitions only apply to bundle output. use "edit" to modify loading sources. 
 merge(entry,{replace:undefined})))
].flat().reduce(merge);
 syntax=definition.syntax;
 let foreign=!["javascript","json"].includes(syntax)||Object.keys(definition).length>1;
 // parse foreign to serialize standard syntax. without native interpretter to call (next), all syntax are foreign. 
 // using acorn's Parser methods (parse) until interpretation reducer is complete. 
 let edits=relevant(definition.edit||{},sparse);
 let patriate=foreign?[infer(parse,syntax,{source}),definition,sanitize,serialize,"javascript",{source},parse,serialize]:[];
 let module=await buffer
(compose(access,edits,edit,...patriate)
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&wait(1000)(fail).then(exit)
)(source,true);
 if(next)
 return compose.call({source:module,format:{json:"json"}[syntax]||"module"},shortcircuit);
 return module;
};

 function check(scope)
{if(scope.format!=="module"||scope.tests||!scope.responseURL)
 return scope;
 let target=new URL(scope.responseURL).pathname;
 compose(buffer(compose(wether
(false//compose.call(resolve("vm"),has("Module"))
 // dispatch new import thread for tests until modularization halts on self-referential imports. 
,compose(true,access,target,modularise)
,resolve
),module=>scope.tests=module.tests&&compose
(test,result=>
 scope.tests="\x1b[4m"+source+"\x1b[0m:\n"+result
,note
)(module)
)
,note.bind(1,"Test failed for "+target+":\n")
),swap(scope))(target);
 return scope;
};

 export async function checkout(remote,target,branch,path)
{// git clone remote branch to target, restricted to subfolder if present. (to be replaced with js-git)
 if(!/^http/.test(remote))
 return fs.cp(remote,target,{dereference:true,recursive:true}).then(copy=>branch&&spawn("git","-C",target,"checkout",branch));
 let commit=branch.length===40&&!/[^a-z0-9]/.test(branch);
 let clone=await spawn("git","clone","--depth=1",...path.length?["--no-checkout","--sparse","--filter=tree:0"]:[]
,...commit?["--no-checkout","-c","remote.origin.fetch=+"+branch+":refs/remotes/origin/"+branch]:branch?["--single-branch","--branch",branch]:[]
,remote,target);
 if(commit)
 clone=await spawn("git","-C",target,"checkout",branch);
 if(!path.length)
 return target;
 clone=await spawn("git","-C",target,"sparse-checkout","add",...[path.join("/").split(" ")].flat());
 if(!commit&&branch)
 clone=await spawn("git","-C",target,"checkout",branch);
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

 export var compress=revert((revert,reject,buffer)=>import("zlib").then(({gzip})=>
 gzip(buffer,(fail,buffer)=>fail?reject(fail):revert(buffer))));

 export async function decompress(buffer,target)
{let address=string(buffer)&&buffer;
 let [zip,tar]=address?[/\.(gz|zip)$/,/\.tar$/].map(pattern=>pattern.test(buffer)):[];
 if(address)
 buffer=await access(buffer,"binary");
 if(is(Error)(buffer))
 exit(buffer);
 if(zip&&globalThis.DecompressionStream)
{let gzip=new DecompressionStream("gzip");
 let [readable,writable]=["read","writ"].map(stream=>
 gzip[stream+"able"]["get"+stream.replace(/^./,infer("toUpperCase"))+"er"]());
 writable.write(buffer),writable.close();
 let expanded=[],size=0,{done,value}=await readable.read();
 while(!done)
 expanded.push(value),size+=value.byteLength,{done,value}=await readable.read();
 return expanded.reduce((buffer,array,index,arrays)=>
 buffer.set(array,size+=arrays[index-1]?.byteLength??-size)||buffer
,new Uint8Array(size));
};
 if(zip)
 return revert((decompress,reject,buffer)=>
 resolve("zlib","gunzip",buffer,(fail,buffer)=>fail?reject(fail):decompress(buffer)))(buffer);
 let stream=await import("stream").then(({Duplex})=>
 [new Duplex(),buffer,null].reduce((duplex,buffer)=>(duplex.push(buffer),duplex)));
 let extractor=await import("./isaacs_2011_node-tar.js").then(({Parser})=>new Parser());
 let folder={};
 let prefix="extracting ";
 let pathspace=process.stdout.columns-prefix.length;
 await revert((resolve,reject,stream)=>observe.call(stream
,{entry(entry)
{process.stdout.cursorTo?.(prefix.length);
 process.stdout.clearLine?.(1);
 process.stdout.write(entry.path.slice(0,pathspace));
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
 }))(stream.pipe(extractor),process.stdout.write(prefix));
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
 if(file.startsWith("http"))
 return request(file);
 if(/^file:\/\//.test(file))
 file=new URL(file).pathname;
 let {promises:fs}=await import("fs");
 if(!encoding)
 return fs.stat(file);
 if(/\/$/.test(file))
 return fs.readdir(file,{withFileTypes:true});
 if(content)
 return fs.writeFile(file,...binary(content)?[encoding,'utf8']:[content,encoding]).then(written=>file);
 let buffer=await fs.readFile(file);
 if(["binary",1].includes(encoding))
 return buffer;
 content=buffer.toString([true,"object"].includes(encoding)?"utf8":encoding);
 if(encoding==="object")
 return JSON.parse(content);
 return content;
};

 export async function list(file,recursive=true,exclude=[])
{if(!/\/$/.test(file))
 file=file.replace(/$/,"/");
 let {promises:fs}=await import("fs");
 let files=await fs.readdir(file)//,{withFileTypes:true});
 files=await files.reduce(record(file=>buffer(compose(fs.stat,{name:file},merge),swap(undefined))(file)),[])
 let entries=await files.reduce(record(entry=>
 !exclude.some(exclusion=>RegExp(exclusion).test(file+entry.name))
?entry.isDirectory()?recursive
?list(file+entry.name+"/",recursive,exclude).then(files=>[entry.name,files])
:undefined
:[entry.name,null]
:undefined)
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
 process.stdout.clearLine?.();
 process.stdout.write(("\rwriting "+path).slice(0,process.stdout.columns));
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
{return compose(path,{recursive:true},"rm",swap(path))(resolve("fs","promises"));
};

 export var compile=compose(drop(1),load,parse,serialize);

 export async function modularise(resource,identifier,context={},parents={})
{// uses --experimental-vm-modules 
 let {SourceTextModule,SyntheticModule,createContext,isContext}=await import("vm");
 let {default:{resolve}}=await import("path");
 let {pathToFileURL}=await import("url");
 identifier=resolve(identifier);
 if(identifier.endsWith(".json"))
 try{return {default:JSON.parse(resource),[Symbol.toStringTag]:"Module"};}catch(fail){};
 if(!isContext(context))
 context=createContext(
 {imports:new Map(),URL,Object,Reflect,Buffer,TextEncoder,TextDecoder
 //,isNaN,Error,Math,JSON,Date,Symbol,Object,Function,Promise,String,Array,Boolean,ArrayBuffer,crypto,global,globalThis
 ,process,console,setTimeout,setInterval,global,...context
 });
 let options=
 {identifier,context
 ,importModuleDynamically:identifier=>import(identifier)
 ,initializeImportMeta:meta=>Object.assign(meta,{url:pathToFileURL(identifier)})
 ,cachedData:context.imports.get(identifier)
 };
 let module=new SourceTextModule(resource||"",options);
 context.imports.set(identifier,module.createCachedData());
 await module.link(link);
 await module.evaluate().catch(compose(note,exit));
 return module;
 function link(identifier,{context})
{return Object.assign(parents
,{[identifier]:parents[identifier]||/^[a-z]/.test(identifier)
?import(identifier).then(module=>new SyntheticModule(Object.keys(module),function()
{Object.entries(module).reduce((module,entry)=>
 module.setExport(...entry)||module,this);
},{identifier,context}))
:compose.call(identifier,true
,buffer(access,compose(bundling,swap(identifier),true,access))
,identifier,context,parents,modularise)
 }
)[identifier];
};
};

 function bundling(fail,source)
{let [bundle]=Object.entries(scope).find(([field,module])=>
 source.startsWith(field)&&is(Promise)(module));
 return scope[bundle]||exit(fail);
};

 export async function require(path)
{// to be deprecated in favor of commonjs compilation. 
 let instance=globalThis.require||require.instance;
 //path=new URL(note(path)).pathname;
 if(instance)
 return instance(path);
 require.instance=await resolve("module","createRequire",import.meta.url);
 return require.instance(path);
};

 export async function sourcemap(request,address)
{let {query:{module}={}}=await resolve("url","parse",request.url,true);
 let {default:actions,...exports}=await resolve(module);
 let namespace=
 {["./"+await resolve("path","relative",".",address)]:
 [exports,...Object.values(actions)].flatMap(names=>
 Object.entries(names).map(([field,value])=>
 is(Function)(value)&&value.name||field))
 };
 let names=Object.values(namespace).flat();
 let sources=await Object.keys(namespace).reduce
(record(source=>infer(access,true)(source))
,[await compose(fetch,"text")(module)]
);
 let grammars=await Object.entries({...namespace,[module]:names}).reduce(record(function([module,[...names]],index,namespaces)
{// find node with same source text as first name match in source files (names are more likely shadowed in output, but source may still be mistaken).
 let reference=this.slice(0,namespaces[index+1]?0:index).flatMap(Object.values);
 return compose(buffer(parse,swap(null)),tether(search,({1:value})=>names.includes(value?.id?.name)&&
 [value,reference?.find(node=>node.id.name===value.id.name)].filter(Boolean).map(node=>
 (sources[node===value?index:this.findIndex(grammar=>Object.values(grammar).includes(node))]).slice(node.start,node.end)).reduce((text,reference)=>text===reference)&&
 names.splice(names.indexOf(value.id.name),1),true))(sources[index]);
}),[]);
 let [source,grammar]=[sources,grammars].map(list=>list.pop());
 let locations=grammars.map((nodes,index)=>Object.values(nodes).map(node=>
[coordinates(sources[index],node.id.start)
,coordinates(source,Object.values(grammar).find(({id})=>id.name===node.id.name)?.id.start)
,node.id.name
]).filter(({0:source,1:target})=>
 // filter locations not matched due to transformation.
 [source,target].flat().every(numeric)));
 let entries=locations.flatMap((locations,source)=>
 locations.map(([[sourceline,sourcecharacter],[line,character],name],index,locations)=>[line,[
 // zero-based character, file, sourceline, sourcecharacter and name index relative to previous value.
[character-(locations[index-1]?.[1][0]===line?locations[index-1][1][1]:0)
,index?0:source?1:0
,sourceline-(locations[index-1]?.[0][0]??0)
,sourcecharacter-(locations[index-1]?.[0][1]??0)
,[locations[index-1]?.[2],name].filter(Boolean).map(name=>names.indexOf(name)).reduce((past,next)=>next-past)
]]]));
 let vlq='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 let quantifiers=entries.map(entry=>Object.fromEntries([entry])).reduce((quantifiers,quantifier)=>merge(quantifiers,quantifier,0));
 let mappings=Object.assign(Array(),quantifiers).map(entries=>
 entries.map(entry=>entry.map(quantifier=>
 // https://github.com/Rich-Harris/vlq/blob/master/src/index.js
 [quantifier<0?(-quantifier<<1)|1:quantifier<<1].reduce(function clamp(stack,shifted)
{return (!stack.length||shifted>0)&&(shifted>>>5>0)?clamp([...stack,(shifted&31)|32],shifted>>>5):[...stack,shifted&31];
},[]).map(quantifier=>vlq[quantifier]).join("")).join("")).join(",")).join(";");
 let {origin}=new URL("http"+(request.client.encrypted?"s":"")+"://"+request.headers.host);
 let report=locations.flatMap((locations,index)=>locations.map(([source,target,name])=>name+": "+
[[Object.keys(namespace)[index],source.map(index=>index+1)].flat().join(":")
,[module,target.map(index=>index+1)].flat().join(":")
].map(path=>path.replace(/^\.{0,1}/,origin)).join(" -> "))).join("; \n");
 return {version:3,file:module,sources:Object.keys(namespace),names,mappings,report};
};

 export async function delegate(term,...context)
{when(either(string,functor,defined(this)&&has(["exports"])))(term);
 if(defined(this))
 return control(new AbortController()
,revert((control,reject,{signal},worker,...context)=>
 // listen until worker emits request id. 
[function message({target,data,type,message})
{let ephemeral=target!==globalThis.worker;
 if(ephemeral)target.terminate();
 let [id,value]=data||[];
 if(id===context[0])
 return control(message?Error(message):value);
},context.filter(context=>context instanceof ArrayBuffer)
].reduce((message,transfer)=>console.log(message,context)||
 observe.call(worker,{message,error:message},{signal}).postMessage(context,transfer)))
,this,crypto.randomUUID(),string(term)?term:term.name,...context);
 let ephemeral=term instanceof Function;
 if(ephemeral&&!term.name)
 throw Error("Can't create ephemeral worker for anonymous function.");
 let address=string(term)?term:compose.call
(ephemeral?{exports:{[term.name]:term}}:term,work,0,merge,tether(prune,([field,value])=>field==="imports"
?Object.fromEntries(Object.entries(value).map(([field,value])=>
 [[window.location.origin,field].join("/"),value]))
:value),serialize,collect,{type:"text/javascript"},collect,slip(Blob),Reflect.construct,URL.createObjectURL
);
 let worker=new Worker(address,{type:"module"});
 await revert((message,error,worker)=>
 observe.call(worker,{message,error},{once:true}))(worker).then(({data})=>
 note.call(2,data));
 URL.revokeObjectURL(address);
 return ephemeral?delegate.bind(worker,term.name,...context):worker;
};

 export var worker=
 {imports:{"./Blik_2023_inference.js":["","compose","combine","drop","collect","infer","buffer","note","exit","slip","differ"]}
 ,procedures:[function()
{var address=new URL(import.meta.url).pathname;
 Object.assign(self
,{onmessage({data:[id,term,...context]})
{compose(buffer(compose(...[term].flat().map(term=>differ(term))))
//,wether(string,infer(),JSON.stringify),wether(string,compose(TextEncoder.prototype.encode.bind(new TextEncoder()),"buffer"),infer())
,combine(compose(slip(id),collect),compose(collect,infer("filter",term=>term instanceof ArrayBuffer)))
,postMessage)(import(address),...context);
},onerror:compose(drop(1),postMessage)
 });
 postMessage("Worker ready: "+address);
}]
 };

 async function freefetch(request,header)
{let remote=/^http/.test(request);
 let url=string(request)?!remote
?[this.location.origin,request?.replace(/^[\.\/]+/,"")||""].join("/")
:request:request.url;
 let {href:address,hostname,path,port}=await resolve("url","parse",url);
 if(!compound(request))request=
 {end(response){return Object.assign(this.response,response);}
 ,respond(header){Object.assign(this.response,{header});}
 ,response:{}
 ,url:address,port,method:"get"
 ,...merge(header,{origin:window.location.origin},0)
 };
 let method=request?.method?.toUpperCase()||"GET";
 let protocol=address.match(/[^:]*/)?.[0];
 let agent=await peer(protocol);
 return revert((respond,reject,protocol,request)=>compose
(infer(resolve,"request",request,function forward(response)
{let {statusCode:status,headers:{location}}=response;
 let type=response.headers["content-type"];
 let redirect=status===302;
 if(redirect)
 console.log(address,"redirected to",location,"...");
 let body=[];
 observe.call(response
,{data:record(body=>body).bind(body)
 ,error:compose(note,reject)
 ,end:infer((end,body)=>redirect
?compose.call({...request,url:location},fetch,respond).then(respond).catch(reject)
:compose(stage,respond)({body:Buffer.concat(body,sum(body.map(({length})=>length))),status,type,headers:response.headers},request)
,body)
 });
})
,tether(observe
,{error(fail){this.destroy();reject(fail);}
 ,timeout(fail){this.destroy();reject(fail||Error("timeout: "+this.path));}
 ,close:infer("destroy")
 })
,combine(infer("write",String(request.body||"")),"end")
)(protocol))(protocol,{method,hostname,path,port,agent});
};

 export async function jsdom(url)
{if(this)
 this.reconfigure({url})
,fetch=freefetch.bind(this.window)
,note.call(3,"navigated browser to "+url);
 return window=revert(async function(expose,reject,url)
{infer("close")(window);
 let {JSDOM}=await resolve("./Domenic_2010_jsdom.js","default");
 let browser=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 jsdom=jsdom.bind(browser);
 let {protocol,hostname,port}=await resolve("url","parse",url);
 let name=["fetch",protocol.replace(":",""),hostname,port].join("_");
 fetch=describe(freefetch.bind(browser.window),name);
 note.call(3,"navigated browser to "+url);
 expose(window=browser.window);
})(url);
}

 export async function stage(response,request)
{let agent=version(request.headers);
 let browser="Mozilla/Chrome/Safari/AppleWebKit".split("/").some(has.bind(agent||{}));
 let features=feature(agent);
 let importing=request.headers?.referer&&!request.headers.referer.endsWith(request.url)&&request?.headers?.["sec-fetch-dest"]==="script";
 let fail=is(Error)(response);
 let type=!fail&&response?.type||mime(response?.nodeName?.toLowerCase()||(either(simple,array)(response)?"json":request.url))||mime(response.nodeName?"html":"txt");
 let [js,json]=[type===mime("js"),type===mime("json")];
 let status=response?fail?500:response.status||200:404;
 let success=status<400;
 let cookie=response?.body&&response?.cookie;
 let headers={"Content-Type":type,...response.headers,get(key){return this[key];}};
 let body=wether
([fail,has("nodeName"),something]
,"message"
,compose(combine
(wether(is(window.HTMLHtmlElement),swap("<!DOCTYPE html>"),drop())
,wether(is(window.DocumentFragment),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),collect,"","join")
,wether(has("body"),infer(Reflect.get,"body"),infer())
)(response);
 if(json&&!basic(body))
 body=JSON.parse(serialize(body.constructor?.name=="Buffer"?body.toString():body));
 if(js&&importing&&!features.assertions)
 body=(string(body)?body:body.toString()).replace(/(import\([^,\)]+),(.*?\(.*?\))*[^\)]*/,"$1");
 if(json&&simple(body))
 body=JSON.stringify(body);
 if(json&&importing&&!features.json)
 body=Buffer.from("export default "+body+";"),headers["Content-Type"]=mime("js"),js=true;
 if(browser&&js)
 body=await compress(body),headers["Content-Encoding"]="gzip";
 if(response?.nodeName)
 await resolve("./Blik_2023_fragment.js","destroy",response);
 return (
 {status,body,location:request.url,cookie,headers
 ,json(){return this.text(true);}
 ,async text(json=false)
{if(!binary(json))json=false;
 let buffer=this.body.constructor?.name=="Buffer";
 let gzip=Array(2).fill("Content-Encoding").find((field,index)=>this.headers?.get(index?field.toLowerCase():field)==="gzip");
 let text=buffer?(gzip?Buffer.from(await decompress(this.body)):this.body).toString():this.body;
 if(compound(text))
 return json?text:JSON.stringify(text);
 return json?JSON.parse(text):text;
},async arrayBuffer()
{let gzip=this.headers["Content-Encoding"]==="gzip";
 // if(simple(this.body))
 // return compose(JSON.stringify(this.body),"encode","buffer")(new TextEncoder());
 if(this.body.constructor?.name=="Buffer")
 return compose
(infer("reduce",(array,byte,index)=>Object.assign(array,{[index]:byte})
,new Uint8Array(new ArrayBuffer(this.body.length)))
,"buffer"
)(this.body);
 return Buffer.from(this.body,"utf-8");
}});
};

 export var script=compose
(combine(fetch,infer()),wether
(match({status:200})
,compose(combine(compose(crop(1),"text"),drop(1,2)),modularise)
,compose(crop(1),"text",Error,exit)
)
);

 export function module(module,address)
{let sourcemap="/sourcemap?module="+address;
 let headers=Object.fromEntries(["X-",""].map(field=>[field+"SourceMap",sourcemap]));
 return compose.call
(module,serialize,"\n//# sourceMappingURL="+sourcemap,"concat",["body"],record
,{type:mime("js"),headers},Object.assign
);
};

 export var peer=remember(function peer(protocol)
{return resolve(protocol,"Agent",{timeout:5*60*1000});
},protocol=>protocol);

 export var digest=compose
 // read response in its specified format. 
 // Response objects may be imitated, hence not when(is(Response)). 
(when(has(["status","text","json","headers"]))
,wether(compose("status",not(is(200))),compose("text",Error,exit),infer())
,combine(infer(),compose("headers","Content-Type","get",infer
((type,xml)=>compose.call(
 {json:"json",pdf:"arrayBuffer",csv:compose("text",records)
 ,svg:compose("text",type,xml),xml:compose("text",type,xml)
 ,png:"blob",jpg:"blob",png:"blob"
 },Object.entries,infer("map",([field,value])=>
 [mime(field),value]),Object.fromEntries)[type]
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
)),tether(differ),resolve),"body")
,either("parse",drop(1),swap(""))
);

 export var cookie=cookie=>string(cookie)?cookies(window.document.cookie)[cookie]:Object.entries(cookie||{}).map(([field,value])=>field+"="+value).join(";");
 export var cookies=buffer(compose(when(string),/ *; */,"split",provide,each(entry=>entry.split("=")),collect,Object.fromEntries),swap({}));
 export var query=compose(when(string),wether(compose("/","startsWith"),path=>window.location.origin+path,infer()),collect,slip(URL),Reflect.construct,"searchParams","entries",Array.from,Object.fromEntries);
 export function path(request)
{let address=!string(request)?request.headers.origin+request.url:request;
 return new URL(address).pathname.replace(/^\/*|\/*$/g,"");
};

 export async function spawn(command, ...context)
{// bound scope defines output color: undefined=quiet, other=default
 note.call(3,command, ...context, "...");
 let process = await resolve("child_process", "spawn", command, context);
 let streams = ["out", "err"].map((stream) => process["std" + stream]);
 if(this)
 streams.forEach((stream,index,[out])=>stream.on("data", (data) => console[index?"error":"log"](data.toString("utf8"))));
 return new Promise((resolve, reject)=>process.on("exit", (exit) => (exit ? reject(Error(exit)) : resolve())));
};

 export var tests=
 {access:
[{context:[import.meta.url],terms:[value=>typeof value,"object"],condition:"equal"},
 {context:[import.meta.url,true],terms:[value=>typeof value,"string"],condition:"equal"}
],resolve:
[{context:[import.meta.url,"tests"],terms:[entry=>provide([entry,tests]),Object.is],condition:"ok"}
,{context:[import.meta.url],terms:[swap(scope),address,record=>record.hasOwnProperty("imports")],condition:"ok"}
//,{context:["./Harris_2015_rollup.js"],terms:[swap(scope),location+"/Harris_2015_rollup.js"],condition:"ok"}
],load:
[{context:[import.meta.url],terms:[" import","startsWith"],condition:"ok"}
]};
