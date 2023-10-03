import path from "path";
import { access, resolve, note } from "./Blik_2023_interface.js";
import { compose, record, provide } from "./Blik_2023_inference.js";
import { search, merge, prune, route, random } from "./Blik_2023_search.js";

export async function parse(source, syntax = "javascript", options = {}) {
  // interpret language syntax.
  if(typeof source!=="string")
  return Error("can't parse "+typeof source);
  if(source instanceof Buffer)
  source=source.toString();
  if (syntax === "json") return JSON.parse(source);
  let { Parser } = await import("./haverbeke_2012_acorn.js");
  if(syntax=="typescript")
  Parser=await import("./tyrealhu_2023_acorn_typescript.js").then(({default:plugin})=>
  Parser.extend(plugin({dts:options.source.endsWith(".d.ts")})));
  else if(!/xtuc_2020_acorn_importattributes/.test(options.source))
  Parser=await import("./xtuc_2020_acorn_importattributes.js"). then(({importAttributes:plugin})=>
  Parser.extend(plugin));
  let comments = [];
 //(syntax==="typescript")note(Parser.parse("export default class Graph{constructor(private readonly options: NormalizedInputOptions){}}",{ecmaVersion:2022, sourceType:'module'}).body[0].declaration)//.body.body[0]. value.params[0])
  let scope = Parser.parse(source, {
    ecmaVersion: 2022,
    sourceType: "module",
    onComment: comments,
    locations: syntax === "typescript",
  });
  comments
    .map((comment) => Object.assign(comment, { type: comment.type + "Comment" }))
    .forEach((comment) => route(scope, comment, path));
  if (options.source) scope.meta = { url: new URL(options.source) };
  return scope;
  function descendant(scope) {
    return scope.start < this.start && this.end < scope.end;
  }
  function sibling(scope, index, scopes) {
    return (scopes[index - 1]?.end ?? -1) < this.start && this.end < scope.start;
  }
  function path(scope, comment) {
    Array.isArray(scope)
      ? [descendant, sibling, undefined].reduce(
          (found, find) => (found < 0 ? find && scope.findIndex(find.bind(comment)) : found),
          -1
        )
      : descendant.call(comment, scope) &&
        ["body", "declaration", "consequent"].find((field) => scope[field]);
  }
}

 export async function sanitize(grammar,format)
{if(!Object.keys(format||{}).length)
 return grammar;
 let {alias={},replace,output,syntax,scripts}=format;
 let path=await import("path");
 let location=path.dirname(new URL(import.meta.url).pathname);
 let relation=path.dirname(grammar.meta.url.pathname);
 let disjunction=estree[syntax];
 if(disjunction)
 grammar=prune(grammar,function([field,value])
{let term=Object.values(disjunction).find(({condition})=>condition.call(this,value,field));
 return term?term.ecma.call(this,value):value;
});
 if(syntax==="commonjs"&&!grammar.body.some(({type})=>type==="ExportDefaultDeclaration"))
 grammar.body.push(
 {type:"ExportDefaultDeclaration",declaration:
 {type:"ObjectPattern"
 ,properties:Object.values(search.call(grammar,([field,value])=>
 value?.type==="ExportNamedDeclaration")).flatMap(({specifiers,declaration})=>
 specifiers?.map(({local})=>local)||declaration.declarations.map(({id})=>id))
 }
 });
 if(Object.keys(alias).length)
 prune(grammar,([field,value])=>value?.type==="ImportDeclaration"
?[alias[value.source.value],value.source].reduce((alias,source)=>
 !alias?value:["value","raw"].map(field=>(
 {[field]:source[field].replace(source.value,/^\./.test(alias)?"./"+path.relative(relation,path.resolve(location,alias)):alias)
 })).reduce(merge,source)
 )
:value);
 grammar=prune(grammar,function jsonnamespace({1:value})
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
 return provide(...statements);
});
 if(/\.d\.ts$/.test(grammar.meta.url.pathname))
 grammar=prune(grammar,function initialized({1:value})
{// typescript ambiguates uninitialized const as type declarations. 
 let declaration=value?.type==="ExportNamedDeclaration"?value.declaration:value;
 let uninitialized=declaration?.type==="VariableDeclaration"&&declaration.kind==="const"&&!declaration.declarations.some(({init})=>init);
 return uninitialized?undefined:value;
});
 await ["banner","footer"].map(extension=>
 output?.[extension]).reduce(record((extension,index)=>
 extension&&compose(extension,parse,({body})=>
 grammar.body[index?"push":"unshift"](...body)))
,[]);
 let fields={Literal:"value",Identifier:"name"};
 let generic=Object.keys(replace||{}).some(type=>fields[type]);
 if(!generic)
 replace=replace?.[Object.keys(replace).find(field=>grammar.meta.url.pathname.endsWith(field))];
 if(replace)
 grammar=prune(grammar,function({1:value})
{let values=replace[value?.type];
 let field=fields[value?.type];
 let replacement=values?.hasOwnProperty(value?.[field])&&values[value[field]];
 return replacement?{...value,[field]:replacement,...value?.type==="Literal"&&{raw:"\""+replacement+"\""}}:value;
});
 return grammar;
};

 var estree=
 // sort by decreasing specificity for declarative disjunction (Object.values(estree.dialect)). 
 {commonjs:
 {require:
 {condition(value,field)
{let values=value?.type==="VariableDeclaration"?value.declarations.map(({init})=>init?.type==="MemberExpression"?init.object:init):[value?.expression?.right];
 return values.some(value=>(value?.callee?.name||value?.callee?.object?.callee?.name)==="require");
},ecma(value)
{let declarations=(value.declarations||[value.expression]).flatMap(expression=>expression.right
 // expression
?[[expression.right.callee.object||expression.right,"arguments","0"].reduce(Reflect.get)
,value=>value.replace(/[^a-zA-Z]/g,"")+"_exports"
].reduce((source,id)=>
[{type:"ImportDeclaration",source,specifiers:["ImportDefaultSpecifier",{type:"Identifier",name:id(source.value)}].reduce((type,local)=>[{type,local,imported:local}])},
[value
,{expression:
 {right:value.expression.right.callee.object
?{callee:{object:{type:"Identifier",name:id(source.value)}}}
:{type:"Identifier",name:id(source.value)}
 }
 }
].reduce(merge,{})
])
:(expression.init?.callee?.name||expression.init?.object?.callee?.name)==="require"
?// declaration
[[expression.init.object||expression.init,"arguments","0"].reduce(Reflect.get)
,[expression.init.object||expression.init,"arguments","0","value"].reduce(Reflect.get).replace(/[^a-zA-Z]/g,"")+"_exports"
].reduce((source,local)=>
[{type:"ImportDeclaration",source,specifiers:["ImportDefaultSpecifier",expression.id.name&&!expression.init.property?expression.id:{type:"Identifier",name:local}].reduce((type,local)=>[{type,local,imported:local}])}
,expression.init.property||expression.id.properties
?{...value,declarations:
[{type:"VariableDeclarator",id:expression.id,init:expression.init.property
?{type:"MemberExpression",object:{type:"Identifier",name:local},property:expression.init.property}
:{type:"Identifier",name:local}
 }
]}
:[]
]).flat()
 // statement
:{...value,declarations:[expression]});
 return provide(...declarations);
}}
 ,export:
 {condition(value)
{if(value?.type!=="ExpressionStatement")return false;
 let named=value.expression.left?.object?.name==="exports";
 if(named)return true;
 let major=value.expression.left?.object?.name==="module"&&value.expression.left.property.name==="exports";
 if(major)return true;
},ecma(value)
{if(value.expression.left?.object?.name==="module")
 return {type:"ExportDefaultDeclaration",declaration:value.expression.right};
 let id=value.expression.left.property;
 let init=value.expression.right;
 let specifier=init.type==="Identifier";
 let exported=specifier?{specifiers:[{type:"ExportSpecifier",exported:id,local:init}]}:{declaration:{type: "VariableDeclaration", kind: "var", declarations:[{id,init}]}};
 if(!specifier&&estree.commonjs.require.condition(exported.declaration))
 return Object.assign(estree.commonjs.require.ecma(exported.declaration),{type:"ExportNamedDeclaration"});
 return Object.assign(value,{type: "ExportNamedDeclaration",expression: undefined,...exported});
}}
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
 {condition(value){return value?.type==="ExportNamedDeclaration"&&["TSInterfaceDeclaration","TSTypeAliasDeclaration","TSEnumDeclaration"].includes(value.declaration?.type);}
 ,ecma({type,start,end,loc,declaration})
{let enumtype=declaration.type==="TSEnumDeclaration";
 let init=enumtype
?{type:"ObjectExpression"
 ,properties:declaration.members.map(member=>(
 {type:"Property",kind:"init",key:member.id
 ,value:member.initializer||{type:"Literal",value:member.id.name,raw:"'"+member.id.name+"'"}
 }))
 }
:{type:"Literal",kind:"undefined"};
 return {type,start,end,loc,declaration:{type:"VariableDeclaration",kind:"const",declarations:[{id:declaration.id,init}]}};
}}
 ,typeimport:
 {condition(value){return value?.type==="ImportDeclaration"&&value.importKind==="type"}
 ,ecma(){return undefined;}
 }
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

export async function serialize(syntax, format = "astring", options) {
  // convert abstract syntax tree to javascript;
  if (typeof syntax === "string") syntax = JSON.parse(syntax);
  let [module, term] = {
    astring: ["./davidbonnet_2015_astring.js", "generate"],
    babel: ["./node_modules/@babel/generator/lib/index.js", "default"],
  }[format] || [format];
  return import(module).then(module=>module[term](syntax, options));
}

 export async function modularise(resource,identifier,context={})
{// uses --experimental-vm-modules 
 let {SourceTextModule,createContext,isContext}=await import("vm");
 let {default:{resolve}}=await import("path");
 if(!isContext(context))
 context=createContext(
 {cache:new Map(),imports:new Map()
 ,importModuleDynamically:identifer=>({})
 ,initializeImportMeta:meta=>Object.assign(meta,{url:identifier})
 })
 let module=new SourceTextModule(resource||"",{identifier,context});
 context.cache.set(identifier,module);
 await module.link((identifier,{context})=>
 context.cache.has(identifier)
?context.cache.get(identifier)
:import(identifier).then(module=>
 context.imports.set(identifier,module)&&
 modularise(Object.getOwnPropertyNames(module).sort(name=>
 name!="default"||-1).map((name,index,exports)=>name=="default"
?"export default imports.get(\""+identifier+"\").default;"
:"export const {"+exports.splice(index).join(",")+`}=
 imports.get("`+identifier+"\");").join("\n")
,identifier,context)));
 await module.evaluate();
 return module;
};

 function set(options, namespace)
{return Object.entries(namespace).reduce(
    (defaults, [field, kinds]) =>
      Object.assign(defaults, {
        [field]: options[field]
          ? Object.entries(kinds)
              .find(([kind]) =>
                [kind, options[field]].map((kind) => kind.toLowerCase()).reduce(Object.is)
              )
              ?.pop() ||
            Error(
              [
                String(options[field]),
                'not in "' + field + '" options',
                Object.keys(kinds),
              ].join(" ")
            )
          : defaults[field],
      }),
    this
  );
}

export async function compile(address, dialect = "prettier", options = {}) {
  // parse and serialize (third party tools without modular parser/serializer).
  if (dialect === "typescript") {
    note(["compiling ", address, "..."].join(""));
    let {
      default: {
        createProgram,
        transpileModule,
        getPreEmitDiagnostics: preemit,
        ScriptTarget: target,
        ModuleKind: module,
        ModuleResolutionKind: moduleResolution,
      },
    } = await import("./microsoft_2014_typescript.js");
    options = set.call({target: target.ES2022, module: module.ES2022, moduleResolution: moduleResolution.Node16}, options, { target, module, moduleResolution });
    let fail = Object.values(options).find((option) => option instanceof Error);
    if (fail) throw fail;
    let source = await access(address);
    let program = createProgram([source], options);
    note(preemit(program));
    let { outputText } = transpileModule(source, options);
    return outputText;
  }
  if (dialect === "prettier")
    return Promise.all([
      import("prettier"),
      import("../package.json", { assert: { type: "json" } }),
    ]).then(
      ([
        { format },
        {
          default: { prettier },
        },
      ]) => format(source, prettier)
    );
 console.trace(address)
  let { default: rules } = await import("./static/eslint_rules.json", { assert: { type: "json" } });
  options = options || {
    parser: "babel",
    parserOptions: {
      requireConfigFile: false,
      sourceType: "module",
      allowImportExportEverywhere: true,
      babelOptions: { plugins: ["@babel/plugin-syntax-import-assertions"] },
    },
    rules: rules[dialect],
  };
  let { Linter } = await import("./node_modules/eslint/lib/api.js");
  let lint = new Linter({ cwd: location });
  lint.defineParser("babel", await import("@babel/eslint-parser"));
  let { messages, output } = lint.verifyAndFix(source, options);
  console.table(messages, ["line", "ruleId", "nodeType", "message"]);
  return output;
}

export async function imports(syntax,format={}) {
  if(typeof syntax==="string")
  syntax=await compose(syntax,true,access,format.syntax,{...format,source:await resolve("url","pathToFileURL",syntax)},parse);
  let terms = search.call(syntax,([field,scope])=>["Declaration", "Expression"].map((type) => "Import" + type).includes(scope?.type));
  let sources = Object.values(terms)
    .map(({ source }) => source.value)
    .filter((source) => source?.startsWith("."))
    .map((peer) => path.resolve(path.dirname(syntax.meta.url.pathname), peer));
  sources = await sources.reduce(record(async source=>
  compose(source,format,imports)), []);
  return { [syntax.meta.url.pathname]: sources.reduce(merge, {}) };
}

export async function exports(source) {
  let module = await resolve(source);
  let sources = await compose(imports(source), source, Reflect.get);
  await prune(sources, ([path, term]) =>
    exports(path).then((exports) => [term, exports].reduce(merge))
  );
  let scopes = scope(module);
  return [sources, scopes].reduce(merge);
}

export function scope(module) {
  let entries = Object.entries(module).map(([path, term]) => [
    path,
    term && typeof term == "object" ? scope(term) : term?.toString() || term,
  ]);
  return Object.fromEntries(entries);
}

export async function test(scope, tests, path = []) {
  // compose tests defined in scope.
  if(!path.length)
  console.log("\x1b[4m" + scope + "\x1b[0m:\n");
  let assert = await import("assert");
  if (typeof scope === "string" && !path.length) scope = await import(scope);
  tests = tests || scope.tests || {};
  let fails = await Object.entries(tests).reduce(
    record(async ([term, value]) => {
      if (!value.condition) return test(scope[term] ?? scope, value, path.concat(term));
      let { context = [], terms = [], condition } = value;
      if(!context.length) context.push(undefined);
      try {
        await compose(...[context].flat(), scope[term] ?? scope, ...[terms].flat(), assert[condition] || condition);
      } catch (fail) {
        let field = path.concat(term).join("/");
        let { stack } = fail;
        console.log(field + ": \x1b[31m" + stack + "\x1b[0m");
        return { [field]: stack };
      }
    }),
    []
  );
  fails = fails.reduce(merge, {});
  if (path.length) return fails;
  let format = (item, order, items) =>
    compose(
      Math.max(...items.map(({ length }) => length)),
      (length) =>
        item +
        (order % Math.floor(process.stdout.columns / length)
          ? " ".repeat(length - item.length)
          : "\n")
    );
  let report =
    [fails, tests, scope]
      .map((subject, index) => [
        "\x1b[" + ["31mFAIL:", "32mPASS:", "34mSKIP:"][index],
        ...Object.keys(subject).map(
          index ? (field) => field : (field) => field.match(/(.*?)(\/|$)/)[1]
        ),
      ])
      .map((subject, index, subjects) =>
        subject
          .filter((test) => !subjects.slice(0, index).flat().includes(test))
          .slice(0, 15)
          .concat(subject.length < 16 ? (!subject.length ? "-" : []) : "...")
          .map(format)
          .join("")
      )
      .join("\n") + "\x1b[0m\n";
  if (Object.keys(fails).length) throw report;
  return report;
}

export const tests = {
  parse: { context: [import.meta.url, access], condition: "ok" },
};
