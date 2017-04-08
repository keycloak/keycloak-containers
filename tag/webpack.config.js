'use strict';
const join = require('path').join;
const resolve = require('path').resolve;
const webpack = require('webpack');

const {plugins} = require('./webpack/config')(webpack);

module.exports = {
  devtool: 'source-map',
  entry: {
    client: './src/client.js'
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        exclude: /node_modules/,
        loader: ['babel-loader'],
        query: {
          presets: ["es2015"],
          "plugins": ["transform-flow-strip-types", "syntax-flow"]
        }
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  output: {
    filename: '[name].js',
    // path: join(__dirname, './build'),
    // publicPath: '/build'
  },
  plugins: plugins,
  resolve: {
    extensions: [
      '', '.js'
    ],
    root: [join(__dirname, './src')]
  }
};
