let zlib = require('zlib'); //核心模块 压缩流
let path = require('path');
let p = path.join(__dirname,'1.txt');
let fs = require('fs');
console.log(p);
function gzip(source) {
    let gz = zlib.createGzip(); //转化流(可读可写)
    fs.createReadStream(source).pipe(gz).pipe(fs.createWriteStream(source+'.gz'));
}
// gzip(p)

// //解压
function ungzip(source){
    let ungz = zlib.createGunzip();
    fs.createReadStream(source).pipe(ungz).pipe(fs.createWriteStream( path.basename(source, '.gz')));
}
ungzip(path.join(__dirname, '1.txt.gz'))