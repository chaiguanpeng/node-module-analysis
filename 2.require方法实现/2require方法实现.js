let path = require('path');
let fs = require('fs');
let vm = require('vm');
// 声明构造函数Module
function Module(filename){
    this.loaded = false; //用于检测是否被缓存过
    this.filename = filename; //文件的绝对路径
    this.exports = {} //模块对应的导出结果
}
//存放模块的扩展名
Module._extensions = ['.js','.json'];
//检测是否有缓存
Module._cache = {};
//拼凑成闭包的数组
Module.wrapper = ['(function(exports,require,module){','\r\n})'];
//如果没写扩展名，我们给它默认添加扩展名
Module._resolveFilename = function (p) {
    p = path.join(__dirname,p);
    if(!/\.\w+$/.test(p)){
        //如果没写扩展名,尝试添加扩展名
        for(let i=0;i<Module._extensions.length;i++){
            let filePath = p + Module._extensions[i];//拼接出一个路径
            // 判断文件是否存在
            try{
                fs.accessSync(filePath);
                    return filePath;
            }catch (e) {
                throw new Error('module not found')
            }
        }
    }else {
        return p
    }
}
Module.wrap = function(content){
    return Module.wrapper[0] + content +Module.wrapper[1];
};
// 加载模块本身
Module.prototype.load = function () {
    let extname = path.extname(this.filename);
    // js按照js加载,json按照json加载
    Module._extensions[extname](this);
};
// 后缀名为json的加载方法
Module._extensions['.json'] = function (module) {
    let content = fs.readFileSync(module.filename,'utf8');
    module.exports = JSON.parse(content);
};
// 后缀名为js的加载方法
Module._extensions['.js'] = function (module) {
    let content = fs.readFileSync(module.filename,'utf8');
    // 形成闭包
    let script = Module.wrap(content);
    let fn = vm.runInThisContext(script);
    fn.call(module,module.exports,req,module)
};
function req(path) { //自己实现require方法,实现加载模块
    // 根据输入的路径 变出一个绝对路径
    let filename = Module._resolveFilename(path);
    if(Module._cache[filename]){
        return Module._cache[filename].exports;
    }
    // 通过这个文件名创建一个模块
    let module = new Module(filename);
    module.load(); //让这个模块进行加载 根据不同的后缀加载不同的内容
    Module._cache[filename] = module;
    return module.exports
}

let str = req('./b');
console.log(str);


作者：言sir
链接：https://juejin.im/post/5b308972f265da595534f00a
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。