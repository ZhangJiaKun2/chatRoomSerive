//搜索
const dbserver = require('../dao/dbServe')

//用户搜索
exports.searchUser = function (req,res){
    const {data} = req.body
    dbserver.searchUser(data,res)
}

//判断是否为好友
exports.isFriend = function (req,res){
    const {uid,fid} = req.body
    dbserver.isFriend(uid,fid,res)
}

//搜索群
exports.searchGroup = function (req,res){
    const {data} = req.body
    dbserver.searchGroup(data,res)
}

//是否在群里面
exports.isInGroup = function (req,res){
    const {uid,gid} = req.body
    dbserver.isInGroup(uid,gid,res)
}
