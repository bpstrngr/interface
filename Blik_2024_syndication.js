 import {fetch,query} from "./Blik_2023_interface.js";
 import {compose, record, slip, note, string} from "./Blik_2023_inference.js";

 export default function syndication(keys)
{return (
 {rss2json:request=>compose(fetch,"json",["body"],record)("https://api.rss2json.com/v1/api.json?"+new URLSearchParams(
 {rss_url:string(request)?request:query(request.url).url,api_key:keys.rss2json.key
 }))
 //,wordpress:request=>compose.call("./wordpress_2019_wpcom.js","WPCOM",resolve,request.url.split("/").slice(2).join("/"),"site",{number:15},"postsList",request.url.split("/").slice(2),record,note)
 //,facebook:source=>compose(fetch,"json")("/facebook/"+source)
 // new Promise(resolve=>!window.FB?featurefacebook().then(f=>
 // insert(f,"after",window.document.body)).then(f=>
 // feed.face(source)).then(resolve):FB.api("/"+/*source*/"10210793350908906"+"/feed","GET",{},response=>resolve(response)))
 // ,google(request){"https://www.googleapis.com/drive/v3/files/"+"?alt=media&key="+keys.googleapi}
 //,facebook(){FB.api("/"+subject.getAttribute("source"),"GET",{fields:'id,name,from,created_time,message,type,timeline_visibility,link,object_id'},response=>resolve(response)).then(response=>{return response.object_id?new Promise(resolve=>FB.api("/"+response.object_id,"GET",{fields:'id,title,format,source,embed_html'},responseobject=>resolve(responseobject))).then(responseobject=>{return responseobject.embed_html+" \n"+response.message}):deform(response.message+" \n "+(response.name&&response.link?response.name.replace(/ /g,"_")+"@"+response.link:""))});
 // ,"https:":source=>compose(fetch,"json")("https:/"+source)
 // ,"http:":source=>compose(fetch,"json")("http:/"+source)
 ,medium:request=>compose(fetch,"text",note,slip(new DOMParser()),"text/xml","parseFromString", "item", "querySelectorAll")("https://medium.com/feed/"+new URL(request.url).pathname.split("/").slice(2).join("/"))
 });
};