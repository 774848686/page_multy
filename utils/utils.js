var path = require('path');
var fs = require('fs');
function getFiles(dirSrc){
    var excludeDirs = ['lib', 'index'],entriesConfig = [];
    var dirPages = fs.readdirSync(dirSrc).filter(function (dirName) {
      return excludeDirs.indexOf(dirName) === -1 && fs.statSync(dirSrc + '/' + dirName).isDirectory()
    })
    dirPages.forEach(pageWalk)
    
    function pageWalk(pageName) {
      var filemark = 'index'
      var pagePath = path.resolve(dirSrc, pageName)
      var files = fs.readdirSync(pagePath)
      var fileHTML = filemark + '.html'
      var fileJS = filemark + '.js'
    
      if (files.indexOf(fileHTML) === -1 || files.indexOf(fileJS) === -1) return
    
      var filename = pageName + '/' + fileHTML
      entriesConfig.push({
        entryName: pageName + '/' + filemark,
        entry: path.resolve(dirSrc, pageName, fileJS),
        filename: filename,
        template: path.resolve(dirSrc, filename)
      })
    
      var subDirs = files.filter(function (file) {
        return fs.statSync(pagePath + '/' + file).isDirectory()
      }).map(function (dirName) {
        return pageName + '/' + dirName
      })
    
      if (subDirs.length) {
        subDirs.forEach(pageWalk)
      }
    }
    return entriesConfig;
}
module.exports = getFiles;