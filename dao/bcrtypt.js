const bcrypt = require('bcryptjs');

//生成hash密码
exports.encryption = function (pwd){
    //生成随机 salt
    let salt = bcrypt.genSaltSync(10);
    //生成hash密码
    let hash = bcrypt.hashSync(pwd, salt);

    return hash
}

//解密  pwd前端传递过来的密码   hashPwd数据库保存的密码
exports.verification = function (pwd,hashPwd){
    return bcrypt.compareSync(pwd, hashPwd)
}
