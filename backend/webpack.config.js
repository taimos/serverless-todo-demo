/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

const path = require('path');

module.exports = {
  entry: './lib/index.ts',
  mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'skill',
    libraryTarget: 'commonjs2'
  },
  performance: {
    hints: false
  }
};