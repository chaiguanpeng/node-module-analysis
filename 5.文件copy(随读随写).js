let fs = require('fs');
function copy(source, target) {
    let size = 3;
    let index = 0;
    let buffer = Buffer.alloc(size);
    fs.open(source, 'r', function (err, rfd) {
        if (err) return console.log(err);
        fs.open(target, 'w', 0o666, function (err, wfd) {
            function next() {
                fs.read(rfd, buffer, 0, size, index, function (err, byteRead) {
                    fs.write(wfd, buffer, 0, byteRead, index, function (err, byteWritten) {
                        index += byteRead;
                        console.log(byteWritten);
                        if (byteWritten) {
                            next();
                        }else{
                            fs.close(rfd,()=>{});
                            fs.fsync(function(){ //把内存中的内容强制写入后再关闭文件 写入是异步操作
                                fs.close(wfd, () => { });
                            })
                        }
                    })
                })
            }
            next();
        })
    })
}
copy('./1.txt', './5.txt')
