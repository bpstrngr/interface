 export var colors={steady:"\x1b[0m",alarm:"\x1b[31m",ready:"\x1b[32m",busy:"\x1b[33m",bright:"\x1b[1m",dim:"\x1b[2m",bold:"\x1b[3m",underscore:"\x1b[4m",blink:"\x1b[5m",reverse:"\x1b[7m",invisible:"\x1b[8m",black:"\x1b[30m",red:"\x1b[31m",green:"\x1b[32m",yellow:"\x1b[33m",blue:"\x1b[34m",magenta:"\x1b[35m",cyan:"\x1b[36m",white:"\x1b[37m",gray:"\x1b[90m",night:"\x1b[40m",fire:"\x1b[41m",grass:"\x1b[42m",sun:"\x1b[43m",sea:"\x1b[44m",club:"\x1b[45m",sky:"\x1b[46m",milk:"\x1b[47m",fog:"\x1b[100m"};

 export function cast(type,...values)
{return describe(function(term)
{let index=array(type)?type.findIndex(type=>type(term))+1:type(term);
 return index?values[index-1](term):term;
},cast,type);
};

 export function instance(term){return term?.constructor?.name;};

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
 export function any(term){return true;}
 export function defined(term){return term!==undefined;}
 export function something(term){return defined(term??undefined);}
 export function nothing(term){return !something(term);}
 export function none(term){return term===null;}
 export function modular(term){return term?.[Symbol.toStringTag]==="Module";}
 export function functor(term){return type(term)==="function";}
 export function functional(term){return functor(term)||term?.startsWith?.("data:text/javascript;")||"FunctionDeclaration/FunctionExpression/ArrowFunctionExpression".split("/").includes(term?.type);}
 export function lambda(term){if(functor(term))term=String(term);let index=term.indexOf("=>")+1;return index&&parameters(term.slice(0,index-1));}
 export function asynchronous(term){return ["AsyncGeneratorFunction","AsyncFunction"].includes(instance(term));}
 export function promise(term){return instance(term)==="Promise"&&functor(term.then);}
 export function pattern(term){return term instanceof RegExp;}
 export function composed(term){return functor(term)&&term.name.includes("(");}
 export function binary(term){return type(term)==="boolean";}
 export function string(term){return type(term)==="string";}
 export function numeric(term){return type(term)==="number"}
 export function finite(term){return numeric(term)&&term<Infinity}
 export function compound(term){return Boolean(type(term)==="object"&&term);}
 export function simple(term){return compound(term)&&Object.hasOwn(term,"constructor")||instance(term)==="Object";}
 export function basic(term){return simple(term)||array(term);}
 export function native(term){return !compound(term)||basic(term);}
 export function complex(term){return compound(term)&&!basic(term);}
 export function construct(term){return compound(term)&&!simple(term);}
 export function generator(term){return term?.constructor?.constructor?.name==="GeneratorFunction";}
 export function asyncgenerator(term){return term?.constructor?.constructor?.name==="AsyncGeneratorFunction";}
 export function ascending(past,next){return (past<=next)-1;}
 export function plural(term){return generator(term)||asyncgenerator(term);}
 export function iterable(term){try{return Symbol.iterator in term}catch(fail){return false;};}
 export function array(term){return Array.isArray(term);};
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
 let abbreviation=/^([\s\S]{20})[\s\S]*$/;
 let clip=name=>name.replace(abbreviation,(match,head)=>head+"…");
 let depict=term=>
 numeric(term)
?String(term)
:string(term)
?"\""+clip(term).replace(/\n/g,"")+"\""
:functor(term)
?term.name||"functor"
:instance(term)||instance(term?.constructor)||type(term);
 let eponymous=context.shift();
 let value=[String(this||""),eponymous?.name||eponymous].filter(Boolean).join("")
+(context.length?"("+context.map(depict).join(",")+")":"");
 return Object.defineProperty(term,"name",{value});
};

 export function label(scope,label)
{return new Proxy(scope,{get(scope,field)
{return field===Symbol.toStringTag?string(label)?scope[label]:label(scope):Reflect.get(...arguments);
}});
};
