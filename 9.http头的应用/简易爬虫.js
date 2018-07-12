let http = require('http');
http.createServer((req,res)=>{
 let client =    http.request({
        host:'news.baidu.com',
        method:'get'
    },(r)=>{
        let arr = [];
        r.on('data',data=>{
            arr.push(data);
        });
        r.on('end',()=>{
          let result = Buffer.concat(arr).toString();
          let match = result.match(/<li class="bold-item">([\s\S]*?)<\/li>/g);
            res.setHeader('Content-Type','text/html;charset=utf8');
           res.end(match.join(''));
        })
    });
 client.end();

}).listen(3000);