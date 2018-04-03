const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: [
    'eventsource-polyfill',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'client/src/Entry.jsx')
  ],
  devtool: 'eval-source-map',
  target: 'web',
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: `${__dirname}/client`
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['client/dist']),
    new ExtractTextPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: [path.join(__dirname, 'client'),
          path.join(__dirname, 'server/shared')
        ],
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot-loader', 'babel-loader']
      },
      {
        test: /\.woff2?(\?[a-z0-9#=&.]+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.scss$|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          // resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
