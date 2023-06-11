//好友
let dbserve = require('../dao/dbServe')

//好友申请
exports.applyFriend = function (req,res){
    let data = req.body
    dbserve.applyFriend(data,res)
}

//更新好友状态
exports.updateFriendStatus = function (req,res){
    let data = req.body
    dbserve.updateFriendStatus(data,res)
}

//删除好友
exports.deleteFriend = function (req,res){
    let data = req.body
    dbserve.deleteFriend(data,res)
}

//添加消息
exports.insertMsg = function (req,res){
    let {uid,fid,msg,type} = req.body
    console.log(uid,fid,msg,type)
    dbserve.insertMsg(uid,fid,msg,type,res)
}

//搜索好友
