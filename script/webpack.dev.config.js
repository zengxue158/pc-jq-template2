const pkg = require('../package.json')
const baseWebpackConfig = require('./webpack.base.config.js')
const webpackRouterConfig = require('./webpack.router.config.js')

const path = require('path')
const resolve = path.resolve

const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production'

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'static/js/[name].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    proxy: {
      // 代理
      // '/api': {
      //   target: 'https://test.3g.163.com/ug'
      // }
    }
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false,
            attrs: [':src']
          }
        },{
          loader: 'ne-ssi-loader',
          options: {
            remote: {
              locations: 'https://news.163.com',
              charset: 'utf-8'
            }
          }
        },{
          loader: 'ne-velocity-loader'
        }]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './static/css/[name].css'
    }),
    ...webpackRouterConfig.plugins,
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify('/'),
      'process.env.ANT_PROJECT_ID': JSON.stringify(pkg.projectId)
    })
  ]
})
