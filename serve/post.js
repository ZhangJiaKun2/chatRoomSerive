//贴子
let dbServe = require('../dao/dbServe')
const dbserve = require("../dao/dbServe");

//新建一个贴子
exports.addPost = (req,res)=>{
    let data = req.body
    dbServe.addPost(data,res)
}

//按条件查找贴子
exports.searchPost = (req,res)=>{
    let data = req.body
    dbserve.searchPost(data,res).then(
        result=>{
            res.send(result)
        }
    )
}

//收藏贴子
exports.collectPost = (req,res)=>{
    let data = req.body
    dbserve.collectPost(data,res)
}
//获取收藏的贴子
exports.getCollectPost = (req,res)=>{
    let data = req.body
    dbServe.getCollectPost(data,res)
}
//添加评论
exports.sendComment = (req,res)=>{
    let data = req.body
    dbServe.sendComment(data,res)
}
//获取评论
exports.getComment = (req,res)=>{
    let data = req.body
    dbServe.getComment(data,res)
}

//贴子点赞
exports.likePost = (req,res)=>{
    let data = req.body
    dbServe.likePost(data,res)
}
//取消点赞
exports.cancelLike = (req,res)=>{
    let data = req.body
    dbServe.cancelLike(data,res)
}

//贴子点踩
exports.dislikePost = (req,res)=>{
    let data = req.body
    dbServe.dislikePost(data,res)
}
//取消点踩
exports.cancelDislike = (req,res)=>{
    let data = req.body
    dbServe.cancelDislike(data,res)
}
