let fs = require('fs');
let EventEmitter = require('events');
class WriteStream extends EventEmitter{
    constructor(path,options={}){
        super();
        this.path = path;
        this.flags = options.flags || 'w';
        this.encoding = options.encoding || 'utf8';
        this.start = options.start || 0;
        this.pos = this.start;
        this.mode = options.mode || 0o666;
        this.autoClose = options.autoClose || true;
        this.highWaterMark = options.highWaterMark || 16 * 1024;

        //第一次写入是真的往文件里写
        this.writing = false; //默认第一次不是正在写入

        // 可写流  要有一个缓存区，当正在写入文件时，内容要写入到缓存区
        this.cache = [];

        // 记录缓存区大小
        this.len =0;

        // 是否触发drain事件
        this.needDrain = false;


        this.open(); //目的是拿到fd 异步,触发一个open事件后fd肯定存在啦
    }
    clearBuffer(){
        let buffer = this.cache.shift();
        if(buffer){ //缓存里有
            this._write(buffer.chunk,buffer.encoding,()=>this.clearBuffer())
        }else { //缓存里没有了
            if(this.needDrain){ //需要触发drain事件
                this.writing = false; //告诉下次直接写就可以了  不需要写到内存中
                this.needDrain = false;
                this.emit('drain');
            }
        }
    }
    destroy() {
        if (typeof this.fd != 'number') { //文件未打开,也要关闭文件且触发close事件
            return this.emit('close');
        }
        fs.close(this.fd, () => {  //如果文件打开过了 那就关闭文件并且触发close事件
            this.emit("close");
        })
    }
    _write(chunk,encoding,clearBuffer){
        if(typeof this.fd!= 'number'){
            //因为write方法是同步调用,此时fd还没有获取到,所以等待获取到再执行write
            return this.once('open',()=>this._write(chunk,encoding,clearBuffer));
        }
        fs.write(this.fd,chunk,0,chunk.length,this.pos,(err,byteWritten)=>{
            this.pos +=byteWritten;
            this.len -=byteWritten; //每次写入后就要在内存中减少下
            this.writing = false;
            clearBuffer(); //第一次就写完成了
        })
    }
    write(chunk,encoding = this.encoding,callback){ //客户调用的是write
        //chunk必须是buffer或者字符串, 为了统一,如果传递的是字符串也要转成buffer
        chunk = Buffer.isBuffer(chunk)?chunk : Buffer.from(chunk,encoding);
        this.len +=chunk.length; //维护缓存的长度
        let ret = this.len <this.highWaterMark; //一个标识 比较是否达成了缓存区的大小
        this.needDrain = !ret; //是否需要触发needDrain
        if(this.writing){ //判断是否正在写入  如果是正在写入 就写入到缓存区中
            this.cache.push({chunk,encoding,callback})
        }else { //第一次写
            this.writing = true;
            this._write(chunk,encoding,()=>this.clearBuffer()); //专门实现写的方法

        }

        return ret; //能不能继续写了 false表示下次写的时候就要占用内存

    }
    open(){
        fs.open(this.path,this.flags,this.mode,(err,fd)=>{
            if(err){
                this.emit('error', err); //打开文件发生错误，发布error事件
                this.emit('error');
                if (this.autoClose) { //如果需要自动关闭我再去销毁fd
                    this.destroy(); //关闭文件(触发关闭事件)
                }
                return;
            }
            this.fd = fd; //保存文件描述符
            this.emit('open', this.fd) //触发文件open方法
        })
    }
}
module.exports = WriteStream;










