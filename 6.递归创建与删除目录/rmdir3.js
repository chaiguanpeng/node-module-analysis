let fs = require('fs');
let path = require('path');
//异步 深度优先
function removeDir(dir,callback) {
    fs.stat(dir,(err,stat)=>{
        if(stat.isDirectory()){ //是目录的话?
            fs.readdir(dir,(err,dirs)=>{
                //异步递归就用next
                dirs = dirs.map(p=>path.join(dir,p));
                //标识先删除第一个
                function next(index) {
                    if(index===dirs.length) return fs.rmdir(dir,callback);
                    let file = dirs[index];
                    removeDir(file,()=>next(index+1));
                }
                next(0)
            })
        }else {
            fs.unlink(dir,callback)
        }
    })
}

removeDir('a',()=>{
    console.log('delete ok');
});