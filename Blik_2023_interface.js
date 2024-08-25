 import {note,collect,prompt,same,has,pass,slip,something,observe,describe,remember,refer,expect,control,trace,array,compound,simple,apply,stream,record,revert,provide,tether,differ,wether,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,binary,match,wait,string,defined,compose,combine,exit,clock,route} from "./Blik_2023_inference.js";
 import {sum,merge,stringify,search,edit,prune,parse as records} from "./Blik_2023_search.js";
 import {parse,sanitize,serialize,exports,reexport,test} from "./Blik_2023_meta.js";

 export const address=new URL(import.meta.url).pathname;
 export const location=address.replace(/\/[^/]*$/,"");//path.dirname(address);
 export const file=address.replace(/.*\//,"");//path.basename(address);
 var agent=globalThis.process
?prune.call(process.versions,({1:value})=>string(value)?Number(value.match(/(\.{0,1}\d+){1,2}/)[0]):value)
:version(globalThis.navigator);

 export function version(navigator)
{return ["user-agent","userAgent"].reduce((agent,field)=>
 agent||navigator?.[field],undefined)?.match(/[\w\.]+\/(\.{0,1}\d+){1,2}/g).map(agent=>
 agent.split("/")).map(([name,version])=>({[name]:Number(version)})).reduce(merge);
};

 var feature=prune.call
({attributes:{"Node.js":21,Chrome:123}
 },([feature,condition])=>isNaN(condition)?condition:
 Object.entries(condition).every(([name,version])=>version<=agent[name])
);
 var sources="./Blik_2023_sources.json";
 export var scope={};


 // --import flag registers loader module on separate thread unlike 
 // --loader, where context is available directly on the primary thread. 
 let [thread,loader]=["import","loader"].map(name=>agent.node&&
 process.execArgv.some(flag=>new RegExp("^--"+name+"[= ][^ ]*"+file).test(flag)));

 if(thread&&await resolve("worker_threads","isMainThread"))
 // register loader thread. 
 await compose.call
("worker_threads",resolve,["MessageChannel"],tether(search),[],Reflect.construct
 // draft to forward logs to inspector. 
 // ,resolve("net","connect",process.debugPort).then(inspector=>new Promise((resolve,reject)=>
 //  observe.call(inspector,{connect(){resolve(infer.bind(this,"write"))},error(){resolve()}})))
,combine
(({port1})=>new Promise(message=>observe.call(port1,{message}))
,({port2})=>resolve("module","register",address,import.meta.url,{data:{socket:port2},transferList:[port2]})
)// promise resolves on message from registration port. 
,crop(1),"data",note.bind(2)
),compose(buffer(resolve),note)(...process.argv.slice(1));

 if(!thread&&!loader&&agent.node&&process.argv[1]?.endsWith(file))
 // without either loader flag, context begins at second index. 
 resolve(...process.argv.slice(2));


 // https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize({socket})
{socket?.postMessage("Module loader registered:\n"+import.meta.url);
};

 let precedent=compose(crop(1),"resolution",collect,slip(scope),tether(search));
 let respecify=compose("url",collect,slip(URL),Reflect.construct,"pathname",decodeURI);
 let recovery=compose
(drop(-1,1),combine(infer(),(source,{message})=>message.includes("'"+source+"'"))
,(source,fail,immediate)=>(
 {ERR_MODULE_NOT_FOUND:immediate?acquire:divert
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate&&extend
 }[fail.code])||
 Promise.reject.bind(Promise,fail)
);
 let backtrack=compose
(crop(1),scope,either((source,scope)=>
 Object.entries(scope).find(([field,module])=>
 source.startsWith(field)&&is(Promise)(module))
,compose(crop(1),"not subject of bundling",collect,infer("join"," "),Error,exit))
,0,/.*\//,"","replace",".js","concat"
);
 let format=compose
(combine(infer(),compose(swap(sources),"default",resolve,Object.keys)),(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$/,"/")].join("/"))),"format",refer
);
 let modulepath=when(is(match(/^[\/\.]/),not(match(RegExp(sources+"$")))));
 let shortcircuit=compose
(combine(infer(),either(compose(respecify,modulepath,format),swap({}))),merge
,{shortCircuit:true},merge,"resolution",refer
);

 export async function resolve(source,context,next)
{// import module from source, infer context if provided. 
 // use as --loader/import module to do for each import. 
 // (https://nodejs.org/api/esm.html#esm_loaders). 
 if(Array.isArray(source))
 return source.reduce(record(source=>resolve(source,context,next)),[]);
 if(!string(source))
 return source;
 let internal=context?.parentURL;
 let loading=next?.name==="nextResolve";
 let command=!loading||!internal;
 let primary=loading&&!internal;
 if(primary&&thread&&!await resolve("worker_threads","isMainThread"))
 // suppress primary import on loader thread (registered with --import) in favor of explicit inference with context available only on main. 
 return next("worker_threads",context);
 let target=internal?decodeURI(new URL(internal).pathname):address;
 let relation=target.replace(/\/[^/]*$/,"");
 let [url,path]=[/^file:/.test(source),/^[\/\.]/.test(source)];
 let absolute=await wether
([url,path]
,source=>resolve("url","fileURLToPath",source)
,source=>!agent.node?relation+"/"+source:resolve("path","resolve",relation,source)
,infer()
)(source);
 if(internal)
 merge(scope,{[target]:{imports:new Set([absolute])}},0);
 let invoke=infer(Function.call,scope,absolute,target);
 let proceed=infer(resolve,context,next);
 let discard=wether(same(absolute),compose(context,next),compose(drop(-1),exit));
 let fail=compose(drop(2),each("stack"),"The above errors occured while trying to locate "+source+".",collect,"\n","join",Error,exit);
 let json=source.endsWith(".json")||undefined;
 let module=command?import(source,json&&{[feature.attributes?"with":"assert"]:{type:"json"}}):either(precedent,compose
(either(next,compose(recovery,invoke,proceed),compose(backtrack,discard),fail)
,shortcircuit,{imports:new Set()},merge,absolute,refer,slip(scope),merge
,[absolute,"resolution"],tether(search)
))(absolute,context);
 if(loading&&internal)
 return module;
 [source,...context]=primary?process.argv.slice(1):Array.from(arguments);
 let term=context.shift();
 let inference=combine(...[term].flat().map(term=>infer(term,...context)));
 let suspense=primary&&!process.execArgv.includes("--watch")?10*60*1000:0;
 return compose(inference,primary?compose(note,wait(suspense),drop(),0,process.exit):infer())(module);
};

 function extend(absolute)
{return [".js","js","ts","d.ts"].map((extension,index)=>
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
(entries,([{remote,input},...parts])=>path.resolve(location,...remote?[target,input.filter(string).length<2&&!parts.length||input.filter(string).length===1?"0/"+input[0]:"reexports.js"]:[])
,combine(infer(),wether
(buffer(access,drop())
 // source entry indicates available re-import, or incomplete assembly to await/report. 
,entry=>either.call(this,entry,wether(differ(target),expect(entry),swap(null)))
 // target entry indicates assembly outpaced by re-import, otherwise begin. 
,entry=>either.call(this,target,compose
(swap(2),"Collecting source of \""+relative+"\" for",dependent+"...",tether(note),swap(this)
 // expose assembly promise to inform redirects to source, and retries in case of their unlikely outpace by its purge. 
,scope=>merge(scope,{[target]:entries.reduce(record(assemble),[]).catch(fail=>purge(target).finally(done=>exit(fail)))})
,target
 // temporary re-export of all namespaces for multientry bundle. 
,pass(parts=>parts.flatMap(({source})=>source).length>1&&compose.call
(parts.flatMap(({source})=>source).reduce(record(source=>
 compose.call(source,relative,load,"javascript",{source},parse,exports,target,reexport)),[])
,"\n","join"
,slip(target+"/reexports.js"),true,access
))
 // perform a full scope resolution before bundling to forego being outpaced by purge. 
,pass(parts=>parts.reduce(record(({source})=>resolve(source)),[]).catch(note))
 // not returning bundle promise after assembly to unblock immediate resolution from source. 
,parts=>void(compose.call
(parts.flatMap(({source})=>source).length>1?target+"/reexports.js":parts[0].source
,parts.map(({format})=>format).reduce(merge,{})
,bundle,slip(absolute),true,access
,"bundle ready.",note.bind(2)
).finally(done=>purge(target)))
))
))
,pass((entry,reference)=>!something(reference)&&
 note.call(defined(reference)?1:3,
["Accessing source entry of \""+relative+"\" for "+dependent+":\n "+entry+"\n "
,defined(reference)
?"(bundling failed - delete source to guarantee integrity)"
:"(not to halt re-imports while bundle is being prepared)"
].join("")))
,crop(1)
);
 let sloppy=!/\.(js|json)$/.test(absolute)&&
 await ["js","ts","d.ts"].map(extension=>absolute+"."+extension).reduce((module,file)=>
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
?await access(asset).catch(fail=>
 compose.call(remote,buffer(expect(fetch,0,5),compose(remote,note,exit)),response=>response.status===200
?response.arrayBuffer().then(buffer=>persist(Buffer.from(buffer),asset)).catch(fail=>note(fail)&&access(asset))
:exit(response.status))).then(compressed=>
 compose.call({},depot,persist,swap(asset),decompress,depot,decompress,swap(asset),purge))
:await expect(buffer(checkout,combine
(compose([],({stack},record)=>record.push(note.call(1,record.length+1+"/5 attempt to checkout "+address+": "+stack)))
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

 export async function bundle(source,format={})
{if(!source)return;
 let [input,...multientry]=[source].flat();
 if(multientry.length)
 throw Error("Bundling requires singular entry point. Multiple sources must be exposed through reexports.");
 let path=await import("path");
 let relation=path.dirname(input);
 let alias=prune.call(format.alias||{},({1:alias})=>string(alias)&&/^\./.test(alias)&&
 // aliases are relative to "location", so offset external ones (not sharing bundle route) 
 // to "relation" in transform to match by reference for exclusion in resolution below. 
 [path.resolve(location,alias),relation].map(address=>
 path.relative(location,address).split("/")).reduce(([route],[bundle])=>
 route!==bundle)
?"./"+path.relative(location,path.resolve(relation,alias))
:alias);
 let relativeformat=[format].reduce(merge,{alias});
 let plugins=await Object.entries(format).filter(([field])=>
 /^\./.test(field)).reduce(record(([plugin,settings])=>resolve(plugin,"default",settings)),[
 {name:"interface"
 ,transform:(source,address)=>compose.call
("url","pathToFileURL",address,resolve,"href"
,{format:relativeformat},load,code=>({code,map:{mappings:''}})
),resolveId:(source,client)=>client
?/^\./.test(source)
?Object.values(format.alias||{}).includes("./"+path.relative(relation,path.resolve(path.dirname(client),source)))
?false
:["","/index.js","/index.ts",".js",".ts"].map(extension=>
 path.resolve(path.dirname(client),source.replace(/\/$/,"")+extension)).reduce((source,alias)=>
 source.then(source=>source||access(alias).then(file=>file.isDirectory()?exit():alias).catch(fail=>null))
,Promise.resolve(null))
:null
:null
 }]);
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
 return precedent.source?.length===0
 // buffer is mysteriously cleared sometimes, eg. in reimport for tests below. 
?access(precedent.responseURL,1).then(source=>Object.assign(precedent,{source}))
:precedent;
 if(string(context))context={format:context};
 let {format,importAttributes:attributes,importAssertions:assertion}=context||{};
 attributes=assertion||attributes||{};
 let syntax=attributes?.type||mime(source)?.replace(/.*\//,"");
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
 return compose.call
(source,context,next,{shortCircuit:true},merge
,[target,"module"],refer,slip(scope),merge,target,"module"
,module=>module.format==="module"
 //?read(source).then(module=>modularise(module,source)).then(({namespace:module})=>prove.call(module,module.proof))
 // dispatch new import thread for tests until modularization halts on self-referential imports. 
?import(target).then(module=>module.tests&&!scope[target].tests&&(
 scope[target].tests=buffer(test)(source).then(result=>
 console.log(scope[target].tests="\x1b[4m"+source+"\x1b[0m:\n"+result))))&&module
:module
);
 let {comment,...definition}=
[{syntax}
,typeof format==="object"?format||{}:await import(sources).then(sources=>
 [sources.default[format]||{}].reduce(function flat(entries,source)
{return [entries,!compound(source)||array(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(compound).map(entry=>
 // replacement definitions only apply to bundled output. use "edit" to modify loading sources. 
 merge(entry,{replace:undefined})))
].flat().reduce(merge);
 syntax=definition.syntax;
 let foreign=!["javascript","json"].includes(syntax)||Object.keys(definition).length>1;
 // parse foreign to serialize standard syntax. without native interpretter to call (next), all syntax are foreign. 
 // using acorn's Parser methods (parse) until interpretation reducer is complete. 
 let edits=Object.fromEntries(Object.entries(definition.edit||{}).flatMap(([field,value])=>
 string(value)?[[field,value]]:source.endsWith(field)?Object.entries(value):[]));
 let patriate=foreign?[syntax,{source},parse,definition,sanitize,serialize,syntax,{source},parse,serialize]:[];
 let module=await buffer
(compose(access,edits,edit,...patriate)
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&wait(1000)(fail).then(exit)
)(source,true);
 if(next)
 return compose.call
({source:module,format:{json:"json"}[syntax]||"module",shortCircuit:true}
 // persist shortCircuit on scope to support loading from source while bundling. 
,[target,"module"],refer,slip(scope),merge,target,"module"
);
 return module;
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
{if(globalThis.DecompressionStream)
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
 let file=string(buffer)&&buffer;
 let [zip,tar]=file?[/\.(gz|zip)$/,/\.tar$/].map(pattern=>pattern.test(buffer)):[];
 if(file)
 buffer=await access(buffer,"binary");
 if(buffer instanceof Error)
 throw buffer;
 if(zip)
 return new Promise((resolve,reject)=>
 import("zlib").then(({gunzip})=>gunzip(buffer,(fail,buffer)=>fail?reject(fail):resolve(buffer))));
 let stream=await import("stream").then(({Duplex})=>
 [new Duplex(),buffer,null].reduce((duplex,buffer)=>(duplex.push(buffer),duplex)));
 let extractor=await import("./isaacs_2011_node-tar.js").then(({Parser})=>new Parser());
 let folder={};
 let prefix="extracting ";
 let pathspace=process.stdout.columns-prefix.length;
 await new Promise((resolve,reject)=>Object.entries(
 {entry(entry)
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
 }).reduce((stream,[event,action])=>
 stream.on(event,action)
,(process.stdout.write(prefix),stream.pipe(extractor))));
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
 return fs.writeFile(file,...typeof content==="boolean"?[encoding,'utf8']:[content,encoding]).then(written=>file);
 let buffer=await fs.readFile(file);
 if(["binary",1].includes(encoding))
 return buffer;
 if(encoding===true)encoding="utf8";
 content=buffer.toString(encoding);
 if(encoding==="object")
 return JSON.parse(content);
 return content;
};

 export async function list(file,recursive=true,exclude=[])
{if(!/\/$/.test(file))
 file=file.replace(/$/,"/");
 let {promises:fs}=await import("fs");
 let files=await fs.readdir(file,{withFileTypes:true});
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
{if(!path)throw Error("Unspecified persistence target");
 if(!(body instanceof Buffer))
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
 if(!(descriptor instanceof Error))
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

 export const purge=path=>import("fs").then(({promises:{rm}})=>
 rm(path,{recursive:true})).then(done=>path);

 export var compile=compose(drop(1),load,parse,serialize);

 export async function modularise(resource,identifier,context={})
{// uses --experimental-vm-modules 
 let {SourceTextModule,SyntheticModule,createContext,isContext}=await import("vm");
 let {default:{resolve}}=await import("path");
 let {pathToFileURL}=await import("url");
 identifier=resolve(identifier)
 if(!isContext(context))
 context=createContext({imports:new Map(),URL,TextEncoder,TextDecoder,Buffer,global,...context});
 let options=
 {identifier,context
 ,importModuleDynamically:identifier=>import(identifier)
 ,initializeImportMeta:meta=>Object.assign(meta,{url:pathToFileURL(identifier)})
 ,cachedData:context.imports.get(identifier)
 };
 let module=new SourceTextModule(resource||"",options);
 context.imports.set(identifier,module.createCachedData());
 await module.link((identifier,{context})=>
 /^[a-z]/.test(identifier)
?import(identifier).then(module=>new SyntheticModule(Object.keys(module),function()
{Object.entries(module).reduce((module,entry)=>module.setExport(...entry)||module,this);
},{identifier,context}))
:access(identifier,true).then(source=>
 modularise(source,identifier,context)));
 await module.evaluate().catch(compose(note,exit));
 return module;
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

 export async function delegate(term,...context)
{when(either(string,is(Function),defined(this)&&has(["exports"])))(term);
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
].reduce((message,transfer)=>
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

 export var {jsdom,window,fetch}=globalThis.window?globalThis
:{async jsdom(url)
{let {JSDOM}=await resolve("./domenic_2022_jsdom_rollup.js","default");
 let jsdom=Reflect.construct(JSDOM,["",{url,referrer:url,contentType:"text/html",includeNodeLocations:true,storageQuota:10000000}]);
 return {window,fetch}={window:jsdom.window,fetch:fetch.bind(jsdom.window)};
},async fetch(request,header)
{if(!defined(this))
 exit(Error("No window scope provided for fetch. (call jsdom first)"));
 let {href:address,hostname,path,port}=await resolve("url","parse",string(request)?!/^http/.test(request)
?this.location.origin+await resolve("path","resolve","/",request||"")
:request:request.url);
 if(!compound(request))request=
 {end(response){return Object.assign(this.response,response);}
 ,respond(header){Object.assign(this.response,{header});}
 ,response:{}
 ,url:address,port,method:"get"
 ,...header||{}
 };
 let method=request?.method?.toUpperCase()||"GET";
 let protocol=address.match(/[^:]*/)?.[0];
 let agent=await peer(protocol);
 request={method,hostname,path,port,agent};
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
 ,error:reject
 ,end:infer((end,body)=>redirect
?compose.call({...request,url:location},fetch,respond).then(respond).catch(reject)
:compose(stage,respond)({body:Buffer.concat(body,sum(body.map(({length})=>length))),status,type,headers:response.headers},request)
,body)
 });
})
,tether(observe
,{error(fail){this.destroy();reject(fail);}
 ,timeout(fail){this.destroy();reject(fail);}
 })
,combine(infer("write",String(request.body||"")),"end")
)(protocol))(protocol,request);
}};

 export async function stage(response,request)
{let fail=is(Error)(response);
 let type=!fail?response?.type||mime(response?.nodeName?.toLowerCase()||(either(simple,array)(response)?"json":request.url)):mime("txt");
 let status=response?fail?500:response.status||200:404;
 let success=status<400;
 let headers={"Content-Type":type,...response.headers,get(key){return this[key];}};
 let cookie=response?.cookie;
 let body=wether
([fail,has("nodeName"),something]
,compose(note.bind(1),"message")
,compose(combine(wether(compose("nodeName",is("HTML")),swap("<!DOCTYPE html>"),drop()),"outerHTML"),collect,"","join")
,either("body",crop(1))
)(response);
 let browser="Mozilla/Chrome/Safari/AppleWebKit".split("/").some(has.bind(version(request.headers)||{}));
 if(browser&&type===mime("js"))
 body=await compress(body),headers["Content-Encoding"]="gzip";
 if(response?.nodeName)
 infer(function destroy(node){Array.from(node.childNodes).forEach(destroy),node.remove();})(response);
 // let importing=request.headers?.["sec-fetch-dest"]==="script";
 // if(importing&&type==="json")
 // body="export default "+JSON.stringify(JSON.parse(body.constructor?.name=="Buffer"?body.toString():body))+";"
 //,type="js";
 response=
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
}};
 return response;
};

 export var peer=remember(function peer(protocol)
{return resolve(protocol,"Agent",{keepAlive:true,timeout:5*60*1000});
},protocol=>protocol);

 export var digest=compose
(combine(infer(),response=>response.headers.get("Content-Type")?.split("/")[1])
,{json:"json",csv:compose("text",records),pdf:"arrayBuffer"}
,(response,mime,parse)=>infer.call(response,parse[mime]||
 compose("text",text=>mime==="xml"||text.startsWith?.("<?xml ")
?new window.DOMParser().parseFromString(text,"application/xml")
:text))
);

 export async function spawn(command, ...context)
{// bound scope defines output color: undefined=quiet, other=default
 note.call(3,command, ...context, "...");
 let process = await resolve("child_process", "spawn", command, context);
 let streams = ["out", "err"].map((stream) => process["std" + stream]);
 if(this)
 streams.forEach((stream,index,[out])=>stream.on("data", (data) => console[index?"error":"log"](data.toString("utf8"))));
 return new Promise((resolve, reject)=>process.on("exit", (exit) => (exit ? reject(Error(exit)) : resolve())));
};

 export var mime=compose
(infer("match",/[^\.]*$/),either("0",infer())
,{text:{plain:["txt"],javascript:["js","cjs"],typescript:["ts"],"":["html","css","csv"]}
 ,image:{jpeg:["jpg","jpeg"],"x-icon":"ico","svg+xml":"svg","":["gif","png"]}
 ,audio:{mpeg:"mp3"}
 ,font:{ttf:"ttf"}
 ,application:{xml:["gexf"],"":["json","pdf","xml"]}
 }
,(extension,mime)=>
 Object.entries(mime).reduce((mime,[type,subtypes])=>mime||
 Object.entries(subtypes).reduce((mime,[subtype,extensions])=>mime||
 [extensions].flat().includes(extension)&&
 [type,subtype||extension]
,mime)
,undefined)||
 Object.entries(mime)[0].reduce((type,subtype)=>[type,Object.keys(subtype)[0]])
,infer("join","/")
);

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
