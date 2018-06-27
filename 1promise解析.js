// //解析x与promise2的关系
function resolvePromise(promise2,x,resolve,reject) {
    /*判断x是不是promise
    *A+规范规定一段代码,这个代码可以实现我们的promise和别人的promise可以进行交互
     */
    if (promise2 === x) { //自己不能等待自己完成
        return reject(new TypeError('循环引用'));
    }
    // x不是null或者是对象或者函数
    if(x!==null && (typeof x === 'object' || typeof x==='function')){
        let called; //标识promise是否被调用过，防止成功后调用失败
        try{ //防止取then出现异常
            let then = x.then; // 取x的then方法
            if(typeof then === 'function'){ //如果then是函数我就认为它是promise
                then.call(x,y=>{ //call第一个参数是this,后面是成功和失败的回调
                    if(called) return;
                    called = true;
                    // 如果y是promise就继续递归解析promise
                    resolvePromise(promise2,y,resolve,reject);
                },r=>{ //只要失败就失败
                    if(called) return
                    called = true;
                    reject(r);
                });
            }else {
                resolve(x)
            }
        }catch (e) {
            //then是一个普通对象
            if(called) return
            called = true;
            reject(e)
        }
    }else {
        resolve(x);
    }
}
class Promise{
    constructor(executor){
        //默认状态 等待态
        this.status = 'pending';
        // 成功的结果
        this.value = undefined;
        //失败的原因
        this.reason = undefined;
        // 成功存放的数组
        this.onResolvedCallbacks = [];
        // 失败存放的数组
        this.onRejectedCallbacks = [];
        // 成功态执行函数
        let fulfilled = (value)=>{
            if(this.status ==='pending'){
                this.status ='resolved' //成功态
                // 成功的结果
                this.value = value;
                //依次执行成功的回调函数
                this.onResolvedCallbacks.forEach(fn=>fn())
            }
        };
        //失败态执行函数
        let rejected = (reason)=>{
            if(this.status ==='pending'){
                this.status ='rejected' //失败态
                // 失败原因
                this.reason = reason;
                //依次执行失败的回调函数
                this.onRejectedCallbacks.forEach(fn=>fn())
            }
        };

        // 默认让执行器执行，可能会发生错误
        try{
            executor(fulfilled,rejected);
        }catch (e) {
            rejected(e)
        }

    }
    then(onFulfilled, onRejected) {
        let promise2;
        //默认成功和失败不穿参数情况
        onFulfilled = typeof onFulfilled ==="function"? onFulfilled:value=>value;
        onRejected  = typeof onRejected ==="function"? onRejected:err=>{
            throw err;
        };
        promise2 = new Promise((resolve,reject)=>{
            if(this.status ==="resolved"){
                //执行上下文为异步
                setTimeout(()=>{
                    try{
                        //成功逻辑
                        let x = onFulfilled(this.value);
                        /* 判断x是不是promise,如果是promise取它结果,作为promise2成功结果
                          *要是返回普通值，作为promise2成功的结果
                          * todo: resolvePromise可以解析x和promise2关系
                          */
                        resolvePromise(promise2,x,resolve,reject);
                    }catch (e) {
                        reject(e)
                    }
                })
            }
            if(this.status ==="rejected"){
               setTimeout(()=>{
                   try{
                       //失败逻辑
                       let x=  onRejected(this.reason);
                       resolvePromise(promise2,x,resolve,reject);
                   }catch (e) {
                       reject(e)
                   }
               })
            }
            //如果等待态（即异步逻辑时）要做一件事情
            if(this.status ==='pending'){
                this.onResolvedCallbacks.push(()=>{
                 setTimeout(()=>{
                     try{
                         let x =  onFulfilled(this.value);
                         resolvePromise(promise2,x,resolve,reject);
                     }catch (e) {
                         reject(e)
                     }
                 })
                });
                this.onRejectedCallbacks.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x =  onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);

                        }catch (e) {
                            reject(e)
                        }
                    })
                })

            }
        })
        //调用then后,返回新的promise2。实现多次then
        return promise2;
    }
    catch(onRejected){ //接受参数只有失败
        return this.then(null,onRejected)
    }
}
module.exports = Promise;
Promise.resolve = function (val){
    return new Promise((resolve,reject)=>resolve(val)
    )
};
Promise.reject = function (val){
    return new Promise((resolve,reject)=>reject(val)
    )
};
Promise.all = function(promises){ //返回promise,接受一个数组
    let arr = [];
    let i=0; //i的目的是为了保证获取全部成功，来设置索引
    function processDara(index,data){
        arr[index] = data;
        i++;
        if(i ===promises.length){
            resolve(arr);
        }
    }
    return new Promise((resolve,reject)=>{
       for(let i=0;i<promises.length;i++){
           promises[i].then(data=>{
               //处理数据
                processDara(i,data)
           },err=>{ //有一个失败就失败
               reject(err)
           })
       }
    })
};
Promise.race = function(promises){ //返回promise,接受一个数组
    return new Promise((resolve,reject)=>{
        for(let i=0;i<promises.length;i++){
            promises[i].then(data=>{ //有一个成功就成功
                resolve(data)
            },err=>{ //有一个失败就失败
                reject(err)
            })
        }
    })
};
// 目前是通过他测试 他会测试一个对象
// 语法糖
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;
// npm install  promises-aplus-tests -g
// promises-aplus-tests  文件名称

作者：言sir
链接：https://juejin.im/post/5b2313ad51882574b72f0314
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。