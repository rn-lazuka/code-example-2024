onst { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    minimize: true,
    runtimeChunk: false,
  },
};

module.exports = merge(commonConfig, prodConfig);
