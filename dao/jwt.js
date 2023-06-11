//token
//引入token
let jwt = require('jsonwebtoken')

let secret = 'omwikundsg'
//生成token
exports.generateToken = (id)=>{
    let payload = {
        id,
        time:new Date()
    }
    const token=jwt.sign(payload,secret)   //还可以添加一个参数，token过期时间，单位为 s
    return token
}

//解码token
exports.decodeToken = (token)=>{
    let payload
    jwt.verify(token,secret,function (err,result){
        if(err){
            payload = 0
        }else{
            payload = 1
        }
    })
    return payload
}
