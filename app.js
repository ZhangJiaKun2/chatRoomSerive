const express = require('express')
//解析req.body 的插件
const bodyParser = require('body-parser')
//引入token
const jwt = require('./dao/jwt')
const app = express()
const port = 3000

//socket.io
const { Server } = require("socket.io");
const io = new Server({
    allowEIO3: true,
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
    transport: ['websocket']
});
require('./dao/socket')(io)
io.listen(8082);

const allowHeaders = "Origin, Expires, Content-Type, X-E4M-With, Authorization";
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许人员域名跨域
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", allowHeaders);
    res.header("Access-Control-Allow-Credentials", "true");
    //允许的header类型
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

app.use(bodyParser.urlencoded({ extended: false })); //parse application/x-www-form-urlencoded
app.use(bodyParser.json()); //parse application/json

//获取静态路径
app.use(express.static(__dirname+'/data'))

//token 判断
app.use(function (req,res,next){
    if(req.headers.authorization){
        //处理token
        let token = req.headers.authorization
        let tokenMatch = jwt.decodeToken(token)
        if(tokenMatch){
            next()
        }else{
            res.send({status:300,data:{result:tokenMatch,msg:'token出问题'}})
        }
    }else{
        next()
    }

})
//后端路由
require('./router/index')(app)
require('./router/files')(app)

//404问题
app.use((req, res, next)=>{
    // console.log(req,res,next)
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})
//出现错误问题
app.use((err,req, res, next)=>{
    res.status(err.statusCode||500)
    res.send(err.statusMessage)
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
