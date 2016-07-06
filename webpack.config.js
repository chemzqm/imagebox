var cssnext = require('postcss-cssnext')
var colorRgbaFallback = require('postcss-color-rgba-fallback')

module.exports = {
  entry: './example/index.js',
  output: {
    path: 'example',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.svg/, loader: 'svg-url-loader'},
      {test: /\.jsx?$/, exclude: /(node_modules|dest)/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style!css!postcss'},
      {test: /\.(png|gif)$/, loader: 'url-loader'},
      {test: /\.json$/, loader: 'json' },
      {test: /\.html$/, loader: 'html'}
    ]
  },
  postcss: [cssnext(), colorRgbaFallback({oldie: true})],
  plugins: []
}
