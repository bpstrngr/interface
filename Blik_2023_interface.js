 import path from "path";
 import { promises as fs } from "fs";
 import {Parser} from "./isaacs_2011_node-tar.js";
 import { infer, compose, record, provide, wait, string, defined } from "./Blik_2023_inference.js";
 import { merge, stringify, search } from "./Blik_2023_search.js";
 import {parse,sanitize,serialize,modularise,compile,test} from "./Blik_2023_meta.js";
 export const address=new URL(import.meta.url).pathname;
 export const location = path.dirname(address);
 export const file=path.basename(address);

 if(!globalThis.window)
 if(process.execArgv.some(flag=>new RegExp("^--import[= ][^ ]*"+file).test(flag)))
 // nodejs 20.7.0 compatibility. 
 Promise.all(["module","worker_threads"].map(module=>
 import(module))).then(([{register},{MessageChannel}])=>
 [new MessageChannel(),import.meta.url].reduce(({port1,port2},parentURL)=>
 register(address,{parentURL,data:{socket:port2},transferList:[port2]})));
 if(!process.execArgv.some(flag=>new RegExp("^--loader[= ][^ ]*"+file).test(flag)))
 // nodejs 16 backwards compatibility. 
 compose(...process.argv.slice(2),resolve,console.log);

 var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",underscore:"\x1b[4m", blink:"\x1b[5m", reverse:"\x1b[7m",invisible:"\x1b[8m", black:"\x1b[30m", red:"\x1b[31m", green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m", magenta:"\x1b[35m",cyan:"\x1b[36m", white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};

 export function note(...context)
{// console.log with return value.
  let stack = Error().stack.split("\n");
  let location = stack[2] || stack[1];
  if(/^ *at infer /.test(location))
  location = stack[5];
  location = location.replace(/^ */, "");
  let stream=console[this?"warn":"log"];
  stream("\x1b[36m" + location + ":\x1b[0m");
  let steady=colors.steady;
  let phase=colors[this]||Object.values(colors)[this]||steady;
  process.stdout.write(phase);
  stream(...context);
  process.stdout.write(steady);
  return provide(...context);
} 

 export async function prompt(...context)
{// request context from client interface, 
 // or offer it to the client (syncing the cli 
 // with debugPort and customizing it don't work yet). 
 let {createInterface}=await import("readline");
 let {stdin:input,stdout:output}=process;
 let socket=await import("net").then(({connect})=>connect(process.debugPort));
 let prompt="\x1b[31m"+process.versions.node+": \x1b[0m";// regexp bracket matching: ]]
 let inspector=await createInterface({input,output:socket,prompt});
 return inspector.question(prompt,console.log);
 let repl=await import("repl");
 return (
[{input,output,prompt}
,{input:socket,output,prompt}
].map(options=>repl.start(options)));
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
 let directory=/\/$/.test(path);
 if(directory)return fs.mkdir(path).catch(fail=>fail).then(done=>path);
 let transaction=force?fs.appendFile:fs.writeFile;
 let descriptor=await fs.open(path,"wx").catch(fail=>fail);
 process.stdout.clearLine();
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

 export async function access(file, encoding, content)
{// access folder/file's metadata, content with specified encoding, or overwrite its content.
 if(file.startsWith("http"))
 return request(file);
 if (/^file:\/\//.test(file))
 file = new URL(file).pathname;
 if (!encoding)
 return fs.stat(file);
 if(/\/$/.test(file))
 return fs.readdir(file,{withFileTypes: true});
 if (content)
 return fs.writeFile(file, ...typeof content==="boolean"?[encoding, 'utf8']:[content, encoding]).then((written) => file);
 let buffer=await fs.readFile(file);
 if(encoding === "binary")
 return buffer;
 if(encoding===true)encoding="utf8";
 content=buffer.toString(encoding);
 if(encoding === "object")
 return JSON.parse(content);
 return content;
}

export async function list(file, recursive = true, exclude = []) {
  if (!/\/$/.test(file)) file = file.replace(/$/, "/");
  let files = await fs.readdir(file, { withFileTypes: true });
  let entries = await files.reduce(
    record(
      (entry) =>
        exclude.includes(entry.name) ||
        Promise.resolve(
          entry.isDirectory() ? (recursive ? list(file + entry.name + "/") : {}) : undefined
        ).then((content) => [entry.name, content])
    ),
    []
  );
  return Object.fromEntries(entries);
}

export const purge = (path) => fs.rm(path, { recursive: true }).then((done) => path);

 export async function require(path)
{// to be deprecated in favor of commonjs compilation. 
 let instance=globalThis.require||require.instance;
 //path=new URL(note(path)).pathname;
 if(instance)
 return instance(path);
 require.instance=await import("module").then(({createRequire})=>createRequire(import.meta.url));
 return require.instance(path);
};

// https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize({socket}){socket.postMessage("Module interface ready.");}

 export async function resolve(source,context,next)
{// import module from source, infer context if provided. 
 // use as --loader module to do for each import. 
 // (https://nodejs.org/api/esm.html#esm_loaders).
 if(Array.isArray(source))
 return source.reduce(record(source=>resolve(source,context,next)),[]);
 if(typeof source==="object")
 return source;
 let internal=context?.parentURL;
 let loading=next?.name==="nextResolve";
 let command=!loading||!internal;
 let target=internal?decodeURI(new URL(internal).pathname):address;
 let relation=path.dirname(target);
 let absolute=/^file:/.test(source)?new URL(source).pathname:/^\//.test(source)?source:path.resolve(relation,source);
 let module=command?import(source):next(source,context).catch(async function recover(fail)
{let index={ERR_MODULE_NOT_FOUND:0,ERR_UNSUPPORTED_DIR_IMPORT:1}[fail.code];
 let immediate=fail.message.includes("'"+absolute+"'");
 let recovery=
[immediate?retrieve.bind(unbundled):redirect
,immediate&&function enter(absolute)
{return ["js","ts","d.ts"].map(extension=>
 path.join(absolute,"index."+extension)).reduce((file,source)=>
 file.catch(fail=>access(source).then(file=>source))
,Promise.reject());
}
][index]||Promise.reject.bind(Promise,fail);
 return recovery(absolute,target).then(source=>
 string(source)?resolve(source,context,next):source).catch(reason=>
 note.call(1,recovery.name,"failed for",absolute+":\n",reason)&&
 exit(fail));
});
 let bundle=unbundled.find(depot=>absolute.startsWith(depot));
 if(bundle)
 module=compose(module,{format:path.basename(bundle.replace(/\/$/,".js"))},1,merge).catch(exit);
 if(loading&&internal)
 return module;
 let client=loading&&!internal;
 [source,...context]=client?process.argv.slice(1):Array.from(arguments);
 let term=context.length?[context.shift(),Reflect.get]:[];
 return compose(module,...term,infer.bind(null,provide(...context)),terms=>
 client?compose(terms,note,wait.bind(0,10*60*1000*0),process.exit):terms);
};

 var unbundled=[];

 async function retrieve(absolute)
{// bundle if not found despite source entry, 
 // load source if source entry already downloaded for bundling (eg. imported by bundler/parser/serializer). 
 if(!defined(this))exit([retrieve.name,"requires bound array to track unbundled source imports."].join(" "));
 let {default:modules}=await import("./Blik_2023_sources.json", {assert:{type:"json"}});
 let target=absolute.replace(/\.js$/, "/");
 let relative=path.relative(location,absolute);
 let definition=modules[relative];
 let entry=typeof definition!=="object"||Array.isArray(definition);
 let sources=Object.entries(definition?entry?[definition]:definition:{}).flatMap(function sortentry([remote,input],index)
{if(remote==index)remote=undefined;
 if(typeof input!=="object"||Array.isArray(input))
 return {remote,input:[input].flat()};
 return Object.entries(input).map(([branch,input])=>({remote,branch,input:[input].flat()}));
});
 if(sources.length)
 return compose(sources[0],({remote,input})=>
 // presence of first source entry indicates in-progress assembly. 
 path.resolve(location,...remote?[target,"0"]:[],input[0])
,file=>access(file).then(async present=>(
 this.includes(target)||this.push(target)&&
 note.call(3,"Accessing source entry for \""+relative+"\":\n "+file+"\n (bundling already in progress or interrupted before purge)")
,resolve("url","pathToFileURL",file).then(({href:url})=>({url,format:relative,shortCircuit:true}))))).catch(async fail=>
 assemble(sources,absolute));
 let sloppy=!/\.(js|json)$/.test(absolute)&&
 await ["js","ts","d.ts"].map(extension=>absolute+"."+extension).reduce((module,file)=>
 module.catch(fail=>access(file).then(present=>file))
,Promise.reject()).catch(fail=>false);
 return sloppy||exit(Error("no source entry for "+absolute));
}

 async function redirect(absolute,target)
{// find potential alias in bundle definition. 
 let {default:modules}=await import("./Blik_2023_sources.json");
 let source=path.relative(path.dirname(target),absolute);
 let [format,definition]=Object.entries(modules).find(([target,definition])=>
 Object.values(typeof definition!=="object"||Array.isArray(definition)?[definition]:definition).some((source,index)=>
 absolute.startsWith(path.join(location,target.replace(/\.js$/,""),String(index)))))||[];
 let namespace=definition&&Object.values(search.call([definition],({1:entry})=>
 Array.isArray(entry)||typeof entry==="string")).flat().find(entry=>entry.alias);
 let alias=namespace?.alias[source];
 return alias?path.resolve(location,alias):exit(Error("no alias for "+source+" in "+target));
};

 async function assemble(sources,target)
{let deposit=target.replace(/\.js$/,"/")
 await persist({},deposit);
 let input = await sources.reduce(record(async function({ remote, branch, input }, index, {length}={})
{if(!remote)return input.map(input=>string(input)?path.join(deposit,input):input);
 let depot=path.join(deposit,String(index))+"/";
 let [protocol, host, author, name, ...route] = remote?.match(/(.*:\/\/)(.*)/).slice(1).reduce((protocol, address) =>
 [protocol, ...address.split("/")])||[];
 let compressed=route[0]==="tarball"||!["github.com"].some(host.includes.bind(host));
 let address = protocol + [host, author, name, ...compressed?route:[]].join("/");
 let asset=depot.replace(/\/$/,".tar.gz");
 let local=await access(depot,false).catch(fail=>false);
 if(!local&&remote)
 // download. 
 compressed
?await access(asset).catch(fail=>
 compose(remote,fetch,response=>response.status===200
?response.arrayBuffer().then(buffer=>persist(Buffer.from(buffer),asset)).catch(fail=>access(asset))
:exit(response.status))).then(compressed=>
 compose({},depot,persist).then(ready=>
 compose(asset,decompress,depot,decompress)).then(ready=>
 compose(asset,purge)))
:await checkout(address, depot, branch, route).catch(fail=>fail).then(done=>
 access(depot,false).then(done=>note.call(2,"Source downloaded:",address,"->",depot)).catch(fail=>exit(done)));
 let relation=remote?depot:location;
 let entries=await [input].flat().reduce(record(input=>typeof input==="string"
?Promise.resolve(/\/$/.test(input)
?access(path.join(relation, input), true).then(files=>
 files.map(({name})=>path.join(input,name)).filter(name=>/\.js$/.test(name)))
:[input]).then(input=>input.map(input=>path.join(relation, input)))
:input)
,[]);
 let {source = [], format = [],patches = []} = [entries.flat()].flat().map(function sort(part)
{let field =typeof part == "string" ? (/\.patch$/.test(part) ? "patches" : "source") : "format";
 return { [field]: [part] };
}).reduce((entries,entry)=>merge(entries,entry,0), {});
 format=format.reduce(merge,{});
 await patch(path.dirname(source[0]), patches);
 await [format.scripts].filter(Boolean).flat().reduce(record(script=>
 resolve(path.resolve(path.dirname(target),script)).then(({default:module})=>module).catch(note))
,[]);
 let part=await bundle(source,format);
 return access(length > 1 ? path.dirname(depot) + "_" + index + ".js" : target,part,true).then(file=>
 note.call(2,file,"bundle ready.")&&file);
}),[]).catch(fail=>purge(deposit).finally(exit.bind(null,fail)));
 return Promise.resolve(input.length>1
?bundle(input.flat()).then(content=>access(target,content,true))
:target).finally(target=>purge(deposit));
}

 export async function load(source,context,next)
{// access source as module specifier, ie. 
 // compose(source,true,access,interpret,format,sanitize,serialize,modularize). 
 let version=process.versions.node.split(".")[0];
 if(string(context))context={format:context};
 let {importAssertions:assertion={},format}=context||{};
 let syntax=assertion?.type||mime(source)?.replace(/.*\//,"");
 if(syntax==="json"&&format!==syntax)
 Object.assign(context,{format:format=syntax});
 if(format==="json"&&assertion.type!==format)
 // bypasses need for static import assertions. 
 Object.assign(assertion,{type:format});
 if(format!=="builtin"&&/^node:/.test(source))
 // builtin format is sometimes omitted by nodejs. 
 Object.assign(context,{format:format="builtin"});
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await require(new URL(source).pathname).catch(fail=>
 Object.assign(context,{format:format="module"}));
 let native=["json","module","wasm","builtin","commonjs"].includes(format);
 if(native&&next)
 return next(source,context).then(module=>module.format==="module"
 //read(source).then(module=>modularise(module,source)).then(({namespace:module})=>prove.call(module,module.proof))
 // dispatch new import thread for tests until modularization halts on self-referential imports. 
?import(source).then(module=>module.tests&&test(source).then(result=>console.log("\x1b[4m"+source+"\x1b[0m:\n"+result)))&&module
:module);
 let {comment,...definition}=[{syntax},typeof format==="object"?format:await import("./Blik_2023_sources.json").then(sources=>
 [sources.default[format]||{}].reduce(function flat(entries,source)
{return [entries,typeof source!=="object"||Array.isArray(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(entry=>typeof entry==="object"))].flat().reduce(merge);
 syntax=definition.syntax;
 let foreign=!["javascript","json"].includes(syntax)||Object.keys(definition).length>1;
 // parse foreign to serialize standard syntax. without native interpretter to call (next), all syntax are foreign. 
 // using acorn's Parser methods (parse) until interpretation reducer is complete. 
 let patriate=foreign?[syntax,{source},parse,definition,sanitize,serialize]:[];
 let edits=Object.fromEntries(Object.entries(definition.edit||{}).flatMap(([field,value])=>
 string(value)?[[field,value]]:source.endsWith(field)?Object.entries(value):[]));
 source=await compose(source,true,access,edits,edit,...patriate).catch(fail=>
 note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&exit(fail));
 return next?{source,format:{json:"json"}[syntax]||"module",shortCircuit:true}:source;
};

 export function edit(source,edits)
{return Object.entries(edits||{}).reduce((source, [field,value]) =>
 source.replace(new RegExp(field,"g"),(match, ...groups) =>
 [value, ...groups.slice(0,-2)].reduce((value, group, index) =>
 value.replace("$"+index, group)))
,source);
};

 export async function bundle(source, format)
{if(!source)return;
 source=[source].flat();
 let relation=path.dirname(source[0])
 let multientry=source.length > 1;
 if(multientry) format["./rollup_2022_multientry.js"]={};
 let plugins = await Object.entries(format).filter(([field])=>
 /^\./. test(field)).reduce(record(([plugin,settings])=>resolve(plugin, "default", settings)),
[{name:"interface"
 ,transform:(source,address)=>
 compose("url","pathToFileURL",address,resolve,"href",Reflect.get
,{format:merge(
 {alias:Object.fromEntries(Object.entries(format.alias||{}).map(([source,alias])=>
 [source,/^\./.test(alias)
?[relation,path.resolve(location,alias)].map(address=>
 path.relative(location,address).split("/")).reduce(([bundle],[route])=>
 // aliases are relative to location, so offset them to resolve statically from the bundle entry, unless they resolve internally. 
 route!==bundle?"./"+path.relative(location,path.resolve(relation,alias)):alias)
:alias]))
 },format,false)
 }
,load,code=>({code,map:{mappings:''}}))
 ,resolveId:(source,client)=>client
?Object.values(format.alias||{}).includes("./"+path.relative(relation,path.resolve(path.dirname(client),source)))
?false
:/^\./.test(source)
?["",".ts","/index.ts"].map(extension=>
 path.resolve(path.dirname(client),source.replace(/\/$/,"")+extension)).reduce((source,alias)=>
 source.then(source=>source||access(alias).then(file=>file.isDirectory()?exit():alias).catch(fail=>null))
,Promise.resolve(null))
:null
:null
 }
]);
 note.call(3,"bundling " + source + "...");
 let { rollup } = await import("./rollup_2022_rollup.js");
 let input=multientry ? { include: source } : source[0];
 let bundle=await rollup({input,plugins,...format.input});
 let {output:[{code}]}=await bundle.generate({ format: "module", inlineDynamicImports: true, ...format.output });
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
  clone=await spawn("git","-C", target, "sparse-checkout", "add", path.join("/"));
  if(!commit&&branch)
  clone=await spawn("git","-C", target, "checkout", branch);
  return clone;
}

export function patch(repository, patch) {
  return [patch].flat().reduce(
    record((patch) => spawn("git", "-C", path.resolve(repository), "apply", path.resolve(patch))),
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
{process.stdout.cursorTo(prefix.length);
 process.stdout.clearLine(1);
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
},close(){console.log("\nextracted "+ target+".");resolve(folder)}
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

export async function spawn(command, ...context) {
  note.call(3,command, ...context, "...");
  let process = await resolve("child_process", "spawn", command, context);
  let streams = ["out", "err"].map((stream) => process["std" + stream]);
  streams.forEach((stream,index,[out]) => stream.on(
    "data", (data) => console.log(data.toString("utf8")))
  );
  return new Promise((resolve, reject) =>
    process.on("exit", (exit) => (exit ? reject(Error(exit)) : resolve()))
  );
}

export function exit(fail) {
  throw fail;
}

 export function mime(file)
{return compose
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
}

export var tests = {
  access: [{
    context: [import.meta.url],
    terms: [(value) => typeof value, "object"],
    condition: "equal",
  },{
    context: [import.meta.url,true],
    terms: [(value) => typeof value, "string"],
    condition: "equal",
  }],
};
