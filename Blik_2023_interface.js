 import {note,collect,same,has,promise,pass,slip,something,observe,functor,describe,expect,control,trace,array,compound,simple,apply,stream,revert,provide,tether,differ,whether,either,when,each,drop,swap,crop,infer,buffer,is,not,plural,numeric,binary,basic,match,wait,string,defined,minor,compose,combine,exit,clock,major,colors,skip,flip,debug} from "./Blik_2023_inference.js";
 import {search,merge,prune,sum,stringify,edit,parse as records,relevant,route,record,remember} from "./Blik_2023_search.js";
 import {parser,parse,sanitize,serialize,exports,reexport,test,mime,coordinates} from "./Blik_2023_meta.js";
 export const address=new URL(import.meta.url).pathname;
 export const location=address.replace(/\/[^/]*$/,"");//path.dirname(address);
 export const file=address.replace(/.*\//,"");//path.basename(address);
 export const virtual=typeof imports!=="undefined";// interface/modularise tracks imports in context. 
 export const remote=/^http/.test(import.meta.url);
 export const agent=globalThis.process?.versions
?prune.call(process.versions,({1:value})=>string(value)?Number(value.match(/(\.{0,1}\d+){1,2}/)[0]):value)
:version(globalThis.navigator);
 export const entry=agent.node&&await import("worker_threads").then(({isMainThread:is})=>is);
 // --import flag registers loader module on separate thread unlike 
 // --loader, where context is available directly on the primary thread. 
 export var [loader,legacy,inspected]=
 Object.entries({import:file,loader:file,inspect:""}).map(([field,value])=>
 agent.node&&process.execArgv.some((flag,index)=>
 new RegExp("^--"+field+(value?"=[^ ]*"+value:"")).test(flag))||undefined);
 var sources="./Blik_2023_sources.json";
 export var scope={};// interface/resolve tracks imports in interface/scope. 
 export var {window,fetch}=globalThis.window?globalThis:{fetch:freefetch};// call interface/jsdom to bind fetch to a window with origin. 
 export var peer=remember(function peer(protocol)
{return import(protocol).then(({Agent})=>Agent({timeout:5*60*1000}));
},protocol=>protocol);

 if(agent.node&&!virtual)
 await infer(async function register(module,...context)
{// expose modules to console. 
[import.meta.url,"./Blik_2023_inference.js","./Blik_2023_search.js"
].forEach(compose(crop(1),resolve.bind(import.meta.url),globalThis,flip,Object.assign));

 if(entry&&loader&&!remote)
 // register loader thread. 
 loader=await compose.call
("worker_threads",resolve.bind(import.meta.url),["MessageChannel"],tether(search),[],Reflect.construct
,revert(function register(resume,onerror,{port1,port2:socket})
{observe.call(port1
,{message:combine(compose(drop(1),"data",note.bind(2)),resume)
 ,onerror,messageerror:onerror
 },{once:true});
 resolve("module","register",address,import.meta.url,{data:{socket},transferList:[socket]});
})
),whether
(compose(collect,"length",major(0)),buffer(compose
(resolve.bind(import.meta.url),note.bind(2),pass(expect(compose(drop(),combine
(delegate.bind(loader,"bundling")
,delegate.bind(loader,"testing")
),are(false)),5000))
)
,compose(note.bind(1),wait(60*1000),swap(1),process.exit))
,infer()
)(module,...context);

 if(!loader&&!legacy&&module?.endsWith(file))
 // without either loader flag, context begins at second index. 
 compose(resolve.bind(import.meta.url),drop(),0,process.exit)(...context);

 // if(entry&&await compose.call(resolve("vm"),has("Module")))
 // Report internal segfault errors (may occur with experimental features). 
 // await compose("default","registerHandler")(import("./Shiranuit_2021_segfault.node"));

 if(inspected&&entry)
 // restart inspector to trigger a DevTools switch back to the main thread in case open. 
 await compose
(resolve.bind(import.meta.url),pass("close"),pass(compose(process.debugPort,"localhost","open"))
,infer(Reflect.get,"Session"),[],Reflect.construct,{inspectorNotification:note},tether(observe)
)("node:inspector")
,compose(inspector,slip("Inspect: \n"),"concat",note.bind("cyan"))(process.debugPort,"localhost");
})(...process?.argv?.slice(1)||[]);

 // https://nodejs.org/api/esm.html#esm_loaders 

 export async function initialize({socket})
{loader=socket;
 if(inspected)
 // Inspect thread. 
 await combine
(compose(slip("node:inspector","open"),resolve.bind(import.meta.url))
,skip(compose(inspector,slip("Inspect:\n"),"concat",note.bind("cyan")))
)(process.debugPort+1,"localhost");
 Object.assign(globalThis,{scope});
 worker.procedures[0].call(loader);
};

 export async function prompt(...context)
{// request context from client interface, 
 // or offer it to the client (syncing the cli 
 // with debugPort and customizing it don't work yet). 
 let {createInterface}=await import("readline");
 let {stdin:input,stdout:output}=process;
 let socket=await buffer(revert((connect,error,connection)=>
 observe.call(connection,{connect:infer(connect),error}))
,compose(note,swap("debug port unavailable for "+prompt.name),note.bind(1)))(resolve.call(import.meta.url,"net","connect",process.debugPort));
 let interfaces=[{input,output}/*,socket&&{input:socket,output:socket}||[]*/].flat().map(createInterface);
 let entries=context.flat().flatMap(term=>compound(term)?Object.entries(term):[[term]]);
 entries=await entries.reduce(record(([field,term])=>
 control(new AbortController(),revert((resolve,reject,abortion,...interfaces)=>
 term?resolve(term):interfaces.forEach(infer("question",field+":"
,combine(compose(note,swap(abortion),"abort"),resolve)))),...interfaces).then(term=>
 [field,term]))
,[]);
 return compose(each("close"),swap(Object.fromEntries(entries)))(...interfaces);
};

 export async function locate(action)
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
 module=await either(...[2020,new Date().getFullYear()].reduce((min,max)=>
 Array(max-min).fill(max).map((year,index)=>year-index)).flatMap(year=>
 ["Blik"].map(author=>"./"+[author,year,module].join("_")+".js")).map(module=>
 buffer(compose(swap(module),resolve.bind(this),swap(module)),drop())),compose("message",note.bind(2),exit))(undefined);
 return [lead+module,feature,...path];
};

 var precedent=compose(crop(1),"resolution",collect,slip(scope),tether(search));

 var recovery=compose
(combine(crop(1),({message},source)=>message.includes("'"+source+"'"))
,(fail,immediate)=>(
 {ERR_MODULE_NOT_FOUND:immediate?acquire:divert
 ,ERR_UNSUPPORTED_DIR_IMPORT:immediate&&extend
 }[fail.code])||exit(fail)
);

 var request=compose
(address=>fetch(address),when(compose("status",is(200))),"headers","location"
,address=>({url:window.location.origin+address})
);

 var respecify=compose("url",collect,slip(URL),Reflect.construct,"pathname",decodeURI);
 var modulepath=when(is([match(/^[\/\.]/),not(match(RegExp(sources+"$")))]));
 var format=compose
(combine(infer(),compose(swap(sources),"default",resolve.bind(import.meta.url),Object.keys)),(source,sources)=>
 sources.find(field=>source.startsWith([location,field.replace(/\.js$|\.node$/,"/")].join("/"))),["format"],record
);
 var shortcircuit=compose
(combine(infer(),either(buffer(compose(respecify,modulepath,format)),swap({}))),merge
,{shortCircuit:true},merge,["resolution"],record
);

 export function lambda(term)
{return compose
(when(string)," ","split",provide,each(compose
(locate.bind(this),([module,field])=>[resolve.call(this,module),field],provide,Reflect.get
)),collect,infer("reverse")
,infer("reduce",(past,next)=>next(past))
)(term);
}

 export function recompose(term)
{when(simple)(...arguments);
 return provide(Object.entries(term).map(compose
(entry=>entry.flat(),infer("map",term=>
 whether.call(term,[string,simple,array],lambda.bind(this),recompose.bind(this),provide))
,provide,(term,...context)=>term(...context)
)));
};

 export async function resolve(source,context,next)
{// import module from source, infer context if provided. 
 // use as --loader/import module to do for each import. 
 // (https://nodejs.org/api/esm.html#esm_loaders). 
 if(compound(source))
 return array(source)&&!source.some(not(string))
?source.reduce(record(source=>
 resolve.call(this,source,...Array.from(arguments).slice(1)))
,[])
 // composition declarations: ["module/name",[context],"module/name"]
:agent.node&&!loader
?exit("Resolving composition declarations not allowed on main thread.")
:compose(infer("reduce",record(term=>
 whether([simple,string],recompose.bind(this),lambda.bind(this),infer())(term))
,[]),"flat",provide,tether(compose))(source);
 if(!string(source))
 return exit("can't resolve type "+typeof source);
 let loading=next?.name==="nextResolve";
 let {importAssertions:assertions,importAttributes:attributes}=context||{};
 attributes=attributes||assertions;
 if(attributes?.peer)
 // clone immutable context without custom attributes. 
 context=prune.call(context,([field,value])=>field==="peer"?undefined:value);
 // peer attribute tracks bound url of direct invocations below. 
 let internal=attributes?.peer||context?.parentURL;
 let primary=loading&&!internal;
 if(primary&&loader&&!await resolve.call(import.meta.url,"worker_threads","isMainThread"))
 // suppress primary import on loader thread (registered with --import) in favor of dynamic inference of command line context only available on the main one. 
 return next("worker_threads",context);
 let command=!loading||!internal;
 let target=internal?decodeURI(new URL(internal).pathname):address;
 let relation=target.replace(/\/[^/]*$/,"");
 let url=compose(collect,slip(URL),Reflect.construct);
 let {protocol,host,pathname:absolute}=/^[\/\.]/.test(source)?agent.node
?await resolve.call(import.meta.url,"url","pathToFileURL",source)
:new URL("file://"+source.replace(/^[\/\.]+/,relation+"/"))
:either(url,compose(/^/,"node:","replace",url))(source);
 let relative=agent.node&&"file:"===protocol?"/"+await resolve.call(import.meta.url,"path","relative",location,absolute):absolute;
 let type=source.endsWith(".json")?"json":undefined;
 let recover=compose(recovery,infer("call",scope,absolute,target),infer(resolve.bind(internal),context,next));
 if(command&&!string(this))
 console.warn("Resolution invoked without peer module's reference in scope for \""+source+"\".\nWill default to \""+location+"/\" (no scope).");
 if(!command)
 return compose(either(precedent,compose
(drop(1,0,absolute),buffer(next,buffer(recover,either(compose(swap(source),request),exit)))
,shortcircuit,{imports:new Set()},merge,[relative],record
,slip(scope),0,merge,[relative,"resolution"],tether(search)
,pass(compose(swap(colors.yellow+"import:"+colors.cyan+relative+" ("+internal+")"+colors.steady),console.log))
)),target===location+"/"?undefined:pass(compose
(swap(scope),{[target.replace(location,"")]:{imports:new Set([relative])}},0,merge
)))(relative,context);
 let module=import(source,(compound(loader)||type)&&prune.call(
 {[!agent.Linux&&feature(agent).attributes?"with":"assert"]:{type,peer:compound(loader)?this||"file://"+location+"/":undefined}
 },({1:value})=>value));
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
 let target=absolute.replace(/\.js$|\.node$/,"");
 let relative=path.relative(location,absolute);
 let definition=await compose("default",resolve.bind(import.meta.url),either(relative,swap({})))(sources);
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
{// access source as module specifier, ie. 
 // compose(source,true,access,interpret,format,sanitize,serialize,modularize). 
 //let version=process.versions.node.split(".")[0];
 let url=compose(collect,slip(URL),Reflect.construct);
 let {protocol,host,pathname:absolute}=/^[\/\.]/.test(source)
?await resolve.call(import.meta.url,"url","pathToFileURL",source)
:either(url,compose(/^/,"node:","replace",url))(source);
 let relative="file:"===protocol?"/"+await resolve.call(import.meta.url,"path","relative",location,absolute):absolute;
 let loading=next?.name==="nextLoad";
 // let absolute=/^file:/.test(source)?await resolve.call(import.meta.url,"url","fileURLToPath",source):source.replace(/^node:/,"");
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
 if(format==="module"&&/\.glsl\.js$/.test(source))
 Object.assign(context,{format:syntax=format="shader"});
 if(format==="commonjs")
 // don't trust default assumption from nearest package.json as it often refers to inaccessible build outputs. 
 await buffer(require,commonjs=>is(Error)(note(commonjs))&&
 Object.assign(context,{format:format="module"}))(source);
 let native=["json","module","wasm","builtin","commonjs",undefined].includes(format);
 if(native&&next)
 return compose(next,whether(match({format:"addon"}),infer(merge,{source:null})),shortcircuit,skip(check))(source,context);
 let [index,sparse]=relative.split("/").reduce((folder,entry,index,relative)=>
 [entry,relative.splice(2).join("/")]);
 let {comment,...definition}=
[{syntax}
,compound(format)?format||{}:await import(sources).then(sources=>
 [Object.values(sources.default[format]||{})[index]||sources.default[format]||{}].reduce(function flat(entries,source)
{return [entries,!compound(source)||array(source)?source:Object.values(source).reduce(flat,[])].flat();
},[]).filter(compound).map(entry=>
 // replacement definitions only apply to bundle output. use "edit" to modify loading sources. 
 merge(entry,{replace:undefined})))
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
(compose(access,edits,edit,patriate)
,fail=>note.call(1,"Failed to patriate "+syntax+" \""+source+"\" due to",fail)&&wait(1000)(fail).then(exit)
)(source,true);
 if(next)
 return compose.call(module,source=>(
 {source,format:{json:"json"}[syntax]||"module"
 }),shortcircuit);
 return module;
};

 export async function modularise(source,specifier,context={},depth=0)
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
:either(parse,compose(/^/,"node:","replace",parse))(specifier);
 if(target)
 merge(scope[target],{imports:new Set([identifier])},0);
 let precedent=context.imports?.[identifier];
 if(precedent)
 return precedent;
 let builtin=protocol==="node:";
 if(!source&&!builtin)null
,{source}=scope[identifier]?.module||
 await expect(buffer(load,whether
(compose(swap(identifier),bundling)
,compose(crop(1),slip("awaiting bundle to "+modularise.name),note,undefine)
,note
)),3000)(url,{importAttributes:attributes});
 if(attributes?.type==="json"||specifier?.endsWith(".json"))
 source="export default "+source;
 if(!isContext(context))
 context=createContext(
 {imports:{},URL,Object,Blob,Reflect,Buffer,TextEncoder,TextDecoder
 ,setTimeout,setInterval
 ,global,performance,process:
 {env:{},argv:[],execArgv:[],stdout:process.stdout,stderr:process.stderr
 ,version:process.version,versions:process.versions
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
),crop(1)),drop(2)),(specifier,attributes,depth)=>
 modularise(null,{specifier,attributes,target:identifier},context,depth)
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
 ,importModuleDynamically:compose(crop(3),stash(0),link,"namespace")
 ,initializeImportMeta:infer(merge,{url})
 });
 merge(context.imports,module,[identifier]);
 let links=await module.moduleRequests?.reduce(record(compose
(drop(1),combine("specifier",swap(module),"attributes"),stash(depth+1),link
)),[]);
 module.linkRequests
?await module.linkRequests?.(links)
:await module.link(compose(crop(3),stash(depth+1),link))?.catch(undefine);
 // if(!builtin)
 // merge(scope,module.createCachedData(),[identifier,"virtual"]);
 if(!depth)
 module.instantiate?.()
,await module.evaluate().catch(compose({[identifier]:module},note,exit));
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
,compose(true,access,target,modularise,"namespace")
,resolve
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

 export var compress=revert((revert,reject,buffer)=>import("zlib").then(({gzip})=>
 gzip(buffer,(fail,buffer)=>fail?reject(fail):revert(buffer))));

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
 }))(tarstream.pipe(extractor),process.stdout.write(prefix));
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
 return merge(fs.stat(file),{path:file});
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
 return file.split("/").reduce(compose(drop(3),path=>provide(
[new RegExp(path.pop().replace("*",".*"))
,list(path.splice(0).join("/"),recursive,exclude)
]),(name,files)=>prune.call(note(files),([file,entry])=>
 name.test(file)?entry:undefined,0,0)));
 if(!/\/$/.test(file))
 file=file.replace(/$/,"/");
 let {promises:fs}=await import("fs");
 let files=await fs.readdir(file)//,{withFileTypes:true});
 files=await files.reduce(record(name=>
 buffer(compose(fs.stat,{name},merge),swap(undefined))(file+name)),[])
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

 export var worker=
 {imports:{"/Blik_2023_inference.js":["","compose","combine","drop","collect","infer","buffer","is","note","exit","slip","differ","observe"]}
 ,procedures:[function()
{var address=new URL(import.meta.url).pathname;
 var worker=this||self;
 observe.call(worker
,{message({data:[id,term,...context]})
{compose(buffer(compose(...compound(term)
?[swap(term),resolve.bind(import.meta.url)]
:[term].flat().map(term=>differ(term,...context))),crop(1))
//,whether(string,infer(),JSON.stringify),whether(string,compose(TextEncoder.prototype.encode.bind(new TextEncoder()),"buffer"),infer())
,combine
(compose(slip(id),collect)
,compose(collect,tether(search,compose(drop(1),1,either(is(ArrayBuffer)))),Object.values)
)
,this.postMessage.bind(this))(import(address));
},error:infer("postMessage")
 }).postMessage("Worker ready: "+address);
}]
 };

 export async function delegate(term,...context)
{when(either(string,array,functor,defined(this)&&has(["exports"])))(term);
 if(defined(this))
 return control(new AbortController()
,revert((resume,reject,{signal},worker,...context)=>
 // listen until worker emits request id. 
[function message({target,data,type,message}={})
{let ephemeral=![globalThis.worker,loader].includes(target);
 if(ephemeral)target.terminate();
 let [id,value]=data||[];
 if(id===context[0])
 return resume(message?Error(message):value);
},context.filter(is(ArrayBuffer))
].reduce((message,transfer)=>//console.log(message,context)||
 observe.call(worker,{message,error:message},{signal}).postMessage(context,transfer)))
,this,crypto.randomUUID(),functor(term)?term.name:term,...context);
 let ephemeral=functor(term);
 if(ephemeral&&!term.name)
 throw Error("Can't create ephemeral worker for anonymous function.");
 let address=string(term)?term:compose.call
(ephemeral?{exports:{[term.name]:term}}:term,worker,0,merge
,tether(prune,([field,value])=>field!=="imports"?value
:prune.call(value,function([field,value])
{merge(this,{[[window.location.origin,field].join("/")]:value});
},0,0)),serialize,collect,{type:"text/javascript"},collect,slip(Blob),Reflect.construct,URL.createObjectURL
);
 let module=new Worker(address,{type:"module"});
 await compose.call
(module,revert((message,error,module)=>
 observe.call(module,{message,error},{once:true}))
,"data",note.bind(2)
);
 URL.revokeObjectURL(address);
 return ephemeral?delegate.bind(module,term.name,...context):module;
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
{// revert message events on bound socket with resume/reject hooks to terminate listening. 
 return control(new AbortController(),revert
((resume,reject,{signal},events,message,call)=>
 call(observe.call(events,{message(response)
{action.call(this,JSON.parse(response.data),message,resume,reject);
}},{signal}))
),this,message,message?infer("send",JSON.stringify(message)):infer());
};

 export async function infrastructure()
{return Object.entries(scope).reduce(record
(({1:{imports=[]}})=>Array.from(imports)
,([field])=>field
),{});
};

 async function freefetch(request,{method,body,headers}={})
{let remote=/^http/.test(request);
 let url=string(request)?!remote
?!this?exit(freefetch.name+" not bound to JSDOM for local origin request. No server context for "+request+"?")
:[this.location.origin,request?.replace(/^[\.\/]+/,"")||""].join("/")
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
{//infer("close")(window);
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
 let body=whether
([fail,has("nodeName"),something]
,"message"
,compose(combine
(whether(is(window?.HTMLHtmlElement),swap("<!DOCTYPE html>"),drop())
,whether(is(window?.DocumentFragment),compose("children",Array.from,infer("map",infer("outerHTML")),"","join"),"outerHTML")
),collect,"","join")
,whether(has("body"),infer(Reflect.get,"body"),infer())
)(response);
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
 if(this.body.constructor?.name==="Buffer")
 return compose
(new Uint8Array(new ArrayBuffer(this.body.length))
,(buffer,array)=>{for(let i=0;i<array.length;i++){array[i]=buffer[i]};return array}
,"buffer"
)(this.body);
 return Buffer.from(this.body,"utf-8");
}});
};

 export var script=compose
(combine(fetch,infer()),whether
(match({status:200})
,compose(combine(compose(crop(1),"text"),drop(1,2)),modularise)
,compose(crop(1),"text",Error,exit)
)
);

 export function sourcemap(module,address)
{let sourcemap="/sourcemap?module="+address;
 let headers=["X-",""].map(field=>({[field+"SourceMap"]:sourcemap})).reduce(merge);
 let body=[module,"//# sourceMappingURL="+sourcemap].join("\n");
 return {body,type:mime("js"),headers};
};

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
 },Object.entries,provide
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
 export var cookies=buffer(compose(when(string),/ *; */,"split",provide,each(entry=>entry.split("=")),collect,Object.fromEntries),swap({}));
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

 export function clientwidth(){return process.stdout.columns;};

 export function inspector(port,host)
{return compose(fetch,"json",0,"devtoolsFrontendUrl")("http://"+host+":"+port+"/json");
};

 export function feature(agent)
{return agent&&prune.call
({attributes:{node:21,Chrome:123}
 ,assertions:{node:16.14,Chrome:91,Firefox:Infinity}
 ,json:{Chrome:125,Firefox:Infinity}
 },([feature,condition])=>
[true,Object.keys(condition).find(name=>agent[name])
].filter(Boolean).reduce((value,name)=>
 condition[name]<=agent[name])
);
};

 export function version(navigator)
{let agent=either("user-agent","userAgent",swap(undefined))(navigator);
 let device=/\((.*?)\)/.exec(agent)?.[1]?.split(";").reduce(function(platform)
{return {[platform]:arguments[3].splice(1).join(";")};
})||{};
 let entries=agent?.match(/[\w\.]+\/(\.{0,1}\d+){1,2}/g)?.map(agent=>agent.split("/"))||
 [[agent]];
 return entries.map(([name,version])=>({[name]:Number(version)})).reduce(merge,device);
};

 export var tests=
 {access:
[{context:[import.meta.url],terms:[value=>typeof value,"object"],condition:"equal"},
 {context:[import.meta.url,true],terms:[value=>typeof value,"string"],condition:"equal"}
],resolve:
[{scope:import.meta.url,context:[import.meta.url,"tests"],terms:[entry=>provide([entry,tests]),Object.is],condition:"ok"}
,{scope:import.meta.url,context:[import.meta.url],terms:[swap(scope),address,record=>record.hasOwnProperty("imports")],condition:"ok"}
//,{context:["./Harris_2015_rollup.js"],terms:[swap(scope),location+"/Harris_2015_rollup.js"],condition:"ok"}
],load:
[{context:[import.meta.url],terms:[" import","startsWith"],condition:"ok"}
]};
