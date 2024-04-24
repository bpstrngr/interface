 import {color} from "./Blik_2023_layout.js";
 import {search,merge,prune,extreme,sum,extract} from "./Blik_2023_search.js";
 import {document,demarkup,namespaces,path} from "./Blik_2023_fragment.js";
 import {infer,tether,swap,wait,drop,pass,note,collect,compose,combine,wether,refer,observe,ascending,compound,array,string,clock} from "./Blik_2023_inference.js";
 import {window,fetch,resolve} from "./Blik_2023_interface.js";
 import * as d3 from './Bostock_2020_d3v6_rollup.js';
 import extend,{ascend} from "./Blik_2023_d4.js";
 var {default:vectors}=await resolve("./Blik_2020_svg.json");
 var browser=Boolean(globalThis.window);

 export default compose(combine(compose(sprawl,relate,spread),drop(2)),chart,simulate,pass(report));

 function sprawl(resource,options={})
{// parse object as a D3 hierarchy. 
 if(typeof resource==="string")
 resource=JSON.parse(resource);
 if(resource.constructor.name=="Node")
 return resource;
 let {relations,spread,title,monospace=10,cluster,still,source,gradual}=options;
 let matrix=records(resource);
 //resources may contain link definitions as single fields by name or index, or as full matrix. clear the latter now.
 let routes=matrix.map(([field])=>field);
 let routed=routes.some(path=>array(path));
 resource=Object.fromEntries(Object.entries(resource).filter(([field])=>!routes.includes(field)));
 matrix=matrix.filter(([field])=>[field.join?.("/")||field,"average",true,undefined].includes(options.matrix))
 let node=d3.hierarchy(resource,infer(descend,{relations,title,routed}));
 let nodes=node.descendants();
 nodes.forEach(node=>node.depth===options.depth&&delete node.children);
 let label=node=>string(node.data)?node.data:array(node.data)?path(source)
:node.parent?Object.keys(node.data).join(""):source;
 nodes.forEach((node,index,{length})=>Object.assign(node,{title:title&&node.data[title]||label(node),value:length}));
 let [min,max]=extreme(nodes.flatMap(period).filter(Boolean).sort(ascending));
 let time=d3.scaleLinear().domain([min-(max-min)/5,max+(max-min)/5]).range([0,(max-min)/14000000])
 Object.assign(node,{matrix,spread,monospace,still,cluster,gradual,time});
 return note(node);
};

 function descend(value,{relations,title,routed})
{// recursion for sprawl. 
 if(!value)return [];
 if(string(value))return {[value]:undefined};
 if(value[relations])return value[relations];
 let flatten=array(value);
 let descendants=Object.entries(value).filter(([field])=>field!==title);
 return descendants.flatMap(([field,value],index,{length})=>
 flatten||(length==1)
?!value||Object.keys(value).length>1?descend(value,{relations,title,routed})
// routed records refer to terminal objects, which shouldn't be strings.
:(routed&&Object.values(value).every(value=>string(value)||array(value)))?[]:value
:{[field]:value})
};

 function records(resource)
{// extract matrix definitions as {domain,range,matrix:{[domain]:[...range]}}.
 let records=Object.entries(resource).filter(([field,records])=>
 array(records)&&records.some(record=>
 array(record)&&record.every(vector=>!isNaN(vector))));
 if(records.length)
 return records;
 if(Object.entries(resource).length==2)
 // they may also be referential values by title or index 
 // with uniform "record" keys as {scope,matrix:{path:{in:{scope:{record:[[...fields]]}}}}}.
 // WARNING binary trees may contain such arrays intended as children, not records. 
 return Object.entries(resource).map(([field,value])=>[[field],value]).reduce(function trace(matrix,[path,value])
{if(!compound(value))return matrix;
 let references=Object.entries(value||[]).map(([field,references])=>
[field,Object.entries(references||[]).find(({1:record})=>
 array(record)&&!record.flat().some(field=>!string(field)&&field))||[]
]);
 let records=references.every(({1:{0:field}},index,[{1:{length,0:first}}])=>length&&field===first);
 if(records)
 return references.reduce((matrix,[field,{1:record}])=>Object.assign(matrix
,{[matrix.length]:[[...path,field],[record]]})
,matrix);
 return Object.entries(value).reduce((matrix,[field,value])=>trace(matrix,[[...path,field],value]),matrix);
},[]);
 return records;
};

 function relate(node)
{[node,...node.matrix].reduce((node,[path,records])=>
 records.reduce((node,vectors,record)=>vectors.reduce((node,vector,field)=>
{if(!vector||!node)return;
 let [domain,range]=[0,1].map(index=>node.children[index].leaves());
 let [source,target]=array(path)?
[[node,...path].reduce(({children},field)=>children.find(({title})=>title==field))
,domain[field]
]:[domain,range].map((nodes,index)=>nodes[[field,record][index]]);
 // clear child node representing these relation records. 
 let [referral]=Object.entries(source.data[source.title]||{}).find(({1:value})=>value==records[0])||[];
 if(source.children?.find(({title})=>title==referral)||!source.children?.length)
 delete source.children;
 let domains=["stakeholder"];
 let ranges=["service","provider"];
 [source,target]=[source,target].sort((source,target)=>
 // parent title indicates the direction of the relationship. 
 [source,target].map(({parent:{title}})=>title).reduce((independent,title)=>
 [ranges,domains][Number(independent)].includes(title),false)-1);
 [source,target].forEach(node=>merge(node,{occurence:new Set([path])},0));
 merge(source,{adjacency:{[target.title]:new Set([path])}},0);
 let relation=source.relations?.get(target);
 relation=isNaN(vector)?[...relation||[],...[vector].flat()]:((relation||0)+vector)/source.adjacency[target.title].size;
 merge(source,{relations:new Map([[target,relation]])});
 return node;
},node),node));
 node.descendants().filter(({relations})=>relations).forEach(source=>
 source.relations=Array.from(source.relations).flatMap(([target,values])=>
 [values].flat().map(value=>({source,target,value}))));
 return node;
};

 function spread(root)
{let {spread,monospace,matrix}=root;
 let {force,radial,up,down,left,right}={[spread]:true};
 let horizontal=left||right;
 let vertical=down||up;
 let inverse=up||left;
 let path=["title","length"];
 let nodes=root.descendants();
 gauge(root,path);
 nodes.forEach(node=>Object.assign(node,[node.leaves().length,height(node)/(force?2:1)].map(scale=>
 scale*monospace).sort(size=>horizontal&&-1).reduce((width,height)=>({width,height}))));
 let size=[radial?Math.PI*2:root.width,root.height/(radial?2:1)].sort(size=>!horizontal-1);
 if(force)
 return nodes.reverse().reduce(({x,y},node)=>Object.assign(node,{x,y})
,[root.width,root.height].map(size=>size/2).reduce((x,y)=>({x,y})));
 else d3[radial?"tree":"cluster"]().size(size).separation(({depth,parent},next)=>
 radial?(parent==next.parent?1:2)/depth:1)(root);
 if(vertical||horizontal)
 nodes.forEach(node=>Object.assign(node,
[node.x,sum(
[node.parent?.["xy"[Number(!horizontal)]]??node[path.join("")][0]*monospace
,node.parent?node.parent.children.some(node=>node.children?.length)?node.parent[path.join("")][1]*monospace:10*monospace:0
])
].sort(width=>!horizontal-1).reduce((x,y)=>({x,y}))));
 if(inverse)
 nodes.forEach(node=>Object.assign(node
,[{x:root.width-node.x},{y:root.height-node.y}][Number(Boolean(vertical))]));
 return root;
};

 function gauge(node,path)
{// record max value of a property on node children recursively. 
 path=[path].flat();
 let field=path.join("");
 let values=node[field];
 if(values)return values;
 let value=search.call(node,path);
 let {children=[]}=node;
 values=children.map(node=>gauge(node,path)).reduce((values,branch)=>
 Object.assign([],branch,values).map((value,depth)=>
 Math.max(...[values,branch].map(values=>values[depth]))||value||branch||0),[]);
 return node[field]=[value,...values];
};

 function chart(concept,fragment)
{let zoom=browser&&!concept.still&&{zoom({transform}){extend.call(this,{fold:false,g:{fold:false,class:"graph",transform}});}};
 return compose.call
(fragment?.ownerDocument?fragment:{svg:{"xmlns:xlink":namespaces.xlink,preserveAspectRatio:"xMidYMid meet",defs:{filter:[vectors.shadow.defs.filter,vectors.shadow_white.defs.filter]}}}
,document
,{fold:false,datum:concept,call:zoom?observe.call(d3.zoom().scaleExtent([0.3,16]),zoom):undefined
 ,id:concept.source,class:"d3"//,width:({width})=>width,height:({height})=>height
 ,viewBox({width,height,spread})
{return [spread,0].reduce((spread,origin)=>
[{radial:-width,left:origin},{radial:-height,up:origin}
,{radial:width*2,left:origin},{radial:height*2,up:origin}
].map((boundary,index)=>boundary[spread]||[0,0,width,height][index]||origin).join(" "));
},title(concept){return trace(concept,[])[0];}
 ,g:
 {update:true,class:"graph",transform({spread})
{let [{width,height}]=ascend.call(this);
 let translate={radial:[width/2,height/2],right:[10,0],left:[-10,0],down:[0,10],up:[0,-10]}[spread]||[0,0];
 return "translate("+translate+")";
},g:
[{update:true,class:"network",fill:"none",stroke:"#555","stroke-width":1.5,g:
 {fold(node){return forage(node)[1]},class:"link",call(links){links.remove();}
 ,update(links){if(ascend.call(links)[0].datum().spread==="force")links.each(link.each).call(drag);}
 }
 }
,{update:true,class:"cluster","stroke-linejoin":"round","stroke-width":1,g:
 {fold(node){return forage(node)[0];},class:"node",call(nodes){nodes.remove();}
 ,update(nodes){if(ascend.call(nodes)[0].datum().spread==="force")nodes.each(locate).call(drag);}
 }
 }
]}
 },tether(extend)
);
};

 function forage(node)
{if(node.ownerDocument)
 return [["cluster","node"],["network","link"]].map(([group,name],index)=>
 d3.select(node).select("g."+group).selectAll("g."+name));
 let {spread,matrix}=node;
 let {up,down,left,right}={[spread]:true};
 let stub=(up||down||left||right)&&node.children.length>1;
 let nodes=node.descendants().slice(stub);
 let cyclical=matrix.length&&matrix.every(([field])=>array(field));
 let links=stub
?node.children.flatMap(domain=>domain.links())
:[node.links(),nodes.flatMap(node=>node.relations?.filter(Boolean)||[])].flat();
 return [nodes,links];
};

 function locate(node)
{return compose.call
(this.transform?.baseVal[0]?.matrix||{}
,combine(swap(node),compose("e","x",refer),compose("f","y",refer)),collect,infer("reduce",merge)
);
};

 function simulate(fragment)
{return compose
(0.01,"alphaTarget",infer("force","link",d3.forceLink([]).strength(0))
,{fragment,clock:0},Object.assign
,tether(observe,{tick:compose(synchronize,charge)})
,"fragment"
)(fragment.simulation=fragment.simulation||d3.forceSimulation());
};

 function synchronize(simulation)
{// reflect changes to simulation on chart. 
 let {fragment,clock=0,title,gradual,time}=simulation;
 if(!fragment.parentNode)
 return note(simulation.stop(),"detached");
 let hold=clock%5;
 if(gradual&&hold)return simulation;
 simulation.clock=0;
 let [cluster,network]=forage(fragment);
 let [nodes,links]=forage(d3.select(fragment).datum());
 if(gradual)
 links=links.slice(0,network.size()+1)
,nodes=Array.from(new Set(links.flatMap(({source,target})=>[source,target])));
 extend.call(fragment,{fold:false,g:{fold:false,class:"graph",g:
[{fold:false,class:"network",g:{...link,fold:links}}
,{fold:false,class:"cluster",g:{...node,fold:nodes}}
]}});
 let {force}={[d3.select(fragment).datum().spread]:true};
 if(!force)
 return simulation.alpha(0).stop();
 return simulation;
 //form.style.backgroundImage=nodes.size()==this.nodes()[0].value?"":"linear-gradient(to right,"+[...this.nodes(),...new Array(this.nodes()[0].value-this.nodes().length)].map(node=>!node?"var(--isle)":paint(node).replace(")",",0.3)")).join(",")+")";
};

 var node=
 {fold:false,match:nodeindex
 ,update(nodes)
{let fields=["class","id","fill","transform"];
 extend.call(nodes,{fold:false,...extract.call(node,fields)});
 //nodes.attr("fill", node. fill).attr("transform",node. transform)
},each(node){if(trace(node,[])?.[0]?.includes("image"))pattern(node);}
 ,call:nodes=>drag(nodes)
 ,class:"node",id:nodeindex,filter:"url(#shadow)"
 ,fill:node=>paint(node)
 ,transform({x,y})
{let {spread}=ascend.call(d3.select(this))[0].datum();
 let {up,down,right,left,radial,force}={[spread]:true};
 return force?"translate("+[x,y]+")"
:radial?"rotate("+(x*180/Math.PI-90)+") translate("+y+",0)"
:"translate("+[x,y]+") rotate("+(right?0:down?90:up?-90:0)+")";
},title:{text:({title})=>title}
 ,circle:
[{class:"node"
 ,name({title,parent,children}){return parent&&!children?parent.title+"_"+title:null;}
 ,r(node){return ascend.call(d3.select(this))[0].datum().spread==="force"?scale(node.centrality)||10:5;}
 ,fill:node=>paint(node)
 ,title:{text({data,title}){return search.call(data,[title,"progress"])?.concat("%")||this.remove();}}
 }
,{fold(node){return trace(node,[])?.[0]?.includes("image")?[node]:[];}
 ,class:"label"
 ,r({centrality}){return scale(centrality)*0.9||9;}
 ,fill({title}){return "url(#"+title?.replace(/ /g,"_")+")"}
 }
],text:
 {fold:wrap,class:"label",fill:"black",stroke:"black",opacity:0.5
 ,"text-anchor":function()
{let {spread}=ascend.call(d3.select(this))[0].datum();
 let {force,left,up}={[spread]:true};
 let {children}=ascend.call(d3.select(this),1)[0].datum();
 return force?"middle":["start","end"][sum([Boolean(children?.length),left])%2];
},"stroke-width":function()
{let force=ascend.call(d3.select(this))[0].datum().spread==="force";
 return force?(scale(ascend.call(d3.select(this),1)[0].datum().centrality)||10)*0.002+"px":0.5;
},"font-size":function()
{let force=ascend.call(d3.select(this))[0].datum().spread==="force";
 return (scale(ascend.call(d3.select(this),1)[0].datum().centrality)||10)/5+"px";
},dx()
{let {spread}=ascend.call(d3.select(this))[0].datum();
 let {force,left,up}={[spread]:true};
 let {children}=ascend.call(d3.select(this),1)[0].datum();
 return !force?[7,-7][sum([Boolean(children?.length),left])%2]:null;
},dy(text,index,wrap)
{let force=ascend.call(d3.select(this))[0].datum().spread==="force";
 return force?(index+1-(wrap.length)/2)*10+"px":".25em";
},transform()
{let radial=ascend.call(d3.select(this))[0].datum().spread==="radial";
 return radial?left(this)?"rotate(180)":null:null;
},text(text){return text;}
 }
 };

 var link=
 {fold:false,match:linkindex
 ,update(links)
{let force=ascend.call(links)[0].datum().spread==="force";
 let fields=force?["class","id","path"]:["class","id","transform","path"];
 extend.call(links,{fold:false,...extract.call(link,fields)});
 //links.attr("transform", link. transform);["link","arrow"].forEach((l,index)=>links.select("path."+l).attr("d",link.path[index].d))
},drop(links)
{extend.call(links,{fold:false,each(link)
{let detached=connect(link,-1).filter(node=>!node.degree);
 detached.forEach(infer("remove"))
}});
 return links;
},each:link=>connect(link)
 ,call:links=>drag(links)
 ,id:linkindex,class:"link",style:"opacity:0.5"
 ,title:{text:(link)=>[link,link.source,link.target].map(({value,title},index)=>
 index?title:{R:"responsible",A:"accountable",C:"consulted",I:"informed"}[value]||value).join("\n")}
 ,transform(link,index,links)
{let twins=d3.selectAll(links).select(function(twin){return ["source","target"].every(key=>twin[key]==link[key])&&this}).data();
 let twinindex=twins.indexOf(link);
 return "translate(0,"+(scale(!link.value||isNaN(link.value)?1:link.value)/7/twins.length)*Math.ceil(twinindex/2)*(twinindex%2||-1)+")";
},path:
[{update(path){extend.call(path,{fold:false,...extract.call(link.path[0],["class","d"])});}
 ,class:"link"
 ,stroke({value,source}){return paint(value&&isNaN(value)?value:source);}
 ,"stroke-width":({value})=>scale(!value||isNaN(value)?1:value)/7
 ,d(link,index,paths)
{let {spread}=ascend.call(d3.select(this))[0].datum();
 return line(spread,index,paths)(link);
}}
,{update(path){extend.call(path,{fold:false,...extract.call(link.path[1],["class","d"])});}
 ,class:"arrow"
 ,"stroke-width":({value})=>scale(value||1)/14
 ,"marker-end":function({source})
{let [fragment]=ascend.call(this);
 let marker=trace(source,[]).pop()?.replace(/[^a-zA-Z0-9]/g,"").replace(/^[0-9]+/,number=>
 number.split("").map(number=>String.fromCharCode(65+number))).replace(/,/g,"")||"none";
 if(!fragment.querySelector("marker#"+marker))
 extend.call(fragment,{fold:false,defs:
 {fold:false,marker:
 {id:marker,orient:"auto",markerWidth:"2",refX:"0.1",refY:"1"
 ,path:{d:"M0,0 V2 L2,1 Z",fill:paint(source)}
 }
 }});
 return "url(#"+marker+")";
},d({source,target})
{if(!this.previousSibling.getPointAtLength)
 return null;
 if(!source.centrality)
 return null;
 let curve=[source,source,this.previousSibling.getPointAtLength?.(scale(source.centrality))||target];
 return curve.map(({x,y},index)=>["M","S"," "][index]+[x,y]).join("");
}}
]};

 function line(spread,index,paths)
{let axis=[["left","right"],["up","down"]].findIndex(axis=>axis.includes(spread));
 spread=["horizontal","vertical"][axis]||spread;
 let line=Object.fromEntries(
[["radial","Radial","angle","radius"]
,["vertical","Vertical","x","y"]
,["horizontal","Horizontal","x","y"]
].map(([spread,line,tilt,steer])=>
 [spread,d3["link"+line]()[tilt](({x})=>x)[steer](({y})=>y)]));
 return function(link)
{let origo=spread=="radial"&&!link.source.parent;
 if(line[spread])
 if(!origo)
 return line[spread](link);
 let {source,target:{x,y}}=link;
 let curve=!["horizontal","vertical"].includes(spread)?""
://"C"+source.x+","+(source.y+y)/2+" "+x+","+(source.y+y)/2:
 compose.call(
 {distance:Math.sqrt((source.x-x)**2+(source.x-x)**2),middle:(y+source.y)/2,ascent:Math.sqrt(Math.abs(y*source.y))
 ,side:(paths[index]._parent.closest("svg").getAttribute("width")/2<source.x?1:-1)
 ,steer:Math.abs(source.x-paths[index]._parent.closest("svg").getAttribute("width")/2)
 ,feedback:trace(source)=="stakeholder",scope:0,descent:0
 }
,({steer,...curve})=>({...curve,steer,descent:y+source.y-ascent,scope:((paths[index]._parent.closest("svg").getAttribute("width")/2/steer)*Math.sqrt(steer*steer/4))})
,({distance,middle,side,steer,scope,feedback,ascent,descent})=>
 "C"+(feedback?source.x+","+(source.y-scope/3):source.x+","+ascent)
    +(feedback?" "+(source.x+scope*side)+","+(source.y-scope/3):"")
+" "+(feedback?source.x+scope*side+","+middle:x+","+descent)
    +(feedback?" "+(source.x+scope*side)+","+(y+distance):"")
    +(feedback?" "+(x)+","+(y+scope/3):"")
);
 let end=spread=="radial"?Math.cos(x-Math.PI/2)*y+","+Math.sin(x-Math.PI/2)*y:(x+","+y);
 return "M"+source.x+","+source.y+curve+" "+end;
}
};

 function pattern(node)
{extend.call(ascend.call(this)[0]
,{fold:false,defs:{fold:false,pattern:
 {fold(){return d3.select(this).selectAll("pattern").data().concat(node);}
 ,match:patternindex
 ,id:patternindex,name({data,title}){return data[title]||title;}
 ,x:0,y:0,width:1,height:1,viewBox({centrality:size}){return [0,0,size,size];}
 ,each(node,index,patterns)
{let {id}=this,name=this.getAttribute("name"),pattern=this,color=paint(node);
 (name!="image"
?fetch("https://www.googleapis.com/customsearch/v1/"
+(name=="wiki image"?"siterestrict":"")
+"?q="+label(node)+"&searchType=image&cx="
+(name==="wiki image"?"014735265259933203879:xaftz2zw4io":"014735265259933203879:qgusnjqnuxk")
+"&key="+keys.google.api).then(response=>response.json()).then(json=>(json.items||[{link:undefined}])[0].link)
:new Promise(done=>done(name.startsWith("http")?name:name=="image"
?vectors[name]?"vector/"+name:("icon/"+label(node)+".png")
:"icon/"+name.replace(/ /g,"_")+".png"))).then(canvas).then(canvas=>
{pattern.appendChild(document(
 {image:
 {width:scale(node.centrality)
 ,height:!src.endsWith("png")&&canvas.height>canvas.width?null:scale(node.centrality)
 ,y:label(node)=="desertification"||(color=["hazard","stakeholder"].includes(color))?scale(node.centrality)*.2:undefined
 ,[color=canvas.width>canvas.height&&color?"width":"height"]:color?undefined:scale(node.centrality)*(color=="width"?1:label(node)=="desertification"?1:.6)
 }
 },"svg").next().value).setAttributeNS("http://www.w3.org/1999/xlink","href",canvas.toDataURL("image/"+src.slice(-3)));
})
}}}
 });
};

 var drag=observe.call(d3.drag()
,{start(drag,nodes)
{["x","y"].forEach(dimension=>nodes["s"+dimension]=nodes[dimension]);
 //setTimeout(tick=>event.target.editing&&this.window.subject.reform({delete:{name:nodes.title}}),event.target.editing=1000);
},drag(drag,nodes)
{["x","y"].forEach(dimension=>nodes["f"+dimension]=drag[dimension]);
 this.style.zIndex=0;
 if(this.spread=="force")return;
 let {simulation}=this.closest("svg");
 let siblings=nodes.parent.children;
 let index=siblings.indexOf(nodes);
 let [sort,sibling]=[-1,1].map(sort=>[sort,siblings[index+sort]]).filter(([,sibling])=>sibling).find(([,{y}],bigger)=>
 (nodes.y-y<0)!=Boolean(bigger))||[];
 let source=["data","title"].map(key=>nodes.parent[key]).reduce(Reflect.get);
 if(sibling)
{nodes.edited=true;
 nodes.parent.children=siblings.sort(({title})=>title==nodes.title&&sort);
 Object.assign(source,Object.fromEntries(Object.entries(source).sort(([key])=>key==nodes.title&&sort)));
 ["x","y"].forEach(dimension=>[nodes["s"+dimension],sibling[dimension]]=[sibling[dimension],nodes["s"+dimension]]);
 [this,this[(sort<0?"previous":"next")+"Sibling"]].filter(Boolean).map(d3.select).forEach(nodes=>
 node.update(nodes)||
 link.update(simulation.network.filter(({source,target})=>[source,target].includes(nodes.datum()))));
};
},end(drag,nodes)
{let {simulation}=this.closest("svg");
 let radius=+this.querySelector("circle").getAttribute("r");
 let source=simulation.find(nodes.x,nodes.y,radius);
 ["x","y"].map(dimension=>nodes[dimension]=nodes["s"+dimension]);
 node.update(d3.select(this));
 link.update(simulation.network.filter((link)=>[link.source,link.target].includes(nodes)))
 delete nodes.fx&&delete nodes.fy;
 delete nodes.sx&&delete nodes.sy;
 delete this.style.zIndex;
 if(nodes.edited)
 delete nodes.edited&&
 Object.entries({join:simulation.title,put:{room:simulation.title,body:nodes}}).forEach(([emit,body])=>
 window.subject.room.emit(emit,body));
 if(!source)return;
 let links=simulation.force("link").links();
 simulation.force("link").links(links.concat({source,target:nodes}));
 //simulation.restart();
}});

 function connect(link,rate=1)
{if(!link)return [];
 let {source,target,value}=link;
 return [source,target].map((concept,vertex)=>
 ["imposure","exposure","outdegree","indegree"].map((score,index)=>
 concept[score]=index%2==vertex?(concept[score]||0)+(index<2&&value||1)*rate:concept[score]||0)&&
 Object.assign(concept
,{degree:concept.indegree+concept.outdegree
 ,centrality:concept.exposure+concept.imposure
 ,complexity:concept.exposure/concept.imposure
 }));
};

 function nodeindex(node){return node?trace(node,[]).join("/"):this.getAttribute("id");};
 function linkindex(link){return link?[link.source,link.target].map(nodeindex).join("_"+link.value+"_"):this.getAttribute("id");};
 function patternindex({title}){return title.replace(/[^\d\w]/g,"");};
 function scale(value){return Math.cbrt(value*13000)};
 function period(node){return ["start","end"].map(field=>search.call(node.data,[node.title,field]));};

 function branch(node)
{return node.parent?[...branch(node.parent),node]:[node];
};

 function height(node)
{return Math.max(...node.leaves().map(node=>
 sum(branch(node).flatMap((node,index)=>node.titlelength.slice(index?1:0,2)))));
};

 export var trace=(node,path)=>!path&&color[node.title]?node.title:!node.parent
?[node.title,...path||[]]
:trace(node.parent,path?[node.title,...path]:path);

 function paint(node,scale)
{if(typeof node=="string")
 return {R:color.red,A:color.yellow,C:color.green}[node]||color.indigo;
 let {progress}=node.data[node.title]||{};
 return typeof progress=="undefined"
?color[trace(node)]||(scale||color.rainbow).call(color,node.height/(node.depth+node.height))
:Number(progress)?color.health(Number(progress)/100):"#616161";
};

 function wrap({title,parent})
{if(trace(arguments[0],[])?.[0]?.includes("image"))
 return [];
 let force=ascend.call(d3.select(this))[0].datum().spread==="force";
 return force?!title||(title.toString().match(/.+?(_|\/|$)/g)||[]).reduce((wrap,split,index,splits)=>
 wrap.concat(index&&(split.length+wrap[wrap.length-1].length<18)
?wrap.pop()+split
:split.match(new RegExp(".{1,"+18+"}","g"))),[])
:[parent?title:""];
};

 function left(node)
{let {width,spread}=ascend.call(d3.select(node))[0].datum();
 let {x,parent}=ascend.call(d3.select(node),1)[0].datum();
 let {radial}={[spread]:true};
 return radial?x<Math.PI||!parent:(x<width/2?parent:!parent);
};

 function charge(simulation)
{let [cluster,network]=forage(simulation.fragment);
 let [population,connections]=[cluster,network].map(selection=>selection.size());
 let [nodes,links]=[simulation.nodes(),simulation.force("link").links()];
 let change=[population,connections].some((size,index)=>size!==[nodes,links][index].length);
 if(!change)
 return simulation;
 let density=connections/population**2||0;
 let [width,height]=["width","height"].map(dimension=>scale(population**2/(density||1)));
 let {complexity,centrality}=metrics(cluster.data());
 combine
(infer("alpha",1)
,infer("nodes",cluster.data(),nodeindex)
,infer("force","center",d3.forceCenter(width/2,height/2))
,infer("force","charge",d3.forceManyBody().strength(population/complexity*-1||0))
,infer("force","collision",d3.forceCollide().radius(({centrality})=>scale(centrality)+5))
,compose("link","force",1/density||0,"distance",population/connections||1,"strength",infer("links",network.data(),linkindex))
,compose("fragment",{fold:false,viewBox:[-0,-0,width,height].join(" "),width,height},tether(extend))
)(simulation);
 return simulation;
 //this.force("x",d3.forceX(width/2).strength(1)).force("y",d3.forceY(width/2).strength(1));
};

 function metrics(nodes)
{let [exposure,imposure,internal,balance]=nodes.reduce((metric,{exposure,imposure,complexity},index)=>
[exposure,imposure,index=complexity&&(complexity!=Infinity),index?complexity:0
].map((value,index)=>metric[index]+value)
,[0,0,0,0]);
 let complexity=balance/internal||0;
 let dominance=(12/(nodes.length**3-nodes.length))*nodes.reduce((hierarchy,node,index,{length})=>
 hierarchy+(((node.imposure-imposure)/length)**2),0)
 return {exposure,imposure,internal,complexity,dominance};
};

 export function serialize(concept)
{let children=Array.isArray(concept.children)?concept.children.map(subceive):[];
 Object.assign(concept.data[concept.title]||{},...children);
 return concept.data;
};

 function report(fragment)
{note(d3.select(fragment).datum().source,fragment.parentNode?"tethered.":"ready.");
};

/* function conceptualise()
{return Object.entries(seed).reduce(function latch(concepts,[name,concept])
{path.push(name);
 let passive=!concept||["string","number"].includes(typeof concept)||["/awesome","/vectors","/d3"].includes(name);
 let relations=passive?[]:!concept[reference]?reference?[]:concept
:Array.isArray(concept[reference])||!Object.values(concept[reference]).some(isNaN)?concept[reference]:[concept[reference]];
 relations=Object.entries(relations).map(([key,relation],index)=>
 parseInt(key)==index&&!relation.length&&!reference
?Object.entries(relation).reduce(latch,concepts)
&&Object.keys(relation).map(relation=>[relation,1])
:latch(concepts,[key=parseInt(key)==index?typeof relation.name=="string"?relation.name:relation:key,relation])
&&[[key,typeof relation=="number"?relation:1]]).flat();
 console.log(concept,relations);
 relations=Object.fromEntries([...concepts[name]&&concepts[name].relations?concepts[name].relations.length?concepts[name].relations.map(relation=>[relation,1]):Object.entries(concepts[name].relations):[],...relations]);
 concepts[path.pop()]=Object.assign({data:{name,path:[...path]},parent:concepts[path.slice(-1)[0]]},concept.length||concept,concepts[name],{relations});
 if(!reference&&!path.length&&Object.keys(seed)[1])
 concepts[seed.name||""]={data:{relations:{...(concepts[seed.name||""]||{}).relations,[name]:1}}};
 return concepts;
},{})
};*/
