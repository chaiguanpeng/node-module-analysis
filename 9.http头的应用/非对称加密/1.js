let crypto = require('crypto');
let fs = require('fs');
let public = fs.readFileSync(__dirname+'/rsa_public.key','utf8');
let private = fs.readFileSync(__dirname+'/rsa_private.key','utf8');
let r1 = crypto.publicEncrypt(public, Buffer.from('hello'));
let r2 = crypto.privateDecrypt(private, r1);

console.log(r2.toString());
