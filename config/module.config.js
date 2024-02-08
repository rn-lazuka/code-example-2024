const { dependencies } = require('../package.json');

const moduleConfig = {
  name: 'Host',
  filename: process.env.HOST_MODULE_BUNDLE_NAME,
  remotes: {},
  exposes: {
    './App': './src/App',
    './AppWithStore': './src/AppWithStore',
    './translations': './src/i18n/config',
    './styles': './src/styles',
    './utils': './src/utils',
    './constants': './src/constants',
    './components': './src/components',
    './containers': './src/containers',
    './services': './src/services',
    './guards': './src/guards',
    './hooks': './src/hooks',
    './store': './src/store',
    './validators': './src/validators',
    './enums': './src/enums',
    './types': './src/types',
    './tests': './src/tests',
    './regexp': './src/regexp',
    './modules': './src/modules',
  },
  shared: {
    ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    i18next: {
      singleton: true,
      requiredVersion: dependencies['i18next'],
    },
    'react-hook-form': {
      singleton: true,
      requiredVersion: dependencies['react-hook-form'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: dependencies['react-router-dom'],
    },
    'react-redux': {
      singleton: true,
      requiredVersion: dependencies['react-redux'],
    },
    'react-i18next': {
      singleton: true,
      requiredVersion: dependencies['react-i18next'],
    },
    '@material-ui/core': {
      singleton: true,
      requiredVersion: dependencies['@material-ui/core'],
    },
    '@mui/x-date-pickers': {
      singleton: true,
      requiredVersion: dependencies['@mui/x-date-pickers'],
    },
    '@mui/private-theming': { singleton: true, requiredVersion: dependencies['@mui/material'] },
    '@mui/styles': { singleton: true, requiredVersion: dependencies['@mui/material'] },
  },
};

if (process.env.MODULE_BILLING_ACTIVE === 'true') {
  console.log('Module Federation: Billing module added');
  moduleConfig.remotes.Billing = `Billing@[window.MODULE_ORIGIN]${process.env.MODULE_BILLING_URL}${process.env.MODULE_BILLING_BUNDLE_FILE_NAME}`;
}

if (process.env.MODULE_USER_MANAGEMENT_ACTIVE === 'true') {
  console.log('Module Federation: UserManagement module added');
  moduleConfig.remotes.UserManagement = `UserManagement@[window.MODULE_ORIGIN]${process.env.MODULE_USER_MANAGEMENT_URL}${process.env.MODULE_USER_MANAGEMENT_BUNDLE_FILE_NAME}`;
}

module.exports = moduleConfig;
