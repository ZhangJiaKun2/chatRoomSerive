
module.exports = function (io){
    let users = {}  //socket 登录用户
    io.on("connection", (socket) => {
        //用户登录
        socket.on('login',id=>{
            socket.emit('msg',id)
            socket.name = id    //这个id是用户id  uid
            users[id] = socket.id   //{uid:socket.id }
        })
        //一对一消息
        socket.on('OneToOneMsg',(msg,fromid,toid,type,time,imgurl)=>{
            console.log(users,'users')
            if(users[toid]){   //判断用户是否在线
                socket.to(users[toid]).emit('OneToOneMsg',{msg,fromid,type,time,imgurl})   //向目标用户聊天框发送
                socket.emit('chatOneToOneMsg',{msg,fromid,type,time,toid})     //向自己的好友列表框发送消息，用于更新用户列表消息
                socket.to(users[toid]).emit('chatOneToOneMsg',{msg,fromid,type,time,toid})  //向好友的用户列表发送消息
            }
        })
        //用户离开
        socket.on('disconnecting',()=>{
            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name]   //删除目前登录的用户
            }
        })

        //加入群
        socket.on('group',(data)=>{
            console.log('socketGroup',data)
            socket.join(data)
        })

        //接收群消息
        socket.on('groupMsg',(msg,fromid,gid,type,time,imgurl)=>{
            // 群内广播消息
            console.log('接收消息',msg,fromid,gid)
            socket.to(gid).emit('groupmsg',{msg,fromid,type,time,imgurl})
        })
        console.log('连接成功')
    });
}
