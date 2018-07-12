// 根据文件内容
// ETag:xxx
// if-none-match
let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
let crypto = require('crypto');
let mime = require('mime'); //可以根据路径判断当前文件是什么类型
let server = http.createServer(function (req, res) {
    let {pathname} = url.parse(req.url,true);
    let p = path.join(__dirname,pathname);
    fs.stat(p,function (err, stats) {
        if(!err){
            res.setHeader("Content-Type",mime.getType(p)+';charset=utf8');
            let md5 = crypto.createHash('md5');
            let rs = fs.createReadStream(p);
            rs.on("data",function (data) {
                md5.update(data)
            });
            rs.on('end',function () {
              let r = md5.digest('hex'); //当前文件的唯一标识
                console.log(req.headers['if-none-match']);
                if(req.headers['if-none-match']===r){
                    console.log(2);
                    res.statusCode = 304;
                    res.end();
                }else {
                    res.setHeader('Cache-Control','no-cache');
                    res.setHeader('Etag',r);
                    fs.createReadStream(p).pipe(res);
                }
            });

        }else {
            res.end();
        }
    })
});
server.listen(6333);