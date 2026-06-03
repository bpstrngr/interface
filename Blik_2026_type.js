 export var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",bold:"\x1b[3m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",invisible:"\x1b[8m",black:"\x1b[30m",red:"\x1b[31m",green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};

 export function cast(type,value)
{return describe(function(term)
{return type(term)?value(term):term;
},cast,type);
};

 export function prototype(term,limit,path=[])
{if(path.length>limit)
 return [];
 return something(term)?[...prototype(Object.getPrototypeOf(term),limit,[path,term].flat()),term]:[];
};

 export function heritage(term)
{return prototype(...arguments).flatMap(term=>
{try{return Reflect.ownKeys(term);}catch(fail)
{console.warn("warning: can't see all properties on",typeof term," - ",fail.message);
 if(string(term))
 if(term.length>500)
 return [];
 return Object.keys(term);
};
});
};

 export var expressions=
 {signature:/ *(async *){0,1}(function){0,1}\*{0,1} *[a-zA-Z_]* *\([\s\S]*?\)[\s\S]*?/
 ,lambda:/^(async *){0,1}(?:\([^)]*\)|[a-zA-Z_$][\w$]*)\s*=>/
 ,json:new RegExp(/[{\[]{1}(?:[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/,"mg")
 ,protocol:/^[a-z]+:/
 };

 export function type(term){return typeof term;}
 export function defined(term){return term!==undefined;}
 export function something(term){return defined(term??undefined);}
 export function none(term){return term===null;}
 export function modular(term){return term?.[Symbol.toStringTag]==="Module";}
 export function functor(term){return typeof term==="function";}
 export function functional(term){return functor(term)||term?.startsWith?.("data:text/javascript;")||"FunctionDeclaration/FunctionExpression/ArrowFunctionExpression".split("/").includes(term?.type);}
 export function lambda(term){if(functor(term))term=String(term);let index=term.indexOf("=>")+1;return index&&parameters(term.slice(0,index-1));}
 export function asynchronous(term){return ["AsyncGeneratorFunction","AsyncFunction"].includes(term?.constructor?.name);}
 export function promise(term){return term?.constructor?.name==="Promise"&&functor(term.then);}
 export function pattern(term){return term instanceof RegExp;}
 export function composed(term){return functor(term)&&term.name.includes("(");}
 export function binary(term){return typeof term==="boolean";}
 export function string(term){return typeof term==="string";}
 export function numeric(term){return typeof term==="number"}
 export function finite(term){return numeric(term)&&term<Infinity}
 export function simple(term){return term?.constructor?.name==="Object";}
 export function compound(term){return Boolean(typeof term==="object"&&term);}
 export function basic(term){return simple(term)||array(term);}
 export function native(term){return !compound(term)||basic(term);}
 export function complex(term){return compound(term)&&!basic(term);}
 export function construct(term){return compound(term)&&!simple(term);}
 export function generator(term){return term?.constructor?.constructor?.name==="GeneratorFunction";}
 export function asyncgenerator(term){return term?.constructor?.constructor?.name==="AsyncGeneratorFunction";}
 export function ascending(past,next){return (past<=next)-1;}
 export function plural(term){return generator(term)||asyncgenerator(term);}
 export function iterable(term){try{return Symbol.iterator in term}catch(fail){return false;};}
 export var array=Array.isArray
 export function nothing(term){return !something(term);}
 export function imperative(term)
{if(functor(term))term=String(term);
 return new RegExp("^"+expressions.signature.source+"\\{").test(term);
};
 export function odd(text,pair,exclusion="",exception="")
{// find unmatched character pair indexes, outside exclusion pairs and exceptions. 
 let toggle=symbol=>register=register===stack?symbol:register===symbol?stack:symbol;
 let exclude=Object.fromEntries(Array.from(exclusion).map(symbol=>[symbol,toggle]));
 let except=Object.fromEntries(Array.from(exception).map(symbol=>[symbol,symbol=>skip=true]));
 var stack=Object.fromEntries(Array.from(pair).map((symbol,index)=>[symbol,index%2?"pop":"push"]));
 var register=stack;
 var skip=false;
 return Array.from(text).reduce((open,symbol,index,{length})=>(!skip
?exclude[symbol]?.(symbol)||open[register[symbol]]?.(index)
:skip=false,open),[]);
};

 export function parameters(text)
{return !odd(text.trim(),"(){}","\"'`","\\").length;
};

 export function pdf(buffer)
{if(!buffer||buffer.length<4)return false;
 return [0x25,0x50,0x44,0x46].every((code,index)=>buffer[index]===code);
};

 export function describe(term,...context)
{// name term after a bound prefix and context in its closure. 
 if(!functor(term))
 throw Error("can't describe "+term);
 let prefix=String(this||"");
 let eponymous=context.shift();
 let name=[prefix,eponymous?.name||eponymous].filter(Boolean).join("");
 let abbreviation=/^([\s\S]{20})[\s\S]*$/;
 let value=context.reduce((value,term,index,{length},left=length-index-1)=>
[value
,numeric(term)
?String(term)
:string(term)
?"\""+term.replace(abbreviation,(...match)=>match[1]+"…").replace(/\n/g,"")+"\""
:functor(term)
?term.name||"functor"
:(term?.constructor?.name||term?.constructor?.constructor?.name||type(term))
].join(index?",":"(")+(left?"":")")
,name);
 return Object.defineProperty(term,"name",{value});
};

