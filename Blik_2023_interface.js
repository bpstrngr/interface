 import path from "path";
 import stream from "stream";
 import {EventEmitter} from "events";
 import { promises as fs } from "fs";
 import { infer, compose, record, provide, wait, string } from "./Blik_2023_inference.js";
 import { merge, stringify, search } from "./Blik_2023_search.js";
 import {parse,sanitize,serialize,compile} from "./Blik_2023_meta.js";
 export const address=new URL(import.meta.url).pathname;
 export const location = path.dirname(address);
 export const file=path.basename(address);

 if(!globalThis.window)
 if(!process.execArgv.some(flag=>new RegExp("^--loader[= ][^ ]*"+file).test(flag)))
 compose(...process.argv.slice(2),resolve,console.log);

 var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m"};

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

// https://nodejs.org/api/esm.html#esm_loaders 

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
 let module=command?import(source):next(source,context).catch(async function recover(fail)
{let path=await import("path");
 let relation=context?.parentURL?path.dirname(decodeURI(new URL(context?.parentURL).pathname)):location;
 let absolute=/^file:/.test(source)?new URL(source).pathname:/^\//.test(source)?source:path.resolve(relation,source);
 let immediate=fail.message.match("'"+absolute+"'");
 let recovery=
 {ERR_MODULE_NOT_FOUND:immediate?retrieve:redirect
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate
?absolute=>["js","ts","d.ts"].map(extension=>
 path.join(absolute,"index."+extension)).reduce((file,source)=>
 file.catch(fail=>access(source).then(file=>source))
,Promise.reject())
:exit
 }[fail.code];
 if(!recovery)throw fail;
 return recovery(absolute,relation).catch(fail=>
 exit(console.warn(fail))).then(source=>
 resolve(source,context,next)).catch(
 exit.bind(null,fail));
});
 if(loading&&internal)
 return module;
 let client=loading&&!internal;
 [source,...context]=client?process.argv.slice(1):Array.from(arguments);
 let term=context.length?[context.shift(),Reflect.get]:[];
 return compose(module,...term,infer.bind(null,provide(...context)),term=>term).then(terms=>
 client?compose(terms,note,wait.bind(0,10*60*1000*0),process.exit):terms);
};

 var retrieve=async function(absolute)
{// bundle if not found despite source entry, 
 // load source if source entry already downloaded for bundling (eg. imported by bundler/parser/serializer). 
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
,file=>access(file).then(present=>(
 this.includes(file)||(note.call(3,"Using source entry point for \""+relative+"\":\n"+file+"\n(bundling already in progress or interrupted before purge)"),this.push(file))
,file))).catch(async fail=>
 assemble(sources,absolute));
 let sloppy=!/\.(js|json)$/.test(absolute)&&
 await ["js","ts","d.ts"].map(extension=>absolute+"."+extension).reduce((module,file)=>
 module.catch(fail=>access(file).then(present=>file))
,Promise.reject()).catch(fail=>false);
 return sloppy||exit(Error("no source entry for "+absolute));
}.bind([])

 async function redirect(absolute,relation=location)
{// find potential alias in bundle definition. 
 let {default:modules}=await import("./Blik_2023_sources.json");
 let source=path.relative(relation,absolute);
 let definition=Object.entries(modules).find(([target,definition])=>
 Object.values(typeof definition!=="object"||Array.isArray(definition)?[definition]:definition).some((source,index)=>
 absolute.startsWith(path.join(location,target.replace(/\.js$/,""),String(index)))));
 let namespace=definition?.reduce((target,definition)=>
 Object.values(search.call([definition],({1:entry})=>Array.isArray(entry)||typeof entry==="string")).flat().find(entry=>entry.output));
 let alias=namespace?.output.paths[source];
 return alias?path.resolve(location,alias):exit(Error("no alias for "+source+" in "+relation));
};

 async function assemble(sources,target)
{let deposit=target.replace(/\.js$/,"/")
 await persist({},deposit);
 let input = await sources.reduce(record(async function({ remote, branch, input }, index, {length}={})
{if(!remote)return input.map(input=>path.join(deposit,input));
 let depot=path.join(deposit,String(index))+"/";
 let [protocol, host, author, name, ...route] = remote?.match(/(.*:\/\/)(.*)/).slice(1).reduce((protocol, address) =>
 [protocol, ...address.split("/")])||[];
 let compressed=route[0]==="tarball"||!["github.com"].some(host.includes.bind(host));
 let address = protocol + [host, author, name, ...compressed?route:[]].join("/");
 let asset=depot.replace(/\/$/,".tar.gz");
 let local=await access(depot, false).catch(fail=>false);
 if(!local&&remote)
 // download. 
 compressed
?await access(asset).catch(fail=>
 compose(remote,fetch,response=>response.status===200
?response.arrayBuffer().then(buffer=>persist(Buffer.from(buffer),asset))
:exit(response.status))).then(compressed=>
 compose({},depot,persist).then(ready=>
 compose(asset,decompress,depot,decompress)).then(ready=>
 compose(asset,purge)))
:await checkout(address, depot, branch, route).catch(provide).then(done=>
 access(depot,false).then(done=>note.call(2,"Source downloaded:",address,"->",depot)));
 let relation=remote?path.join(depot,...compressed?[]:route):location;
 let entries=await [input].flat().reduce(record(input=>typeof input==="string"
?Promise.resolve(/\/$/.test(input)
?access(path.join(relation, input), true).then(files=>
 files.map(({name})=>path.join(input,name)).filter(name=>/\.js$/.test(name)))
:[input]).then(input=>input.map(input=>path.join(relation, input)))
:input)
,[]);
 entries=entries.flat();
 let part = length > 1 ? path.dirname(depot) + "_" + index + ".js" : target;
 return bundle(entries, part);
}),[]).catch(fail=>purge(deposit).finally(exit.bind(null,fail)));
 return Promise.resolve(input.length>1
?bundle(input.flat(),target)
:target).finally(target=>purge(deposit));
}

 export async function load(source,context,next)
{// access source as module specifier, ie. 
 // compose(true,access,interpret,format,sanitize,serialize,modularize). 
 let version=process.versions.node.split(".")[0];
 let {importAssertions:assertion,format}=context||{};
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await require(new URL(source).pathname).catch(fail=>Object.assign(context,{format:"module"}));
 if(format==="json"&&assertion.type!==format)
 // bypasses need for static import assertions. 
 Object.assign(assertion,{type:format});
 let module=next?await next(source,context,next).catch(fail=>fail):Error();
 let fail=module instanceof Error;
 if(!fail)
 return (module.format==="module"||typeof module==="string"&&
 //read(source).then(module=>modularise(module,source)).then(({namespace:module})=>prove.call(module,module.proof))
 // dispatch new import thread for tests until modularization halts on self-referential imports. 
 import(source).then(module=>prove.call(module,module.proof).then(proof=>console.log(url+"\n"+proof)))
,module);
 let syntactic=module.constructor.name==="SyntaxError";
 let modular=syntactic&&["import","export"].some(term=>RegExp(term).test(module.message));
 if(modular)
 return load(source,Object.assign(context,{format:"module"}),next);
 let notfound=module.message.startsWith("Cannot find");
 let foreign=!["commonjs","module","builtin"].includes(format);
 let syntax=assertion?.type||mime(source).replace(/.*\//,"");
 let relative=path.relative(location,source);
 let {default:sources}=await import("./Blik_2023_sources.json");
 let definition=notfound
?Object.entries(sources).find(([target,definition])=>
 Object.values(typeof definition==="object"?definition:[definition]).some((source,index)=>
 new URL(source).pathname.startsWith(path.join(location,target.replace(/\.js$/,""),String(index)))))?.[1]
:Object.values(sources[relative]||{}).reduce(function flat(entries,source)
{return [entries,typeof source!=="object"||Array.isArray(source)?source:Object.values(source).reduce(flat,[])].flat();
},[{url:source,syntax}]).filter(entry=>typeof entry==="object").reduce(merge);
 if(definition||!next)
 // parse foreign to serialize standard syntax. without native interpretter to call (next), all syntax are foreign. 
 source=await compose
 // use acorn's Parser methods (parse) until interpret reducer is complete. 
(source,true,access,definition.syntax,{source},parse,definition,sanitize,serialize
).catch(fail=>note.call(1,"Failed to patriate "+definition.syntax+" \""+source+"\" due to",fail)&&exit(fail));
 return next?{source,shortCircuit:true,format:"module"}:source;
};

 export async function require(path)
{// to be deprecated in favor of commonjs compilation. 
 let instance=globalThis.require||require.instance;
 //path=new URL(note(path)).pathname;
 if(instance)
 return instance(path);
 require.instance=await import("module").then(({createRequire})=>createRequire(import.meta.url));
 return require.instance(path);
};

export async function bundle(source, target) {
  if (!source) return;
  let {
    include = [],
    rules = [],
    patches = [],
  } = [source]
    .flat()
    .map(function sort(part) {
      let field =
        typeof part == "string" ? (/\.patch$/.test(part) ? "patches" : "include") : "rules";
      return { [field]: [part] };
    })
    .reduce(merge, {});
  await patch(path.dirname(include[0]), patches);
  let multientry = include.length > 1 && { "@rollup/plugin-multi-entry": {} };
  let { input, output, syntax, typescript, scripts, transform, comment, ...plugins } = rules.reduce(merge, { ...multientry });
  if(scripts)
  await [scripts].flat().reduce(record(
    script=>resolve(path.resolve(path.dirname(target),script)).then(({default: module})=>module).catch(note)
  ),[]);
  plugins = await Object.entries(plugins).reduce(
    record(([plugin, settings]) => resolve(
      plugin, "default", plugin==="@rollup/plugin-alias" && Array.isArray(settings.entries)
        ? settings.entries.map(entry=>entry.find=new RegExp(entry.find)) && settings
        : settings
    )),
    [{async transform(source,address){
      if(/\.ts$/.test(address) && !include.includes(address))
        source = await compile(address, "typescript", typescript);
      let origin = path.relative(path.dirname(target), address);
      source = Object.entries(transform||{}).flatMap(
            ([field, value]) => typeof value === "string" ? [[field, value]] : field === origin ? Object.entries(value) : []
          ).reduce(
            (source, [field,value]) => source.replace(
              new RegExp(field,"g"),
              (match, ...groups) => [value, ...groups.slice(0,-2)].reduce(
                (value, group, index) => value.replace("$"+index, JSON.stringify(group))
              )
            ),
            source
          );
      return {
        code: source,
        map: {mappings: ''}
      };
    }}]
  );
  note.call(3,"bundling " + include + "...");
  let { rollup } = await import("./rollup_2022_rollup.js");
  let bundle = await rollup({ input: multientry ? { include } : include[0], plugins, ...input });
  if (target)
    await bundle.write({ file: target, format: "module", inlineDynamicImports: true, ...output });
  return target || bundle;
}

export async function checkout(remote, target, branch, path) {
  // git clone remote branch to target, restricted to subfolder if present. (to be replaced with js-git)
  if (!/^http/.test(remote))
    return fs
      .cp(remote, target, { dereference: true, recursive: true })
      .then((copy) => branch && spawn("git", "-C", target, "checkout", branch));
  let clone = await spawn(
    "git",
    "clone",
    "--depth=1",
    ...(path.length?["--no-checkout","--sparse","--filter=tree:0"]:[]),
    ...(branch?["--single-branch","--branch",branch]:[]),
    remote,
    target
  );
  if(!path.length)
  return clone;
  clone=await spawn("git","-C", target, "sparse-checkout", "add", path.join("/"));
  if(branch)
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

 export function mime(term)
{return compose
(term.replace(/.*\./,"")
,{text:{plain:["txt"],javascript:["js","cjs"],typescript:["ts"],"":["html","css"]}
 ,image:{jpeg:["jpg","jpeg"],"x-icon":"ico","svg+xml":"svg","":["gif","png"]}
 ,audio:{mpeg:"mp3"}
 }
,(extension,mime)=>
 Object.entries(mime).reduce((mime,[type,subtypes])=>mime||
 Object.entries(subtypes).reduce((mime,[subtype,extensions])=>mime||
 [extensions].flat().includes(extension)&&
 [type,subtype]
,mime)
,extension.includes("/")&&extension.split("/"))||
 ["application",extension]
,terms=>terms.join("/")
);
}

export var tests = {
  access: {
    context: [import.meta.url],
    terms: [(value) => typeof value, "string"],
    condition: "equal",
  },
};

 // smuggled from: https://github.com/npm/node-tar/blob/main/lib/read-entry.js

 const maxMetaEntrySize = 1024 * 1024

 const gzipHeader = Buffer.from([0x1f, 0x8b])
 const STATE = Symbol('state')
 const WRITEENTRY = Symbol('writeEntry')
 const READENTRY = Symbol('readEntry')
 const NEXTENTRY = Symbol('nextEntry')
 const PROCESSENTRY = Symbol('processEntry')
 const EX = Symbol('extendedHeader')
 const GEX = Symbol('globalExtendedHeader')
 const META = Symbol('meta')
 const EMITMETA = Symbol('emitMeta')
 const BUFFER = Symbol('buffer')
 const QUEUE = Symbol('queue')
 const ENDED = Symbol('ended')
 const EMITTEDEND = Symbol('emittedEnd')
 const EMIT = Symbol('emit')
 const UNZIP = Symbol('unzip')
 const CONSUMECHUNK = Symbol('consumeChunk')
 const CONSUMECHUNKSUB = Symbol('consumeChunkSub')
 const CONSUMEBODY = Symbol('consumeBody')
 const CONSUMEMETA = Symbol('consumeMeta')
 const CONSUMEHEADER = Symbol('consumeHeader')
 const CONSUMING = Symbol('consuming')
 const BUFFERCONCAT = Symbol('bufferConcat')
 const MAYBEEND = Symbol('maybeEnd')
 const WRITING = Symbol('writing')
 const ABORTED = Symbol('aborted')
 const DONE = Symbol('onDone')
 const SAW_VALID_ENTRY = Symbol('sawValidEntry')
 const SAW_NULL_BLOCK = Symbol('sawNullBlock')
 const SAW_EOF = Symbol('sawEOF')

 const types = new Map(Object.entries(
 {0:'File'
 // same as File
 ,'':'OldFile',1:'Link',2:'SymbolicLink'
 // Devices and FIFOs aren't fully supported
 // they are parsed, but skipped when unpacking
 ,3:'CharacterDevice',4:'BlockDevice',5:'Directory',6:'FIFO'
 // same as File
 ,7:'ContiguousFile'
 // pax headers
 ,g:'GlobalExtendedHeader',x:'ExtendedHeader'
 // vendor-specific stuff
 // skip
 ,A:'SolarisACL'
 // like 5, but with data, which should be skipped
 ,D:'GNUDumpDir'
 // metadata only, skip
 ,I:'Inode'
 // data = link path of next file
 ,K:'NextFileHasLongLinkpath'
 // data = path of next file
 ,L:'NextFileHasLongPath'
 // skip
 ,M:'ContinuationFile'
 // like L
 ,N:'OldGnuLongPath'
 // skip
 ,S:'SparseFile'
 // skip
 ,V:'TapeVolumeHeader'
 // like x
 ,X:'OldExtendedHeader'
 }));

 const SLURP = Symbol('slurp')
 const TYPE = Symbol('type')
 const EOF = Symbol('EOF')
 const MAYBE_EMIT_END = Symbol('maybeEmitEnd')
 const EMITTED_END = Symbol('emittedEnd')
 const EMITTING_END = Symbol('emittingEnd')
 const EMITTED_ERROR = Symbol('emittedError')
 const CLOSED = Symbol('closed')
 const READ = Symbol('read')
 const FLUSH = Symbol('flush')
 const FLUSHCHUNK = Symbol('flushChunk')
 const ENCODING = Symbol('encoding')
 const DECODER = Symbol('decoder')
 const FLOWING = Symbol('flowing')
 const PAUSED = Symbol('paused')
 const RESUME = Symbol('resume')
 const BUFFERLENGTH = Symbol('bufferLength')
 const BUFFERPUSH = Symbol('bufferPush')
 const BUFFERSHIFT = Symbol('bufferShift')
 const OBJECTMODE = Symbol('objectMode')
 const DESTROYED = Symbol('destroyed')
 const EMITDATA = Symbol('emitData')
 const EMITEND = Symbol('emitEnd')
 const EMITEND2 = Symbol('emitEnd2')
 const ASYNC = Symbol('async')
 const defer = fn => Promise.resolve().then(fn)

 // TODO remove when Node v8 support drops
 const doIter = global._MP_NO_ITERATOR_SYMBOLS_  !== '1'
 const ASYNCITERATOR = doIter && Symbol.asyncIterator||Symbol('asyncIterator not implemented')
 const ITERATOR = doIter && Symbol.iterator||Symbol('iterator not implemented')

 // events that mean 'the stream is over'
 // these are treated specially, and re-emitted
 // if they are listened for after emitting.
 const isEndish = ev => ev === 'end' ||ev === 'finish' ||ev === 'prefinish'
 const isArrayBuffer = b => b instanceof ArrayBuffer ||typeof b === 'object' &&b.constructor &&b.constructor.name === 'ArrayBuffer' &&b.byteLength >= 0
 const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b)

 class Pipe
{constructor (src, dest, opts)
{Object.assign(this,{src,dest,opts,ondrain:()=>src[RESUME]()})
 dest.on('drain', this.ondrain);
}
 unpipe(){this.dest.removeListener('drain', this.ondrain);}
 // istanbul ignore next - only here for the prototype
 proxyErrors(){}
 end(){this.unpipe();if(this.opts.end)this.dest.end();}
}

 class PipeProxyErrors extends Pipe
{constructor(src, dest, opts)
{super(src, dest, opts)
 this.proxyErrors = er => dest.emit('error', er)
 src.on('error', this.proxyErrors)
}
 unpipe()
{this.src.removeListener('error', this.proxyErrors)
 super.unpipe()
}
}

 class Entry extends stream
{constructor(header,ex,gex)
{super()
 this[FLOWING] = false
 // whether we're explicitly paused
 this[PAUSED] = false
 this.pipes = []
 this.buffer = []
 this[OBJECTMODE] = false
 if(this[OBJECTMODE])
 this[ENCODING] = null
 else
 this[ENCODING] = null
 if(this[ENCODING] === 'buffer')
 this[ENCODING] = null
 this[ASYNC] = false
 this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null
 this[EOF] = false
 this[EMITTED_END] = false
 this[EMITTING_END] = false
 this[CLOSED] = false
 this[EMITTED_ERROR] = null
 this.writable = true
 this.readable = true
 this[BUFFERLENGTH] = 0
 this[DESTROYED] = false
 // read entries always start life paused.  this is to avoid the
 // situation where Minipass's auto-ending empty streams results
 // in an entry ending before we're ready for it.
 this.pause()
 this.extended = ex
 this.globalExtended = gex
 this.header = header
 this.startBlockSize = 512 * Math.ceil(header.size / 512)
 this.blockRemain = this.startBlockSize
 this.remain = header.size
 this.type = header.type
 this.meta = false
 this.ignore = false
 if(['NextFileHasLongLinkpath','NextFileHasLongPath','OldGnuLongPath','GlobalExtendedHeader','ExtendedHeader','OldExtendedHeader'].includes(this.type))
 this.meta = true;
 else if(!['File','OldFile','Link','SymbolicLink','CharacterDevice','BlockDevice','Directory','FIFO','ContiguousFile','GNUDumpDir'].includes(this.type))
 // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
 // it may be worth doing the same, but with a warning.
 this.ignore = true
 this.path = header.path
 this.mode = header.mode
 if (this.mode)
 this.mode = this.mode & 0o7777
 this.uid = header.uid
 this.gid = header.gid
 this.uname = header.uname
 this.gname = header.gname
 this.size = header.size
 this.mtime = header.mtime
 this.atime = header.atime
 this.ctime = header.ctime
 this.linkpath = header.linkpath
 this.uname = header.uname
 this.gname = header.gname
 if(ex)slurp.call(this,ex)
 if(gex)slurp.call(this,gex, true)
}

 write(data, encoding, cb)
{const writeLen = data.length
 if (writeLen > this.blockRemain)
 throw new Error('writing more to entry than is appropriate')
 const r = this.remain
 const br = this.blockRemain
 this.remain = Math.max(0, r - writeLen)
 this.blockRemain = Math.max(0, br - writeLen)
 if (this.ignore)
 return true
 let chunk=r >= writeLen?data:data.slice(0, r);
 if (this[EOF])
 throw new Error('write after end')
 if (this[DESTROYED])
{this.emit('error'
,Object.assign(new Error('Cannot call write after a stream was destroyed')
,{ code: 'ERR_STREAM_DESTROYED' }));
 return true;
}
 if (typeof encoding === 'function')
 cb = encoding, encoding = 'utf8'
 if (!encoding)
 encoding = 'utf8'
 const fn = this[ASYNC] ? defer : f => f()
 // convert array buffers and typed array views into buffers
 // at some point in the future, we may want to do the opposite!
 // leave strings and buffers as-is
 // anything else switches us into object mode
 if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk))
 if (isArrayBufferView(chunk))
 chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength)
 else if (isArrayBuffer(chunk))
 chunk = Buffer.from(chunk)
 else if (typeof chunk !== 'string')
 // use the setter so we throw if we have encoding set
 this.objectMode = true
 // handle object mode up front, since it's simpler
 // this yields better performance, fewer checks later.
 if (this[OBJECTMODE])
{/* istanbul ignore if - maybe impossible? */
 if (this.flowing && this[BUFFERLENGTH] !== 0)
 this[FLUSH](true)
 if (this.flowing)
 this.emit('data', chunk)
 else
 this[BUFFERPUSH](chunk)
 if (this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if (cb)
 fn(cb)
 return this.flowing
}
 // at this point the chunk is a buffer or string
 // don't buffer it up or send it to the decoder
 if (!chunk.length)
{if (this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if (cb)
 fn(cb)
 return this.flowing
}
 // fast-path writing strings of same encoding to a stream with
 // an empty buffer, skipping the buffer/decoder dance
 if(typeof chunk === 'string' &&
  // unless it is a string already ready for us to use
 !(encoding === this[ENCODING] && !this[DECODER].lastNeed))
 chunk = Buffer.from(chunk, encoding)
 if (Buffer.isBuffer(chunk) && this[ENCODING])
 chunk = this[DECODER].write(chunk)
 // Note: flushing CAN potentially switch us into not-flowing mode
 if(this.flowing && this[BUFFERLENGTH] !== 0)
 this[FLUSH](true)
 if(this.flowing)
 this.emit('data', chunk)
 else
 this[BUFFERPUSH](chunk)
 if(this[BUFFERLENGTH] !== 0)
 this.emit('readable')
 if(cb)fn(cb)
 return this.flowing
}
 get bufferLength(){return this[BUFFERLENGTH];}
 get encoding(){return this[ENCODING];}
 set encoding(enc)
{if(this[OBJECTMODE])
 throw new Error('cannot set encoding in objectMode')
 if(this[ENCODING] && enc !== this[ENCODING] &&
 (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
 throw new Error('cannot change encoding')
 if(this[ENCODING] !== enc)
{this[DECODER] = enc ? new SD(enc) : null
 if(this.buffer.length)
 this.buffer = this.buffer.map(chunk => this[DECODER].write(chunk))
}
 this[ENCODING] = enc
}
 setEncoding(enc){this.encoding = enc}
 get objectMode(){return this[OBJECTMODE];}
 set objectMode(om){this[OBJECTMODE]=this[OBJECTMODE] || !!om;}
 get ['async'](){return this[ASYNC]}
 set ['async'](a){this[ASYNC] = this[ASYNC] || !!a;}
 read(n)
{if (this[DESTROYED])return null
 if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH])
{this[MAYBE_EMIT_END]();return null
}
 if(this[OBJECTMODE])n = null
 if (this.buffer.length > 1 && !this[OBJECTMODE])
{if (this.encoding)
 this.buffer = [this.buffer.join('')]
 else
 this.buffer = [Buffer.concat(this.buffer, this[BUFFERLENGTH])]
}
 const ret = this[READ](n || null, this.buffer[0])
 this[MAYBE_EMIT_END]()
 return ret
}

 [READ](n, chunk)
{if (n === chunk.length || n === null)
 this[BUFFERSHIFT]()
 else
{this.buffer[0] = chunk.slice(n)
 chunk = chunk.slice(0, n)
 this[BUFFERLENGTH] -= n
}
 this.emit('data', chunk)
 if (!this.buffer.length && !this[EOF])
 this.emit('drain')
 return chunk
}

 end(chunk, encoding, cb)
{if(typeof chunk === 'function')
 cb = chunk, chunk = null
 if (typeof encoding === 'function')
 cb = encoding, encoding = 'utf8'
 if (chunk)
 this.write(chunk, encoding)
 if (cb)
 this.once('end', cb)
 this[EOF] = true
 this.writable = false
 // if we haven't written anything, then go ahead and emit,
 // even if we're not reading.
 // we'll re-emit if a new 'end' listener is added anyway.
 // This makes MP more suitable to write-only use cases.
 if (this.flowing || !this[PAUSED])
 this[MAYBE_EMIT_END]()
 return this
}

  // don't let the internal resume be overwritten
 [RESUME]()
{if (this[DESTROYED])
 return
 this[PAUSED] = false
 this[FLOWING] = true
 this.emit('resume')
 if (this.buffer.length)
 this[FLUSH]()
 else if (this[EOF])
 this[MAYBE_EMIT_END]()
 else
 this.emit('drain')
}
 resume(){return this[RESUME]()}
 pause()
{this[FLOWING] = false
 this[PAUSED] = true
}
 get destroyed () {return this[DESTROYED]}
 get flowing () {return this[FLOWING]}
 get paused () {return this[PAUSED]}

 [BUFFERPUSH] (chunk)
{this[BUFFERLENGTH] += this[OBJECTMODE]?1:chunk.length;
 this.buffer.push(chunk)
}

 [BUFFERSHIFT] ()
{if (this.buffer.length)
 if (this[OBJECTMODE])
 this[BUFFERLENGTH] -= 1
 else
 this[BUFFERLENGTH] -= this.buffer[0].length
 return this.buffer.shift()
}

 [FLUSH] (noDrain)
{do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))
 if (!noDrain && !this.buffer.length && !this[EOF])
 this.emit('drain')
}

 [FLUSHCHUNK] (chunk){return chunk ? (this.emit('data', chunk), this.flowing) : false;}

 pipe(dest, opts)
{if(this[DESTROYED])return;
 const ended = this[EMITTED_END]
 opts = opts || {}
 opts.end = dest === proc.stdout || dest === proc.stderr?false:(opts.end !== false)
 opts.proxyErrors = !!opts.proxyErrors
 // piping an ended stream ends immediately
 if(ended){if(opts.end)dest.end();}
 else
{this.pipes.push(!opts.proxyErrors?new Pipe(this, dest, opts):new PipeProxyErrors(this, dest, opts));
 if(this[ASYNC])defer(()=>this[RESUME]());
 else this[RESUME]();
}
 return dest
}

 unpipe (dest)
{const p = this.pipes.find(p => p.dest === dest)
 if (p)
{this.pipes.splice(this.pipes.indexOf(p), 1)
 p.unpipe()
}
}

 addListener(ev, fn){return this.on(ev, fn)}

 on (ev, fn)
{const ret = super.on(ev, fn)
 if (ev === 'data' && !this.pipes.length && !this.flowing)
 this[RESUME]()
 else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
 super.emit('readable')
 else if (isEndish(ev) && this[EMITTED_END])
{super.emit(ev)
 this.removeAllListeners(ev)
} else if (ev === 'error' && this[EMITTED_ERROR])
{if (this[ASYNC])
 defer(() => fn.call(this, this[EMITTED_ERROR]))
 else
 fn.call(this, this[EMITTED_ERROR])
}
 return ret
}

 get emittedEnd(){return this[EMITTED_END]}

 [MAYBE_EMIT_END] ()
{if (!this[EMITTING_END] &&
 !this[EMITTED_END] &&
 !this[DESTROYED] &&
 this.buffer.length === 0 &&
 this[EOF])
{this[EMITTING_END] = true
 this.emit('end')
 this.emit('prefinish')
 this.emit('finish')
 if (this[CLOSED])
 this.emit('close')
 this[EMITTING_END] = false
}
}

 emit(ev, data, ...extra)
{// error and close are only events allowed after calling destroy()
 if(ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
 return
 else if (ev === 'data')
{return !data ? false
:this[ASYNC] ? defer(() => this[EMITDATA](data))
:this[EMITDATA](data)
}else if (ev === 'end')
{return this[EMITEND]()
}else if (ev === 'close')
{this[CLOSED] = true
 // don't emit close before 'end' and 'finish'
 if (!this[EMITTED_END] && !this[DESTROYED])
 return
 const ret = super.emit('close')
 this.removeAllListeners('close')
 return ret
}else if (ev === 'error') {
 this[EMITTED_ERROR] = data
 const ret = super.emit('error', data)
 this[MAYBE_EMIT_END]()
 return ret
}else if (ev === 'resume') {
 const ret = super.emit('resume')
 this[MAYBE_EMIT_END]()
 return ret
}else if (ev === 'finish' || ev === 'prefinish')
{const ret = super.emit(ev)
 this.removeAllListeners(ev)
 return ret
}
 // Some other unknown event
 const ret = super.emit(ev, data, ...extra)
 this[MAYBE_EMIT_END]()
 return ret
}

 [EMITDATA](data)
{for(const p of this.pipes)
 if(p.dest.write(data) === false)this.pause();
 const ret = super.emit('data', data)
 this[MAYBE_EMIT_END]()
 return ret;
}

 [EMITEND]()
{if (this[EMITTED_END])
 return
 this[EMITTED_END] = true
 this.readable = false
 if (this[ASYNC])
 defer(() => this[EMITEND2]())
 else
 this[EMITEND2]()
}

 [EMITEND2]()
{if(this[DECODER])
{const data = this[DECODER].end()
 if (data)
{for (const p of this.pipes)
 p.dest.write(data);
 super.emit('data', data)
}
}
 for (const p of this.pipes)
 p.end();
 const ret = super.emit('end')
 this.removeAllListeners('end')
 return ret
}

 // const all = await stream.collect()
 collect()
{const buf = []
 if (!this[OBJECTMODE])
 buf.dataLength = 0
 // set the promise first, in case an error is raised
 // by triggering the flow here.
 const p = this.promise()
 this.on('data',c=>{buf.push(c);if(!this[OBJECTMODE])buf.dataLength+=c.length;})
 return p.then(() => buf)
}

 // const data = await stream.concat()
 concat()
{return this[OBJECTMODE]
?Promise.reject(new Error('cannot concat in objectMode'))
:this.collect().then(buf=>this[OBJECTMODE]
?Promise.reject(new Error('cannot concat in objectMode'))
:this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
}

 // stream.promise().then(() => done, er => emitted error)
 promise()
{return new Promise((resolve, reject) => {
 this.on(DESTROYED, () => reject(new Error('stream destroyed')))
 this.on('error', er => reject(er))
 this.on('end', () => resolve())
})
}
 
 // for await (let chunk of stream)
 [ASYNCITERATOR] ()
{const next = () => {
 const res = this.read()
 if (res !== null)return Promise.resolve({ done: false, value: res })
 if (this[EOF])return Promise.resolve({ done: true })
 let resolve = null
 let reject = null
 const onerr = er =>
{this.removeListener('data', ondata)
 this.removeListener('end', onend)
 reject(er)
}
 const ondata = value =>
{this.removeListener('error', onerr)
 this.removeListener('end', onend)
 this.pause()
 resolve({ value: value, done: !!this[EOF] })
}
 const onend = () =>
{this.removeListener('error', onerr)
 this.removeListener('data', ondata)
 resolve({ done: true })
}
 const ondestroy = () => onerr(new Error('stream destroyed'));
 return new Promise((res, rej) =>
{reject = rej
 resolve = res
 this.once(DESTROYED, ondestroy)
 this.once('error', onerr)
 this.once('end', onend)
 this.once('data', ondata)
});
}
 return {next}
}

 // for (let chunk of stream)
 [ITERATOR]()
{const next = () => 
{const value = this.read()
 const done = value === null
 return { value, done }
}
 return { next }
}

 destroy(er) 
{if(this[DESTROYED])
{this.emit(...er?['error', er]:[DESTROYED]);
 return this;
}
 this[DESTROYED] = true
 // throw away all buffered data, it's never coming out
 this.buffer.length = 0
 this[BUFFERLENGTH] = 0
 if(typeof this.close==='function'&&!this[CLOSED])
 this.close()
 // if no error to emit, still reject pending promises
 this.emit(...er?['error', er]:[DESTROYED])
 return this
}

 static isStream (s)
{return !!s && (s instanceof Minipass || s instanceof Stream ||s instanceof EE && 
(typeof s.pipe === 'function' || // readable
 (typeof s.write === 'function' && typeof s.end === 'function') // writable
))
}
}

// Tar can encode large and negative numbers using a leading byte of
// 0xff for negative, and 0x80 for positive.

 const encodePositive = (num, buf) =>
{buf[0] = 0x80
 for(var i = buf.length; i > 1; i--){buf[i - 1] = num & 0xff, num = Math.floor(num / 0x100);}
}

 const onesComp=byte=>(0xff^byte)&0xff;
 const twosComp=byte=>((0xff^byte)+1)&0xff;

 const encodeNegative=(num,buf)=>
{buf[0] = 0xff
 var flipped = false
 num = num * -1
 for (var i = buf.length; i > 1; i--)
{var byte = num & 0xff
 num = Math.floor(num / 0x100)
 if (flipped)
 buf[i - 1] = onesComp(byte)
 else if (byte === 0)
 buf[i - 1] = 0
 else
{flipped = true
 buf[i - 1] = twosComp(byte)
}
}
}

 const twos=(buf)=>
{var len = buf.length
 var sum = 0
 var flipped = false
 for (var i = len - 1; i > -1; i--)
{var byte = buf[i]
 var f
 if(flipped)
 f=onesComp(byte);
 else if(byte === 0)
 f=byte;
 else{flipped = true;f = twosComp(byte);}
 if (f !== 0)
 sum -= f * Math.pow(256, len - i - 1)
}
 return sum
}

 const pos = (buf) =>
 //sum(Array(buffer.length).fill(0).map((value,index,{length})=>
 //buffer[index]?buffer[index]*Math.pow(256,length-index-1):0));
{var len = buf.length
 var sum = 0
 for (var i = len - 1; i > -1; i--)
{var byte = buf[i]
 if (byte !== 0)
 sum += byte * Math.pow(256, len - i - 1)
};
 return sum
}

 const large=
 {encode(num, buf)
{if (!Number.isSafeInteger(num))
 // The number is so large that javascript cannot represent it with integer
 // precision.
 throw Error('cannot encode number outside of javascript safe integer range')
 else [encodePositive,encodeNegative][Number(num<0)](num, buf)
 return buf
},parse(buf)
{const pre = buf[0]
 const value = pre === 0x80 ? pos(buf.slice(1, buf.length)): pre === 0xff ? twos(buf): null
 if (value === null)
 throw Error('invalid base256 encoding')
 if (!Number.isSafeInteger(value))
 // The number is so large that javascript cannot represent it with integer
 // precision.
 throw Error('parsed number outside of javascript safe integer range')
 return value
}};


 class Header
{constructor (data, off, ex, gex)
{Object.assign(this,{cksumValid:false,needPax:false,nullBlock:false,block:null,path:null,mode:null,uid:null,gid:null,size:null,mtime:null,cksum:null,linkpath:null,uname:null,gname:null,devmaj:0,devmin:0,atime:null,ctime:null});
 this[TYPE] = '0'
 if(Buffer.isBuffer(data))
 this.decode(data, off || 0, ex, gex)
 else if(data)
 this.set(data)
}

 decode (buf, off, ex, gex)
{if(!off)off=0;
 if(!buf || !(buf.length >= off + 512))
 throw new Error('need 512 bytes for header')
 this.path = decString(buf, off, 100)
 this.mode = decNumber(buf, off + 100, 8)
 this.uid = decNumber(buf, off + 108, 8)
 this.gid = decNumber(buf, off + 116, 8)
 this.size = decNumber(buf, off + 124, 12)
 this.mtime = decDate(buf, off + 136, 12)
 this.cksum = decNumber(buf, off + 148, 12)
 // if we have extended or global extended headers, apply them now
 // See https://github.com/npm/node-tar/pull/187
 slurp.call(this,ex)
 slurp.call(this,gex, true)
 // old tar versions marked dirs as a file with a trailing /
 this[TYPE]=decString(buf, off + 156, 1)
 if (this[TYPE] === '')
 this[TYPE] = '0'
 if (this[TYPE] === '0' && this.path.substr(-1) === '/')
 this[TYPE] = '5'
 // tar implementations sometimes incorrectly put the stat(dir).size
 // as the size in the tarball, even though Directory entries are
 // not able to have any body at all.  In the very rare chance that
 // it actually DOES have a body, we weren't going to do anything with
 // it anyway, and it'll just be a warning about an invalid header.
 if (this[TYPE] === '5')
 this.size = 0
 this.linkpath = decString(buf, off + 157, 100)
 if (buf.slice(off + 257, off + 265).toString() === 'ustar\u000000')
{this.uname = decString(buf, off + 265, 32)
 this.gname = decString(buf, off + 297, 32)
 this.devmaj = decNumber(buf, off + 329, 8)
 this.devmin = decNumber(buf, off + 337, 8)
 if (buf[off + 475] !== 0)
 // definitely a prefix, definitely >130 chars.
 this.path = decString(buf, off + 345, 155) + '/' + this.path
 else
{const prefix = decString(buf, off + 345, 130)
 if (prefix)
 this.path = prefix + '/' + this.path
 this.atime = decDate(buf, off + 476, 12)
 this.ctime = decDate(buf, off + 488, 12)
}
}
 let sum = 8 * 0x20
 for (let i = off; i < off + 148; i++)
 sum += buf[i]
 for (let i = off + 156; i < off + 512; i++)
 sum += buf[i]
 this.cksumValid = sum === this.cksum
 if (this.cksum === null && sum === 8 * 0x20)
 this.nullBlock = true
}

 encode (buf, off)
{if (!buf)
{buf = this.block = Buffer.alloc(512)
 off = 0
}
 if (!off)
 off = 0
 if (!(buf.length >= off + 512))
 throw new Error('need 512 bytes for header')
 const prefixSize = this.ctime || this.atime ? 130 : 155
 const split = splitPrefix(this.path || '', prefixSize)
 const path = split[0]
 const prefix = split[1]
 this.needPax = split[2]
 this.needPax = encString(buf, off, 100, path) || this.needPax
 this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax
 this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax
 this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax
 this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax
 this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax
 buf[off + 156] = this[TYPE].charCodeAt(0)
 this.needPax = encString(buf, off + 157, 100, this.linkpath) || this.needPax
 buf.write('ustar\u000000', off + 257, 8)
 this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax
 this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax
 this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax
 this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax
 this.needPax = encString(buf, off + 345, prefixSize, prefix) || this.needPax
 if (buf[off + 475] !== 0)
 this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax
 else
{this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax
 this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax
 this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax
}
 let sum = 8 * 0x20
 for (let i = off; i < off + 148; i++)
 sum += buf[i]
 for (let i = off + 156; i < off + 512; i++)
 sum += buf[i]
 this.cksum = sum
 encNumber(buf, off + 148, 8, this.cksum)
 this.cksumValid = true
 return this.needPax
}

 set(data)
{for (const i in data)
 if (data[i] !== null && data[i] !== undefined)
 this[i] = data[i]
}

 get type(){return types.get(this[TYPE]) || this[TYPE];}
 get typeKey(){return this[TYPE]}
 set type (type)
{if (types.code.has(type))
 this[TYPE] = types.code.get(type)
 else
 this[TYPE] = type
}
}

 const splitPrefix = (p, prefixSize) =>
{const pathSize = 100
 let pp = p
 let prefix = ''
 let ret
 const root = pathModule.parse(p).root || '.'
 if (Buffer.byteLength(pp) < pathSize)
 ret = [pp, prefix, false]
 else {
 // first set prefix to the dir, and path to the base
 prefix = pathModule.dirname(pp)
 pp = pathModule.basename(pp)
 do
{if (Buffer.byteLength(pp) <= pathSize &&
 Buffer.byteLength(prefix) <= prefixSize)
 // both fit!
 ret = [pp, prefix, false]
 else if (Buffer.byteLength(pp) > pathSize &&
 Buffer.byteLength(prefix) <= prefixSize)
  // prefix fits in prefix, but path doesn't fit in path
 ret = [pp.substr(0, pathSize - 1), prefix, true]
 else
{ // make path take a bit from prefix
 pp = pathModule.join(pathModule.basename(prefix), pp)
 prefix = pathModule.dirname(prefix)
}
} while (prefix !== root && !ret)
 // at this point, found no resolution, just truncate
 if (!ret)
 ret = [p.substr(0, pathSize - 1), '', true]
}
 return ret
}

 const decString = (buf, off, size) =>buf.slice(off, off + size).toString('utf8').replace(/\0.*/, '')
 const decDate = (buf, off, size) =>numToDate(decNumber(buf, off, size))
 const numToDate = num => num === null ? null : new Date(num * 1000)
 const decNumber = (buf, off, size) =>buf[off] & 0x80 ? large.parse(buf.slice(off, off + size)): decSmallNumber(buf, off, size)
 const nanNull = value => isNaN(value) ? null : value
 const decSmallNumber = (buf, off, size) => nanNull(parseInt(buf.slice(off, off + size).toString('utf8').replace(/\0.*$/, '').trim(), 8))
 // the maximum encodable as a null-terminated octal, by field size
 const MAXNUM = {12: 0o77777777777,8: 0o7777777,}
 const encNumber = (buf, off, size, number) =>
 number === null ? false : number > MAXNUM[size] || number < 0
?(large.encode(number, buf.slice(off, off + size)), true)
:(encSmallNumber(buf, off, size, number), false);
 const encSmallNumber = (buf, off, size, number) =>buf.write(octalString(number, size), off, size, 'ascii')
 const octalString = (number, size) =>padOctal(Math.floor(number).toString(8), size)
 const padOctal = (string, size) => (string.length === size - 1 ? string: new Array(size - string.length - 1).join('0') + string + ' ') + '\0';
 const encDate = (buf, off, size, date) => date === null ? false : encNumber(buf, off, size, date.getTime() / 1000);
 // enough to fill the longest string we've got
 const NULLS = new Array(156).join('\0');
 // pad with nulls, return true if it's longer or non-ascii
 const encString = (buf, off, size, string) =>
  string === null ? false :
  (buf.write(string + NULLS, off, size, 'utf8'),
  string.length !== Buffer.byteLength(string) || string.length > size)

 function slurp (ex, global)
{for (const k in ex)
 // we slurp in everything except for the path attribute in
 // a global extended header, because that's weird.
 if (ex[k] !== null && ex[k] !== undefined && !(global && k === 'path'))
 this[k] = ex[k]
}

 class Pax
{constructor (obj, global)
{this.atime = obj.atime || null
 this.charset = obj.charset || null
 this.comment = obj.comment || null
 this.ctime = obj.ctime || null
 this.gid = obj.gid || null
 this.gname = obj.gname || null
 this.linkpath = obj.linkpath || null
 this.mtime = obj.mtime || null
 this.path = obj.path || null
 this.size = obj.size || null
 this.uid = obj.uid || null
 this.uname = obj.uname || null
 this.dev = obj.dev || null
 this.ino = obj.ino || null
 this.nlink = obj.nlink || null
 this.global = global || false
}

 encode ()
{const body = this.encodeBody()
 if(body === '')
 return null;
 const bodyLen = Buffer.byteLength(body)
 // round up to 512 bytes
 // add 512 for header
 const bufLen = 512 * Math.ceil(1 + bodyLen / 512)
 const buf = Buffer.allocUnsafe(bufLen)
 // 0-fill the header section, it might not hit every field
 for (let i = 0; i < 512; i++) buf[i] = 0;
 new Header(
 // XXX split the path
 // then the path should be PaxHeader + basename, but less than 99,
 // prepend with the dirname
 {path: ('PaxHeader/' + path.basename(this.path)).slice(0, 99)
 ,mode: this.mode || 0o644
 ,uid: this.uid || null
 ,gid: this.gid || null
 ,size: bodyLen
 ,mtime: this.mtime || null
 ,type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader'
 ,linkpath: ''
 ,uname: this.uname || ''
 ,gname: this.gname || ''
 ,devmaj: 0
 ,devmin: 0
 ,atime: this.atime || null
 ,ctime: this.ctime || null
 }).encode(buf);
 buf.write(body, 512, bodyLen, 'utf8')
 // null pad after the body
 for (let i = bodyLen + 512; i < buf.length; i++) buf[i] = 0;
 return buf
}

 encodeBody()
{return ['path','ctime','atime','dev','ino','nlink','charset','comment','gid','gname','linkpath','mtime','size','uid','uname'].map(field=>
 this.encodeField(field)).reduce((sum,field)=>
 sum+field);
}

 encodeField (field)
{if (this[field] === null || this[field] === undefined)
 return ''
 const v = this[field] instanceof Date ? this[field].getTime() / 1000: this[field]
 const s = ' ' + (field === 'dev' || field === 'ino' || field === 'nlink' ? 'SCHILY.' : '') + field + '=' + v + '\n'
 const byteLen = Buffer.byteLength(s)
 // the digits includes the length of the digits in ascii base-10
 // so if it's 9 characters, then adding 1 for the 9 makes it 10
 // which makes it 11 chars.
 let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1
 if (byteLen + digits >= Math.pow(10, digits)) {digits += 1;}
 const len = digits + byteLen
 return len + s
}
}

 Pax.parse = (string, ex, g) => new Pax(merger(parseKV(string), ex), g);
 const merger = (a, b) => b ? Object.keys(a).reduce((s, k) => (s[k] = a[k], s), b) : a;
 const parseKV = string => string.replace(/\n$/, '').split('\n').reduce(parseKVLine, Object.create(null));

 const parseKVLine = (set, line) =>
{const n = parseInt(line, 10)
 // XXX Values with \n in them will fail this.
 // Refactor to not be a naive line-by-line parse.
 if (n !== Buffer.byteLength(line) + 1)
 return set
 line = line.substr((n + ' ').length)
 const kv = line.split('=')
 const k = kv.shift().replace(/^SCHILY\.(dev|ino|nlink)/, '$1')
 if (!k) return set
 const v = kv.join('=')
 set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k) ? new Date(v * 1000) : /^[0-9]+$/.test(v) ? +v : v
 return set
}

 class Parser extends EventEmitter
{constructor(opt)
{super()
 // set to boolean false when an entry starts.  1024 bytes of \0
 // is technically a valid tarball, albeit a boring one.
 this[SAW_VALID_ENTRY] = null
 // these BADARCHIVE errors can't be detected early. listen on DONE.
 this.on(DONE, _ =>
{if (this.state === 'begin' || this[SAW_VALID_ENTRY] === false)
 // either less than 1 block of data, or all entries were invalid.
 // Either way, probably not even a tarball.
 this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format')
});
 this.on(DONE, _ =>
{this.emit('prefinish')
 this.emit('finish')
 this.emit('end')
 this.emit('close')
});
 this.maxMetaEntrySize = maxMetaEntrySize
 this.filter = value=>true
 // have to set this so that streams are ok piping into it
 this.writable = true
 this.readable = false
 this.queue=[]
 this[BUFFER] = null
 this[READENTRY] = null
 this.writeEntry = null
 this.state = 'begin'
 this[META] = ''
 this[EX] = null
 this[GEX] = null
 this[ENDED] = false
 this[UNZIP] = null
 this[ABORTED] = false
 this[SAW_NULL_BLOCK] = false
 this[SAW_EOF] = false
}

 write(chunk)
{if(this.aborted)return
 /* first write, might be gzipped
 if (this[UNZIP] === null && chunk)
{if (this[BUFFER])
{chunk = Buffer.concat([this[BUFFER], chunk])
 this[BUFFER] = null
}
 if (chunk.length < gzipHeader.length)
{this[BUFFER] = chunk
 return true
}
 for (let i = 0; this[UNZIP] === null && i < gzipHeader.length; i++)
 if (chunk[i] !== gzipHeader[i])
 this[UNZIP] = false
 if (this[UNZIP] === null)
{const ended = this[ENDED]
 this[ENDED] = false
 this[UNZIP] = new zlib.Unzip()
 this[UNZIP].on('data', chunk => this[CONSUMECHUNK](chunk))
 this[UNZIP].on('error', er => this.abort(er))
 this[UNZIP].on('end', _ =>
{this[ENDED] = true
 this[CONSUMECHUNK]()
})
 this[WRITING] = true
 const ret = this[UNZIP][ended ? 'end' : 'write'](chunk)
 this[WRITING] = false
 return ret
}
}*/
 this[WRITING] = true
 //if (this[UNZIP])this[UNZIP].write(chunk); else
 this.consumeChunk(chunk);
 this[WRITING] = false
 // return false if there's a queue, or if the current entry isn't flowing
 const ret=this.queue.length?false:this[READENTRY]?.flowing??true
 // if we have no queue, then that means a clogged READENTRY
 if (!ret && !this.queue.length)
 this[READENTRY].once('drain', _ => this.emit('drain'))
 return ret
}

 consumeChunk(chunk)
{if (this[CONSUMING] || this[BUFFER])
 if (chunk && !this[ABORTED])
 this[BUFFER] = this[BUFFER] ? Buffer.concat([this[BUFFER], chunk]) : chunk;
 if (!chunk && !this[BUFFER])
 this[MAYBEEND]()
 else
{this[CONSUMING] = true
 if (this[BUFFER])
{const c = this[BUFFER]
 this[BUFFER] = null
 this.consumeChunkSub(c)
} else
 this.consumeChunkSub(chunk)
 while(this[BUFFER]&&this[BUFFER].length>=512&&!this[ABORTED]&&!this[SAW_EOF])
{const c=this[BUFFER]
 this[BUFFER] = null
 this.consumeChunkSub(c)
}
 this[CONSUMING] = false
}
 if (!this[BUFFER] || this[ENDED])
 this[MAYBEEND]()
}

 consumeChunkSub(chunk)
{// we know that we are in CONSUMING mode, so anything written goes into
 // the buffer. Advance the position and put any remainder in the buffer.
 let position = 0
 const length = chunk.length
 while (position + 512 <= length && !this[ABORTED] && !this[SAW_EOF])
{switch (this.state)
{case 'begin':
 case 'header':this.consumeHeader(chunk, position);position += 512;break
 case 'ignore':
 case 'body':position += this.consumeBody(chunk, position);break
 case 'meta':position += this.consumeMeta(chunk, position);break     
 default:throw new Error('invalid state: ' + this[STATE])
}
 /*position+=
 {begin:this.consumeHeader
 ,header:this.consumeHeader
 ,ignore:this.consumeBody
 ,body:this.consumeBody
 ,meta:this.consumeMeta
 }[this.state](chunk, position)??512*/
}
 if (position < length)
 this[BUFFER] = this[BUFFER]
?Buffer.concat([chunk.slice(position), this[BUFFER]])
:chunk.slice(position)
}

 consumeHeader(chunk,position)
{if(this[SAW_VALID_ENTRY]===null)
 this[SAW_VALID_ENTRY]=false;
 let header=new Header(chunk, position, this[EX], this[GEX])
 if(header.nullBlock)
{if(this[SAW_NULL_BLOCK])
{this[SAW_EOF] = true
 // ending an archive with no entries.  pointless, but legal.
 if (this.state === 'begin')
 this.state = 'header'
 this[EMIT]('eof')
}else
{this[SAW_NULL_BLOCK] = true
 this[EMIT]('nullBlock')
}
}else
{this[SAW_NULL_BLOCK] = false
 if(!header.cksumValid)
 throw Error('checksum failure')
 else if (!header.path)
 this.warn('TAR_ENTRY_INVALID', 'path is required', { header })
 else
{const type = header.type
 if (/^(Symbolic)?Link$/.test(type) && !header.linkpath)
 this.warn('TAR_ENTRY_INVALID', 'linkpath required', { header })
 else if (!/^(Symbolic)?Link$/.test(type) && header.linkpath)
 this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', { header })
 else
{const entry = this.writeEntry = new Entry(header, this[EX], this[GEX])
 // we do this for meta & ignored entries as well, because they
 // are still valid tar, or else we wouldn't know to ignore them
 if (!this[SAW_VALID_ENTRY])
 if (entry.remain)
 // this might be the one!
 entry.on('end',() =>
{if (!entry.invalid)
 this[SAW_VALID_ENTRY] = true
})
 else this[SAW_VALID_ENTRY] = true
 if (entry.meta)
{if (entry.size > this.maxMetaEntrySize)
{entry.ignore = true
 this[EMIT]('ignoredEntry', entry)
 this.state = 'ignore'
 entry.resume()
}else if (entry.size > 0)
{this[META] = ''
 entry.on('data', c => this[META] += c)
 this.state = 'meta'
}
}else
{this[EX] = null
 entry.ignore = entry.ignore || !this.filter(entry.path, entry)

 if (entry.ignore)
{// probably valid, just not something we care about
 this[EMIT]('ignoredEntry', entry)
 this.state = entry.remain ? 'ignore' : 'header'
 entry.resume()
}else
{if(entry.remain)this.state = 'body'
 else{this.state = 'header';entry.end()}
 this.queue.push(entry)
 if (!this[READENTRY])
 this.nextEntry()
}
}
}
}
}
 return 512;
}

 [PROCESSENTRY] (entry)
{let go = true
 if (!entry)
{this[READENTRY] = null
 go = false
}else if (Array.isArray(entry))
 this.emit.apply(this, entry);
 else
{this[READENTRY] = entry
 this.emit('entry', entry)
 if (!entry.emittedEnd) {
 entry.on('end', _ => this.nextEntry())
 go = false
}
}
 return go
}

 nextEntry ()
{do {} while (this[PROCESSENTRY](this.queue.shift()))
 if (!this.queue.length)
{// At this point, there's nothing in the queue, but we may have an
 // entry which is being consumed (readEntry).
 // If we/ If we don't, then we definitely can handle more data.
 // If we do, and either it's flowing, or it has never had any data
 // written to it, then it needs more.
 // The only other possibility is that it has returned false from a
 // write() call, so we wait for the next drain to continue.
 const re = this[READENTRY]
 const drainNow = !re || re.flowing || re.size === re.remain
 if (drainNow)
{if (!this[WRITING])
 this.emit('drain')
}else
 re.once('drain', _ => this.emit('drain'));
}
}

 consumeBody(chunk, position)
{// write up to but no  more than writeEntry.blockRemain
 const entry = this.writeEntry
 const br = entry.blockRemain
 const c = (br >= chunk.length && position === 0) ? chunk : chunk.slice(position, position + br);
 entry.write(c)
 if(!entry.blockRemain)
{this.state = 'header'
 this.writeEntry = null
 entry.end()
}
 return c.length
}

 consumeMeta(chunk, position)
{const entry = this.writeEntry
 const ret = this.consumeBody(chunk, position)
 // if we finished, then the entry is reset
 if (!this.writeEntry)
 this[EMITMETA](entry)
 return ret
}

 [EMIT] (ev, data, extra)
{if (!this.queue.length && !this[READENTRY])
 this.emit(ev, data, extra)
 else
 this.queue.push([ev, data, extra])
}

 [EMITMETA] (entry)
{this[EMIT]('meta', this[META])
 switch (entry.type)
{case 'ExtendedHeader':
 case 'OldExtendedHeader':
 this[EX] = Pax.parse(this[META], this[EX], false)
 break
 case 'GlobalExtendedHeader':
 this[GEX] = Pax.parse(this[META], this[GEX], true)
 break
 case 'NextFileHasLongPath':
 case 'OldGnuLongPath':
 this[EX] = this[EX] || Object.create(null)
 this[EX].path = this[META].replace(/\0.*/, '')
 break
 case 'NextFileHasLongLinkpath':
 this[EX] = this[EX] || Object.create(null)
 this[EX].linkpath = this[META].replace(/\0.*/, '')
 break
 /* istanbul ignore next */
 default: throw new Error('unknown meta: ' + entry.type)
}
}
 abort(error){this[ABORTED] = true;this.emit('abort', error);}

 [MAYBEEND]()
{if(this[ENDED] && !this[EMITTEDEND] && !this[ABORTED] && !this[CONSUMING])
{this[EMITTEDEND] = true
 const entry = this.writeEntry
 if (entry && entry.blockRemain)
{// truncated, likely a damaged file
 const have = this[BUFFER] ? this[BUFFER].length : 0
 this.warn('TAR_BAD_ARCHIVE', `Truncated input (needed ${
 entry.blockRemain} more bytes, only ${have} available)`, { entry })
 if (this[BUFFER])
 entry.write(this[BUFFER])
 entry.end()
}
 this[EMIT](DONE)
}
}

 end(chunk)
{if (!this[ABORTED])
 if (this[UNZIP])
 this[UNZIP].end(chunk)
 else
{this[ENDED] = true
 this.write(chunk)
}
}
}
