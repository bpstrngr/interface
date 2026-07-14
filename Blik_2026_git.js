 import {note,buffer,expect,record,prune,colors} from "./Blik_2023_inference.js";
 import {prompt,print} from "./Blik_2023_interface.js";
 import {folder} from "./Blik_2023_meta.js";
 import http from "./Hilton_2018_isomorphic-git-http.js";
 import git from "./Hilton_2017_isomorphic-git.js";
 import fs from "fs";
 var address=import.meta.url;
 var relation=folder(new URL(address).pathname);

 export default
 {log(request)
{return git.log({fs,dir:relation});
},tree(request)
{return compose.call
({fs,dir:relation},git.listBranches,infer("reduce",record
(branch=>git.log({fs,dir:relation,ref:branch})
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
 let [dir,ref]=[relation,[remote,branch].join("/")];
 console.log(" Pivotting to "+ref+".\n");
 // git fetch $remote;
 await git.fetch({fs,http,remote,dir,onProgress}).then(note);
 // git checkout $remote/$branch .gitignore;
 await git.checkout({fs,dir,ref,filepaths:[".gitignore"]
 // update HEAD to include .gitignore's scope. 
 // do Checkout to show .gitignore as unmodified. 
 // do not track to remain oriented towards current. 
 ,noUpdateHead:false,noCheckout:false,track:false
 ,onProgress,onPostCheckout
 });
 // git add .;
 let matrix=await git.statusMatrix({fs,dir});
 await matrix.reduce(record(buffer(compose(drop(1),([filepath])=>git.add({fs,dir,filepath,force:true})),undefine)),[]);
 console.log(" Merged scopes:");
 await status().then(console.log);
 // stash=$(git status --porcelain|wc -l);
 let stash=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 // [[ $stash -gt 0 ]] && git stash;
 let object=stash.length&&await git.stash({fs,dir,op:"push"});
 let stashed=await git.listFiles({fs,dir,ref:object});
 console.log("Stashed "+stashed.length);
 // git checkout $remote/$branch;
 await git.checkout({fs,dir,ref,onProgress,onPostCheckout});
 console.log(" New scope:");
 await status().then(console.log);
 // [[ $stash -gt 0 ]] && git checkout stash .;
 if(object)
 await git.checkout(
 {fs,dir,ref:object,filepaths:stashed
 // leave HEAD to show changes. 
 // do Checkout to merge scopes. 
 // do not track to remain oriented towards current. 
 ,noUpdateHead:true,noCheckout:false,track:false
 ,onProgress,onPostCheckout
 });
 console.log(" Re-merged scopes:");
 await status().then(console.log);
 // git restore --staged .;
 await git.statusMatrix({fs,dir}).then(matrix=>
 matrix.reduce(record(([filepath])=>
 git.resetIndex({fs,dir,filepath})),[]));
 note(" Unstaged changes.");
 function onProgress(message){print(message);};
 function onPostCheckout(message){console.log(message);};
};

 export async function authorize(dir=relation)
{let [name,email]=await ["name","email"].reduce(record(field=>git.getConfig({fs,dir,path:"user."+field})),[]);
 return prompt({name,email}).then(({name,email})=>
 [name,email].reduce(record(([field,value])=>
 git.setConfig({fs,dir,path:"user."+field,value})),[]));
};

 export async function status()
{let matrix=await git.statusMatrix({fs,dir:relation});
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