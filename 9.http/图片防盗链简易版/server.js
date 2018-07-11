// Host: news.baidu.com
// Referer: http://news.baidu.com/

// 静态服务
let fs = require('fs');
let http = require('http');
let url = require('url');
let path = require('path');
let {exists} = require('mz/fs');
let static = path.resolve('public');
//增加白名单
let whiteList =['zf2.cn'];
let server = http.createServer(async function (req,res) {
    let {pathname} = url.parse(req.url);
    let p =path.join(static,pathname);
    let flag = await exists(p);
   // Host imgsa.baidu.com
    //Referer http://127.0.0.1:8080/
    if(flag){
       let refer= req.headers['referer'] || req.headers['referered'];
       if(refer){
            refer = url.parse(refer).hostname;
            let host = req.headers['host'].split(':')[0];
           if(refer!=host){
               if(whiteList.includes(refer)){
                   fs.createReadStream(path.join(static,'pic1.gif')).pipe(res);
               }else {
                   fs.createReadStream(path.join(static,'pic2.jpg')).pipe(res);
               }
           }else {
               fs.createReadStream(path.join(static,'pic1.gif')).pipe(res);
           }
       }else {
           fs.createReadStream(p).pipe(res);
       }
    }else {
        res.statusCode = 404;
        res.end();
    }

});
server.listen(3000);