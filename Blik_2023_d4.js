 import * as d3 from './Bostock_2011_d3.js';
 import {fail,trace} from './Blik_2023_sort.js';
 import {merge,search} from './Blik_2023_search.js';
 import {window} from "./Blik_2023_interface.js";
 import {numeric,note,defined,simple} from "./Blik_2023_inference.js";
 import {qualify} from "./Blik_2023_fragment.js";

// Data-Driven Document Declarations (D4).

 export default function extend({fold=value=>[value],match,drop=true,update=false,...fragment},name)
{// extend bound nodes (and subselections qualified by fragment class/id attributes)
 // with described nodes/attributes/events/operations (fragment).
 // (d3's select/datum/selectAll/data/append/attr/etc fluent interface as a declarative reduction).
 // Nodes are unfolded by "matching" identities on a "fold" (hylomorphism; inherited by default).
 // To update existing nodes, specify {fold: false} or {update: true or a function returning them}.
 // To preserve unmatched nodes, consume them in a "drop" function.
 // eg: ul:{datum:1,li:{fold:n=>[n,n,n],update:true,text:n=>n}} = 1 ul, 3 li, updated on each call.
 if(!this)return;
 if(name=='0')trace(this, ...arguments);
 const [cast]=Object.entries({select:window.Node,selectAll:window.NodeList}).find(({1:selectable})=>this instanceof selectable)||[];
 let selection=d3[cast]?.(this)||this;
 if(name)
 selection=[selection,selection.selectChildren(name+qualify(fragment))].reduce((selection,children)=>
 children.size()||fold?children:selection.append(name));
 const nodes=selection.nodes();
 const values=selection.data();
 const precedent=selection.node()?.nodeName.toLowerCase();
 if(fold)
 if(!name&&!precedent)throw "can't append nodes without a name or precedent.";
 else
 selection=selection.data(fold, match).call((selection)=>//.join(enter=>extend.call(enter.append(name||target),fragment));
 // "extension" only applies to new nodes by default, where the implicit "merge" of the common "join" does not apply. 
 // the recursion to bypass it is tail-call optimized instead.
 selection.exit().call((selection)=>selection.size()&&drop&&(drop===true?selection:drop(selection))?.remove())),
 selection=selection.enter().append(name || precedent).merge(selection.size()
?(update
?update===true
?selection //console.log('updating', selection.nodes(), 'with', selection.data()), // track updates
:update?.(selection)
// d3 is only meant to persist matched values if update is specified.
:!selection.datum(function restore(){return values[nodes.indexOf(this)];}))||
 d3.select(null)
:selection);
 if(selection.size())
 Object.entries(fragment).reduce((selection,entry)=>Object.values(extension).reduce((applied,extension)=>applied||extension.apply(selection,entry),undefined)||
 fail("extension entry doesn't satisfy "+Object.keys(extension).join('/')+' namespaces: '+entry),selection);
 return this;
}

 const extension =
{event(field, value)
{const events = ['load', 'click', 'change', 'input'];
 const mouseevents = ['enter', 'leave', 'over', 'out', 'down', 'up', 'move'].map((event) => 'mouse' + event);
 const focusevents = ['', 'in', 'out'].map((event) => 'focus' + event);
 events.push(...mouseevents, ...focusevents);
 if (events.includes(field) && value instanceof Function)
 return this.on(field, value);
},style(field, value)
{if (field !== 'style')
 return;
 if (typeof value === 'string')
 return this.attr(field, value);
 if (value instanceof Function)
 return this.each(function () { extension.style.call(d3.select(this), field, value.call(this, ...arguments)); });
 if (!value)
 return this;
 return Object.entries(value).reduce((selection, entry) => selection[field](...entry), this);
},operation(field,value)
{// specify operations to include in case of namespace collision with fragments/attributes.
 //const operations = ['data', 'datum', 'each', 'call', 'attrs', 'text', 'classed', 'sort', 'transition'] as const;
 const fragment=Object.entries({text:['object'],filter:['object','string']}).some(([name,types])=>
 field===name&&types.includes(typeof value));
 if(fragment)
 return;
 if(!defined(value))
 return this;
 const [scope,operation]=field==='transition'?[this[field](),'duration']:[this,field];
 return scope[operation]?.(...(field==='classed'?[value,true]:[value]));
},fragment(field, value)
{const compoundattributes = ['viewBox', 'transform', 'class'];
 if (typeof value === 'object' && !compoundattributes.includes(field))
 return [value].flat().filter(Boolean).reduce((selection, fragment) =>
 extend.call(selection, fragment, field), this);
},attribute(field, value)
{try
{return this.attr(field, value);
}catch (fail)
{console.log(fail);
}
}};

 export function ascend(selector,descendants=new Set())
{let fragment=this instanceof window.Node;
 let selection=!fragment&&!simple(this);
 let node=fragment?this:selection?this.node():this;
 if((selection||fragment)&&!defined(selector))selector="svg";
 let limited=numeric(selector);
 if(limited&&!selector)
 return [this];
 let matching=!limited&&(!/[\.#]/.test(selector)
?node.nodeName.toLowerCase()===selector
:is(Function)(selector)
?selector(this)
:// match selectors on node. 
[qualify(qualify(node)),search.call(qualify(selector),({1:value})=>
 Object.keys(value).every(field=>["id","class"].includes(field)))
].map(Object.entries).reduce(([[nodename,node]],[[name,selector]])=>
 (!name||nodename===name)&&
 Object.entries(selector).every(([field,value])=>
 value.every(value=>node[field]?.includes(value)))));
 if(matching)
 return [this];
 let parent=fragment||selection?node.parentNode:node.parent;
 return !descendants.has(node)&&parent
?[...ascend.call(selection?d3.select(parent):parent,limited?selector-1:selector,descendants.add(node)),this]
:[this];
};

export function jss(style) {
    return Object.fromEntries(Object.entries(style).map(([field, value]) => [
        field.replace(/-(.)/g, (match, lowerCase) => lowerCase.toUpperCase()),
        value,
    ]));
};

export function activate(action, register = true) {
    // construct event (pair) fragments for extensions (css pseudoclasses for js)
    // and (un)register them directly on bound Node.
    const binary = {
        hover: ['mouseenter', 'mouseleave'],
        focus: ['focusin', 'focusout'],
    };
    const entries = [action]
        .flat()
        .flatMap((action) => 
    // function names are removed in nextjs builds, so don't use action.name.
    typeof action === 'object' ? Object.entries(action) : [[action?.name, action]])
        .flatMap(([name, action]) => binary[name]?.reduce((start, end) => [
        [start, action],
        [
            end,
            function (event) {
                this.dispatchEvent(new { focus: FocusEvent, hover: MouseEvent }[name](start, event));
            },
        ],
    ]) || [[name, action]]);
    if (this !== undefined)
        entries.reduce((node, [event, action]) => (node[(register ? 'add' : 'remove') + 'EventListener'](event, action), this), this);
    return Object.fromEntries(entries);
}
