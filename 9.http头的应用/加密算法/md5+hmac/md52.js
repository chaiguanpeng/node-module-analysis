let fs = require('fs');
let crypto = require("crypto");
let md5 = crypto.createHash('md5');
let rs = fs.createReadStream(__dirname+'/index.html',{highWaterMark:3});
rs.on("data",(chunk)=>{
    md5.update(chunk);
});
rs.on("end",()=>{
    let result = md5.digest('hex');
    console.log(result);
});