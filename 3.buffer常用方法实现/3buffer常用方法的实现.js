//Buffer中copy的实现
Buffer.prototype.myCopy = function (target,targetStart,sourceStart,sourceEnd) {
    for(let i=0;i<sourceEnd-sourceStart;i++){
        target[targetStart+i] = this[sourceStart+i];
    }
};
let buffer1 = Buffer.alloc(6);
let b =  Buffer.from( '珠峰培训'); //  buffer长度是安装字节算的
b.myCopy(buffer1,0,0,6);
console.log(buffer1.toString());
//buffer中concat的实现
Buffer.myConcat = function (bufferList,len= bufferList.reduce((prev,next)=>prev+next.length,0)) {
   let newBuffer = Buffer.alloc(len);
   let index =0;
   bufferList.forEach(buf=>{
       buf.myCopy(newBuffer,index,0,buf.length);
       index+=buf.length;
   })
   return newBuffer
}
let b1 = Buffer.from("珠");
let b2 = Buffer.from("峰");
let str = Buffer.myConcat([b1,b2]);
console.log(str.toString());

// 自己实现split方法
let buffer = Buffer.from("珠峰*培训*");
Buffer.prototype.split = function (sep) {
    let arr = [];
    let offset = 0;
    let len = Buffer.from(sep).length;
    let start = 0;
    while (-1!==(offset = this.indexOf(sep,start)) ){
        arr.push(this.slice(start,offset).toString());
        start = offset+len;
    }
    if(this.slice(start).toString()!==""){
        arr.push(this.slice(start).toString())
    }
    return arr;
}
console.log(buffer.split('*'));




