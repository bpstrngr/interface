 import {note,wait,drop,infer,buffer,observe,compose,combine,revert,collect,stream,record,provide,compound,tether,bind,slip,string,is,not,iterable,defined,exit,expect} from "./Blik_2023_inference.js";
 import {search,merge,prune,route,random} from "./Blik_2023_search.js";
 let {default:reify}=compose(expect(module=>import(module),100,20),module=>
 // missing external module can't be loaded before loader registration. 
 ({default:reify}=module))("./Yahoo_2014_serialize.js");
 let address=new URL(import.meta.url).pathname;

 export async function parse(source,syntax="javascript",options={})
{// interpret language syntax. 
 if(!string(source))
 return Error("can't parse "+typeof source);
 if(is(Buffer)(source))
 source=source.toString();
 if(syntax==="json")return JSON.parse(source);
 let {Parser}=await import("./haverbeke_2012_acorn.js");
 let typescript=syntax==="typescript";
 if(typescript)
 Parser=await import("./tyrealhu_2023_acorn_typescript.js").then(({default:plugin})=>
 Parser.extend(plugin({dts:options.source?.endsWith(".d.ts")})));
 else if(!/xtuc_2020_acorn_importattributes/.test(options.source))
 // the typescript plugin includes support for importattributes. 
 Parser=await import("./xtuc_2020_acorn_importattributes.js").then(({importAttributes:plugin})=>
 Parser.extend(plugin));
 let comments=[];
 let scope=Parser.parse(source,{ecmaVersion:2022,sourceType:"module",onComment:comments,locations:typescript});
 comments.map(comment=>
 Object.assign(comment,{type:comment.type+"Comment"})).forEach(comment=>
 route(scope,comment,path));
 if(options.source)scope.meta=
 {url:options.source.startsWith("file:/")
?new URL(options.source)
:await import("url").then(({pathToFileURL:url})=>url(options.source))
 };
 return scope;
 function descendant(scope){return scope.start<this.start&&this.end<scope.end;};
 function sibling(scope,index,scopes){return (scopes[index-1]?.end??-1)<this.start&&this.end<scope.start;};
 function path(scope,comment)
{Array.isArray(scope)
?[descendant,sibling,undefined].reduce((found,find)=>
 found<0?find&&scope.findIndex(find.bind(comment)):found
,-1)
:descendant.call(comment,scope)&&
 ["body","declaration","consequent"].find((field)=>scope[field]);
};
};

 export async function sanitize(grammar,format)
{if(!Object.keys(format||{}).length)
 return grammar;
 if(grammar.body[0]?.type==="ExpressionStatement"&&grammar.body[0].expression.value==="use strict")
 grammar.body.shift();
 let {alias={},detach,replace,output,syntax,scripts}=format;
 let path=await import("path");
 let location=path.dirname(address);
 let relation=path.dirname(grammar.meta?.url.pathname||address);
 let disjunction=estree[syntax];
 if(disjunction)
 grammar=prune.call(grammar,function([field,value],path)
{let term=Object.values(disjunction).find(({condition})=>condition.call(this,value,field,path));
 return term?term.ecma.call(this,value,field,path):value;
});
 let imports=grammar.body.filter(value=>value?.type==="ImportDeclaration");
 let namespaces=imports.flatMap(value=>value.specifiers.map(({local})=>[local.name,value.source.name]));
 let [duplicates]=namespaces.reduce((groups,[name,source])=>(groups[groups[1][name]===source?"0":"1"][name]=source,groups),[{},{}]);
 duplicates=Object.entries(duplicates).flatMap(([name,source])=>imports.filter(value=>
 value.specifiers.some(({local})=>local.name===name)&&value.source.name===source).slice(1));
 duplicates.map(value=>grammar.body.indexOf(value)).sort().reverse().forEach(index=>delete grammar.body[index]);
 grammar=prune.call(grammar,function jsonnamespace({1:value})
{let boundary=["Import","ExportNamed","ExportAll"].map(type=>type+"Declaration").find(type=>type===value?.type);
 let json=boundary&&/\.json$/.test(value.source?.value);
 let namespace=json&&(boundary==="ExportAllDeclaration"||value.specifiers.some(({type,local})=>
 /^Import/.test(boundary)?type!=="ImportDefaultSpecifier":local.name!=="default"));
 if(!namespace)return value;
 let specifier=value.properties?.find(({type})=>type==="ImportNamespaceSpecifier")?.local;
 let local=specifier||{type:"Identifier",name:!value.specifiers?value.exported:value.source.value.replace(/[^a-zA-Z]/g,"")+"_object"};
 let statements=[{type:"ImportDeclaration",source:value.source,specifiers:[{type:"ImportDefaultSpecifier",local}]}];
 if(value.specifiers)
 statements.push({type:"VariableDeclaration",kind:"const",declarations:[{type:"VariableDeclarator",id:
 {type:"ObjectPattern",properties:value.specifiers?.map(specifier=>(
 {type:"Property",kind:"init"
 ,key:specifier.exported?specifier.local:specifier.imported
 ,value:specifier.exported||specifier.local
 }))
 },init:local}]});
 if(/^Export/.test(boundary))
 statements.push({type:"ExportNamedDeclaration",specifiers:value.specifiers?.map(specifier=>({...specifier,local:specifier.exported}))||
 [{type:"ExportSpecifier",local,exported:local}]});
 return provide(statements);
});
 if(/\.d\.ts$/.test(grammar.meta?.url.pathname))
 grammar=prune.call(grammar,function initialized({1:value})
{// typescript ambiguates uninitialized const as type declarations. 
 let declaration=value?.type==="ExportNamedDeclaration"?value.declaration:value;
 let uninitialized=declaration?.type==="VariableDeclaration"&&declaration.kind==="const"&&!declaration.declarations.some(({init})=>init);
 return uninitialized?undefined:value;
});
 alias=Object.fromEntries(Object.entries(alias).flatMap(([field,value])=>
 string(value)?[[field,value]]:grammar.meta.url.pathname.endsWith(field)?Object.entries(value):[]));
 if(Object.keys(alias).length)
 grammar=prune.call(grammar,function({1:value})
{let candidate=["Import","Import","ExportNamed","ExportAll"].map((type,index)=>type+(index?"Declaration":"Expression")).includes(value?.type);
 let source=candidate&&alias[value.source?.value];
 if(!source) return value;
 source=/^\./.test(source)?"./"+path.relative(relation,path.resolve(location,source)):source;
 source=["value","raw"].map(field=>
 value.source[field].replace(value.source.value,source)).reduce((value,raw)=>(
 {value,raw}));
 return [value,{source}].reduce(merge,{});
});
 let fields={Literal:"value",Identifier:"name"};
 let generic=Object.keys(replace||{}).some(type=>fields[type]);
 if(!generic)
 replace=replace?.[Object.keys(replace).find(field=>grammar.meta.url.pathname.endsWith(field))];
 if(replace)
 grammar=prune.call(grammar,function({1:value})
{let values=replace[value?.type];
 let field=fields[value?.type];
 let replacement=values?.hasOwnProperty(value?.[field])&&values[value[field]];
 return replacement?{...value,[field]:replacement,...value?.type==="Literal"&&{raw:"\""+replacement+"\""}}:value;
});
 if(detach)
 // detach imports and their direct assignments - further usages are expected to be edited instead of sanitized. 
 grammar=Object.values(search.call(grammar,({1:value})=>
 value?.type==="ImportDeclaration"&&detach.includes(value.source.value))).reduce((grammar,declaration)=>
 prune.call(grammar,({1:value})=>value===declaration||
 (value?.declarations||[value||{}]).some(({init})=>
 init?.name&&declaration.specifiers.some(({local})=>local.name===init.name))?undefined:value),grammar);
 // default import of es namespaces by commonjs should not be supported. "edit" the files instead. 
 // if(defaultexport&&!grammar.body.some(value=>value?.type==="ExportDefaultDeclaration"))
 // grammar.body.push(
 // {type:"ExportNamedDeclaration"
 // ,specifiers:grammar.body.flatMap((value,index)=>
 // ["ExportNamedDeclaration","ExportAllDeclaration"].includes(value?.type)?[[index,value]]:[]).map(([index,value])=>
 // grammar.body[index]=value.declaration||Object.assign(value,
 // {type:"ImportDeclaration"
 // ,specifiers:value.specifiers?.map(specifier=>Object.assign(specifier,{type:"ImportSpecifier"}))||
 // [{type:"ImportNamespaceSpecifier",local:value.exported}]
 // })).flatMap(value=>
 // value.specifiers||value.declarations).map(({local,id})=>({type:"ExportSpecifier",local:local||id,exported:local||id}))
 // })
 await ["banner","footer"].map(extension=>
 output?.[extension]).reduce(record((extension,index)=>
 extension&&stream(extension,parse,({body})=>
 grammar.body[index?"push":"unshift"](...body)))
,[]);
 return grammar;
};

 var functional=term=>"FunctionDeclaration/FunctionExpression/ArrowFunctionExpression".split("/").includes(term?.type);
 var synchronous=({1:term})=>functional(term)&&term.async?undefined:term;
 var requirecall=term=>term?.type==="CallExpression"&&term.callee?.name==="require";
 var linear=(scope,field,index,path)=>scope[field].type==="TryStatement"?!path.splice(index):scope[field];

 export var estree=
 // sort by decreasing specificity for declarative disjunction (Object.values(estree.dialect)). 
 {commonjs:
 {defaultexport:
 {condition(term,field,path){return !path.length&&field==="body";}
 ,ecma(term)
{// declare commonjs module.exports in module scope. 
 [{type:"Identifier",name:"module"},{type:"Identifier",name:"exports"}].reduce((module,exports)=>
 term.unshift(
 term.find((statement,index,body)=>
 statement?.kind==="let"&&
 ["exports","module"].map((name,index)=>statement.declarations[index]?.id.name===name).every(Boolean)&&
 delete body[index])||
 {type:"VariableDeclaration",kind:"let",declarations:
[{type:"VariableDeclarator",id:exports,init:{type:"ObjectExpression",properties:[]}}
,{type:"VariableDeclarator",id:{type:"Identifier",name:"module"},init:{type:"ObjectExpression",properties:
[{type:"Property",key:exports,value:exports,shorthand:true,kind:"init"}
]}
 }
]})&&
 // expose commonjs module.exports as default export. 
 term.some(statement=>statement?.type==="ExportNamedDeclaration"&&
 statement.specifiers.some?.(({exported})=>exported?.name==="default"))||
 term.push(
 term.find((statement,index,body)=>statement?.type==="ExportDefaultDeclaration"&&
 // statement.declaration.object?.name==="module"&&
 // statement.declaration.property?.name==="exports"&&
 delete body[index])||
 {type:"ExportDefaultDeclaration"
 ,exportKind:"value"
 ,declaration:{type:"MemberExpression",object:module,property:exports}
 }));
 return term;
}}
 ,require:
 {condition(term,field,path)
{let toplevel=path.length===1;
 let asynchronous=!toplevel&&functional(term)&&term.async;
 if(!toplevel&&!asynchronous)return;
 let scope=prune.call(term,synchronous);
 let requires=search.call({scope},({1:term})=>requirecall(term));
 return Object.keys(requires).length;
},ecma(term,field,path)
{let scope=prune.call(term,synchronous);
 let requires=search.call(scope,({1:term})=>requirecall(term));
 let modulescope=!functional(term);
 let dynamic=term.async;
 let values=Object.entries(requires).map(([path,{arguments:[source]}])=>
 dynamic||(modulescope&&![0,path.split("/")].flat().reduce(linear,[scope]))
?{type:"AwaitExpression",argument:
 {type:"CallExpression",callee:
 {type:"MemberExpression"
 ,object:{type:"ImportExpression",source}
 ,property:{type:"Identifier",name:"then"}
 },arguments:
[{type:"ArrowFunctionExpression",expression:true
 ,params:[{type:"ObjectPattern",properties:
[{type:"Property",kind:"init"
 ,key:{type:"Identifier",name:"default"}
 ,value:{type:"Identifier",name:"module"}
 }
]}]
 ,body:{type:"Identifier",name:"module"}
 }
]}
 }
:{type:"Identifier",name:source.value.replace(/[^a-zA-Z]/g,"")+"_exports"});
 let expression=values.reduce((term,value,index)=>
 merge(term,value,Object.keys(requires)[index].split("/")),term);
 if(dynamic)return expression;
 let imports=Object.entries(requires).map(([path,require],index)=>
 modulescope&&![0,path.split("/")].flat().reduce(linear,[scope])?undefined
:{type:"ImportDeclaration",source:require.arguments[0]
 ,specifiers:
[{type:"ImportDefaultSpecifier",local:values[index],imported:values[index]}
]}).filter(Boolean);
 return provide([...imports,expression]);
}}
  // module.exports exportdefaultdeclaration prepended to scope instead. 
//  ,export:
//  {condition(value)
// {if(value?.type!=="ExpressionStatement")return false;
//  let named=value.expression.left?.object?.name==="exports";
//  if(named)return true;
//  let major=value.expression.left?.object?.name==="module"&&value.expression.left.property.name==="exports";
//  if(major)return true;
// },ecma(value)
// {if(value.expression.left?.object?.name==="module")
//  return {type:"ExportDefaultDeclaration",declaration:value.expression.right};
//  let id=value.expression.left.property;
//  let init=value.expression.right;
//  let specifier=init.type==="Identifier";
//  let exported=specifier?{specifiers:[{type:"ExportSpecifier",exported:id,local:init}]}:{declaration:{type:"VariableDeclaration",kind:"var",declarations:[{id,init}]}};
//  if(!specifier&&estree.commonjs.require.condition(exported.declaration))
//  return Object.assign(estree.commonjs.require.ecma(exported.declaration),{type:"ExportNamedDeclaration"});
//  return Object.assign(value,{type: "ExportNamedDeclaration",expression: undefined,...exported});
// }}
 ,dirname:
 {condition(value){return value?.type==="Identifier"&&value.name==="__dirname";}
 ,ecma()
{return {type:"CallExpression",callee:
 {type:"MemberExpression"
 ,object:{type:"Identifier",name:"path"},property:{type:"Identifier",name:"dirname"},computed:false,optional:false
 },arguments:
[{type:"MemberExpression",object:
 {type:"NewExpression",callee:{type:"Identifier",name:"URL"},arguments:
[{type:"MemberExpression"
 ,object:{type:"MetaProperty",meta:{type:"Identifier", name:"import"}, property: {type:"Identifier", name:"meta"}}
 ,property:{type:"Identifier",name:"url"},computed:false,optional:false
 }
]},property:{type:"Identifier",name:"pathname"},computed:false,optional:false
 }
]};
}}
 }
 ,typescript:
 {method:{condition(value){return value?.type==="MethodDefinition"&&value?.value?.type==="TSDeclareMethod";},ecma(){return undefined;}}
 ,expression:
 {condition(value){return ["TSAsExpression","TSNonNullExpression"].includes(value?.type);}
 ,ecma(value)
{// embedded expressions need more robust drilling than this disjunction. 
 let expression=value.expression?.expression||value.expression;
 delete value.expression;
 return expression?{...value,...expression}:value;
}}
 ,interface:
 {condition(value){return ["TSInterfaceDeclaration","TSTypeAliasDeclaration","TSEnumDeclaration"].includes(value?.type);}
 ,ecma(value)
{let enumtype=value.type==="TSEnumDeclaration";
 let init=enumtype
?{type:"ObjectExpression"
 ,properties:value.members.map(member=>(
 {type:"Property",kind:"init",key:member.id
 ,value:member.initializer||{type:"Literal",value:member.id.name,raw:"'"+member.id.name+"'"}
 }))
 }
:{type:"Literal",kind:"undefined"};
 return {type:"VariableDeclaration",kind:"const",declarations:[{id:value.id,init}]};
}}
 ,typeimport:
 {condition(value)
{return value?.type==="ImportDeclaration"&&(value.importKind==="type"||value.specifiers?.every(({importKind})=>importKind==="type"));
},ecma(){return undefined;}
 }
 ,typespecifier:
 {condition(value){return value?.type==="ImportSpecifier"&&value.importKind==="type"}
 ,ecma(){return undefined;}
 }
 ,importequals:
 {condition(value){return value?.type==="TSImportEqualsDeclaration";}
 ,ecma({id,moduleReference:{left:object,right:property,expression}})
{return {type:"VariableDeclaration",kind:"const",declarations:
[{type:"VariableDeclarator",id,init:expression||{type:"MemberExpression",object,property}}
]};
}}
 ,genericinstance:{condition(value){return value?.type==="TSInstantiationExpression";},ecma(value){return value.expression;}}
 ,declaredproperty:{condition(value){return value?.type==="PropertyDefinition"&&value.declare;},ecma(){return undefined;}}
 ,implicitproperty:{condition(value,field)
{return value?.type==="ClassDeclaration"&&
 value.body.body.find(({kind})=>kind==="constructor")?.value.params.some(({type})=>type==="TSParameterProperty");
},ecma(value)
{let {body:structure}=value.body;
 let index=structure.findIndex(({kind})=>kind==="constructor");
 let method=structure[index];
 let {value:{params,body:{body}}}=method;
 let properties=params.filter(({type})=>type==="TSParameterProperty").map(({parameter})=>({type:"PropertyDefinition",key:parameter,value:null}));
 let assignments=properties.map(({key})=>({type:"ExpressionStatement",expression:
 {type:"AssignmentExpression", operator:"="
 ,left:{type:"MemberExpression",object:{type:"ThisExpression"},property:key.left||key}
 ,right:key.left||key
 }}));
 let inheritence=body.findIndex(statement=>statement.expression?.callee?.type==="Super")+1;
 params=[Array(params.length).fill(undefined),params.map(param=>param.type==="TSParameterProperty"?param.parameter:param)].flat();
 body=[Array(body.length).fill(undefined),body.slice(0,inheritence),assignments,body.slice(inheritence)].flat();
 method=[method,{value:{params,body:{body}}}].reduce(merge,{});
 structure={...[Array(structure.length).fill(undefined),properties,structure].flat(),[index+structure.length+properties.length]:method};
 return [value,{body:{body:structure}}].reduce(merge,{});
}}
 ,annotation:{condition(value){return value?.type?.startsWith("TS");},ecma(){return undefined;}}
 ,bindtype:{condition(value,field){return field==="params"&&value[0]?.name==="this";},ecma(value){return value.slice(1);}}
 }
 };

 export function serialize(syntax,format="astring",options)
{// convert abstract syntax tree or runtime namespace to javascript;
 if(string(syntax))
 syntax=JSON.parse(syntax);
 let {type,body,sourceType}=syntax;
 if(type==="Program")
 return (
 {astring:["./davidbonnet_2015_astring.js","generate"]
 ,babel:["./node_modules/@babel/generator/lib/index.js","default"]
 }[is(Function)(format)?"astring":format]||[format,"default"]).reduce((module,term)=>
 import(module).then(module=>module[term](syntax,options))).then(is(Function)(format)?format:infer());
 let {exports,imports,procedures}=syntax;
 imports=Object.entries(imports||{}).map(([module,names])=>[module,[names].flat()]).flatMap(([module,names],index)=>
[(index=names.findIndex(name=>name.startsWith("*")))>-1?[module,names.splice(index,1)]:[]
,[module,names]
]).filter(({1:names})=>names?.join("").length).map(([module,names])=>!module.endsWith(".json")
?names.reduce((imports,name,index,names)=>imports+(index&&names[index-1]?",":"")+(index===1?"{":"")+name
," import ")+(names.length>1?"}":"")
+" from \""+module+"\""+(/\.json$/.test(module)?" with {type:\"json\"}":"")+";"
:(" var {default:"+names[0]+"}=await resolve(\""+module+"\");")).join("\n")
,exports=!exports?""
:[Object.entries(exports||{}).map(([field,term])=>
 "export "+({default:field+" "}[field]||("var "+field+"="))+reify(term)).join("\n\n")
,""].join("\n");
 procedures=[procedures].flat().filter(Boolean).map(proceduralize);
 let output=compose(collect,infer("filter",Boolean),"\n\n","join",)(imports,exports,...procedures);
 return is(Function)(format)?format(output):output;
};

 export function proceduralize(term)
{if(term instanceof Function)
 return String(term||"").replace(/(^(async ){0,1}function *\w*\([\w,\n]*\)\n* *\{\n*)|(\}$)/g,"");
 if(string(term))
 return term;
 throw Error("can't proceduralize "+typeof term);
};

 export function aphorize(source)
{if(compound(source))
 return JSON.stringify(source).replace(/:{|},|}}|}]/g,match=>match[0]+"\n "+match.substring(1));
 return source.replace(/(\}\})(,\"[^\"]*\":)(\{)/g,(...match)=>match.slice(1,4).join("\n "));
};

//  export async function modularise(resource,identifier,context={})
// {// uses --experimental-vm-modules 
//  let {SourceTextModule,createContext,isContext}=await import("vm");
//  let {default:{resolve}}=await import("path");
//  if(!isContext(context))
//  context=createContext(
//  {cache:new Map(),imports:new Map()
//  ,importModuleDynamically:identifer=>({})
//  ,initializeImportMeta:meta=>Object.assign(meta,{url:identifier})
//  })
//  let module=new SourceTextModule(resource||"",{identifier,context});
//  context.cache.set(identifier,module);
//  await module.link((identifier,{context})=>
//  context.cache.has(identifier)
// ?context.cache.get(identifier)
// :import(identifier).then(module=>
//  context.imports.set(identifier,module)&&
//  modularise(Object.getOwnPropertyNames(module).sort(name=>
//  name!="default"||-1).map((name,index,exports)=>name=="default"
// ?"export default imports.get(\""+identifier+"\").default;"
// :"export const {"+exports.splice(index).join(",")+`}=
//  imports.get("`+identifier+"\");").join("\n")
// ,identifier,context)));
//  await module.evaluate();
//  return module;
// };

export async function imports(syntax,format={}) {
  if(typeof syntax==="string")
  syntax=await stream(syntax,true,access,format.syntax,{...format,source:await import("url").then(({pathToFileURL:url})=>url(syntax))},parse);
  let path=await import("path");
  let terms = search.call(syntax,([field,scope])=>["Declaration", "Expression"].map((type) => "Import" + type).includes(scope?.type));
  let sources = Object.values(terms)
    .map(({ source }) => source.value)
    .filter((source) => source?.startsWith("."))
    .map((peer) => path.resolve(path.dirname(syntax.meta.url.pathname), peer));
  sources = await sources.reduce(record(async source=>
  stream(source,format,imports)), []);
  return { [syntax.meta.url.pathname]: sources.reduce(merge, {}) };
}

 export async function exports(source)
{let path=await import("path");
 if(!string(source))
 return compose.call
(source,tether(search,({1:value})=>/^Export(Named|All)Declaration$/.test(value?.type)),Object.values
,infer("map",({specifiers,declaration,source:reexport})=>specifiers||declaration
?[["./"+path.relative(address.replace(/\/.*?$/,""),source.meta.url.pathname),specifiers.length&&specifiers?.map(({exported:{name}})=>name)||
 [declaration.declarations||declaration].flat().map(({id})=>id.name)]]
:[[source.meta.url.pathname.replace(/\/.*?$/,"/")+reexport.value,"*"]])
,infer("map",Object.fromEntries)
,infer("reduce",(exports,entry)=>merge(exports,entry,0))
,Object.entries
,infer("map",([source,names])=>[source,["",names].flat()])
,Object.fromEntries
);
 let module = await import(source);
 let sources = await stream(imports(source), source, Reflect.get);
 await prune.call(sources, ([path, term]) =>
 exports(path).then((exports) => [term, exports].reduce(merge))
 );
 let scopes = scope(module);
 return [sources, scopes].reduce(merge);
};

 export async function reexport(modules,relation)
{let path=relation?await import("path"):undefined;
 let statements=Object.entries(modules).map(([source,names])=>
 names.reduce((exports,name,index,names)=>
 exports+(index&&names[index-1]?",":"")+(index===1?"{":"")+name
," export ")+(names.length>1?"}":"")
+" from \"./"+(path?.relative(relation,path.resolve(source))||source)+"\";");
 return statements.join("\n ");
};

 export function coordinates(source,position)
{return source.slice(0,position).split("\n").reverse().flatMap((line,index,lines)=>
 [lines.length-1,position-lines.splice(1).join("\n").length-1]);
};

 export function scope(module)
{let entries=Object.entries(module).map(([path,term])=>
[path,term&&typeof term=="object"?scope(term):term?.toString()||term
]);
 return Object.fromEntries(entries);
};

 export async function test(namespace,tests,path=[])
{// compose tests defined in namespace. 
 let assert=await import("assert");
 if(typeof namespace==="string"&&!path.length)namespace=await import(namespace);
 tests=tests||namespace.tests||{};
 let fails=await Object.entries(tests).reduce(record(async function evaluate([term,value])
{let traverse=!value.condition||is(compound,not(iterable))(value.condition)||value.condition?.some?.(condition=>condition.condition);
 if(traverse)return test(namespace[term]??namespace,value,path.concat(term));
 let {tether,scope,context=[],terms=[],condition}=value;
 scope=scope||tether;
 context=[context].flat();
 if(!context.length)context.push(undefined);
 try
{await compose.call(...context,buffer((namespace[term]??namespace).bind(scope)),...[terms].flat(),assert[condition]||condition);
}catch(fail)
{let field=path.concat(term).join("/");
 let {stack}=fail;
 console.log(field+": \x1b[31m"+stack+"\x1b[0m");
 return {[field]:stack};
}
 return {};
})
,[]);
 fails=fails.reduce(merge,{});
 if(path.length)return fails;
 let format=(item,order,items)=>stream(
 Math.max(...items.map(({length})=>length))
,length=>item+(order%Math.floor(process.stdout.columns/length)? " ".repeat(length-item.length):"\n"));
 let report=[fails,tests,namespace].map((subject,index)=>
["\x1b["+["31mFAIL:","32mPASS:","34mSKIP:"][index]
,...Object.keys(subject).map(index?field=>field:field=>field.match(/(.*?)(\/|$)/)[1]),
]).map((subject,index,subjects)=>
 subject.filter(test=>
 !subjects.slice(0,index).flat().includes(test)).slice(0,15).concat(subject.length<16
?(!subject.length?"-":[])
:"...").map(format).join("")).filter(subject=>subject.length>11).join("\n")+"\x1b[0m\n";
 if(Object.keys(fails).length)throw report;
 return report;
};

 export const tests=
 {parse:
 {empty:{context:[""],terms:["type","Program"],condition:"equal"}
 }
 ,sanitize:
 {dynamicrequire:
 {block:{context:["var a=!async function(){a=require('')}()",parse,{syntax:"commonjs"}],terms:[serialize,"let exports = {}, module = {\n  exports\n};\nvar a = !(async function () {\n  a = await import('').then(({default: module}) => module);\n})();\nexport default module.exports;\n"],condition:"equal"}
 ,lambda:{context:["setTimeout(async time=>a=require(''),3000)",parse,{syntax:"commonjs"}],terms:[serialize,"let exports = {}, module = {\n  exports\n};\nsetTimeout(async time => a = await import('').then(({default: module}) => module), 3000);\nexport default module.exports;\n"],condition:"equal"}
 }
 }
 ,estree:
 {commonjs:
 {require:
 {condition:
 {static:
[{context:["a.b=require('')",parse,tether(search,["body",0]),"0",["body"]],terms:[true],condition:"equal"}
,{context:["require('')",parse,tether(search,["body",0]),"0",["body"]],terms:[true],condition:"equal"}
]}
 ,ecma:
 {static:
[{context:["require('')",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\n_exports;\n"],condition:"equal"}
,{context:["require('')()",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\n_exports();\n"],condition:"equal"}
,{context:["a=require('')()",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\na = _exports();\n"],condition:"equal"}
,{context:["a.b=require('')",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\na.b = _exports;\n"],condition:"equal"}
,{context:["const a=require('');",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\nconst a = _exports;\n"],condition:"equal"}
,{context:["function a(){compose({a:require('')})}",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"import _exports from '';\nfunction a() {\n  compose({\n    a: _exports\n  });\n}\n"],condition:"equal"}
],dynamic:
[{context:["async function a(){const a=require('')}",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"async function a() {\n  const a = await import('').then(({default: module}) => module);\n}\n"],condition:"equal"}
,{context:["async function a(){compose({a:require('')})}",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"async function a() {\n  compose({\n    a: await import('').then(({default: module}) => module)\n  });\n}\n"],condition:"equal"}
,{context:["try{b=require('')}catch(fail){}",parse,tether(search,["body",0])],terms:[(...body)=>({type:"Program",body}),serialize,"try {\n  b = await import('').then(({default: module}) => module);\n} catch (fail) {}\n"],condition:"equal"}
]}
 }
 }
 ,typescript:
 {typeimport:{condition:
[{context:["import type {a} from 'a'","typescript",parse,tether(search,["body",0])],terms:[true],condition:"equal"}
,{context:["import type a from 'a'","typescript",parse,tether(search,["body",0])],terms:[true],condition:"equal"}
,{context:["import a from 'a'","typescript",parse,tether(search,["body",0])],terms:[false],condition:"equal"}
]}
 }
 }
 };
