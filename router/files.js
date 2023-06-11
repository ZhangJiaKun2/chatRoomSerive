//引入 附件上传插件
let multer = require('multer')
// const multiparty=require("connect-multiparty")
let mkdir = require('../dao/mkdir')
let mergeFile = require('../dao/mergeFile')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(11)
        mkdir.mkdirs(`../data/${req.body.user}/${req.body.module}`,(err)=>{
            console.log(err)
        })
        cb(null, './data/'+req.body.user+'/'+req.body.module)
    },
    filename: function (req, file, cb) {
        // let type = file.originalname.replace(/.+\./,'.')
        cb(null, Date.now()+'.'+req.body.type)
    }
})
//中小文件上传
const upload = multer({ storage: storage })


//大文件上传
const bigStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let {url,Hash} = req.body
        //创建文件夹
        mkdir.mkdirs(`../data/${url}/${Hash}`,(err)=>{
            console.log(err)
        })
        cb(null, './data/'+url+'/'+Hash)
    },
    filename: function (req, file, cb) {
        let type = file.originalname.replace(/.+\./,'.')
        cb(null, Date.now()+'-'+req.body.index+'.'+req.body.suffix)
    }
})
const bigFile = multer({storage:bigStorage})


module.exports = function (app){
    //普通的数据发送、图片文字视频等
    app.post('/files/upload', upload.array('file',10), function (req, res, next) {
        let file = req.files;
        // console.log(req.body)
        res.send({status:200,data:{data:file,msg:'okk'}})
    })

    //
    app.post('/files/upBigFile',bigFile.array('file'),function (req,res,next){
        let file = req.files
        res.send({status:200,data:{data:file,msg:'okk'}})
    })

    app.post('/files/mergeFiles',(req,res)=>{
        // console.log(req.body)
        // res.send({status:200,data:{data:123,msg:'ok'}})
        // let dataParse =JSON.parse(req.body)
        // console.log(dataParse)
        let {filename,suffix,url,Hash} = req.body
        console.log(filename,suffix,url,Hash)
        mergeFile.thunkStreamMerge(
            `../data/${url}/${Hash}/`,
            `../data/${url}/${filename}.${suffix}`
        );

    })
}
