module.exports = {
  devtool: 'eval',
  entry: './src/index.js',
  output: {
    path: './',
    filename: './dist/index.js'
  },
  module: {
    loaders: [{
      test: /src\/.*\.js?$/,
      loader: 'babel'
    },
    {
      test: /src\/.*\.s?css$/,
      exclude: ['node_modules'],
      loader: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
        'sass'
      ].join('!')
    }]
  }
};
