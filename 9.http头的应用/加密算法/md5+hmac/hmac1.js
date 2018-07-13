//加盐算法  需要安装openssl 生成私钥 openssl genrsa -out rsa_private.key 1024
let crypto = require('crypto');
let fs = require('fs');
let path = require('path');
let key = fs.readFileSync(path.join(__dirname,'./rsa_private.key'));
let hmac = crypto.createHmac("sha1", key);
hmac.update('123456');
let result = hmac.digest('hex');
console.log(result);
