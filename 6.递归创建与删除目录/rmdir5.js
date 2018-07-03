let fs = require('fs');
let path = require('path');
//广度异步删除目录
function removeDir(dir) {
    let arr = [dir];
    let index = 0;
    function next(index) {
        if(index >=arr.length){
            function rm(num) {
                if(num<0){
                    return;
                }
                let p = arr[num--];
                fs.stat(p,(err,stat)=>{
                    if(stat.isDirectory()){
                        fs.rmdir(p,()=>{
                            rm(num)
                        })
                    }else {
                        fs.unlink(p,()=>{
                            rm(num)
                        })
                    }
                })
            }
            rm(arr.length-1);
            return;
        }
        let current = arr[index++];
        fs.stat(current, (err, stat) => {
            if (stat.isDirectory()) {
                fs.readdir(current, (err, dirs) => {
                    dirs = dirs.map(d => path.join(current, d));
                    arr = [...arr, ...dirs];
                    next(index);
                })
            }else {
                next(index)
            }
        })
    }
    next(index)
}
removeDir('a')