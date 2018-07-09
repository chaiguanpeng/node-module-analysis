/*
* 实现的功能:
* l:表示看所有的在线人数
* s:zs:  私聊
* r: 重命名
* b: 广播和所有的人说话
*
*
* client = {127.0.0.1:8080:{nickName:'匿名',socket:socket}}
* */
let net = require("net");
let server = net.createServer();
server.maxConnections = 4;
let client = {};
server.maxConnections = 4;
server.on("connection", (socket) => {
    let key = socket.remoteAddress + socket.remotePort;
    client[key] = {
        nickName:'匿名',
        socket
    };
    socket.setEncoding("utf8");
    server.getConnections((err,count)=>{
        socket.write(`当前人数${count}人,总容纳${server.maxConnections}人 \r\n`);
    });
    socket.on("data",(chunk)=>{
        chunk = chunk.replace(/\r\n/,"");
        let char = chunk.split(":")[0];
        let content = chunk.split(":")[1];
        console.log(char);
        switch (char){
            case 'l':
                showList(socket);
                break;
            case 's':  //s:zs:内容
                private(content,chunk.split(":")[2], client[key].nickName);
                break;
            case 'r':
                rename(key,content);
                break;
            case 'b':
                brocast(key,content)
                break;
        }
    })
});
function brocast(key, content) {
    Object.keys(client).forEach(p=>{
        if(p!=key){
            client[p].socket.write(`${client[key].nickName}说:${content}\r\n`)
        }
    })
}


// 私聊 s:xx:content
function private(name,content,n) {
    Object.keys(client).forEach(key=>{
        if(client[key].nickName===name){
            let socket = client[key].socket;
            socket.write(`${n}说: ${content} \r\n`)
        }
    })

}
//改名 r:
function rename(key, chunk) {
    client[key].nickName = chunk;
}

//展示用户列表 l:
function showList(socket){
    let users = [];
    Object.keys(client).forEach(key=>{
        users.push(client[key].nickName);
    });
    socket.write(`当前用户列表:\r\n ${users.join('\r\n')} \r\n`);
}









server.listen(3000, () => {
    console.log("服务器已启动");
});
