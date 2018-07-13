let path = require('path');
let source = path.join(__dirname,'1.txt.gz');
console.log(source);
let a = path.basename(source,'.gz') ;
console.log(a);