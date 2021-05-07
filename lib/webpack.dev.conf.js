const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

const root = process.cwd();
const postcssLoaderWithPlugins = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [['postcss-preset-env', {}]],
    },
  },
};

const devConfig = {
  mode: 'development',
  devServer: {
    contentBase: path.join(root, 'dist'),
    hot: true,
    open: true,
    overlay: true,
    compress: true, // 一切服务启用gzip压缩
    stats: 'errors-only',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          postcssLoaderWithPlugins,
        ],
      },
      {
        test: /\s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          postcssLoaderWithPlugins,
          'sass-loader',
        ],
      },
    ],
  }
};
module.exports = merge(baseConfig, devConfig);
