let http = require('http');
let httpProxy = require('http-proxy');
let proxy = httpProxy.createProxyServer();
http.createServer(function (req, res) {
    proxy.web(req,res,{
        target:'http://localhost:3000'
    });
    proxy.on('err',(err)=>{
        console.log(err);
    });
}).listen(80)