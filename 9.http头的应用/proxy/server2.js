let http = require('http');
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer();
let opts = {
    "zf1.cn":'http://localhost:3000',
    "zf2.cn":'http://localhost:3001'
}
http.createServer(function (req, res) {
    let host = req.headers.host;
    console.log(host);
    proxy.web(req,res,{
        target:opts[host]
    });
    proxy.on('err',(err)=>{
        console.log(err);
    });
}).listen(80)