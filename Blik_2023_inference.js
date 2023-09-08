import path from "path";

 export function defined(term){return term!==undefined;};
 export function string(term){return typeof term==="string";};

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
