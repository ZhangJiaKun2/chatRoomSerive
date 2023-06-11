// 用户详情
let dbServer = require('../dao/dbServe')
const {response} = require("express");

//详情
exports.userDetail = function (req,res){
    let {id} = req.body
    console.log(id)
    dbServer.userDetail(id,res)
}

//信息修改
exports.userUpdate = function (req,res){
    let data = req.body
    console.log(data,'data')
    dbServer.userUpdate(data,res)
}

//修改好友昵称
exports.friendMarkNameUpdate = function (req,res){
    let {data} = req.body
    dbServer.friendMarkNameUpdate(data,res)
}

//获取好友昵称
exports.getMarkName = function (req,res){
    let {data} = req.body
    dbServer.getMarkName(data,res)
}
