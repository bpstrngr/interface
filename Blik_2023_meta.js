 import {note,wait,pass,drop,swap,infer,either,buffer,observe,compose,combine,revert,collect,stream,record,provide,compound,tether,bind,slip,string,numeric,functor,is,not,iterable,defined,exit,expect} from "./Blik_2023_inference.js";
 import {search,merge,prune,route,random,relevant} from "./Blik_2023_search.js";
 let address=new URL(import.meta.url).pathname;

 export async function parse(source,syntax="javascript",options={})
{// interpret language syntax. 
 if(!string(source))
 return Error("can't parse "+typeof source);
 if(is(Buffer)(source))
 source=source.toString();
 if(syntax==="json")return JSON.parse(source);
 let url=options.source?options.source.startsWith("file:/")
?new URL(options.source)
:await import("url").then(({pathToFileURL:url})=>url(options.source))
:null;
 if(syntax==="flow")return import("./facebook_2014_flow_parser.js").then(({default:{parse}})=>parse(source
,{all_comments:false,comments:false,enums:false,tokens:false,types:true
 ,use_strict:false,esproposal_decorators:false,esproposal_export_star_as:false
 })).then(grammar=>merge(grammar,{meta:{url}}));
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
 if(url&&!scope.meta?.url)
 scope.meta={url};
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
 let disjunction=estree[syntax==="flow"?"typescript":syntax];
 if(disjunction)
 grammar=prune.call(grammar,function([field,value],path)
{return Object.entries(disjunction).reduce((value,{1:{condition,ecma}})=>
 value&&condition.call(this,value,field,path)?ecma.call(this,value,field,path):value,value);
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
 let route=path.relative(location,grammar.meta.url.pathname).split("/").slice(2).join("/");
 alias=relevant(alias,route);
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
 let iife=term.expression?.type==="CallExpression"&&
 term.expression.callee.type==="FunctionExpression";
 let modulescope=!functional(term)&&!iife;
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
 {method:
 {condition(value){return ["DeclareVariable","DeclareFunction","DeclareClass"].includes(value.type)||value?.type==="MethodDefinition"&&value?.value?.type==="TSDeclareMethod";}
 ,ecma(){return undefined;}
 }
 ,expression:
 {condition(value){return [["TSAsExpression","TSNonNullExpression"],["TypeCastExpression"]].flat().includes(value?.type);}
 ,ecma(value,field)
{// embedded expressions need more robust drilling than this disjunction. 
 let expression=[value.expression?.expression,value.expression].find(compound);
 return expression?[value,{expression:undefined,...expression}].reduce(merge,{}):value;
}}
 ,interface:
 {condition(value)
{return [["TSInterfaceDeclaration","TSTypeAliasDeclaration","TSEnumDeclaration"],["TypeAlias","InterfaceDeclaration"]].flat().includes(value?.type);
},ecma(value)
{let enumtype=value.type==="TSEnumDeclaration";
 let init=enumtype
?{type:"ObjectExpression"
 ,properties:value.members.map(member=>(
 {type:"Property",kind:"init",key:member.id
 ,value:member.initializer?.type!=="BinaryExpression"&&member.initializer||{type:"Literal",value:member.id.name,raw:"'"+member.id.name+"'"}
 }))
 }
:{type:"Literal",kind:"undefined"};
 return {type:"VariableDeclaration",kind:"const",declarations:[{id:value.id,init}]};
}}
 ,typeexport:
 {condition(value){return value.type==="ExportNamedDeclaration"&&["OpaqueType","TypeAlias"].includes(value.declaration?.type)||value.exportKind==="type";}
 ,ecma(){return undefined;}
 }
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
 ,declaredproperty:{condition(value){return value?.type==="PropertyDefinition"&&(value.declare||!value.value);},ecma(){return undefined;}}
 ,assignedproperty:{condition(value)
{return ["ClassDeclaration","ClassExpression"].includes(value?.type)&&
 value.body.body.some(value=>value.type==="PropertyDefinition"&&!value.static&&value.value);
},ecma(value)
{let structure=Array.from(value.body.body);
 let properties=structure.filter((value,index,structure)=>
 value.type==="PropertyDefinition"&&!value.static&&value.value&&delete structure[index]);
 let assignments=properties.map(({key,value},index)=>({type:"ExpressionStatement",expression:
 {type:"AssignmentExpression",operator:"="
 ,left:{type:"MemberExpression",object:{type:"ThisExpression"},property:key}
 ,right:value
 }}));
 let method=structure.findIndex(value=>value?.kind==="constructor");
 if(!structure[method])
 method=structure.unshift(
 {type:"MethodDefinition",kind:"constructor"
 ,key:{type:"Identifier",name:"constructor"}
 ,value:{type:"FunctionExpression",params:[],body:{type:"BlockStatement"}}
 })%structure.length;
 let body=Array.from(structure[method].value.body.body||
[value.superClass
?{type:"ExpressionStatement",expression:
 {type:"CallExpression",callee:{type:"Super"}
 ,arguments:[{type:"SpreadElement",argument:{type:"Identifier",name:"arguments"}}]
 ,optional:false
 }
 }
:[]
].flat());
 let index=body.findIndex(statement=>statement.expression?.callee?.type==="Super")+1;
 body.splice(index,0,...assignments);
 structure[method]=[structure[method],{value:{body:{body}}}].reduce(merge,{});
 return [value,{body:{body:structure.flat()}}].reduce(merge,{});
}}
 ,implicitproperty:{condition(value)
{return ["ClassDeclaration","ClassExpression"].includes(value?.type)&&
 value.body.body.find(({kind})=>kind==="constructor")?.value.params.some(({type})=>type==="TSParameterProperty");
},ecma(value)
{let {body:structure}=value.body;
 let index=structure.findIndex(({kind})=>kind==="constructor");
 let method=structure[index];
 let {value:{params,body:{body}}}=method;
 let implicit=params.filter(({type})=>type==="TSParameterProperty");
 let assignments=implicit.map(({parameter},index)=>({type:"ExpressionStatement",expression:
 {type:"AssignmentExpression",operator:"="
 ,left:{type:"MemberExpression",object:{type:"ThisExpression"},property:parameter.left||parameter}
 ,right:!parameter.right
 ?parameter.left||parameter
 :["LogicalExpression",parameter].reduce((type,{left,right})=>({type,operator:"||",left,right}))
 }}));
 let inheritence=body.findIndex(statement=>statement.expression?.callee?.type==="Super")+1;
 params=[Array(params.length).fill(undefined),params.map(param=>param.type==="TSParameterProperty"?param.parameter:param)].flat();
 body=[Array(body.length).fill(undefined),body.slice(0,inheritence),assignments,body.slice(inheritence)].flat();
 method=[method,{value:{params,body:{body}}}].reduce(merge,{});
 structure={...[Array(structure.length).fill(undefined),structure].flat(),[index+structure.length]:method};
 return [value,{body:{body:structure}}].reduce(merge,{});
}}
 ,annotation:{condition(value){return value?.type?.startsWith("TS");},ecma(){return undefined;}}
 ,bindtype:{condition(value,field){return field==="params"&&value[0]?.name==="this";},ecma(value){return value.slice(1);}}
 ,jsx:
 {condition(term){if(term.type==="JSXElement")return true;}
 ,ecma({openingElement:open,children})
{//note(term.children,term.openingElement.attributes.map(({value})=>value))
 let leaf=/^[a-z]/.test(open.name.name);
 return (
 {type:"CallExpression",optional:false
 ,callee:{type:"MemberExpression",object:{type:"Identifier",name:"React"},property:{type:"Identifier",name:"createElement"}}
 ,arguments:
[leaf?{type:"Literal",value:open.name.name,raw:"\""+open.name.name+"\""}:{...open.name,type:"Identifier"}
,{type:"ObjectExpression"
 ,properties:open.attributes.map(({argument,name,value})=>argument
?{type:"SpreadElement",argument}
:{type:"Property",kind:"init",key:{...name.name===value.expression.value?{...name,type:"Identifier"}:{type:"Literal",value:name.name,raw:"\""+name.name+"\""}},value:value.expression})
 }
,...children.map(term=>term.type==="JSXText"?{...term,type:"Literal"}:term.expression)
].filter(term=>term?.type!=="Literal"||term.raw!==term.value)
 });
}}
 ,jsxexpression:
 {condition(term){return term.type==="JSXExpressionContainer"}
 ,ecma(term){return term;}
 }
 }
 };

 export function serialize(syntax,format="astring",options)
{// convert abstract syntax tree or runtime namespace to javascript;
 if(functor(syntax))
 // functions may be serialized as "name(){}", "function(){}", or with a name different from the object field. 
 return [String(syntax),/^async /].reduce((source,prefix)=>
 source.replace(prefix,"").replace(/^([a-zA-Z\*]+)( *)([a-zA-Z]*)|^\(/
,(match,declaration,space,name)=>format&&![name,declaration].includes(format)?
["var "+format+"=",declaration?"function":match
,[declaration,name].find(name=>!/function\**/.test(name))?.replace(/^(.)/," $1")
].join(""):
[prefix.test(source)?"async ":"","function",space||format&&" ",format].join("")));
 if(syntax[Symbol.toStringTag]==="Module")
 return prune.call(syntax,([field,term],path)=>
 functor(term)?!path.length?" export "+serialize(term,field):String(term):term);
 if(string(syntax))
 return syntax.startsWith("data:text/javascript;")?syntax.replace(/^data:text\/javascript;/,""):JSON.stringify(syntax);
 let parser=
 {astring:["./davidbonnet_2015_astring.js","generate"]
 ,babel:["./node_modules/@babel/generator/lib/index.js","default"]
 }[functor(format)?"astring":format];
 if(parser&&syntax.type==="Program")
 return parser.reduce((module,term)=>
 import(module).then(module=>module[term](syntax,options))).then(functor(format)?format:infer());
 let {exports,imports,procedures}=syntax;
 if(![exports,imports,procedures].some(Boolean)||format==="json")
 return Object.entries(prune.call(syntax,([field,value])=>
 functor(value)?"data:text/javascript;"+serialize(value,null):value)).reduce((literal,[field,value],index,{length})=>[literal,
[/[^\w]/.test(field)?JSON.stringify(field):field
,serialize(value,null)
].join(":")].join(index?",":"")
,"{")+"}";
 imports=Object.entries(imports||{}).map(([module,names])=>[module,[names].flat()]).flatMap(([module,names],index)=>
[(index=names.findIndex(name=>name.startsWith("*")))>-1?[module,names.splice(index,1)]:[]
,[module,names]
]).filter(({1:names})=>names?.join("").length).map(([module,names])=>!module.endsWith(".json")
?names.reduce((imports,name,index,names)=>imports+(index&&names[index-1]?",":"")+(index===1?"{":"")+name
," import ")+(names.length>1?"}":"")
+" from \""+module+"\""+(/\.json$/.test(module)?" with {type:\"json\"}":"")+";"
:(" var {default:"+names[0]+"}=await resolve(\""+module+"\");")).join("\n");
 exports=!exports?""
:[Object.entries(exports||{}).map(([field,term])=>
["export "+({default:field+" "}[field]||!functor(term)&&"var "+field+"="||"")
,functor(term)?serialize(term,{[field]:field,default:term.name}[field]):serialize(term,null)
].join("")).join("\n\n")
,""].join("\n");
 procedures=[procedures].flat().filter(Boolean).map(proceduralize);
 let output=compose(collect,infer("filter",Boolean),"\n\n","join",)(imports,exports,...procedures);
 return functor(format)?format(output):output;
};

 export function proceduralize(term,...terms)
{if(terms.length)
 return Array.from(arguments).map(term=>proceduralize(term)).join("\n");
 if(string(term))
 return term;
 if(term instanceof Function)
 return String(term||"").replace(/(^(async ){0,1}function *\w*\([\w,\n]*\)\n* *\{\n*)|(\}$)/g,"");
 throw Error("can't proceduralize "+typeof term);
};

 export function aphorize(source)
{//let semiotics=
//  {"}":function(last){last.replace(/{[^{[]+?/,match=>"\n "+match);}
//  ,"}":function(){}
//  };
//  if(compound(source))
//  return Array.from(JSON.stringify(source)).reduce(([last,...aphorisms],symbol,index,text)=>
//  [semiotics[symbol]?.(last)||last+symbol,aphorisms].flat()
// ,[]);
 return [/[:,]{\"[^\"]+?[^(:{),}]+?/g,/}[},]|\"}|\",\"/g].reduce((source,pattern)=>
 source.replace(pattern,match=>match[0]+"\n "+match.substring(1)+(/["}]}/.test(match)?"\n ":""))
,JSON.stringify(source).replace(/^[{]/,match=>" "+match).replace(/[:,]\[([^\[\],]{2,},|{[^}\]]+)|(,[^\],]+?|[\]}])\]/g,match=>match[0]+"\n"+match.slice(1)));
 return source.replace(/(\}\})(,\"[^\"]*\":)(\{)/g,(...match)=>match.slice(1,4).join("\n "));
};

 export async function imports(syntax,format={})
{if(typeof syntax==="string")
 syntax=await stream(syntax,true,access,format.syntax,{...format,source:await import("url").then(({pathToFileURL:url})=>url(syntax))},parse);
 let path=await import("path");
 let terms=search.call(syntax,([field,scope])=>["Declaration","Expression"].map(type=>"Import"+type).includes(scope?.type));
 let sources=Object.values(terms).map(({source})=>source.value).filter(source=>source?.startsWith(".")).map(peer=>
 path.resolve(path.dirname(syntax.meta.url.pathname),peer));
 sources=await sources.reduce(record(async source=>
 stream(source,format,imports)),[]);
 return {[syntax.meta.url.pathname]:sources.reduce(merge,{})};
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
,infer("reduce",(exports,entry)=>merge(exports,entry,0),{})
,Object.entries
,infer("map",([source,names])=>[source,["",names].flat()])
,Object.fromEntries
);
 let module=await import(source);
 let sources=await stream(imports(source),source,Reflect.get);
 await prune.call(sources,([path,term])=>
 exports(path).then(exports=>[term,exports].reduce(merge)));
 let scopes=scope(module);
 return [sources,scopes].reduce(merge);
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

 export function scope(module,functions=null)
{return tether(prune,([field,term])=>
 functor(term)?functions?.call?.(null,[field,term])||functions:term
)(string(module)?import(module):module);
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

 export var data=(mime,base64)=>"data:image/"+mime+";base64,"+base64;
 export var quote=text=>"\""+text.replace(/([^\\])\\([^\\])/g,"$1\\\\$2").replace(/\"/g,"\\\"").replace(/\n/g
// css:after pseudoelement takes \A for linebreak. 
,"\\A ")+"\"";
 export var demarkup=text=>Array.from(text).map(symbol=>
 ({"<":"&lt;",">":"&gt;"}[symbol]||symbol)).join("");

 export async function test(namespace,tests,path=[])
{// compose tests defined in namespace. 
 let assert=await import("assert");
 if(typeof namespace==="string"&&!path.length)namespace=await import(namespace);
 tests=tests||namespace.tests||{};
 let fails=await Object.entries(tests).reduce(record(async function evaluate([term,value])
{let traverse=!value.condition||is([compound,not(iterable)])(value.condition)||value.condition?.some?.(condition=>condition.condition);
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
