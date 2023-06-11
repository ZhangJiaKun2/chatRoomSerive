//chat
let dbServe = require('../dao/dbServe')

//获取一对一聊天数据
exports.msg = (req,res)=>{
    let data = req.body
    dbServe.msg(data,res)
}
