let dbserve = require('../dao/dbServe')

//用户登录
exports.login = (req,res)=>{
    let {data,pwd} = req.body
    dbserve.verifyUser(data,pwd,res)
}
