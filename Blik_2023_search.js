import {something,record,stream,plural,defined,string,describe} from "./Blik_2023_inference.js";

export function random(length,domain="abcdefghijklmnopqrstuvwxyz_"){
  return Array(length).fill(domain).map(domain=>
  domain.charAt(Math.floor(Math.random()*domain.length))).join("");
}

export var stringify = (scope) =>
  scope && Symbol.iterator in Object(scope) ? String(scope) : JSON.stringify(scope);

 export function edit(source,edits)
{return Object.entries(edits||{}).reduce((source, [field,value]) =>
 source.replace(new RegExp(field,"g"),(match, ...groups) =>
 [value, ...groups.slice(0,-2)].reduce((value, group, index) =>
 value.replaceAll("$"+index, group)))
,source);
};

export function sum(...context) {
  // cumulate context values.
  return context
    .flat()
    .map((term) => Number(term) || 0)
    .reduce((sum, value) => sum + value, 0);
}

export function search(term,recursive=false,path=[]){
  // traverse scope for entries satisfying a term (condition or singular path).
  // recursive search includes ranges in recursion domain.
  const scope = this;
  if (typeof scope !== 'object' || scope === null) return [];
  const condition = term instanceof Function;
  if (!condition) return [term].flat().reduce((scope, field) => scope?.[field], scope);
  let [domain, range] = Object.entries(this).reduce(
    function sort(group, entry) {
      group[term(entry,path) ? 1 : 0].push(entry);
      return group;
    },
    [[], []],
  );
  if (recursive) domain = [domain, range].flat();
  const subrange = domain.flatMap(([field, value]) =>
    Object.entries(search.call(value, term, recursive, path.concat(field))).map(([path, value]) => [
      [field, path].join('/'),
      value,
    ]),
  );
  return Object.fromEntries([range, subrange].flat());
}

export function route(scope, term, path) {
  // insert/invoke term in scope on given path.
  if (!scope) return;
  let paths = [path(scope, term)].flat().filter((path) => (path ?? false) !== false);
  if (!paths.length) return;
  let descended = paths.find((field) => route(scope[field], term, path));
  if (descended) return descended;
  let entries = paths.map((path) => [
    path,
    term instanceof Function ? term([path, scope[path]]) : term,
  ]);
  return entries.reduce(
    record(([path, term]) =>
      infer(term, (term) =>
        Array.isArray(scope) ? scope.splice(path, 0, term) : Object.assign(scope, { [path]: term })
      )
    ),
    []
  );
}

 export function prune(term,collapse,path=[])
{// map entries recursively.
 if(typeof this!=="object"||this===null)return this;
 let entries=Object.entries(this);
 if(!entries.length)for(let field in this)entries.push([field,this[field]]);
 entries=entries.flatMap
(function([field,scope],index,entries)
{let value=term.call(Object.fromEntries(entries),[field,scope],path);
 let pluck=!defined(value);
 if(pluck&&!collapse)
 return [];
 let plant=pluck&&collapse;
 let range=[...plural(plant?scope:value)].map(scope=>prune.call(scope,term,collapse,plant?path:path.concat(field)));
 return range.flatMap(scope=>plant?Object.entries(scope):[[field, scope]]);
});
 let array=entries.length&&!entries.some(([field],index,entries)=>isNaN(field)||[entries[index-1]?.[0],field].map(Number).reduce((past,next)=>next<past));
 if(array)
 entries.forEach(function([field],index,entries)
{if(!index)
 // snap first index. 
 return field!=0&&entries.forEach(entry=>entry[0]=Number(entry[0])-entries[0][0]);
 let leap=1-field+Number(entries[index-1]?.[0]);
 if(leap)
 // spread plural indexes. 
 entries.slice(index).forEach((entry)=>entry[0]=Number(entry[0])+leap);
});
 let scope=Object.fromEntries(entries);
 return array?Object.assign(Array(0),scope):scope;
};

export function merge(target, source, override = 1) {
  // unite scopes (assign if path specified to override).
  let path=[override].flat();
  if(!path.length)return source;
  if (path.some((path) => typeof path === 'string'))
    return [target, ...path, source].reduce((scope, field, index, route) =>
      route.length - index - 1
        ? (scope[field] = route.length - index > 2 ? scope[field] || {} : route[index + 1])
        : route[0],
    );
  let index=Number(Boolean(override));
  let primitive=typeof target !== "object";
  if (primitive) return [target, source][index];
  let Group = [Map, Set].find((group) => [target, source].every((part) => part instanceof group));
  if (Group) return override?source:new Group([source, target].flatMap((part) => Array.from(part)));
  let extensible=Array.isArray(target)&&!override;
  if (extensible) return target.concat(source);
  if (!something(source)) return [target, source][index];
  return Object.entries(source).reduce(function (target, [field, next]) {
    const last = target[field];
    const value = something(last) ? merge(last, next, override) : next;
    // mutation warning - reduce on an empty target to copy.
    if(value!==undefined)
    return Object.assign(target, { [field]: value });
    delete target[field];
    return target;
  }, target);
}

export function trace(term, path = []) {
  // trace term in scope or stack.
  let scope = this;
  if (!something(term))
    return stream(
      [Infinity, Error.stackTraceLimit].reduce(
        ({ stack }, stackTraceLimit) =>
          (Object.assign(Error, { stackTraceLimit }) && stack) || Error(),
        {}
      ),
      stream(
        {
          functor: /at (?:async )*([^ ]*)/,
          file: /(?:.*[\(_|\/])*(.*?)/,
          location: /(?:.js)*(?::[0-9]+){0,2}/,
        },
        Object.values,
        (expressions) => expressions.map(({ source }) => source).join(""),
        RegExp
      ),
      (stack, details) =>
        stack
          .split(/\n */)
          .slice(1)
          .map((stack) => stack.match(details) || [stack]),
      (details) => details.map((details) => details.slice(1, 3).concat(details.input).reverse()),
      (details) => details.slice(details.findIndex(({ 2: term }) => term === trace.name))
    );
  if (scope === term || !scope) return path;
  return Object.entries(scope).reduce(
    (hit, [track, scope]) =>
      hit ||
      [term === scope, path.concat(track)].reduce((hit, path) =>
        hit ? path : typeof scope == "object" ? trace.call(scope, term, path) : undefined
      ),
    undefined
  );
}

export function clone(scope) {
  return merge(JSON.parse(JSON.stringify(scope)), scope);
}

export function isolate(path) {
  // reduce scope to specified path.
  return describe(search.call(this, path), path);
}

 export const tests=
 {merge:
[{context:[{a:1},{b:2}],terms:[{a:1,b:2}],condition:["deepEqual"]}
,{context:[{a:{}},2,"a/b/c".split("/")],terms:[{a:{b:{c:2}}}],condition:["deepEqual"]}
,{context:[undefined,{b:2}],terms:[{b:2}],condition:["deepEqual"]}
,{context:[undefined,{b:2},true],terms:[{b:2}],condition:["deepEqual"]}
],search:
[{scope:{a:{b:2}},context:[({1:value})=>value===2],terms:[{"a/b":2}],condition:"deepEqual"}
,{scope:{a:{b:1}},context:["abc".split("")],terms:[term=>term===undefined],condition:"ok"}
,{scope:{a:{b:1}},context:[["a","b"]],terms:[1],condition:["equal"]}
,{scope:{a:{b:1}},context:[entry=>entry,true],terms:[{a:{b:1},"a/b":1}],condition:["deepEqual"]}
,{scope:{a:{b:1}},context:[([field,value])=>!isNaN(value)],terms:[{"a/b":1}],condition:["deepEqual"]}
],prune:
[{scope:{a:{b:{c:3}}},context:[([field,value])=>field!=='b'?value:undefined],terms:[{a:{}}],condition:"deepEqual"}
,{scope:{a:{b:{b:2,c:3}}},context:[([field,value])=>field!=='b'?value:undefined,true],terms:[{a:{c:3}}],condition:"deepEqual"}
,{scope:{a:{b:{c:{d:1},f:2}},e:3},context:[([field,value],path)=>path.length<2?value:undefined],terms:[{a:{b:{}},e:3}],condition:"deepEqual"}
]};
