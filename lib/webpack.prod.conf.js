const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 压缩js
const TerserJsPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.base.conf');

const postcssLoaderWithPlugins = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [['postcss-preset-env', {}]],
    },
  },
};
const prodConfig = {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserJsPlugin({}),
      // new OptimizeCssAssetsPlugin({}),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        comon: {
          name: 'common-chunks',
          chunks: 'initial',
          minChunks: 2,
        },
        vendor: {
          name: 'vendor-chunks',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 一个模块可能属于多个 chunkGroup，这里是优先级，自定义的 group 是 0
        },
        async: {
          name: 'async-chunks',
          chunks: 'async',
          minSize: 30000,
          // byte, == 30 kb，越大那么单个文件越大，
          // chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）
          // 当这个值很大的时候就不会做公共部分的抽取了
          // 文件的最大尺寸，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize，需要注意的是这个如果配置了，
          // umi.js 就可能被拆开，最后构建出来的 chunkMap 中可能就找不到 umi.js 了。
          maxSize: 0,
          minChunks: 1, // 被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
        },
      },
    },
    runtimeChunk: true, // webpack runtime代码单独打包

  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          postcssLoaderWithPlugins,
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          postcssLoaderWithPlugins,
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
};

module.exports = merge(baseConfig, prodConfig);
