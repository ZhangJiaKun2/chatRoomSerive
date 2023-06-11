const fs = require('fs'); // 导入 fs 模块
const path = require('path'); // 导入 path 模块

/**
 *文件合并
 * @param {*} sourceFiles 源文件目录：存放所有切片文件的目录
 * @param {*} targetFiles 目标文件：合并之后的文件名
 */
exports.thunkStreamMerge = (sourceFiles, targetFiles)=>{
    // console.log(sourceFiles,targetFiles)
    const list = fs.readdirSync(path.resolve(__dirname, sourceFiles));
    const fileWriteStream = fs.createWriteStream(
        path.resolve(__dirname, targetFiles)
    );
    //进行递归调用合并文件
    console.log(fileWriteStream)
    thunkStreamMergeProgress(list, fileWriteStream, sourceFiles);
}
/**
 * 合并每一个切片
 * @param {*} fileList 文件数据
 * @param {*} fileWriteStream 最终的写入结果
 * @param {*} sourceFiles 文件路径
 */
function thunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles) {
    console.log(fileList.length);
    if (!fileList.length) {
        return fileWriteStream.end("console.log('完成了')");
    }
    const currentFile = path.resolve(__dirname, sourceFiles, fileList.shift());
    const currentReadSteam = fs.createReadStream(currentFile);
    //写入文件内容，括号内的会覆盖readStream的内容
    currentReadSteam.pipe(fileWriteStream, { end: false });
    //合并后，删除切片
    fs.rm(currentFile, { recursive: true }, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
    });
    currentReadSteam.on("end", () => {
        thunkStreamMergeProgress(fileList, fileWriteStream, sourceFiles);
    });
}

