var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('../config/index.js');
var buildHtmlPlu = require('../config/htmlPlu');
var htmlPlus = buildHtmlPlu();
var entries = {};
config.entries.forEach(function (entry) {
  entries[entry.entryName] = entry.entry;
});

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
var webpackConfig = {
  entry: entries,
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src/'),
      app: path.resolve(__dirname, '../src/lib/app/')
    }
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'underscore-template-loader'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: process.env.NODE_ENV === 'production',
                importLoaders: 1
              },
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: config.assetsSubDirectory + '/img/[name].[hash:9].[ext]',
              publicPath: process.env.NODE_ENV === 'development'
                ? config.dev.assetsPublicPath
                : config.build.assetsPublicPath
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: config.assetsSubDirectory + '/font/[name].[hash:9].[ext]',
              publicPath: process.env.NODE_ENV === 'development'
                ? config.dev.assetsPublicPath
                : config.build.assetsPublicPath
            }
          }
        ]
      }
    ],
  },
  plugins: [
  ]
};

var htmlMinify = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyJS: true,
  minifyCSS: true,
  minifyURLs: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true
}
config.entries.forEach(function (entry) {
  var options = {
    filename: entry.filename,
    template: entry.template,
    chunks: ['vendor', 'app', entry.entryName],
    env: process.env.NODE_ENV === 'development'
      ? JSON.parse(config.dev.env.NODE_ENV)
      : JSON.parse(config.build.env.NODE_ENV),
    ...htmlPlus
  }

  if (process.env.NODE_ENV === 'production') {
    options.minify = htmlMinify
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(options))
});

module.exports = webpackConfig;
