/* eslint-disable @typescript-eslint/no-var-requires */
const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, './src'),
    '@design': path.resolve(__dirname, './src/design'),
    '@components': path.resolve(__dirname, './src/components'),
    '@engine': path.resolve(__dirname, '../engine/src')
  })
);
