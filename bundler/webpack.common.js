const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const fs = require('fs')

// 入口
const entrys = [
  'planet', // 星球
  'base', // 基础学习
  'rain', // 下雨
  'room', // 小屋
  'sphere', // 360 球体
  'chinaMap', // 地铁
  'rickMorty', // 瑞克和莫蒂
  '3dText', // 3d 文本
  'hauntedHouse', // 鬼屋
  'particles', // 粒子
  'galaxy', // 星系生成器,
  'scrollBasedAnimation', // 基于滚动
]

const generateEntrys = (entrys) => {
  return entrys.reduce((prev, entry) => {
    let filePath = `../src/${entry}`
    try {
      const isDir = fs.lstatSync(path.resolve(__dirname, filePath)).isDirectory()
      filePath = isDir ? `${filePath}/index.js` : `${filePath}.js`
      prev[entry] = path.resolve(__dirname, filePath)
    } catch (error) {
      prev[entry] = path.resolve(__dirname, `${filePath}.js`)
    }
    return prev
  }, {})
}

const generateHtmlWebPackPlugins = (entrys) => {
  return entrys.map(entry => {
    let filePath = `../src/${entry}`
    let template = `${filePath}/index.html`
    const hasTemplate = fs.existsSync(path.resolve(__dirname, template))
    return new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: hasTemplate ? path.resolve(__dirname, template) : path.resolve(__dirname, '../src/index.html'),
      // 是否将生成的静态资源插入模板中
      inject: true,
      minify: true,
      // 输出的html文件引入的入口chunk
      // vendor 是指提取涉及 node_modules 中的公共模块
      // manifest 是对 vendor 模块做的缓存
      chunks: ['manifest', 'vendor', entry],
    })
  })
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
        },

        // Shaders
        {
          test: /\.(glsl|vs|fs|vert|frag)$/,
          exclude: /node_modules/,
          use: [
            'raw-loader'
          ]
        }
      ]
  }
}