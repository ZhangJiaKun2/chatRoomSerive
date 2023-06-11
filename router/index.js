let dbServe = require('../dao/dbServe') // 调用数据库
let sendEmail = require('../dao/emilsServe')

let signup = require('../serve/signup') //注册用户事件
let login = require('../serve/login') //用户登录事件
let search = require('../serve/search') //搜索用户/群
let user = require('../serve/userDetail') //用户详情页服务
let friend = require('../serve/friend') //好友模块
let index = require('../serve/index') //聊天首页模块
let chat = require('../serve/chat') //聊天模块
let group = require('../serve/group') //群模块

let post = require('../serve/post') //群模块

let bodyParser = require('body-parser')

let jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })
module.exports = function (app){
    //这里的 app为  app.js 的 express
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.get('/test',(req, res) => {
        dbServe.findUser(res)
        // res.send('这里是test页面!')
    });

    app.post('/sendEmail',(req,res)=>{
        // console.log(req.body)
        let email = req.body
        // res.send(email)
        // console.log(email)
        sendEmail.emilSingle(email,res)
    });


    /** 注册/登录页 */
    //注册用户
    // app.post('/signup/add',(req,res)=>{
    //     signup.signup(req,res)
    // })
    //判断用户名或者邮箱是否被使用,并注册
    app.post('/signup/add',(req,res)=>{
        signup.judgeValue(req,res)
    })
    //用户登录
    app.post('/login/login',(req,res)=>{
        login.login(req,res)
    })


    /** 搜索页面 */
    //搜索用户
    app.post('/search/user',(req,res)=>{
        search.searchUser(req,res)
    })
    //判断是否为好友
    app.post('/search/isFriend',(req,res)=>{
        search.isFriend(req,res)
    })
    //搜索群
    app.post('/search/group',(req,res)=>{
        search.searchGroup(req,res)
    })
    //判断是否在群内
    app.post('/search/isInGroup',(req,res)=>{
        search.isInGroup(req,res)
    })

    /** 用户详情 */
    //详情
    app.post('/user/detail',(req,res)=>{
        user.userDetail(req,res)
    })
    //修改详情
    app.post('/user/update',(req,res)=>{
        user.userUpdate(req,res)
    })
    //修改好友昵称
    app.post('/user/updateMarkName',(req,res)=>{
        user.friendMarkNameUpdate(req,res)
    })
    //获取好友昵称
    app.post('/user/getMarkName',(req,res)=>{
        user.getMarkName(req,res)
    })

    /** 好友模块*/
    //好友申请
    app.post('/friend/appleFriend',(req,res)=>{
        friend.applyFriend(req,res)
    })
    //更新好友状态（确定添加好友）
    app.post('/friend/updateFriendStatus',(req,res)=>{
        friend.updateFriendStatus(req,res)
    })
    //拒绝好友或删除好友
    app.post('/friend/deleteFriend',(req,res)=>{
        friend.deleteFriend(req,res)
    })

    //添加消息
    app.post('/friend/insertMsg',(req,res)=>{
        friend.insertMsg(req,res)
    })

    /**主页 */
    //获取好友列表
    app.post('/index/getFriendsList',(req,res)=>{
        index.getFriendsList(req,res)
    })
    //获取最后的消息
    app.post('/index/getOneMsg',(req,res)=>{
        index.getOneMsg(req,res)
    })
    //汇总一对一未读消息
    app.post('/index/getUnReadMsg',(req,res)=>{
        index.getUnReadMsg(req,res)
    })
    //好友消息标已读
    app.post('/index/updateMsg',(req,res)=>{
        index.updateMsg(req,res)
    })

    //获取群列表
    app.post('/index/getGroupList',(req,res)=>{
        index.getGroupList(req,res)
    })
    //获取最后一条群消息
    app.post('/index/getGroupMsg',(req,res)=>{
        index.getGroupMsg(req,res)
    })
    //更新群消息标已读
    app.post('/index/updateGroupMsg',(req,res)=>{
        index.updateGroupMsg(req,res)
    })
    //添加群消息
    app.post('/index/sendGroupMsg',(req,res)=>{
        group.insertGroupMsg(req,res)
    })

    /** 聊天页面*/
    app.post('/chat/msg',(req,res)=>{
        chat.msg(req,res)
    })

    /**建群页 */
    app.post('/group/createGroup',(req,res)=>{
        group.createGroup(req,res)
    })


    /**贴子*/
    //创建一个贴子
    app.post('/post/addPost',(req,res)=>{
        post.addPost(req,res)
    })

    //按条件查找贴子
    app.post('/post/searchPost',(req,res)=>{
        post.searchPost(req,res)
    })
    //收藏贴子
    app.post('/post/collectPost',(req,res)=>{
        post.collectPost(req,res)
    })
    //获取收藏的贴子
    app.post('/post/getCollectPost',(req,res)=>{
        post.getCollectPost(req,res)
    })
    //添加评论
    app.post('/post/sendComment',(req,res)=>{
        post.sendComment(req,res)
    })
    //获取评论
    app.post('/post/getComment',(req,res)=>{
        post.getComment(req,res)
    })
    //贴子点赞
    app.post('/post/likePost',(req,res)=>{
        post.likePost(req,res)
    })
    //取消点赞
    app.post('/post/cancelLike',(req,res)=>{
        post.cancelLike(req,res)
    })
    //贴子点踩
    app.post('/post/dislikePost',(req,res)=>{
        post.dislikePost(req,res)
    })
    //取消点踩
    app.post('/post/cancelDislike',(req,res)=>{
        post.cancelDislike(req,res)
    })
}
