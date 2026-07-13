 import {note,buffer,expect,record,prune} from "./Blik_2023_inference.js";
 import {prompt} from "./Blik_2023_interface.js";
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
 console.log("Pivotting to "+[remote,branch].join("/")+".");
 let dir=relation;
 await git.fetch({fs,http,remote,dir}).then(note);
 await git.checkout(
 {fs,dir,remote,ref:branch,filepaths:[".gitignore"]
 ,onProgress(message){console.log(message);}
 ,onPostCheckout(message){console.log(message);}
 });
 await git.add({fs,dir,filepath:"."});
 //let files=await git.listFiles({fs,dir}).then(note);
 //let stats=files.map(filepath=>git.status({fs,dir,filepath}).then(note));
 let status=await git.statusMatrix({fs,dir}).then(note);
 let {length:stash}=status.filter(([name,head,work,stage])=>work===2).map(([file])=>file);
 let [name,email]=await Promise.all(["name","email"].map(field=>
 git.getConfig({fs,path:"user."+field})));
 await prompt({name,email}).then(config=>Promise.all(
 Object.entries(config).map(([field,value])=>!{name,email}[field]&&
 git.setConfig({fs,dir,path:"user."+field,value}))));
 if(stash)
 await git.stash({fs,dir,op:"push"}).then(note)
 await git.stash({fs,dir,op:"list"}).then(note);
 await git.checkout(
 {fs,dir,remote,ref:"stash",track:false,noCheckout:true,noUpdateHead:false
 ,onProgress(message){console.log(message);}
 ,onPostCheckout(message){console.log(message);}
 });
 // git checkout $remote/$branch;
 // [[ $stash -gt 0 ]] && git checkout stash .;
 // git restore --staged .; 
}