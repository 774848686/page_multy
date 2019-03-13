const fs = require('fs');
const path = require('path');
module.exports = {
  // 获取ip
  getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  },
  getDir(dirPath) {
    return this._readDir(dirPath);
  },
  getFiles(dirSrc) {
    return this._forEach(dirSrc, this.getDir(dirSrc));
  },
  /**
  * 获取目录下的所有文件夹
  * @param {*} dirSrc 目录名称
  */
  _readDir(dirSrc) {
    var excludeDirs = ['lib', 'index'];
    var dirPages = fs.readdirSync(dirSrc).filter(function (dirName) {
      return excludeDirs.indexOf(dirName) === -1 && fs.statSync(dirSrc + '/' + dirName).isDirectory()
    });
    return dirPages;
  },
  /**
   * 遍历父级目录下的所有js和html文件
   * @param {*} dirSrc 目录名称
   * @param {*} parentFile 父级目录
   */
  _forEach(dirSrc, parentFile) {
    let entriesConfig = [];
    parentFile.forEach((pageName) => {
      let filemark = 'index';
      let pagePath = path.resolve(dirSrc, pageName);
      let files = fs.readdirSync(pagePath);
      let fileHTML = filemark + '.html';
      let fileJS = filemark + '.js';
      if (files.indexOf(fileHTML) === -1 || files.indexOf(fileJS) === -1) return;
      let filename = pageName + '/' + fileHTML
      entriesConfig.push({
        entryName: pageName + '/' + filemark,
        entry: path.resolve(dirSrc, pageName, fileJS),
        filename: filename,
        template: path.resolve(dirSrc, filename)
      });
      //进行递归处理
      let subDirs = files.filter(file => {
        return fs.statSync(pagePath + '/' + file).isDirectory()
      }).map(dirName => {
        return pageName + '/' + dirName;
      });

      if (subDirs.length) {
        this._forEach(dirSrc, subDirs);
      }
    });
    return entriesConfig;
  }
}