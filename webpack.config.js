const path = require('path');

/** @type {import('webpack').Configuration} */
const extensionConfig = {
  mode: 'none',
  target: 'node',
  entry: {
    extension: './src/extension.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{ test: /\.ts$/, exclude: /node_modules/, use: [{ loader: 'ts-loader' }] }]
  },
  externals: {
    vscode: 'commonjs vscode'
  }
};

/** @type {import('webpack').Configuration} */
const webviewConfig = {
  mode: 'none',
  target: 'web',
  entry: {
    app: './src/webview/app.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist/webview'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{ test: /\.ts$/, exclude: /node_modules/, use: [{ loader: 'ts-loader' }] }]
  }
};

module.exports = [extensionConfig, webviewConfig];
