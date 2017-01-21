module.exports = {
  devtool: 'eval',
  entry: './src/index.js',
  output: {
    path: './dist/',
    filename: '.index.js'
  },
  module: {
    loaders: [{
      test: /src\/.*\.js?$/,
      loader: 'babel'
    },
    {
      test: /src\/.*\.s?css$/,
      loader: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
        'sass'
      ].join('!')
    }]
  }
};
