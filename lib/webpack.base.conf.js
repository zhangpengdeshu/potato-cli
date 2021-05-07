const path = require('path');
// 目录清除
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 多页面打包
const glob = require('glob'); // 获取全部页面或者文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 命令行信息显示优化
const FriendlyErrorWebpackPlugin = require('friendly-errors-webpack-plugin');
// css单独提取
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 样式增强
// const autoprefixer = require('autoprefixer');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const root = process.cwd();

// 多页面入口配置
const setMAP = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(root, './src/*/index.js'));
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(root, `./src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            preserveLineBreaks: false,
            removeComments: false,
          },
        }));
    });
  return {
    entry,
    htmlWebpackPlugins,
  };
};


const { entry, htmlWebpackPlugins } = setMAP();
console.log('htmlWebpackPlugins:', htmlWebpackPlugins);
module.exports = {
  entry,
  output: {
    path: path.join(root, 'dist'),
    filename: '[name].[chunkhash:8].js',
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  module: {
    rules: [
      // vue处理
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
      // 解析ES6
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      // 图片
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'imgs/[name].[contenthash:8].[ext]',
              esModule: false,
            },
          },
        ],
      },
      // 音视频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'media/[name].[contenthash:8].[ext]',
            },
          },
        ],
      },
      // 字体文件
      {
        test: /\.(woff2?|eot|tff|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 10,
              name: 'fonts/[name].[contenthash:8].[ext]',
            },

          },
        ],
      },
    ],
  },
  plugins: [
    // 清空目录
    new CleanWebpackPlugin(),
    // 有好的样式展示
    new FriendlyErrorWebpackPlugin(),
    // 错误处理
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch' === -1)) {
          process.exit(1);
        }
      });
    },
    new VueLoaderPlugin(),
  ].concat(htmlWebpackPlugins),
};
