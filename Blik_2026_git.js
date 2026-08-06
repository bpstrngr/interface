 import {note,compose,slip,swap,unary,buffer,expect,record,prune,colors,exit,string} from "./Blik_2023_inference.js";
 import {prompt,print,compile,command,access,test,locate} from "./Blik_2023_interface.js";
 import {folder,url,query} from "./Blik_2023_meta.js";
 import http from "./Hilton_2018_isomorphic-git-http.js";
 import git from "./Hilton_2017_isomorphic-git.js";
 import onp from "./Wanek_2016_onp.js";
 import fs from "fs";
 var address=import.meta.url;
 var relation=folder(new URL(address).pathname),dir=relation;
 function onProgress(message){print(message);};
 function onPostCheckout(message){console.log(message);};

 export default
 {async index(request,body,response,path)
{let {branch="stable"}=query(request.url);
 let scope=await compose.call(relation,remotes,branch,relation,note,zap,index,infer("reduce",record(files,({remote})=>remote),{}));
 let {pathname}=url(request);
 let [remote,commit,file]=pathname.split("/").slice(path.length+2);
 return scope;
},async commit(request,body,response)
{let {pathname}=url(request);
 let path=pathname.split("/").slice(3);
 return prune.call
(path.length?record(null,path):await compose.call(relation,remotes,infer("reduce",record(undefine,({remote})=>remote),{}))
,([field,value],[remote,branch,commit,...file])=>!value
?!remote?compose.call(field,relation,branches,infer("filter",not(match("HEAD"))),infer("reduce",record(undefine,unary),{}))
:!branch?compose.call({fs,dir,ref:[remote,field].join("/")},git.log,infer("reduce",record(({commit:{message,parent}})=>({message,parent}),({oid})=>oid),{}))
:!commit?compose.call({fs,dir,ref:field},git.listFiles)
:describe(async function(request,body,response,path)
{let filepath=file.join("/")+"/"+field;
 let {oid,object}=note(await git.readObject({fs,dir,oid:commit,filepath,format:"content"}));
 return object;
},file.join("/")+"/"+field)
:value
);
},async tag(request,body,response)
{let {pathname}=url(request);
 let path=pathname.split("/").slice(3);
 return prune.call
(path.length?record(null,path):await compose.call(relation,remotes,infer("reduce",record(undefine,({remote})=>remote),{}))
,([field,value],[remote,tag,commit,...file])=>!value
?!remote?tags(field,relation)
:!tag?compose.call(remote,relation,tags,differ(field),["ref"],record,{fs,dir},merge,git.log,infer("reduce",record(({commit:{message,parent}})=>({message,parent}),({oid})=>oid),{}))
:!commit?compose.call({fs,dir,ref:field},git.listFiles)
:describe(async function(request,body,response,path)
{let filepath=file.join("/")+"/"+field;
 let {oid,object}=note(await git.readObject({fs,dir,oid:commit,filepath,format:"content"}));
 return object;
},file.join("/")+"/"+field)
:value
);
}};

 export function remotes(dir=process.cwd())
{return git.listRemotes({fs,dir});
};

 export function branches(remote,dir=process.cwd())
{return git.listBranches({fs,dir,remote});
};

 export async function tags(remote,dir=process.cwd())
{// live per-remote tag listing (tags aren't remote-namespaced locally, so this can't be a local lookup).
 let url=await git.getConfig({fs,dir,path:"remote."+remote+".url"});
 let {refs:{tags={}}={}}=await git.getRemoteInfo({http,url});
 return Object.fromEntries(Object.entries(tags)
 .filter(([name])=>!name.endsWith("^{}"))
 .map(([name,oid])=>[name,tags[name+"^{}"]||oid]));
};

 export function files({remote},branch,dir)
{return git.listFiles({fs,dir,ref:[remote,branch].filter(string).join("/")});
};
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

 export async function log(depth,ref,dir=process.cwd())
{return git.log({fs,dir,ref,depth:Number(depth)}).then(log=>
 log.map(({oid,commit:{message,author:{name,email,timestamp}}})=>
 [colors.green+oid+colors.steady
 ,colors.dim+name+" <"+email+"> "+new Date(timestamp*1000).toISOString()+colors.steady
 ," "+message].join("\n")).join("\n"));
};

 export function delta(a,b)
{let [from,to]=[a,b].map(text=>text.split("\n"));
 return new onp(from,to).compose().map(({file1,file2})=>(
 {from:{start:file1[0],count:file1[1],lines:from.slice(file1[0],file1[0]+file1[1])}
 ,to:{start:file2[0],count:file2[1],lines:to.slice(file2[0],file2[0]+file2[1])}
 }));
};

 export async function diff(dir=process.cwd())
{let commit=await git.resolveRef({fs,dir,ref:"HEAD"});
 let matrix=await git.statusMatrix({fs,dir});
 let files=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 return files.reduce(record(async filepath=>
{let from=await git.readBlob({fs,dir,oid:commit,filepath}).then(({blob})=>Buffer.from(blob).toString("utf8")).catch(undefine);
 let to=await fs.promises.readFile(dir+"/"+filepath,"utf8").catch(undefine);
 return [filepath,delta(from||"",to||"")];
}),[]).then(Object.fromEntries);
};

 export async function lines(changes,context=2)
{return Object.entries(changes).reduce(record(async ([filepath,hunks])=>
{let source=await access(filepath,"utf8").then(text=>text.split("\n"));
 let cursor=0;
 let text=hunks.map(({from,to},index)=>
{let limit=hunks[index+1]?.to.start??source.length;
 let before=source.slice(Math.max(cursor,to.start-context),to.start).map(line=>" "+line);
 cursor=Math.min(to.start+to.count+context,limit);
 let after=source.slice(to.start+to.count,cursor).map(line=>" "+line);
 return [...before
,...from.lines.map(line=>colors.red+"-"+line+colors.steady)
,...to.lines.map(line=>colors.green+"+"+line+colors.steady)
,...after
].join("\n");
}).join("\n"+colors.dim+"..."+colors.steady+"\n");
 return [colors.steady+colors.bright+colors.underscore+filepath+colors.steady,text];
}),[]).then(diff=>diff.flat().join("\n\n"));
};

 export var changes=compose(diff,lines);

 export async function tracking(commit,dir=process.cwd())
{// which remote/branch (if any) the given commit descends from.
 let remotes=await git.listRemotes({fs,dir}).then(remotes=>remotes.map(({remote})=>remote));
 let branches=await remotes.reduce(record(remote=>
 git.listBranches({fs,dir,remote}).then(branches=>
 branches.map(branch=>remote+"/"+branch))),[]).then(branches=>branches.flat());
 let tracking=await branches.reduce(record(ref=>
 git.resolveRef({fs,dir,ref}).then(tip=>tip===commit||
 git.isDescendent({fs,dir,oid:tip,ancestor:commit})).then(tracking=>
 tracking?ref:undefined)),[]).then(refs=>refs.filter(Boolean));
 if(!tracking.length)
 return console.log(" Not descendent of any remote branch.");
 if(tracking.length>1)
 console.log(" Upstream branches:\n"+tracking.map((branch,index)=>[index+1,branch].join(" ")).join("\n"))
,tracking.splice(0,undefined,await prompt({branch:undefined}).then(({branch})=>tracking[branch-1]||branch));
 let [remote,branch]=tracking[0].split("/");
 if(!remote||!branch)
 return exit(" No such remote branch:"+tracking[0]);
 return [remote,branch];
};

 export async function push(credentials="protocol.json",dir=process.cwd())
{// commit whatever's changed and push HEAD to whichever remote branch it descends from.
 let matrix=await git.statusMatrix({fs,dir});
 let changes=matrix.filter(([file,head,work])=>work!==head).map(([file])=>file);
 if(!changes.length)
 return console.log(" Nothing to commit.");
 await status(matrix).then(console.log)
 let commit=await git.resolveRef({fs,dir,ref:"HEAD"});
 let upstream=await tracking(commit,dir);
 if(!upstream)
 return;
 let [remote,branch]=upstream;
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
(buffer(git.push,(fail,options)=>note(fail)&&
 prompt({"force?":undefined}).then(confirmation=>
 confirmation["force?"]==="yes"?!merge(options,{force:true}):exit("Aborting."))),0,2
)({fs,http,dir,url,remote,ref:head,remoteRef:"refs/heads/"+branch});
 await git.fetch({fs,http,remote,dir}).then(note);
 await log(2,undefined,dir);
};

 export async function amend(dir=process.cwd())
{let commit=await git.resolveRef({fs,dir,ref:"HEAD"});
 let {commit:{parent}}=await git.readCommit({fs,dir,oid:commit});
 if(!parent.length)
 return console.log(" No parent to amend onto.");
 let ref=await git.currentBranch({fs,dir,fullname:true})||"HEAD";
 await git.writeRef({fs,dir,ref,value:parent[0],force:true});
 await log(1,commit,dir);
 await log(1,undefined,dir);
};

 export async function tag(tag,credentials="protocol.json",dir=process.cwd())
{// (re)tag HEAD on whichever remote branch it descends from, pushed under a shared identity.
 ({tag}=await prompt({tag}));
 let commit=await git.resolveRef({fs,dir,ref:"HEAD"});
 let upstream=await tracking(commit,dir);
 if(!upstream)
 return;
 let [remote]=upstream;
 let [name,email]=await authorize(dir);
 if(!name||!email)
 return console.log(" git user config missing.");
 console.log(" Tagging "+remote+" as "+tag+" by "+name+" at "+commit+".");
 let confirmation=await prompt({"good?":undefined});
 if(confirmation["good?"]!=="yes")
 return console.log(" Aborting.");
 let url=await target(remote,name,credentials,dir);
 await git.push({fs,http,dir,url,remote,ref:"HEAD",remoteRef:"refs/tags/"+tag,delete:true}).catch(note);
 await git.deleteTag({fs,dir,ref:tag}).catch(note);
 await git.tag({fs,dir,ref:tag});
 await git.push({fs,http,dir,url,remote,ref:tag,remoteRef:"refs/tags/"+tag});
};

 export async function authorize(dir=process.cwd())
{let [name,email]=await ["name","email"].reduce(record(field=>git.getConfig({fs,dir,path:"user."+field})),[]);
 return prompt({name,email}).then(({name,email})=>
 Object.entries({name,email}).reduce(record(([field,value])=>
 git.setConfig({fs,dir,path:"user."+field,value}).then(set=>value)),[]));
};

 export async function status(matrix)
{let history=await log(1);
 matrix=matrix||await git.statusMatrix({fs,dir:process.cwd()});
 let width=Math.max(...matrix.map(([name])=>name.length));
 return history+"\n"+matrix.sort(([,past],[,next])=>past<next?-1:1).map(([name,head,work,stage])=>
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
