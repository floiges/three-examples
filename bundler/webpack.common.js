const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

// 入口
const entrys = ['planet', 'base', 'rain']

const generateEntrys = (entrys) => {
  return entrys.reduce((prev, entry) => {
    prev[entry] = path.resolve(__dirname, `../src/${entry}.js`)
    return prev
  }, {})
}

const generateHtmlWebPackPlugins = (entrys) => {
  return entrys.map(entry => new HtmlWebpackPlugin({
    filename: `${entry}.html`,
    template: path.resolve(__dirname, '../src/index.html'),
    // 是否将生成的静态资源插入模板中
    inject: true,
    minify: true,
    // 输出的html文件引入的入口chunk
    // vendor 是指提取涉及 node_modules 中的公共模块
    // manifest 是对 vendor 模块做的缓存
    chunks: ['manifest', 'vendor', entry],
  }) )
}

module.exports = {
  entry: generateEntrys(entrys),
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
      ...generateHtmlWebPackPlugins(entrys),
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