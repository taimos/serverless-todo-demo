'use strict';

// Modules
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const API_GW_URL = 'https://ii5p1bxp53.execute-api.eu-central-1.amazonaws.com';

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
let isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  let config = {};
  
  config.entry = {
    app: [
      'font-awesome-loader',
      'bootstrap-loader',
      './src/app/app.js'
    ]
  };
  
  config.output = {
    // Absolute output directory
    path: __dirname + '/dist',
    
    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://127.0.0.1:3000/',
    
    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    
    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };
  
  if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }
  
  // Initialize module
  config.module = {
    rules: [{
      test: /\.js$/,
      use: ['ng-annotate-loader', 'babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {loader: 'css-loader', query: {sourceMap: true}},
          {loader: 'postcss-loader'}
        ],
      })
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      use: 'file-loader'
    }, {
      test: /\.html$/,
      use: 'raw-loader'
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader',
      })
    }, {
      test: /bootstrap-sass\/assets\/javascripts\//,
      use: 'imports-loader?jQuery=jquery'
    }]
  };
  
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    })
  ];
  
  // Render index.html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true})
  );
  
  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin(),
      // Copy assets from the public folder
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public'
      }])
    )
  }
  
  /**
   * Dev server configuration
   */
  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal',
    port: 3000,
    proxy: {
      '/todos': {
        target: API_GW_URL,
        pathRewrite: {'^/': '/Prod/'},
        changeOrigin: true
      }
    }
  };
  
  return config;
}();
