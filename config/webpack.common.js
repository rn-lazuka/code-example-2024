const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();
const SRC_PATH = path.join(__dirname, '../src');
const WorkboxPlugin = require('workbox-webpack-plugin');
const ExternalTemplateRemotesPlugin = require('external-remotes-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const moduleConfig = require('./module.config');
const packageJson = require('../package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const processEnvPlugin = new webpack.DefinePlugin({
  APP_VERSION: JSON.stringify(packageJson.version),
  MODULE_USER_MANAGEMENT_ACTIVE: process.env.MODULE_USER_MANAGEMENT_ACTIVE === 'true',
  MODULE_BILLING_ACTIVE: process.env.MODULE_BILLING_ACTIVE === 'true',
  MODULE_DYNAMIC_ORIGIN: process.env.MODULE_DYNAMIC_ORIGIN,
  DEVELOPMENT_API_TARGET: process.env.DEVELOPMENT_API_TARGET,
  DISABLE_EXP_TOKEN_UPDATE_FOR_TENANTS: process.env.DISABLE_EXP_TOKEN_UPDATE_FOR_TENANTS || JSON.stringify([]),
  ENVIRONMENT_VARIABLES: JSON.stringify(process.env),
});

const plugins = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    favicon: './public/favicon.ico',
    manifest: './public/manifest.json',
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: './public/assets', to: 'assets' }],
  }),
  processEnvPlugin,
  new ModuleFederationPlugin(moduleConfig),
  new ExternalTemplateRemotesPlugin(),
];

if (isProduction) {
  plugins.push(
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 100000000,
    }),
  );
}

module.exports = {
  entry: './src/index',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'ts-loader',
        include: [SRC_PATH],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
        include: SRC_PATH,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        issuer: { and: [/\.(js|ts|md)x?$/] },
        type: 'asset/resource',
        include: SRC_PATH,
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
      '@src': path.resolve(SRC_PATH),
      '@validators': path.resolve(SRC_PATH, 'validators'),
      '@components': path.resolve(SRC_PATH, 'components'),
      '@utils': path.resolve(SRC_PATH, 'utils'),
      '@store': path.resolve(SRC_PATH, 'store'),
      '@sagas': path.resolve(SRC_PATH, 'sagas'),
      '@pages': path.resolve(SRC_PATH, 'pages'),
      '@modules': path.resolve(SRC_PATH, 'modules'),
      '@services': path.resolve(SRC_PATH, 'services'),
      '@translations': path.resolve(SRC_PATH, 'i18n'),
      '@containers': path.resolve(SRC_PATH, 'containers'),
      '@hooks': path.resolve(SRC_PATH, 'hooks'),
      '@assets': path.resolve(SRC_PATH, 'assets'),
      '@guards': path.resolve(SRC_PATH, 'guards'),
      '@constants': path.resolve(SRC_PATH, 'constants'),
      '@enums': path.resolve(SRC_PATH, 'enums'),
      '@types': path.resolve(SRC_PATH, 'types'),
      '@unit-tests': path.resolve(SRC_PATH, 'tests'),
    },
  },

  plugins,
  externals: {
    Config: getConfig(process.env),
  },
};

function getConfig(env) {
  const config = {};
  // providing a list of env variables otherwise we would push all the node envs here
  const customPropsNames = ['API_URL', 'LICENSE_NUMBER', 'CONTACT_SUPPORT_LINK_HOST', 'DEVELOPMENT_API_TARGET'];
  for (const key of customPropsNames) {
    if (env.hasOwnProperty(key)) {
      config[key] = env[key].trim();
    }
  }
  return JSON.stringify(config);
}
