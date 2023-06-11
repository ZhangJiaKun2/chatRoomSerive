let dbModel = require('../model/dbmodel')
let bcrypt = require('../dao/bcrtypt')
let User = dbModel.model('User')
let Friend = dbModel.model('Friend')
let Group = dbModel.model('Group')
let GroupUser = dbModel.model('GroupUser')
let GroupMsg = dbModel.model('GroupMsg')
let OneMsg = dbModel.model('OneMsg')

let Post = dbModel.model('Post')
let postComment = dbModel.model('PostComment')
let collectPost = dbModel.model('collectPost')

let Like = dbModel.model('Like')
let Dislike = dbModel.model('Dislike')

let jwt = require('../dao/jwt')
let mkdir = require('../dao/mkdir')



exports.findUser = function (res){
    User.find(function (err,val){
        if(err){
            res.send('出错')
            console.log('用户数据查找失败',err)
        }else{
            res.send(val)
        }
    })
}

//新建用户
function buildUser(name,mail,pwd,res){
    //密码加密
    let bcryptPwd = bcrypt.encryption(pwd)
    //存储的数据信息
    let data = {
        name:name,
        email:mail,
        psw:bcryptPwd,
        time:new Date()
    }
    //新建一个人的数据
    let user = new User(data)
    //保存到数据表
    user.save(function (err,result){
        if(err){  //错误时返回
            res.send({status:500, message: err instanceof Error ? err.message : err})
        }else{  //添加完成以后返回
            res.send({status:200,data:{msg:'注册成功'}})
        }
    })
}
//匹配用户表元素个数
exports.countsUser = function (name,mail,pwd,type,res){
    let wherestr = {}
    wherestr[type] = mail   //使用 邮箱 做验证
    User.countDocuments(wherestr,function (err,result){
        if(err){
            console.log('出错')
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            if(result!==0) {
                res.send({status:500,data:{msg:'该邮箱已被占用'}})
            }else{
                buildUser(name,mail,pwd,res)
            }
        }
    })
}


//用户验证
exports.verifyUser = function (data,pwd,res){
    //主要是通过 email 进行登录
    let wherestr = {$or:[{'name':data},{'email':data}]}
    let out = {'name':1,'imgurl':1,'psw':1}
    // console.log(data,pwd)
    User.find(wherestr,out,function (err,result){
        console.log(result)
        if(err){
            res.send({
                status:500
            })
        }else{
            if(result == ''){   //没有匹配到该用户
                res.send({
                    status:400,
                    data:{
                        msg:'用户名或者邮箱不存在'
                    }
                })
            }
            result.map((i)=>{
                if(bcrypt.verification(pwd,i.psw)){   //密码验证
                    let token = jwt.generateToken(i.id)

                    let backData = {
                        userInfo:{
                            id:i.id,
                            name:i.name,
                            imgurl:i.imgurl,
                        },
                        token
                    }
                    res.send({
                        status:200,
                        data:{
                            data:backData,
                            msg:'success'
                        }
                    })
                }else{
                    res.send({
                        status:400,
                        data:{
                            msg:'密码错误'
                        }
                    })
                }
            })
        }
    })
}


/** 搜索有一些 bug ： 只能根据 字母搜索  输入汉字和数字返回的都是空  √  已解决*/
/** 第一次解决为：只模糊查询一个*/
//搜索用户   data:搜索词（name）
exports.searchUser = function (data,res){
    console.log(data,'data')
    let wherestr
    if(data === 'test'){
        wherestr = {}
    }else{
        const regData =  new RegExp(data, 'i');
        // console.log(regData)
        // wherestr = {$or : [{name :{$regex:regData,$options:"$i"},email : {$regex:regData,$options:"$i"}}]}   //模糊搜索
        // wherestr = {$or:[{'name' :{$regex:eval("/"+data+"/i")},'email' : {$regex:eval("/"+data+"/i")}}]}   //模糊搜索
        // wherestr = {'name': `/${data}/`}   //模糊搜索
        /** 问题解决方案 */
        wherestr = {"name": {$regex:regData}}
        // wherestr = {$or:[{"name": {$regex:regData},"email": {$regex:regData}}]}  //解决不了
    }
    let out = {
        '_id':1,
        'name':1,
        'email':1,
        'imgurl':1,
        'explain':1
    }
    User.find(wherestr,out,function (err,result){
        // let searchFriend = result.map((item,index)=>{
        //
        // })
        if(err){
            console.log('出错')
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
           res.send({
               status:200,
               data:{
                   data:result,
                   msg:'success'
               }
           })
        }
    })
}

//判断是否为好友
exports.isFriend = function (uid,fid,res){
    let wherestr = {'userID':uid,'friendID':fid,'state':0}
    Friend.findOne(wherestr,function (err,result){
        if(err){
            console.log('出错')
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            if(result){
                res.send({status:200,data:{data:result,state:1,msg:'success'}})
            }else{
                res.send({status:400,data:{state:0,msg:'不是好友'}})
            }
        }
    })
}

//搜索群
exports.searchGroup = function (data,res){
    let wherestr
    if(data === 'test'){
        wherestr = {}
    }else{
        const regData =  new RegExp(data, 'i');
        wherestr = {'name': {$regex:regData}}   //模糊搜索
    }
    let out = {
        'name': 1,
        'imgUrl': 1,
    };
    User.find(wherestr,out,function (err,result){
        if(err){
            console.log('出错')
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({
                status:200,
                data:{
                    data:result,
                    msg:'success'
                }
            })
        }
    })
}

//判断是否在群内
exports.isInGroup = function (uid,gid,res){
    let wherestr = {'userID':uid,'friendID':fid,'state':0}
    GroupUser.findOne(wherestr,function (err,result){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            if(result){
                //在群内
                res.send({status:200,data:{msg:'在群内'}})
            }else{
                res.send({status:400,data:{msg:'不在群内'}})
            }
        }
    })
}

//用户详情
exports.userDetail = function (id,res){
    console.log('我到了')
    let wherestr = {"_id":id}
    let out = {'psw':0}
    User.findOne(wherestr,out,function (err,result){
        if(err){
            res.send({status:500,data:{msg:'出错'}})
        }else{
            res.send({status:200,data:{data:result,msg:'success'}})
        }
    })
}

//用户信息修改  ==> 分为修改资料（不需要密码） 和 修改密码（需要原密码然后进行匹配）
function updateUserDetail(uid,update,res){
    User.findByIdAndUpdate(uid,update,function (err,result){
        if(err){
            //修改失败
            res.send({status:500})
        }else{
            //修改成功
            res.send({status:200,data:{msg:'success',data:result}})
        }
    })
}
// 入（data:{id,type,data}） //用户id  要修改的类目  修改的内容
exports.userUpdate = function (mydata,res){
    // console.log(typeof data)
    //postMan 测试传递过来的是json格式的数据
    // const newData = JSON.parse(data)
    // console.log(typeof newData)
    // console.log(111,newData)
    const {id,type,data} = mydata
    let updatastr = {}
    if(type === 'psw'){   //如果是要修改密码
        //密码加密
        updatastr[type] = bcrypt.encryption(data)
    }
    else if(type === 'email'){
        updatastr[type] = data
        //对邮箱格式进行验证

        //匹配邮箱个数
        User.countDocuments(updatastr,function (err,result){
            if(err){
                res.send({
                    status:500,
                    message: err instanceof Error ? err.message : err
                })
            }else{
                console.log('个数',result)
                if(result>0) {
                    res.send({status:500,data:{message:'邮箱被占用'}})
                }else{
                    updateUserDetail(id,updatastr,res)
                }
            }
        })
    }else{
        //修改其他数据
        updatastr[type] = data
    }
    console.log(updatastr)
    updateUserDetail(id,updatastr,res)
}

//获取好友昵称
exports.getMarkName = function (data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid}  //搜索项
    let updatastr = {'markname':data.name}
    Friend.findOne(wherestr,updatastr,function (err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,data:{data:result,msg:'success'}})
        }
    })
}


//好友昵称修改  （输入：用户id 好友id 昵称）（输出：success）
exports.friendMarkNameUpdate = function (data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid}  //搜索项
    let updatastr = {'markname':data.name}
    Friend.updateOne(wherestr,updatastr,function (err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,data:{msg:'success'}})
        }
    })
}

//好友操作
//添加好友表
exports.buildFriend = function (uid,fid,state,res){
    //存储的数据信息
    let data = {
        userID:uid,
        friendID:fid,
        state:state,
        time:new Date(),
        lastTime:new Date()
    }
    //新建一个人的数据
    let friend = new Friend(data)
    //保存到数据表
    friend.save(function (err,result){
        // console.log(result)
        if(err){
            console.log('申请好友表出错')
        }
    })
}

//添加一对一消息
exports.insertMsg = function (uid,fid,msg,type,res){
    let data = {
        userID:uid,   //用户id
        friendID:fid,      //好友id
        message:msg,                              //消息
        types:type,                                //内容类型
        time:new Date(),                                   //时间
        state:1
    }
    console.log(data)
    let message = new OneMsg(data)
    message.save(function (err,result){
        // console.log(result)
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'消息添加成功'}})
        }
    })
}
//好友最后通讯时间
exports.upFriendLastTime = function(uid,fid,res){
    let wherestr = {$or:[{userID:uid,friendID:fid},{userID:fid,friendID: uid}]}
    let updatestr = {lastTime:new Date()}
    Friend.update(wherestr,updatestr,function (err,result){
        if(err){
            console.log('更新最后时间出错')
        }
    })
}

//好友申请
exports.applyFriend = function (data,res){
    console.log(data)
    let {uid,fid,msg} = data
    console.log(uid,fid,msg)
    //判断是否已经申请
    let wherestr = {userID:uid,friendID:fid}
    Friend.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            //如果 为0，则为初次申请
            if(result===0){
                this.buildFriend(uid,fid,2)
                this.buildFriend(fid,uid,1)
            }else{
                //已经申请过好友
                console.log('已经申请过了')
                this.upFriendLastTime(uid,fid,res)

            }
            this.insertMsg(uid,fid,msg,0,res)
        }
    })
}

//更新好友状态
exports.updateFriendStatus = (data,res)=>{
    const {uid,fid} = data
    console.log(data)
    let wherestr = {$or:[{userID:uid,friendID:fid},{userID: fid,friendID: uid}]}
    Friend.updateMany(wherestr,{state:0},(err,result)=>{
        if(err){
            console.log('更新出错')
            res.send({status:500,data:{msg:'添加失败'}})
        }else{
            res.send({status:200,data:{msg:'添加成功'}})
        }
    })
}

//拒绝或者删除好友
exports.deleteFriend = (data,res)=>{
    const {uid,fid} = data
    let wherestr = {$or:[{userID:uid,friendID:fid},{userID: fid,friendID: uid}]}
    Friend.deleteMany(wherestr,(err,result)=>{
        if(err){
            console.log('更新出错')
            res.send({status:500,data:{msg:'添加失败'}})
        }else{
            res.send({status:200,data:{msg:'添加成功'}})
        }
    })
}


//按要求获取好友列表 （已经为好友isFriend/正在添加中isApplyFriend）
exports.getFriendsList = async (data,res)=>{
    const {uid,type} = data
    return new Promise((resolve, reject)=>{
        let info
        let query = Friend.find({})
        //查询friendID 关联的user对象
        if(type === 'isFriend'){
            //查询返回已为好友的列表
            query.where({userID:uid,state:'0'})
        }else if(type === 'isApplyFriend'){
            //查询并返回正在申请中的好友列表
            query.where({userID:uid,state:'1'})
        }

        query.populate('friendID')
        query.sort({lastTime:-1})
        //查询结果
        query.exec().then( async function (e){
            let result = e.map( async (item,index)=>{
                //获取最后一条信息
                let lastMsgInfo = await getOneMsg({uid,fid:item.friendID._id.toString()},res)
                console.log('lastMsg',lastMsgInfo)
                return {
                    id:item.friendID._id,
                    name:item.friendID.name,
                    markname:item.markname,
                    imgurl:item.friendID.imgurl,
                    lastMsg:lastMsgInfo.message,
                    lastTime:lastMsgInfo.time,
                    types:lastMsgInfo.types
                }
            })
            await Promise.all(result).then(res=>info = res)
            resolve({state:200,data:{data:info,type,msg:'success'}})
        })
    })

}

//按要求获取一条一对一消息
const getOneMsg = (data,res)=>{
    const {uid,fid} = data
    return  new Promise((resolve, reject)=>{
        let query = OneMsg.findOne({})
        //查询条件
        query.where({$or: [{userID: uid, friendID:fid}, {userID: fid, friendID:uid}]})
        query.sort({time:-1})

        //查询结果
        query.exec().then(function (item){
            resolve(item)
        })
    })

}

//汇总一对一未读消息数
exports.unReadMsg = (data,res)=>{
    const {uid,fid} = data
    let wherestr = {userID:uid,friendID:fid,state:1}
    OneMsg.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,data:{data:result,msg:'success'}})
        }
    })
}

//一对一消息状态修改
exports.updateMsg = (data,res)=>{
    const {uid,fid} = data
    let wherestr = {userID:uid,friendID:fid,state:1}
    let updatestr = {state:0}
    OneMsg.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,data:{msg:'success'}})
        }
    })
}

/**群相关操作 */
//新建群
exports.createGroup = (data,res)=>{
    let {uid,groupName,imageUrl,groupMumber} = data   //groupMumber 包括群主和其他成员
    const p =  new Promise((resolve,reject)=>{
        let groupData = {
            userID:uid,
            name:groupName,
            imgUrl:imageUrl,
            time:new Date()
        }
        let group = new Group(groupData)
        group.save(function (err,result){
            if(err){
               reject({status:500})
            }else{
               resolve(result)
            }
        })
    })
    p.then(
        async value=>{
            //添加好友入群
            for (const item of groupMumber) {
                let userData = {
                    groupID:value._id,
                    userID:item.id,
                    time:new Date(),
                    lastTime:new Date()
                }
                //把用户加入群
                await insertGroupUser(userData)
            }

            res.send({status:200,data:{msg:'添加成功'}})
        }
    ).catch(err=>{
        res.send(err)
    })
}
//添加群成员     //视频中是一个一个加的，，我觉得应该传进来应该数组去遍历添加
function insertGroupUser(data,res){
    console.log(data)
    return new Promise((resolve, reject)=>{
        let groupUser = new GroupUser(data)
        groupUser.save(function (err,result){
            if(err){
                reject()
            }else{
               resolve()
            }
        })
    })

}   //建群时添加群成员

//申请添加群成员
//按要求获取该用户的群列表
exports.getGroupList = (uid,res)=>{
    let query = GroupUser.find({})       //////这里视频查的是  GroupUser表
    //查询条件
    query.where({userID:uid})

    query.populate('groupID')
    query.sort({lastTime:-1})

    //查询结果
    query.exec().then(function (e){
        console.log(e)
        let result = e.map((item,index)=>{
            return {
                gid:item.groupID._id,
                name:item.groupID.name,
                // markname:item.markname,
                imgurl:item.groupID.imgUrl,
                time:item.groupID.time,
                // tip:item.tip,
            }
        })
        res.send({state:200,data:{data:result,msg:'success'}})
    })
}

//按要求获取群消息
exports.getGroupMsg = (gid,res)=>{
    let query = GroupMsg.find({})
    //查询条件
    query.where({groupID:gid})
    query.populate('groupID')
    query.sort({lastTime:-1})

    //查询结果
    query.exec().then(function (item){
        console.log(item)
        let result = {
            message:item.message,
            time:item.time,
            types:item.types,
            name:item.userID.name
        }
        res.send({state:200,data:{data:result,msg:'success'}})
    })
}
//保存群消息
exports.insertGroupMsg = function (data,res){
    let {uid,gid,msg,type} = data
    let saveData = {
        userID:uid,   //用户id
        groupID:gid,      //好友id
        message:msg,                              //消息
        types:type,                                //内容类型
        time:new Date(),                                   //时间

    }
    console.log(saveData,'savedata')
    let message = new GroupMsg(saveData)
    message.save(function (err,result){
        // console.log(result)
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'消息添加成功'}})
        }
    })
}
//群消息状态修改
exports.updateGroupMsg = (data,res)=>{
    let {uid,gid} = data
    let wherestr = {userID:uid,groupID:gid,state:1}
    let updatestr = {tip:0}
    GroupMsg.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,data:{msg:'success'}})
        }
    })
}


/**消息操作 */
//获取一对一聊天数据
exports.msg = (data,res)=>{
    console.log(data)
    let {uid,fid,nowPage,pageSize} = data
    let skipNum = nowPage*pageSize   //跳过的页数
    let query = OneMsg.find({})
    //查询条件
    query.where({$or: [{userID: uid, friendID:fid}, {userID: fid, friendID:uid}]})
    query.sort({time:-1})
    // //查询friendID 关联的user对象
    query.populate('userID')
    //跳过的条数
    query.skip(skipNum)
    //一页条数
    query.limit(pageSize)
    //查询结果
    query.exec().then(function (item){
        // console.log(item,'item')
        let result = item.map(i=>{
             return {
                id:i._id,
                message:i.message,
                types:i.types,
                time:i.time,
                from:i.userID._id,
                markname:i.name,
                imgurl:i.userID.imgurl,
                // lastTime:item.lastTime,
                // tip:item.tip
            }
        })
        res.send({state:200,data:{data:result,msg:'success'}})
    })
}

/** 贴子操作 */
//添加贴子
exports.addPost = (data,res)=>{
    //存储的数据信息
    const {uid,message} = data

    let postData = {
        userID:uid,
        message,
        time:new Date(),
        lastTime:new Date()
    }
    // console.log(postData)
    //新建一个人的数据
    let post = new Post(postData)
    //保存到数据表
    post.save(function (err,result){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'添加贴子ok'}})
        }
    })
}

//按要求获取贴子   data:{type:'要查找的类型'，query：‘对应类型的参数’（all：无|id：’可用是用户id和好友id‘|keyWord:'贴子相关内容查询',uid）}
exports.searchPost = (data,res)=>{
    return new Promise((resolve, reject)=>{
        let info
        let query = Post.find({})
        let wherestr
        if(data.type === 'all'){  //返回全部的贴子
            wherestr = {}
        }else if(data.type === 'keyWord'){   //根据关键词搜索贴子
            const regData =  new RegExp(data.querys, 'i');
            wherestr = {"message": {$regex:regData}}
        }else if(data.type==='id'){    //返回用户自己的贴子
            wherestr = {userID:data.querys}
        }else if(data.type==='postID'){
            wherestr = {_id:data.querys}
        }
        query.where(wherestr)
        query.populate('userID')
        query.sort({lastTime:-1})
        query.exec().then(async function (list){
            let result = list.map(async item=>{
                let action
                //获取每条贴子点赞/点踩列表
                let postLike = await getLikePost(item._id)
                let postDislike = await getDislikePost((item._id))
                //查询 该用户是否点赞或踩
                let isLike = postLike.findIndex(item=>item.userID.toString() === data.uid)
                let isDislike = postDislike.findIndex(item=>item.userID.toString() === data.uid)
                //给action赋值
                if(isLike!==-1){
                    action = 'liked'
                }else if(isDislike !== -1){
                    action = 'disliked'
                }else{
                    action = ''
                }
                return {
                    postID:item._id,
                    message:item.message,
                    lastTime:item.lastTime,
                    time:item.time,
                    userID:item.userID._id,
                    name:item.userID.name,
                    imgurl:item.userID.imgurl,
                    image:item.image ? item.image:'',
                    like:postLike,
                    dislike:postDislike,
                    action
                }
            })
            await Promise.all(result).then(res=>info = res)
            resolve({state:200,data:{data:info,msg:'success'}})
        })
    })

}

//收藏贴子
exports.collectPost = (data,res)=>{
    const {uid,fromUserID,pid,message} = data
    let postData = {
        userID:uid,
        postID:pid,
        fromUserID,
        message,
        time:new Date(),
    }
    // console.log(postData)
    //新建一个人的数据
    let collect = new collectPost(postData)
    //保存到数据表
    collect.save(function (err,result){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'收藏贴子ok'}})
        }
    })
}
//获取用户收藏的贴子
exports.getCollectPost = (data,res)=>{
    const {uid} = data
    let query = collectPost.find({})
    let wherestr = {userID:uid}
    query.where(wherestr)
    query.populate('fromUserID')
    query.sort({lastTime:-1})
    query.exec().then(function (result){
        console.log(result)
        res.send({status:200,data:{data:result,msg:'获取收藏ok'}})
    })
}

//添加评论
exports.sendComment = (data,res)=>{
    console.log(data)
    const {uid,pid,message} = data
    let postData = {
        userID:uid,   //用户id
        postID:pid,   //贴子id
        message,                              //消息
        // image:{type:String},                                //图片
        time:new Date(),                                   //时间
    }
    // console.log(postData)
    //新建一个人的数据
    let comment = new postComment(postData)
    //保存到数据表
    comment.save(function (err,result){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'评论成功'}})
        }
    })
}

//根据贴子id获取评论
exports.getComment = (data,res)=>{
    let {postID} = data  //拿到用户的id
    let query = postComment.find({})    //在贴子评论的数据表中查找
    query.where({postID})
    query.sort({lastTime:-1})   //根据最后的操作时间 倒序返回
    query.populate('userID')
    query.exec().then(function (result){
        console.log(result)
        res.send({status: 200,data:{data:result,msg:"评论获取ok"}})
    })
}

/** 赞 */
//贴子点赞  (点赞者的id（用户id），，贴子id，时间)   向数据库中添加数据
exports.likePost = (data,res)=>{
    let {uid,pid} = data
    let likeData = {
        userID:uid,
        postID:pid,
        time:new Date()
    }
    let like = new Like(likeData)

    //判断一下该 用户 是否 已经点过赞
    Like.countDocuments({userID:uid,postID:pid},(err,result)=>{
        if(err){
            res.send({status:400,data:{msg:'error'}})
        }else{
            if(result){
                res.send({status:200,data:{msg:'该用户已经点过赞'}})
            }else{
                //更新数据
                like.save((err,result)=>{
                    if(err) res.send({status:400,data:{msg:'error'}})
                    res.send({status:200,data:{msg:'点赞成功'}})
                })
            }
        }
    })
}
//获取对应贴子的点赞
const getLikePost = (pid)=>{
    return new Promise((resolve, reject)=>{
        let query = Like.find({})
        let wherestr = {postID:pid}
        query.where(wherestr)
        query.sort({lastTime:-1})
        query.exec().then(function (result){
            resolve(result)
        })
    })
}
//取消点赞
exports.cancelLike = (data,res)=>{
    let {uid,pid} = data
    let wherestr = {userID:uid,postID:pid}
    Like.deleteOne(wherestr,function (err){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'取消点赞'}})
        }
    })
}
/**踩 */
//贴子点踩
exports.dislikePost = (data,res)=>{
    let {uid,pid} = data
    let dislikePost = {
        userID:uid,
        postID:pid,
        time:new Date()
    }
    let dislike = new Dislike(dislikePost)

    //判断一下该 用户 是否 已经点过赞
    Dislike.countDocuments({userID:uid,postID:pid},(err,result)=>{
        if(err){
            res.send({status:400,data:{msg:'error'}})
        }else{
            if(result){
                res.send({status:200,data:{msg:'该用户已经点过赞'}})
            }else{
                //更新数据
                dislike.save((err,result)=>{
                    if(err) res.send({status:400,data:{msg:'error'}})
                    res.send({status:200,data:{msg:'点赞成功'}})
                })
            }
        }
    })
}
//获取对应贴子/评论的点踩
const getDislikePost = (pid)=>{
    return new Promise((resolve, reject)=>{
        let query = Dislike.find({})
        let wherestr = {postID:pid}
        query.where(wherestr)
        query.sort({lastTime:-1})
        query.exec().then(function (result){
            resolve(result)
        })
    })
}
//取消点赞
exports.cancelDislike = (data,res)=>{
    let {uid,pid} = data
    let wherestr = {userID:uid,postID:pid}
    Dislike.deleteOne(wherestr,function (err){
        if(err){
            res.send({
                status:500,
                message: err instanceof Error ? err.message : err
            })
        }else{
            res.send({status:200,data:{msg:'取消点赞'}})
        }
    })
}



//根据id 查询用户
const searchUserById = (id)=>{
    return new Promise((resolve, reject)=>{
        let query = User.find({})
        query.where({_id:id})
        query.exec().then(function (result){
            console.log(result)
            resolve(result)
        })
    })
}
