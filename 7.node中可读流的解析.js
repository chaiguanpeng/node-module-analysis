let fs = require('fs');
let EventEmitter = require('events');

class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.autoClose = options.autoClose || true;
        this.start = options.start || 0;
        this.pos = this.start; //pos会随着读取的位置改变
        this.end = options.end || null;
        this.encoding = options.encoding || null;
        this.flags = options.flags || 'r';

        //参数问题
        this.flowing = null; //非流动模式
        //声明一个buffer表示都出来的数据
        this.buffer = Buffer.alloc(this.highWaterMark);

        this.open(); //打开文件 fd
        // 看是否监听了data事件,如果监听了就要变成流动模式
        this.on('newListener', (eventName, callback) => {
            if (eventName === 'data') {
                //相当于用户监听了data事件
                this.flowing = true;
                // 监听了就去读
                this.read(); //去读内容
            }
        })
    }
    pause() {
        this.flowing = false;
    }
    resume() {
        this.flowing = true;
        this.read();
    }
    read() {
        //此时文件还没打开
        if (typeof this.fd != 'number') {
            //当文件真正打开的时候 会触发open事件,触发事件后再执行read，此时fd 就有了
            return this.once('open', () => this.read())
        }
        //此时有fd了 开始读取文件了
        let howMuchToRead = this.end ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark;
        fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (err, byteRead) => {
            // byteRead真实读到的个数
            this.pos += byteRead;
            // this.buffer默认三个
            let b = this.buffer.slice(0, byteRead);
            b = this.encoding ? b.toString(this.encoding) : b;
            //把读取到的buffer发射出去
            this.emit('data', b);
            if ((byteRead === this.highWaterMark) && this.flowing) {
                return this.read();
            }
            //这里没有更多逻辑了
            if (byteRead < this.highWaterMark) {
                //没有更多了
                this.emit('end'); //读取完毕
                this.destroy();   //销毁完毕

            }
        })
    }
    destroy() {
        if (typeof this.fd != 'number') { //文件未打开,也要关闭文件且触发close事件
            return this.emit('close');
        }
        fs.close(this.fd, () => {  //如果文件打开过了 那就关闭文件并且触发close事件
            this.emit("close");
        })
    }
    //打开文件用
    open() {
        fs.open(this.path, this.flags, (err, fd) => { //fd标识的就是当前this.path这个文件，从3开始(number类型)
            if (err) {
                if (this.autoClose) { //如果需要自动关闭我再去销毁fd
                    this.destroy(); //关闭文件(触发关闭事件)
                }
                this.emit('error', err); //打开文件发生错误，发布error事件
            }
            this.fd = fd; //保存文件描述符
            this.emit('open', this.fd) //触发文件open方法

        })
    }
}
module.exports = ReadStream;
