let fs = require("fs");
let Ws = require('./WriteStream');
let ws = new Ws('1.txt',{
    flags:'w',
    encoding:'utf8',
    start:0,
    highWaterMark:3
});
let i =9;
function write() {
    let flag = true;
    while (flag && i>=0){
      flag =   ws.write(i-- +'');
        console.log(flag);
    }
}
ws.on('drain',()=>{ //drain只有满了才触发
    console.log("干了");
    write();
});
write();

