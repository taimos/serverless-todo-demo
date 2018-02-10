/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

module.exports = {
  entry: path.resolve(__dirname, pkg.main),
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: pkg.main
  },
  target: 'node',
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
};