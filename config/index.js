var path = require('path');
var fs = require('fs');
var getFiles = require('../utils/utils.js');
var dirSrc = path.resolve(__dirname, '../src')

// 单独处理项目首页
// 因为它的结构与其它页面不同
var entriesConfig = [
  {
    entryName: 'index/index',
    entry: path.resolve(dirSrc, 'index/index.js'),
    filename: 'index.html',
    template: path.resolve(dirSrc, 'index.html')
  }
];
entriesConfig = entriesConfig.concat(getFiles(dirSrc));
module.exports = {
  entries: entriesConfig,
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'assets',
  commonsChunkName: ['app', 'vendor', 'manifest'],
  dev: {
    env: require('./dev.env.js'),
    assetsPublicPath: '/'
  },
  build: {
    env: require('./prod.env.js'),
    // 可配置 CDN
    assetsPublicPath: '/'
  },
}
