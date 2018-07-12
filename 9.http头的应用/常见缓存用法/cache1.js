// 强制缓存
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let mime = require('mime'); //可以根据路径判断当前文件是什么类型
let server = http.createServer(function (req, res) {
   let {pathname} = url.parse(req.url,true);
   let p = path.join(__dirname,pathname);
    console.log(p);
    fs.stat(p,function (err, stats) {
       if(!err){
           let d =new Date(Date.now()+5000).toUTCString();
           res.setHeader("Expires",d); //http1.0设置的
           res.setHeader("Cache-Control",'max-age=6'); //http1.1设置的
           res.setHeader("Content-Type",mime.getType(p)+';charset=utf8');
           fs.createReadStream(p).pipe(res);
       }else {
           res.end();
       }
   })
});
server.listen(8000);