import path from "path";

 export function defined(term){return term!==undefined;};
 export function string(term){return typeof term==="string";};
 export function functor(term){return term instanceof Function;};
 export function parallel(term){return term instanceof Promise;};
 export function compound(term){return typeof term==="object"&&!Array.isArray(term);};

export function provide(...context) {
  // express plurality with Generators.
  context = context.flatMap((term) =>
    term?.constructor?.constructor?.name === "GeneratorFunction" ? [...term] : [term]
  );
  return (function* () {
    yield* context;
  })();
}

export var infer = (context, term) =>
  // apply or append term to context (respecting plurality and asynchronicity).
  [context, term].some((context) => context instanceof Promise)
    ? Promise.all([context, term]).then(([context, term]) => infer(context, term))
    : term instanceof Function
    ? term(...provide(context))
    : provide(context, term);

 export function tether(factor,...pretext)
{// bound inference. (univalence axiom) 
 let bound=factor instanceof Function
?describe.call("tether ",function()
{return factor.call(...arguments);
},factor)
:factor;
 // when monadic inference is ready. 
 //return infer.call(this,bound,...pretext);
 return bound;
};

 export function describe(scope,...context)
{// name scope after a bound prefix and context in its closure. 
 if(context.every(context=>string(context)))
 return context.reverse().reduce((scope,field)=>({[field]:scope}),scope);
 let functor=scope instanceof Function;
 let name=functor?context.shift()?.name:context.shift();
 if(this!==undefined)
 name=String(this)+name;
 let value=context.reduce((value,context,field,{length})=>
[value
,typeof context!=="number"
?typeof context==="string"
?context.replace(/(?<=^.{9}).*/,({length})=>length?"…":"")
:(context instanceof Function)
?context.name||"functor"
:(context?.constructor?.name??(typeof context).toLowerCase())
:String(context)
].join(field?",":"(")+(length-field-1?"":")")
,name);
 return Object.defineProperty(scope,"name",{value});
};


export function compose(context, ...terms) {
  // consecutive inference.
  return terms.reduce(infer, context);
}

export function record(term) {
  // cumulate terms (pass to reduce with empty array to map asynchronously).
  return function collect(record, ...context) {
    if (record instanceof Promise) return record.then((record) => collect(record, ...context));
    return compose(provide(...context), term, record, (term, record) => [record,[term]].flat());
  };
}

export var wait = (time, ...context) =>
  // halt thread for a time period.
  new Promise((resolve) => setTimeout(resolve.bind(undefined, provide(...context)), time));
