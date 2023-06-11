//引入 发送邮件插件
const nodemailer = require('nodemailer')

//引入配置信息
const cfg = require('../config/credentials')
const transporter = nodemailer.createTransport({
    service:'qq',
    // host: cfg.qq.user,
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
        user: cfg.qq.user, // generated ethereal user
        pass: cfg.qq.pass, // generated ethereal password
    },
})

//注册发送邮件给用户
    /**
     * email 用户邮箱
     *
     */

exports.emilSingle = function (email,res){
    console.log(email.email)
    //发送信息
    let options = {
        from: cfg.qq.user, // sender address
        to: email.email, // list of receivers
        subject: "注册信息", // Subject line  标题
        // text: "Hello world?", // plain text body
        html: '' +
            '<span>感谢注册！</span>' +
            '<a href="https://www.bilibili.com/">点我跳转</a>'
        , // html body
    }

    transporter.sendMail(options,function (err,msg){
        if(err){
            console.log(err)
        }else{
            console.log('邮箱发送成功')
            res.send(msg)
        }
    })
}
