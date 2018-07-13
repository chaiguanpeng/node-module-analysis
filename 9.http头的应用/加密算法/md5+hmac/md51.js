/**md5摘要算法
 * 1、不可逆
 * 2、不管加密的内容多长，最后输出的结果长度都是相等的
 * 3、内容不同输出的结果就完全不同，内容相同结果相同
 * 
 * - 如果是密码可以多次加密
 */
let crypto = require('crypto'); //常见的加密模块
let md5 = crypto.createHash('md5');
md5.update('123456'); //update加密
let result = md5.digest('base64'); //默认buffer hex 16进制  base64  
console.log(result);
