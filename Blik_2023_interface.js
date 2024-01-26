 import {Parser} from "./isaacs_2011_node-tar.js";
 import {note,collect,same,slip,something,observe,describe,expect,trace,array,compound,apply,stream,record,provide,tether,differ,wether,pattern,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,match,wait,string,defined,compose,combine,exit} from "./Blik_2023_inference.js";
 import {merge,stringify,search,edit} from "./Blik_2023_search.js";
 import {parse,sanitize,serialize,compile,test} from "./Blik_2023_meta.js";
 import {fetch,forward} from "./Blik_2023_host.js";
 export const address=new URL(import.meta.url).pathname;
 export const location=address.replace(/\/[^/]*$/,"");//path.dirname(address);
 export const file=address.replace(/.*\//,"");//path.basename(address);
 var classified=["*.git*"].map(term=>RegExp("^"+term.replace(/\./g,"\\.").replace(/\*/g,".*")+"$"));
 var sources="./Blik_2023_sources.json";
 var scope={};

 // --import flag registers loader module on separate thread unlike 
 // --loader, where context can be inferred implicitly on the primary thread. 
 let [explicit,implicit]=["import","loader"].map(name=>!globalThis.window&&
 process.execArgv.some(flag=>new RegExp("^--"+name+"[= ][^ ]*"+file).test(flag)));

 if(explicit&&await import("worker_threads").then(({isMainThread})=>isMainThread))
 // register loader thread. 
 await resolve(["module","worker_threads","net"]).then(([{register},{MessageChannel},{connect}])=>
[new MessageChannel()
,new Promise((resolve,reject)=>observe.call(connect(process.debugPort)
,{connect(){resolve(infer.bind(this,"write"))}
 ,error(){resolve()}
 }))
].reduce(({port1,port2},inspect)=>new Promise(proceed=>observe.call(port1
,{message:compose
(drop(1),proceed,swap([],...process.argv.slice(1)),record(function()
{if(!this.length)compose(buffer(resolve),note)(...arguments);
 return true;
})
)})&&
 register(address,import.meta.url,{data:{socket:port2},transferList:[port2]})))).then(note.bind(3));

 if(!explicit&&!implicit)
 // without either, context just begins at second index. 
 initialize({context:process.argv.slice(2)});

 export var classify=compose(when(either(pattern,infer("every",pattern))),file=>
 [file].flat().forEach(file=>
 classified.push(file)));

 export var permit=(name,classified)=>!classified.some(term=>term.test(name));

 export default
{async get(request,mode)
{mode=request.query?.mode||"binary";
 if(typeof request!="object")
 request={url:request};
 if(/^http/.test(request.url))
 return forward(request.url,request);
 let scope=await module(this||{});
 let path=await import("path");
 let address=request.url.replace(/^\//,"./");
 if(!permit(address,classified))
 throw Error("Classified");
 let file=await access(address);
 if(!file.isDirectory())
 return access(address,1);
 scope=await list(address,true,classified);
 return scope;
}
,put:async function(request)
{let url=path.join(...request.path);
 return await persist(request.body,url,request.query?.force)
}
,delete:async function(request)
{let address=Object.fromEntries(request.headers.origin.split(/:\/+|:/g).map((path,index)=>
 [["protocol","hostname","port"][index],path+(!index?":":"")]));
 let [match,authority]=request.headers.cookie.match(/authority=([^;]*);/)||[];
 let get=path=>new Promise(resolve=>import(address[0].substring(0,-1)).then(({request})=>
 request(note({...address,path,method:"get"}),response=>
 response.setEncoding("utf8").on("data",compose(JSON.parse,resolve))).end())).then(note)
 let {author}=authority&&await get("/authority/"+authority);
 let {rank}=author&&await get("/mind/"+author);
 if(rank!="ranger")
 return Error("unauthorised");
 return purge(path.resolve(...request.path));
}
};

 export async function access(file, encoding, content)
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
 return fs.writeFile(file,...typeof content==="boolean"?[encoding,'utf8']:[content,encoding]).then((written)=>file);
 let buffer=await fs.readFile(file);
 if(["binary",1].includes(encoding))
 return buffer;
 if(encoding===true)encoding="utf8";
 content=buffer.toString(encoding);
 if(encoding==="object")
 return JSON.parse(content);
 return content;
}

 export async function list(file,recursive=true,exclude=[])
{if(!/\/$/.test(file))file=file.replace(/$/,"/");
 let {promises:fs}=await import("fs");
 let files=await fs.readdir(file,{withFileTypes:true});
 let entries=await files.reduce(record((entry)=>
 exclude.some(exclusion=>RegExp(exclusion).test(file+entry.name))
?[]
:Promise.resolve(entry.isDirectory()
?recursive?list(file+entry.name+"/",recursive,exclude):{}
:function(){console.log(entry)}).then((content)=>[entry.name,content]))
,[]);
 return Object.fromEntries(entries);
}

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
 close=descriptor.close.bind(descriptor);
 if(!append)
 truncate=await descriptor.truncate().catch(fail=>fail).finally(close);
 if(truncate instanceof Error)throw truncate;
 let fail=transaction.call(descriptor,body,"utf-8").catch(fail=>fail).finally(close);
 if(fail instanceof Error)
 throw fail;
 return path;
};

export const purge=path=>import("fs").then(({promises:{rm}})=>
rm(path,{recursive:true})).then(done=>path);

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

// https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize({socket})
{socket?.postMessage("Module loader registered:\n"+import.meta.url);
};

 let precedent=compose(crop(1),"resolve",collect,search.bind(scope));
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
 source.startsWith(field)&&is(Promise)(module)))
,infer("replace",/.*\//,""),".js",collect,infer("join","")
);
 let format=compose
(combine(infer(),compose(swap(sources),"default",resolve,Object.keys)),(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$/,"")].join("/"))),"format",describe
);
 let modulepath=when(is(match(/^[\/\.]/),not(match(RegExp(sources+"$")))));
 let shortcircuit=compose
(combine(infer(),either(compose(respecify,modulepath,format),swap({}))),merge
,{shortCircuit:true},merge,"resolve",describe
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
 if(primary&&await import("worker_threads").then(({isMainThread})=>!isMainThread))
 // suppress primary import on loader thread (registered with --import) in favor of explicit inference with context available only on main. 
 return next("worker_threads",context);
 let target=internal?decodeURI(new URL(internal).pathname):address;
 let relation=target.replace(/\/[^/]*$/,"");
 let [url,path]=[/^file:/.test(source),/^[\/\.]/.test(source)];
 let absolute=await wether
([url,path]
,source=>resolve("url","fileURLToPath",source)
,source=>resolve("path","resolve",relation,source)
,infer()
)(source);
 //if(url||path)console.log("\x1b[36m"+internal+"\x1b[0m\n"+source)
 if(internal)
 merge(scope,{[target]:{imports:new Set([absolute])}},0);
 let invoke=infer(Function.call,scope,absolute,target);
 let proceed=infer(resolve,context,next);
 let discard=wether(same(absolute),compose(context,next),compose(drop(-1),exit));
 let module=command?import(source):compose
(either(precedent,next,compose(recovery,invoke,proceed),compose(backtrack,discard))
,shortcircuit,{imports:new Set()},merge
,absolute,describe,slip(scope),merge
,[absolute,"resolve"],tether(search)
)(absolute,context);
 if(loading&&internal)
 return module;
 [source,...context]=primary?process.argv.slice(1):Array.from(arguments);
 let suspense=primary&&!process.execArgv.includes("--watch")?10*60*1000:0;
 return compose(infer(...context),terms=>
 primary?compose.call(terms,note,wait(suspense),swap(0),process.exit):terms)(module);
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
(entries,([{remote,input}])=>path.resolve(location,...remote?[target,"0"]:[],input[0])
,combine(infer(),wether
(buffer(access,drop())
 // source entry indicates available re-import, or incomplete assembly to await/report. 
,entry=>either.call(this,entry,wether(differ(target),expect(entry),swap(null)))
 // target entry indicates assembly outpaced by re-import, otherwise begin. 
,entry=>either.call(this,target,compose
(swap(2),"Collecting source of \""+relative+"\" for",dependent+"...",tether(note),swap(this)
 // expose assembly promise to inform redirects to source, and retries in case of their unlikely outpace by its purge. 
,scope=>merge(scope,{[target]:entries.reduce(record(assemble),[]).catch(fail=>purge(target).finally(done=>exit(fail)))})
,target//,combine(infer(),([{source}])=>resolve(source))
 // not returning bundle promise after assembly to unblock immediate resolution from source. 
,parts=>void(compose.call
(parts.reduce(record(({source,format})=>bundle(source,format)),[])
,infer("reduce",record((bundle,index,{length})=>length>1?access(absolute.replace(/\.js/,"_"+index+".js"),bundle,true):bundle),[])
,input=>input.length>1?bundle(input.flat()):input
,content=>access(absolute,content,true)
,"bundle ready.",note.bind(2)
).finally(done=>purge(target)))
))
))
,combine(infer(),(entry,reference)=>!something(reference)&&
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
 compose.call(remote,buffer(expect(fetch,0,3),compose(remote,note,exit)),response=>response.status===200
?response.arrayBuffer().then(buffer=>persist(Buffer.from(buffer),asset)).catch(fail=>note(fail)&&access(asset))
:exit(response.status))).then(compressed=>
 compose.call({},depot,persist,swap(asset),decompress,depot,decompress,swap(asset),purge))
:await checkout(address,depot,branch,route).catch(note.bind(1)).then(done=>
 access(depot,false).then(done=>note.call(2,"Source downloaded:",address,"->",depot)).catch(fail=>exit(done)));
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
,[]).catch(combine(note,exit));
 return {source,format};
};

 export async function load(source,context,next)
{// access source as module specifier, ie. 
 // compose(source,true,access,interpret,format,sanitize,serialize,modularize). 
 //let version=process.versions.node.split(".")[0];
 let target=/^file:/.test(source)?await resolve("url","fileURLToPath",source):source;
 let precedent=scope[target]?.module;
 if(precedent&&next?.name==="nexLoad")return precedent;
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
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await require(target).catch(fail=>
 Object.assign(context,{format:format="module"}));
 let native=["json","module","wasm","builtin","commonjs"].includes(format);
 if(native&&next)
 return compose.call
(source,context,next
 // native modules don't need shortCircuits to be tracked on scope. 
//,[source,"module"],describe,slip(scope),merge,source,"module"
,module=>module.format==="module"
 //read(source).then(module=>modularise(module,source)).then(({namespace:module})=>prove.call(module,module.proof))
 // dispatch new import thread for tests until modularization halts on self-referential imports. 
?import(source).then(module=>module.tests&&
 test(source).catch(fail=>fail).then(result=>
 console.log("\x1b[4m"+source+"\x1b[0m:\n"+result)))&&module
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
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&exit(fail)
)(source,true);
 if(next)
 return compose.call
({source:module,format:{json:"json"}[syntax]||"module",shortCircuit:true}
 // persist shortCircuit on scope to support loading from source while bundling. 
//,[target,"module"],describe,slip(scope),merge,target,"module"
);
 return module;
};

 export async function bundle(source,format)
{if(!source)return;
 source=[source].flat();
 let path=await import("path");
 let relation=path.dirname(source[0])
 let multientry=source.length > 1;
 if(multientry)format["./Harris_2015_multientry.js"]={};
 let plugins=await Object.entries(format).filter(([field])=>
 /^\./.test(field)).reduce(record(([plugin,settings])=>resolve(plugin,"default",settings)),
[{name:"interface"
 ,transform:(source,address)=>
 multientry&&address.endsWith("virtual:multi-entry.js")
?false
:stream("url","pathToFileURL",address,resolve,"href",Reflect.get
,{format:merge(
 {alias:Object.fromEntries(Object.entries(format.alias||{}).map(([source,alias])=>
 [source,/^\./.test(alias)
?[relation,path.resolve(location,alias)].map(address=>
 path.relative(location,address).split("/")).reduce(([bundle],[route])=>
 // aliases are relative to "location", so offset them to resolve statically from the bundle entry, unless they route internally. 
 route!==bundle?"./"+path.relative(location,path.resolve(relation,alias)):alias)
:alias]))
 },format,false)
 }
,load,code=>({code,map:{mappings:''}}))
 ,resolveId:(source,client)=>client
?Object.values(format.alias||{}).includes("./"+path.relative(relation,path.resolve(path.dirname(client),source)))||
 multientry&&source.endsWith("virtual:multi-entry.js")
?false
:/^\./.test(source)
?["","/index.js","/index.ts",".js",".ts"].map(extension=>
 path.resolve(path.dirname(client),source.replace(/\/$/,"")+extension)).reduce((source,alias)=>
 source.then(source=>source||access(alias).then(file=>file.isDirectory()?exit():alias).catch(fail=>null))
,Promise.resolve(null))
:null
:null
 }
]);
 note.call(3,"bundling "+source+"...");
 let {rollup}=await import("./Harris_2015_rollup.js");
 let input=multientry?{include:source}:source[0];
 let bundle=await rollup({input,plugins,...format.input});
 let {output:[{code}]}=await bundle.generate({format:"module",inlineDynamicImports:true,...format.output});
 return code;
}

export async function checkout(remote, target, branch, path) {
  // git clone remote branch to target, restricted to subfolder if present. (to be replaced with js-git)
  if (!/^http/.test(remote))
    return fs
      .cp(remote, target, { dereference: true, recursive: true })
      .then((copy) => branch && spawn("git", "-C", target, "checkout", branch));
  let commit=branch.length===40&&!/[^a-z0-9]/.test(branch);
  let clone = await spawn(
    "git",
    "clone",
    "--depth=1",
    ...path.length?["--no-checkout","--sparse","--filter=tree:0"]:[],
    ...commit?["--no-checkout","-c","remote.origin.fetch=+"+branch+":refs/remotes/origin/"+branch]:branch?["--single-branch","--branch",branch]:[],
    remote,
    target
  );
  if(commit)
  clone=await spawn("git","-C",target,"checkout",branch);
  if(!path.length)
  return clone;
  clone=await spawn("git","-C", target, "sparse-checkout", "add", ...[path.join("/").split(" ")].flat());
  if(!commit&&branch)
  clone=await spawn("git","-C", target, "checkout", branch);
  return clone;
}

export function patch(repository, patch) {
  return [patch].flat().reduce(
    record((patch) => spawn("git", "-C", repository, "apply", patch)),
    []
  );
}

 export async function decompress(file,target)
{let [zip,tar]=[/\.(gz|zip)$/,/\.tar$/].map(pattern=>pattern.test(file));
 let buffer=file instanceof Buffer?file:await access(file,"binary");
 if(buffer instanceof Error)
 throw file;
 if(zip)
 return new Promise((resolve,reject)=>
 import("zlib").then(({gunzip})=>gunzip(buffer,(fail,buffer)=>fail?reject(fail):resolve(buffer))));
 let stream=await import("stream").then(({Duplex})=>
 [new Duplex(),buffer,null].reduce((duplex,buffer)=>(duplex.push(buffer),duplex)));
 let extractor=new Parser();
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

 export async function spawn(command, ...context)
{// bound scope defines output color: undefined=quiet, other=default
 note.call(3,command, ...context, "...");
 let process = await resolve("child_process", "spawn", command, context);
 let streams = ["out", "err"].map((stream) => process["std" + stream]);
 if(this)
 streams.forEach((stream,index,[out])=>stream.on("data", (data) => console[index?"error":"log"](data.toString("utf8"))));
 return new Promise((resolve, reject)=>process.on("exit", (exit) => (exit ? reject(Error(exit)) : resolve())));
}

 export function mime(file)
{return stream
(file.match(/\.([^\.]+)$/)?.[1]
,{text:{plain:["txt"],javascript:["js","cjs"],typescript:["ts"],"":["html","css"]}
 ,image:{jpeg:["jpg","jpeg"],"x-icon":"ico","svg+xml":"svg","":["gif","png"]}
 ,audio:{mpeg:"mp3"}
 }
,(extension,mime)=>extension
?Object.entries(mime).reduce((mime,[type,subtypes])=>mime||
 Object.entries(subtypes).reduce((mime,[subtype,extensions])=>mime||
 [extensions].flat().includes(extension)&&
 [type,subtype]||
 mime
,mime)
,undefined)||
 ["application",extension]
:undefined
,terms=>terms?.join("/")
);
};

 export function module(source)
{//return JSON.parse(JSON.stringify(source));
 return Object.fromEntries(Object.entries(source.default||source).map(([key,value])=>
 [key,value&&typeof value=="object"?module(value):value?value.toString():value]))
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
