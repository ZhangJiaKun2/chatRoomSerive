const dbserver = require('../dao/dbServe')

//用户名是否被占用，和注册
exports.judgeValue = function (req,res){
    let {name,mail,pwd,type} = req.body
    // console.log(data,type)
    // res.send({data, type})
    dbserver.countsUser(name,mail,pwd,type,res)
}
