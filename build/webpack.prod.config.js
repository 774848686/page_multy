var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('../config/index.js');

var webpackConfig = {
  output: {
    filename: '[name].[chunkhash:9].js',
    path: config.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:9].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: config.commonsChunkName,
      filename: '/lib/[name].[chunkhash:9].js',
      minChunks: 3
    })
  ],
  devtool: 'source-map',
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false
  }))
}

module.exports = webpackMerge(webpackBaseConfig, webpackConfig);
