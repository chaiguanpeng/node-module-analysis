let fs = require('fs');
let ReadStream = require('./ReadStream')
let rs = new ReadStream('./2.txt',{
  highWaterMark:3,
  autoClose:true,
  flags:'r',
  start:0,
  end:3,
  encoding:'utf8'
});
rs.on('open',function () {
  console.log('文件打开')
});
rs.on('error',function (err) {
  console.log(err);
});
rs.on('data',function (data) {
  console.log(data);
  rs.pause();
});

setInterval(() => {
  rs.resume();
}, 1000);
rs.on('close', function () {
  console.log('关闭')
});
rs.on('end', function () {
    console.log('读取完毕')
});