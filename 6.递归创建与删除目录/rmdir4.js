let fs = require('fs');
let path = require('path');

// 广度 同步删除目录
function removeDir(dir) {
    let arr =[dir];
    let index = 0;
    while (arr[index]){
        let current = arr[index++];
        let stat = fs.statSync(current);
        if(stat.isDirectory()){
            let dirs = fs.readdirSync(current);
            dirs = dirs.map(d=>path.join(current,d));
            arr = [...arr,...dirs];
        }

    }
    console.log(arr);


    // 倒着删除
    for(let i=arr.length-1;i>=0;i--){
        let p = arr[i];
        let stat = fs.statSync(p);
        if(stat.isDirectory()){
            fs.rmdirSync(p)
        }else {
            fs.unlinkSync(p)
        }
    }
}
removeDir("a");