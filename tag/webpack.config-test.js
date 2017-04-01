'use strict';
const join = require('path').join;
const resolve = require('path').resolve;
const webpack = require('webpack');

const {plugins} = require('./webpack/config')(webpack);

module.exports = {
  devtool: 'source-map',
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
  plugins: plugins,
  resolve: {
    extensions: [
      '', '.js'
    ],
    root: [join(__dirname, './src')]
  }
};
