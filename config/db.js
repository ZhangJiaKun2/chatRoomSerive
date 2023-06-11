let mongoose = require('mongoose')

const db = mongoose.createConnection('mongodb://localhost:27017/table')


// let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    mongoose.set('strictQuery', true);
    console.info('连接数据库成功')
});

module.exports = db
