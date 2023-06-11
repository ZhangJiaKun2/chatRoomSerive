//群
let dbserve = require('../dao/dbServe')

//新建群
exports.createGroup = function (req,res){
    let data = req.body

    dbserve.createGroup(data,res)
}

//
exports.applyFriend = function (req,res){
    let data = req.body
    dbserve.applyFriend(data,res)
}
