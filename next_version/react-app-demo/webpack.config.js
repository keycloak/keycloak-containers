module.exports = {
  entry: './src/app.js',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: './bin',
    filename: 'app.bundle.js',
    publicPath: 'js'
  },
  debug: true,
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/demo': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.json$/,
        loader: 'json'
     }
    ]
  }
};
