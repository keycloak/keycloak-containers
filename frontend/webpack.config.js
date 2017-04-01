const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const join = require('path').join;
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const assert = require('assert');
assert(process.env.ENDPOINT, 'process.env.ENDPOINT is required');

const sassLoaders = [
  // https://shellmonger.com/2016/01/19/adding-sass-support-to-webpack/
  'css-loader',
  'postcss-loader',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + resolve(__dirname, './src')
];

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/app']
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        exclude: /node_modules/,
        loader: ['babel-loader'],
        query: {
          presets: ['es2015', 'stage-3', 'react']
        }
      }, {
        test: /\.scss$/,
        // loader: [ 'style', 'css?sourceMap', 'sass?sourceMap' ].join('!')
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: join(__dirname, './build'),
    publicPath: '/build'
  },
  plugins: [ // new webpack.optimize.UglifyJsPlugin({
    //   compress: true
    // }),
    new ExtractTextPlugin('[name].css'),

    new HtmlWebpackPlugin({
      filename: resolve(__dirname, 'build/index.html'),
      template: resolve(__dirname, 'src/index.html'),
      inject: false,
      minify: {}
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.ENDPOINT': JSON.stringify(process.env.ENDPOINT)
    }),

    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 8082,
      server: {
        baseDir: ['build']
      }
    })
  ],
  postcss: [autoprefixer({browsers: ['last 2 versions']})],
  resolve: {
    extensions: [
      '', '.js', '.scss', '.css'
    ],
    root: [join(__dirname, './src')]
  }
};
