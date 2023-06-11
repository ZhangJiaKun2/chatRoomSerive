let mongoose = require('mongoose')

let db = require('../config/db')

let Schema = mongoose.Schema

let SchemaUser = new Schema({
    name:{type:String},
    psw:{type:String},
    email:{type:String},
    sex:{type:String,default:'asexual'},
    birth:{type:Date},
    phone:{type:String,default:''},
    explain:{type:String,default:''},
    imgurl:{type:String,default:'user.jpg'},
    time:{type:Date},
})

let SchemaFriend = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户ID
    friendID:{type:Schema.Types.ObjectId,ref:'User'},   //好友ID
    state:{type:String},      //好友状态（0已为好友，1申请中，2申请发送方）
    markname:{type:String},  //好友昵称
    time:{type:Date},     //生成时间
    lastTime:{type:Date}   //最后通讯时间（后加入项）
})

//一对一消息表
let MessageSchema = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户id
    friendID:{type:Schema.Types.ObjectId,ref:'User'},      //好友id
    message:{type:String},                              //消息
    types:{type:String},                                //内容类型
    time:{type:Date},                                   //时间
    state:{type:Number}                                 //消息状态（0未读，1以读）
})

let SchemaGroup = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户ID
    name:{type:String},
    imgUrl:{type:String},
    time:{type:Date},
    notice:{type:String}
})


//群成员表
let SchemaGroupUser = new Schema({
    groupID:{type:Schema.Types.ObjectId,ref:'Group'},
    userID:{type:Schema.Types.ObjectId,ref:'User'},
    name:{type:String},
    tip:{type:Number,default:0},
    time:{type:Date},
    lastTime:{type:Date},
    sheild:{type:Number}   //是否屏蔽群消息（0不屏蔽，1屏蔽）
})

//群消息表
let GroupMsg = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户id
    groupID:{type:Schema.Types.ObjectId,ref:'User'},      //群id
    message:{type:String},                              //消息
    types:{type:String},                                //内容类型
    time:{type:Date},                                   //时间
})

let Post = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户id
    message:{type:String},                              //消息
    image:{type:String},                                //图片
    time:{type:Date},                                   //时间
    lastTime:{type:Date},                               //最后操作的时间

})

let postComment = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //用户id
    postID:{type:Schema.Types.ObjectId,ref:'Post'},   //贴子id
    message:{type:String},                              //消息
    image:{type:String},                                //图片
    time:{type:Date},                                   //时间

})

let collectPost = new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //收藏贴子的用户id
    postID:{type:Schema.Types.ObjectId,ref:'Post'},   //贴子id
    fromUserID:{type:Schema.Types.ObjectId,ref:'User'},   //发帖者的id
    message:{type:String},                              //消息
    time:{type:Date},                                   //时间
})

let Like = new Schema({
    postID:{type:Schema.Types.ObjectId,ref:'Post'},  //贴子id
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //点赞者的id
    time:{type:Date}
})
let Dislike = new Schema({
    postID:{type:Schema.Types.ObjectId,ref:'Post'},  //贴子id
    userID:{type:Schema.Types.ObjectId,ref:'User'},   //点踩者的id
    time:{type:Date}
})


//第三个参数如果不添加，默认为第一个参数的复数，，，所以如果不是复数就添加第三个参数，要么把表名改为复数
module.exports = db.model('User',SchemaUser,'User')  //mongoose不许就用db
module.exports = db.model('Friend',SchemaFriend,'Friend')
module.exports = db.model('Group',SchemaGroup,'Group')
module.exports = db.model('GroupUser',SchemaGroupUser,'GroupUser')
module.exports = db.model('GroupMsg',GroupMsg,'GroupMsg')
module.exports = db.model('OneMsg',MessageSchema,'OneMsg')

module.exports = db.model('Post',Post,'Post')
module.exports = db.model('PostComment',postComment,'PostComment')
module.exports = db.model('collectPost',collectPost,'collectPost')

module.exports = db.model('Like',Like,'Like')
module.exports = db.model('Dislike',Dislike,'Dislike')

