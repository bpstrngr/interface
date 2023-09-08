import {record, compose, provide, defined} from "./Blik_2023_inference.js";

export function random(length,domain="abcdefghijklmnopqrstuvwxyz_"){
  return Array(length).fill(domain).map(domain=>
  domain.charAt(Math.floor(Math.random()*domain.length))).join("");
}

export function assert(term, condition, control) {
  // express term as true if defined or satisfies condition.
  if (condition instanceof Function) return condition(term, control);
  return (term ?? undefined) !== undefined;
}

export var stringify = (scope) =>
  scope && Symbol.iterator in Object(scope) ? String(scope) : JSON.stringify(scope);

export function sum(...context) {
  // cumulate context values.
  return context
    .flat()
    .map((term) => Number(term) || 0)
    .reduce((sum, value) => sum + value, 0);
}

export function trace(term, path = []) {
  // trace term in scope or stack.
  let scope = this;
  if (!assert(term))
    return compose(
      [Infinity, Error.stackTraceLimit].reduce(
        ({ stack }, stackTraceLimit) =>
          (Object.assign(Error, { stackTraceLimit }) && stack) || Error(),
        {}
      ),
      compose(
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

 export function prune(scope,term,collapse)
{// map entries recursively.
 if(typeof scope!=="object"||scope===null)return scope;
 let entries=Object.entries(scope).flatMap
(function([field,scope],index,entries)
{let value=term.call(Object.fromEntries(entries),[field,scope]);
 let pluck=!defined(value);
 if(pluck&&!collapse)
 return [];
 let plant=pluck&&collapse;
 let plural=[...provide(plant?scope:value)].map(scope=>prune(scope,term,collapse));
 return plural.flatMap(scope=>plant?Object.entries(scope):[[field, scope]]);
});
 let array=!entries.some(([field],index,entries)=>isNaN(field)||[entries[index-1]?.[0],field].map(Number).reduce((past,next)=>next<past));
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
 scope=Object.fromEntries(entries);
 return array?Object.assign(Array(0),scope):scope;
};

export function merge(target = {}, source = {}, overwrite = 1) {
  // unite scopes.
  if (typeof target !== "object") return [].concat(target, source);
  if (Array.isArray(target)) return target.concat(source);
  let Group = [Map, Set].find((group) => [target, source].every((part) => part instanceof group));
  if (Group) return new Group([source, target].flatMap((part) => Array.from(part)));
  return Object.keys(source).reduce(function (target, key) {
    let previous = target.hasOwnProperty ? target.hasOwnProperty(key) : target[key];
    let value =
      previous && source[key]
        ? typeof target[key] === "object"
          ? merge(target[key], source[key] || {}, overwrite)
          : [target[key], source[key]][Number(Boolean(overwrite))]
        : source[key];
    // mutation warning - merge in reduce with an empty target to keep pure.
    return Object.assign(target, { [key]: value });
  }, target);
}

export function describe(scope, field) {
  // ember scope in an object path.
  return [field]
    .flat()
    .reverse()
    .reduce((scope, field) => ({ [field]: scope }), scope);
}

export function clone(scope) {
  return merge(JSON.parse(JSON.stringify(scope)), scope);
}

export function isolate(path) {
  // reduce scope to specified path.
  return describe(search.call(this, path), path);
}

export function search(term, recursive = false) {
  // traverse scope for entries satisfying a term (condition or singular path).
  // recursive search includes ranges in recursion domain.
  const scope = this;
  if (typeof scope !== 'object' || scope === null) return [];
  const condition = term instanceof Function;
  if (!condition) return [term].flat().reduce((scope, field) => scope?.[field], scope);
  let [domain, range] = Object.entries(this).reduce(
    function sort(group, entry) {
      group[term(entry) ? 1 : 0].push(entry);
      return group;
    },
    [[], []],
  );
  if (recursive) domain = [domain, range].flat();
  const subrange = domain.flatMap(([field, value]) =>
    Object.entries(search.call(value, term, recursive)).map(([path, value]) => [
      [field, path].join('/'),
      value,
    ]),
  );
  return Object.fromEntries([range, subrange].flat());
}