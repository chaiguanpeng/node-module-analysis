//对称加密 钥匙是相同
let crypto = require('crypto');
let fs = require('fs');
let key  = fs.readFileSync(__dirname+'/rsa_private.key');
let cipher = crypto.createCipher('blowfish',key);
let result =cipher.update('zfpx');
 result += cipher.final('hex');

let decliper = crypto.createDecipher('blowfish',key);
let result2 =  decliper.update(result, 'hex') //告诉他 刚才加密的是hex
result2 += decliper.final('utf8');
console.log(result);
console.log(result2);