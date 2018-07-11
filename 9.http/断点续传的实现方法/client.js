// 定时发起请求 把请求到的结果 写入到download.txt中
let http = require('http');
let fs = require('fs');
//创建可写流
let ws = fs.createWriteStream(__dirname+'/download.txt');
let config = {
    host:'localhost',
    port:3000,
};
//监控控制台输入 输入p 暂停  r 恢复
let pause = false;
process.stdin.on('data',(data)=>{
    if(data.toString().includes('p')){
        pause = true;
    }else if(data.toString().includes('r')){
        pause = false;
        downLoad()
    }
});
let start = 0;
function downLoad() {
    config.headers = {
        "Range" : `bytes=${start}-${start+4}`
    };
    start +=5;
    //res指服务端 可读
    let client = http.request(config,(res)=>{
        let total = res.headers['content-range'].split('/')[1];
        console.log(total);
        let arr = [];
        res.on('data',(data)=>{
            arr.push(data);
        });
        res.on('end',()=>{
          ws.write(Buffer.concat(arr));
          setTimeout(()=>{
              if(!pause && start<=total){
                  downLoad()
              }
          },1000)
        })
    });
    client.end(); //必须调用end 否则请求不会发送
}

downLoad();
