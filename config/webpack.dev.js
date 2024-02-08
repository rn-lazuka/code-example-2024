const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const shouldHotReload =
  process.env.MODULE_USER_MANAGEMENT_URL !== 'http://localhost:8081/' &&
  process.env.MODULE_BILLING_URL !== 'http://localhost:8082/';

const plugins = [];

if (process.env.CIRCULAR_DEPENDENCY_CHECK) {
  plugins.push(
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      include: /src/,
      failOnError: false,
      allowAsyncCycles: false,
    }),
  );
}

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    publicPath: `http://localhost:${process.env.DEVELOPMENT_MODULE_PORT}/`,
  },
  ...(shouldHotReload ? { optimization: { runtimeChunk: 'single' } } : {}),
  devServer: {
    ...(shouldHotReload ? { devMiddleware: { writeToDisk: true } } : {}),
    port: process.env.DEVELOPMENT_MODULE_PORT,
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        context: ['/api'],
        target: process.env.DEVELOPMENT_API_TARGET,
        pathRewrite: {
          '^/api': '',
        },
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        onProxyReq: function (proxyReq) {
          proxyReq.setHeader('referer', process.env.DEVELOPMENT_MODULE_RESOURCES_URL);
          console.log('proxyReq ---', proxyReq.path);
        },
      },
      {
        context: ['/patients/photos'],
        target: 'http://localhost:' + process.env.DEVELOPMENT_MODULE_PORT,
        router: () => process.env.DEVELOPMENT_MODULE_RESOURCES_URL,
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/users/photos'],
        target: 'http://localhost:' + process.env.DEVELOPMENT_MODULE_PORT,
        router: () => process.env.DEVELOPMENT_MODULE_RESOURCES_URL,
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/user-management/'],
        target: process.env.MODULE_USER_MANAGEMENT_URL,
        pathRewrite: { '^/user-management/': '' },
        router: () => process.env.MODULE_USER_MANAGEMENT_URL,
        changeOrigin: true,
        secure: false,
      },
      {
        context: ['/billing/'],
        target: process.env.MODULE_BILLING_URL,
        pathRewrite: { '^/billing/': '' },
        router: () => process.env.MODULE_BILLING_URL,
        changeOrigin: true,
        secure: false,
      },
    ],
  },
  plugins,
};

module.exports = merge(commonConfig, devConfig);
