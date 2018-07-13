// 请求 Accept-Encoding: gzip, deflate, br
// 响应 Content-Encoding: gzip
let http = require('http');
let path = require('path');
let url = require('url');
let fs = require('fs');
let zlib = require('zlib');
let server = http.createServer(function(req,res){
    let {pathname} = url.parse(req.url,true);
    let p = path.join(__dirname,pathname);
    console.log(p)
    fs.stat(p,function(err,stats){
        if(!err){
            let encoding = req.headers['accept-encoding'];
            // console.log(encoding);
            // console.log(encoding.match(/\bgzip\b/));
            // console.log(encoding.match(/\bdeflate\b/));
            if(encoding.match(/\bgzip\b/)){
                res.setHeader('Content-Encoding','gzip');
                let gz = zlib.createGzip();
                fs.createReadStream(p).pipe(gz).pipe(res);
            } else if (encoding.match(/\bdeflate\b/)){
                res.setHeader('Content-Encoding', 'deflate');
                 let deflate = zlib.createDeflate();
                 fs.createReadStream(p).pipe(deflate).pipe(res);
            }else{
                fs.createReadStream(p).pipe(res);
            }
        }else{
            res.end();
        }
    })

});
server.listen(3000,()=>{
    console.log("server start");
});