// 对比修改时间
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
            if(req.headers['if-modified-since'] ===stats.ctime.toUTCString()){
                res.statusCode = 304;
                res.end();
            }else {
                //第一次设置Last-Modified 下一次请求时 会提供一个头 if-modified-sine
                res.setHeader("Last-Modified",stats.ctime.toUTCString()); //文件的最后修改时间
                res.setHeader("Cache-Control",'no-cache');
                fs.createReadStream(p).pipe(res);
            }
        }else {
            res.end();
        }
    })
});
server.listen(8000);