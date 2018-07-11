// 声明EventEmitter事件发生器构造函数
function EventEmitter() {
    this._events = Object.create(null);
}
//设置最大监听数为10
EventEmitter.defaultMaxListeners = 10;

// 设置最大监听数目
EventEmitter.prototype.setMaxListeners = function(n){
    this._count = n;
}
// 得到最大监听数目
EventEmitter.prototype.getMaxListeners = function(n){
    return this._count ? this._count : EventEmitter.defaultMaxListeners;
}
// enentName方法
EventEmitter.prototype.eventNames = function(){
   return Object.keys(this._events);
};
//on 订阅方法实现 跟addListener相同
EventEmitter.prototype.addListener=EventEmitter.prototype.on = function(type,callback,flag){
    // 如果实例不存在则创建一个空对象,Object.create(null)没有链
    if(!this._events) {
        this._events = Object.create(null);
    }
    // 不是newListener 就应该让newListener执行下
    if(type!=="newListener"){
        if(this._events["newListener"]){
            this._events["newListener"].forEach(fn=>fn(type))
        }
    }

    //flag标识
    if(this._events[type]){
        if(flag){
            this._events[type].unshift(callback);
        }else {
            this._events[type].push(callback)
        }
    }else { //内部没存放过
        this._events[type] = [callback];
    }
    if(this._events[type].length ===this.getMaxListeners()){
        console.warn('内存泄漏');
    }

};
// once实现
EventEmitter.prototype.once = function(type,callback,flag){
    // 先绑定 调用后再删除,运用了wrap函数
    let one = (...args)=> {
        callback(...args);
        this.removeListener(type, one);
    }
    //自定义属性 因为实例中没有wrap属性
    one.l = callback;
    this.on(type,one,flag)
};
// prependListener方法实现
EventEmitter.prototype.prependListener  = function(type,callback){
    this.on(type,callback,true);
};
// prependListener方法实现
EventEmitter.prototype.prependOnceListener  = function(type,callback){
    this.once(type,callback,true);
};
// emit方法实现
EventEmitter.prototype.emit = function(type,...args){
    if(this._events[type]){ //{失恋:[cry,eat]} 如果失恋对应有值，依次执行里面的方法
        this._events[type].forEach(fn=>fn(...args))
    }
};
// 移除订阅事件的方法
EventEmitter.prototype.removeListener = function(type,callback){
    if(this._events[type]){
        // 返回false就表示不要了,用filter实现去重
        this._events[type] = this._events[type].filter(fn=>fn!==callback && fn.l!==callback)
    }
};
// removeAllListeners 移除所有的监听者
EventEmitter.prototype.removeAllListeners = function(){
    this._events = Object.create(null);
};
// listeners 方法
EventEmitter.prototype.listeners = function(type){
  return this._events[type];
};
module.exports = EventEmitter;