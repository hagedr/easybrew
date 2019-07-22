const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// require('font-awesome-webpack');
// require('style-loader');
// require('css-loader');
// require('file-loader');

module.exports = {
  entry: {
    style: './src/style.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    // path: 'C:/banche-diaodu/dist/'
    path: path.resolve(__dirname, 'www')
    // path: '/Users/ming/Documents/workspace/wanrun-jf/src/main/resources/webapp/'
  },
  plugins: [
    new CleanWebpackPlugin(['www']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new UglifyJsPlugin({
    //   test: /\.js($|\?)/i,
    // }),
    // new HTMLWebpackPlugin({
    //   title: 'Code Splitting',
    //   template: './src/scripts/templates/index.html'
    // }),
    // new ExtractTextPlugin("./src/scripts/css/style.css"),
    new CopyWebpackPlugin([
      // {output}/file.txt
      // {
      //   from: './src/scripts/img',
      //   to: '../img'
      // },
      // {
      //   from: './src/scripts/css/style.css',
      //   to: '../css/style.css'
      // },
      // {
      //   from: './node_modules/purecss/build/pure.css',
      //   to: '../www/css/pure.css'
      // },
      // {
      //   from: './node_modules/weui/dist/style/weui.css',
      //   to: '../css/weui.css'
      // },
      // {
      //   from: './node_modules/weui.js/dist/weui.js',
      //   to: '../js/weui.js'
      // },
      // {
      //   from: './main.js',
      //   to: '../main.js'
      // },
      {
        from: './src/index.html',
        to: '../www/index.html'
      },
      // {
      //   from: './src/app.js',
      //   to: '../www/js/app.js'
      // },
      // {
      //   from: './src/js',
      //   to: '../www/js'
      // },
      // {
      //   from: './src/pages',
      //   to: '../www/pages'
      // },
      // {
      //   from: './src/css',
      //   to: '../www/css'
      // },
      {
        from: './src/img',
        to: '../www/img'
      },
      {
        from: './src/config',
        to: '../www/config'
      },
      // {
      //   from: './node_modules/jquery/dist/jquery.js',
      //   to: '../www/js/jquery.js'
      // },
      // {
      //   from: './node_modules//angular/angular.js',
      //   to: '../www/js/angular.js'
      // },
      // {
      //   from: './node_modules/angular-ui-router/release/angular-ui-router.js',
      //   to: '../www/js/angular-ui-router.js'
      // },
      // {
      //   from: './node_modules/angular-ui-router/release/stateEvents.js',
      //   to: '../www/js/stateEvents.js'
      // },
      // {
      //   from: './node_modules/storejs/dist/store.js',
      //   to: './store.js'
      // },
      // {
      //   from: './node_modules/moment/moment.js',
      //   to: './moment.js'
      // },
      // {
      //   from: './src/svg/',
      //   to: './svg'
      // },
      // {
      //   from: './bower_components/pickadate/lib/picker.js',
      //   to: '../js/pickadate/picker.js'
      // },
      // {
      //   from: './bower_components/pickadate/lib/picker.date.js',
      //   to: '../js/pickadate/picker.date.js'
      // },
      // {
      //   from: './bower_components/pickadate/lib/picker.time.js',
      //   to: '../js/pickadate/picker.time.js'
      // },
      // {
      //   from: './bower_components/pickadate/lib/translations/zh_CN.js',
      //   to: '../js/pickadate/zh_CN.js'
      // },
    ])
  ],
  module: {
    rules: [
      //暴露$和jQuery到全局
      {
        test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      // {
      //   test: require.resolve('storejs'), //require.resolve 用来获取模块的绝对路径
      //   use: [{
      //     loader: 'expose-loader',
      //     options: 'store'
      //   }]
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.less$/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'less-loader'
      //   ]
      // },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [{
      //     loader: 'file-loader',
      //     options: {
      //       publicPath: './dist/img/', //打包到fonts文件夹
      //       useRelativePath: true, //设置为相对路径
      //     }
      //   }]
      // },
      // {
      //   test: /\.(eot|svg|ttf|woff|woff2)\w*/,
      //   loader: 'file-loader?publicPath=/static/res/&outputPath=font/'
      // },
      // {
      //   // test 表示测试什么文件类型
      //   test: /\.css$/,
      //   // 使用 'style-loader','css-loader'
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader', // 回滚
      //     use: 'css-loader',
      //     publicPath: '../' //解决css背景图的路径问题
      //   })
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: [{
      //     loader: 'url-loader',
      //     options: { // 这里的options选项参数可以定义多大的图片转换为base64
      //       limit: 500000, // 表示小于500kb的图片转为base64,大于500kb的是路径
      //       outputPath: 'images' //定义输出的图片文件夹
      //     }
      //   }]
      // },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 300000000
        }
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.js$/, // 处理以.js结尾的文件
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'babel-loader' // 用babel-loader处理
      }
    ]
  }
};
