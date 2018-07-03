let fs = require('fs');
//同步创建目录
// function makep(p){
//     let dirs = p.split('/');
//     for(let i=0;i<dirs.length;i++){
//        let newP= dirs.slice(0,i+1).join('/');
//        try{
//            fs.accessSync(newP);
//        }catch(e){
//            fs.mkdirSync(newP);
//        }
//         console.log(newP);
//     }
// }


// 异步实现创建目录
function makep(dir,callback){
    let dirs = dir.split('/');
    let index = 1;
    function next(index) {
        //当索引溢出时 就不要递归啦
        if(index-1 ===dirs.length) return callback();
       let p = dirs.slice(0,index).join('/');
    fs.access(p,(err)=>{
           if(err){ //有错误  就创建目录
               fs.mkdir(p, (err) => {
                   if (err) return console.log(err);
                   index++;
                   next(index);
               })
           }else{
               next(index+1)
           }
    })}
    next(index);
}

makep('a/b/c/d',()=>{ //创建完执行的函数
    console.log("ok")
});