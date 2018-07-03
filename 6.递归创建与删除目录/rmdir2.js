let fs = require('fs');
let path = require('path');
//异步删除目录promise版 先序深度
function removeDir(dir) {
    return new Promise((resolve,reject)=>{
        fs.stat(dir,(err,data)=>{
            if(data.isDirectory()){
                fs.readdir(dir,(err,dirs)=>{ //读取当前目录下的内容
                    dirs = dirs.map(d=>path.join(dir,d));
                    dirs = dirs.map(p=>removeDir(p)); //递归变成peomise
                    Promise.all(dirs).then(()=>{
                        fs.rmdir(dir,resolve);
                    })
                })
            }else {
                fs.unlink(dir,resolve)
            }
        })
    })
}
removeDir('a').then(data=>{
    console.log('成功');
});