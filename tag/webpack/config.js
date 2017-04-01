module.exports = (webpack) => {

  const {
    webpack: {
      compress: WEBPACK_COMPRESS
    },
    client
  } = require('common-env/withLogger')(console).getOrElseAll({
    webpack: {
      compress: true
    },
    client: {
      endpoint: 'https://killbug.today'
    }
  });

  const plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.ENDPOINT': JSON.stringify(client.endpoint)
    })
  ]

  if (WEBPACK_COMPRESS) {
    plugins.unshift(new webpack.optimize.UglifyJsPlugin({compress: WEBPACK_COMPRESS}));
  }

  return {plugins};
}
