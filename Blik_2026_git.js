 import {note,slip,buffer,expect,record,prune,colors,exit} from "./Blik_2023_inference.js";
 import {prompt,print,compile,command,access,test,locate} from "./Blik_2023_interface.js";
 import {folder} from "./Blik_2023_meta.js";
 import http from "./Hilton_2018_isomorphic-git-http.js";
 import git from "./Hilton_2017_isomorphic-git.js";
 import fs from "fs";
 var address=import.meta.url;
 var relation=folder(new URL(address).pathname);
 function onProgress(message){print(message);};
 function onPostCheckout(message){console.log(message);};

 export default
 {log(request)
{return git.log({fs,dir:relation});
},tree(request)
{let dir=relation;
 return compose.call
({fs,dir},git.listBranches,infer("reduce",record
(branch=>git.log({fs,dir,ref:branch})
,branch=>branch
),{}),tether(prune,function([ref,commit])
{if(array(commit))
 return commit.reduce(record(({commit:{message,parent}})=>({message,source:parent}),({oid})=>oid),{});
 if(!commit.source?.length)
 return commit;
 let sources=commit.source.flatMap(oid=>
 Object.values(search.call(this,is(something,match([oid]))))).map(source=>
 merge(source,{[ref]:commit},0));
},0,1)
);
}};


 export async function check(remote,branch)
{// pivot to tracking remote/branch, preserving files from the current one and changes to theirs.
 ({remote,branch}=await prompt({remote,branch}));
 let [dir,ref]=[process.cwd(),[remote,branch].join("/")];
 console.log(" Pivotting "+dir+" to "+ref+".\n");
 await git.fetch({fs,http,remote,dir,onProgress}).then(note);
 await include(ref,dir);
 let matrix=await git.statusMatrix({fs,dir});
 await matrix.reduce(record(buffer(compose(drop(1),([filepath])=>git.add({fs,dir,filepath,force:true})),undefine)),[]);
 console.log(" Merged scopes:\n"+await status());
 let changes=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 let stash=changes.length&&await git.stash({fs,dir,op:"push"});
 await git.checkout({fs,dir,ref,onProgress,onPostCheckout});
 console.log(" New scope:\n"+await status());
 if(stash)await apply(stash,dir);
 console.log(" Re-merged scopes:"+await status());
 await git.statusMatrix({fs,dir}).then(matrix=>
 matrix.reduce(record(([filepath])=>
 git.resetIndex({fs,dir,filepath})),[]));
 note(" Unstaged changes.");
};

 export async function push(credentials="protocol.json",dir=process.cwd())
{// commit whatever's changed and push HEAD to whichever remote branch it descends from.
 let matrix=await git.statusMatrix({fs,dir});
 let changes=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 if(!changes.length)
 return console.log(" Nothing to commit.");
 await status(matrix).then(console.log)
 let commit=await git.resolveRef({fs,dir,ref:"HEAD"});
 let remotes=await git.listRemotes({fs,dir}).then(remotes=>remotes.map(({remote})=>remote));
 let branches=await remotes.reduce(record(remote=>
 git.listBranches({fs,dir,remote}).then(branches=>
 branches.map(branch=>remote+"/"+branch))),[]).then(branches=>branches.flat());
 let tracking=await branches.reduce(record(async ref=>
 {let tip=await git.resolveRef({fs,dir,ref});
  return tip===commit||await git.isDescendent({fs,dir,oid:tip,ancestor:commit})?ref:undefined;
 }),[]).then(refs=>refs.filter(Boolean));
 if(!tracking.length)
 return console.log(" Not descendent of any remote branch.");
 if(tracking.length>1)
 console.log(" Upstream branches:\n"+tracking.map((branch,index)=>[index+1,branch].join(" ")).join("\n"))
,tracking.splice(0,undefined,await prompt({branch:undefined}).then(({branch})=>tracking[branch-1]||branch));
 let [remote,branch]=tracking[0].split("/");
 if(!remote||!branch)
 return exit(" No such remote branch:"+tracking[0]);
 let [name,email]=await authorize(dir);
 if(!name||!email)
 return console.log(" git user config missing.");
 console.log(" Committing "+commit+" to "+remote+"/"+branch+" as "+name+" of "+email+".");
 let confirmation=await prompt({"good?":undefined});
 if(confirmation["good?"]!=="yes")
 return console.log(" Aborting.");
 let url=await target(remote,name,credentials);
 await changes.reduce(record(buffer(compose(drop(1),filepath=>git.add({fs,dir,filepath,force:true})),undefine)),[]);
 let {message}=await prompt({message:undefined});
 if(!message)
 return console.log(" Aborting.");
 let head=await git.commit({fs,dir,message,author:{name,email}});
 await expect
(buffer(git.push,fail=>
 prompt({"force?":undefined}).then(confirmation=>
 confirmation["force?"]==="yes"?false:true)),2
)({fs,http,dir,url,remote,ref:head,remoteRef:"refs/heads/"+branch});
 await git.fetch({fs,http,remote,dir}).then(note);
 let log=await git.log({fs,dir,depth:2});
 console.log(log.flatMap(({oid,commit:{message}})=>
 ["\n",colors.green+oid+colors.steady,message]).join("\n"));
};

 export async function authorize(dir=process.cwd())
{let [name,email]=await ["name","email"].reduce(record(field=>git.getConfig({fs,dir,path:"user."+field})),[]);
 return prompt({name,email}).then(({name,email})=>
 Object.entries({name,email}).reduce(record(([field,value])=>
 git.setConfig({fs,dir,path:"user."+field,value}).then(set=>value)),[]));
};

 export async function status(matrix)
{matrix=matrix||await git.statusMatrix({fs,dir:process.cwd()});
 let width=Math.max(...matrix.map(([name])=>name.length));
 return matrix.sort(([,past],[,next])=>past<next?-1:1).map(([name,head,work,stage])=>
[colors[work?work===stage?"green":"yellow":"red"]+name+" ".repeat(width-name.length),
[["       ","tracked"][head]
,["X"," ","*"][work]
,["X"," ","+","*"][stage]
].join(" ")+colors.steady
].join("")).join("\n");
};

 export async function scope(matrix,record="head",delta=1)
{let index={head:1,work:2,stage:3}[record];
 if(!index)throw Error("unknown git record: "+record);
 let deltas=[delta].flat();
 return matrix.filter(record=>deltas.includes(record[index])).map(([file])=>file);
 // https://isomorphic-git.org/docs/en/statusMatrix
 // ["a.txt", 0, 2, 0], // new, untracked
 // ["b.txt", 0, 2, 2], // added, staged
 // ["c.txt", 0, 2, 3], // added, staged, with unstaged changes
 // ["d.txt", 1, 1, 1], // unmodified
 // ["e.txt", 1, 2, 1], // modified, unstaged
 // ["f.txt", 1, 2, 2], // modified, staged
 // ["g.txt", 1, 2, 3], // modified, staged, with unstaged changes
 // ["h.txt", 1, 0, 1], // deleted, unstaged
 // ["i.txt", 1, 0, 0], // deleted, staged
 // ["j.txt", 1, 2, 0], // deleted, staged, with unstaged-modified changes (new file of the same name)
 // ["k.txt", 1, 1, 0], // deleted, staged, with unstaged changes (new file of the same name)
};

 export async function standardize(format)
{console.log(" Stashing author format...");
 // stage=$(git diff --name-only --cached);
 let dir=process.cwd();
 let matrix=await git.statusMatrix({fs,dir});
 let stage=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 // git stash -q --keep-index;
 await stage.reduce(record(buffer(compose(drop(1),([filepath])=>git.add({fs,dir,filepath,force:true})),undefine)),[]);
 let stash=await git.stash({fs,dir,op:"push"});
 await apply(stash,stage);
// for file in $(echo $stage);do
// if [[ "$file" = *.js && -e "$file" ]];then 
 await author(stash,format);
 await stage.reduce(record(buffer(compose(drop(1),([filepath])=>git.add({fs,dir,filepath,force:true})),undefine)),[]);
 console.log(" Re-staged modules after compilation.");
};

 export async function apply(ref,dir=process.cwd())
{let filepaths=await git.listFiles({fs,dir,ref});
 console.log(" Applying "+ref+" ("+filepaths.length+")");
 return git.checkout(
 {fs,dir,ref,filepaths
 // leave HEAD to show changes. 
 // do Checkout to merge scopes. 
 // do not track to remain oriented towards current. 
 ,noUpdateHead:true,noCheckout:false,track:false
 ,onProgress,onPostCheckout
 });
};

 export function include(ref,dir=process.cwd())
{return git.checkout({fs,dir,ref,filepaths:[".gitignore"]
 // update HEAD to include .gitignore's scope. 
 // do Checkout to show .gitignore as unmodified. 
 // do not track to remain oriented towards current. 
 ,noUpdateHead:false,noCheckout:false,track:false
 ,onProgress,onPostCheckout
 });
};

 export async function author(ref,format,dir=process.cwd())
{let files=await git.listFiles({fs,dir,ref});
 let matrix=await git.statusMatrix({fs,dir});
 let modules=files.filter(file=>file.endsWith(".js")&&matrix.find(record=>record[0]===file)[2]);
 modules.reduce(record(file=>
 console.log(" Formatting "+file+" to "+format+"...")||
 compose.call(file,format,compile,slip(file),true,access,test)),[])
};

 export async function target(remote,author,credentials="protocol.json",dir=process.cwd())
{({remote,author}=await prompt({remote,author}));
 let github=syndication.github||await locate(credentials).then(([module])=>
 access(module,"object")).then(({github})=>github);
 let code=github[author]?.personal_token||exit("no credentials for "+author);
 let address=await git.getConfig({fs,dir,path:"remote."+remote+".url"});
 return address.replace("://","://"+author+":"+code+"@");
};

 export var syndication={github:undefined};