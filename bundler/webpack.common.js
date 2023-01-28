const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: {
    planet: path.resolve(__dirname, '../src/planet.js'),
    base: path.resolve(__dirname, '../src/base.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',

  },
  devtool: 'source-map',
  plugins:
    [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, '../static') }
        ]
      }),
      new HtmlWebpackPlugin({
        filename: 'planet.html',
        template: path.resolve(__dirname, '../src/index.html'),
        // 是否将生成的静态资源插入模板中
        inject: true,
        minify: true,
        // 输出的html文件引入的入口chunk
        // vendor 是指提取涉及 node_modules 中的公共模块
        // manifest 是对 vendor 模块做的缓存
        chunks: ['manifest', 'vendor', 'planet'],
      }),
      new HtmlWebpackPlugin({
        filename: 'base.html',
        template: path.resolve(__dirname, '../src/index.html'),
        // 是否将生成的静态资源插入模板中
        inject: true,
        minify: true,
        // 输出的html文件引入的入口chunk
        // vendor 是指提取涉及 node_modules 中的公共模块
        // manifest 是对 vendor 模块做的缓存
        chunks: ['manifest', 'vendor', 'base'],
      }),
      new MiniCSSExtractPlugin()
    ],
  module:
  {
    rules:
      [
        // HTML
        {
          test: /\.(html)$/,
          use: ['html-loader']
        },

        // JS
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use:
            [
              'babel-loader'
            ]
        },

        // CSS
        {
          test: /\.css$/,
          use:
            [
              MiniCSSExtractPlugin.loader,
              'css-loader'
            ]
        },

        // Images
        {
          test: /\.(jpg|png|gif|svg)$/,
          use:
            [
              {
                loader: 'file-loader',
                options:
                {
                  outputPath: 'assets/images/'
                }
              }
            ]
        },

        // Fonts
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use:
            [
              {
                loader: 'file-loader',
                options:
                {
                  outputPath: 'assets/fonts/'
                }
              }
            ]
        }
      ]
  }
}