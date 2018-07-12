// Accept-Language: zh-CN,zh;q=0.9,fr;q=0.1
// 多语言
let pack = {
  'zh-CN':'你好',
  'zh':'nihao',
  'en':'hello',
  'fr':'Bonjour'
};
let defaultLanguage = 'en';
let http = require('http');
http.createServer(function (req, res) {
    res.setHeader('Content-type','text/plain;charset=utf8');
    let lang = req.headers['accept-language'];
    if(lang){ //如果有多语言
        let langs = lang.split(',');
        //[{name:'zh-CN},q:1]类似这种结构
        langs = langs.map(l=>{
           let [name,q] = l.split(";");
           q = q?q.split("=")[1]:1;
           return{name,q}
           
        }).sort((lan1,lan2)=>lan2.q-lan1.q);
        for(let i = 0;i<langs.length;i++){ //循环判断每一种语言看看包里有没有
            let name = langs[i].name;//'zh-CN'
            if(pack[name]){
                res.end(pack[name]);
            }
        }
        res.end(pack[defaultLanguage]); //默认语言
    }
    res.end(pack[defaultLanguage]); //默认语言

}).listen(3000);