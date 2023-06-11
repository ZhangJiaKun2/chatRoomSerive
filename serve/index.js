//主页
let dbserve = require('../dao/dbServe')

//获取好友列表
exports.getFriendsList = (req,res)=>{
    let data = req.body
    dbserve.getFriendsList(data,res).then(
        result=>{
            res.send(result)
        }
    )
}

//获取最后一条消息
exports.getOneMsg = (req,res)=>{
    let data = req.body
    dbserve.getOneMsg(data,res)
}

//汇总一对一未读消息
exports.getUnReadMsg = (req,res)=>{
    let data = req.body
    dbserve.unReadMsg(data,res)
}

//好友消息标以读
exports.updateMsg = (req,res)=>{
    let data = req.body
    dbserve.updateMsg(data,res)
}

//获取群列表
exports.getGroupList = (req,res)=>{
    let uid = req.body.uid
    dbserve.getGroupList(uid,res)
}
//获取群最后一条消息
exports.getGroupLastMsg = (req,res)=>{
    let gid = req.body.gid
    dbserve.getGroupMsg(gid,res)
}
//群消息标已读
exports.updateGroupMsg = (req,res)=>{
    let data = req.body
    dbserve.updateGroupMsg(data,res)
}
