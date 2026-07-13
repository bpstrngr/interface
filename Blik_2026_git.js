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
 await git.checkout({fs,dir,ref,filepaths:[".gitignore"],noUpdateHead:true,track:false,onProgress,onPostCheckout});
 let files=await index().then(note);
 await files.reduce(record(filepath=>git.add({fs,dir,filepath,force:true})),[]);
 let stash=files.length&&await git.stash({fs,dir,op:"push"}).then(note);
 if(stash)await git.stash({fs,dir,op:"list"}).then(note);
 await git.checkout({fs,dir,ref,onProgress,onPostCheckout});
 if(stash)await git.checkout({fs,dir,ref:stash,noUpdateHead:true,track:false,onProgress,onPostCheckout});
 console.log(" Restored stash: "+stash);
 let staged=await stage();
 await staged.reduce(record(([filepath])=>git.resetIndex({fs,dir,filepath})),[]);
 console.log(" Unstaged changes: "+JSON.stringify(staged));
 function onProgress(message){status(message);};
 function onPostCheckout(message){console.log(message);};
};

 export async function authorize(dir=relation)
{let [name,email]=await ["name","email"].reduce(record(field=>git.getConfig({fs,dir,path:"user."+field})),[]);
 return prompt({name,email}).then(({name,email})=>
 [name,email].reduce(record(([field,value])=>
 git.setConfig({fs,dir,path:"user."+field,value})),[]));
};

 export async function index(dir=relation)
{// git status --porcelain;
 let matrix=await git.statusMatrix({fs,dir});
 return matrix.filter(([name,head,work,stage])=>work).map(([file])=>file);
};

 export async function stage(dir=relation)
{let matrix=await git.statusMatrix({fs,dir});
 return matrix.filter(([name,head,work,stage])=>stage===3).map(([file])=>file);
};