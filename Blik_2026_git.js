 import {note,buffer,expect,record,prune} from "./Blik_2023_inference.js";
 import {prompt,status} from "./Blik_2023_interface.js";
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
{({remote,branch}=await prompt({remote,branch}));
 await authorize();
 let [dir,ref]=[relation,[remote,branch].join("/")];
 console.log(" Pivotting to "+ref+".");
 await git.fetch({fs,http,remote,dir,onProgress,onPostCheckout}).then(note);
 await git.checkout({fs,dir,ref,filepaths:[".gitignore"],noUpdateHead:false,noCheckout:false,track:false,onProgress,onPostCheckout});
 let matrix=await git.statusMatrix({fs,dir});
 let past=await scope(matrix,"head",0);
 let next=await scope(matrix,"head");
 await past.reduce(record(filepath=>git.add({fs,dir,filepath,force:true})),[]);
 await next.reduce(record(buffer((record,filepath)=>git.resetIndex({fs,dir,filepath,force:true}),undefine)),[]);
 matrix=await git.statusMatrix({fs,dir});
 let added=await scope(matrix,"stage",[2,3]);
 let removed=await scope(matrix,"stage",0);
 note({matrix,past,next,added,removed})
 return
 let stash=stage.length&&await git.stash({fs,dir,op:"push"}).then(note);
 await git.checkout({fs,dir,ref,onProgress,onPostCheckout});
 if(stash)await git.checkout({fs,dir,ref:stash,noUpdateHead:true,noCheckout:true,track:false,onProgress,onPostCheckout});
 console.log(" Restored stash: "+stash);
 await past.reduce(record(filepath=>git.remove({fs,dir,filepath})),[]);
 await next.reduce(record(filepath=>git.remove({fs,dir,filepath})),[]);
 console.log(" Unstaged changes: "+JSON.stringify(next));
 function onProgress(message){status(message);};
 function onPostCheckout(message){console.log(message);};
};

 export async function authorize(dir=relation)
{let [name,email]=await ["name","email"].reduce(record(field=>git.getConfig({fs,dir,path:"user."+field})),[]);
 return prompt({name,email}).then(({name,email})=>
 [name,email].reduce(record(([field,value])=>
 git.setConfig({fs,dir,path:"user."+field,value})),[]));
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