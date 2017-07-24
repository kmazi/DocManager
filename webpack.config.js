var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:1844',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    path.join(__dirname, 'client/Entry.jsx'),
    path.join(__dirname, 'client/styles/home.scss')
  ],
  output: {
    path: path.join(__dirname, '/client/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  // resolve: {
  //   extensions: ['.js', '.jsx']
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/client.tpl.html',
      inject: 'body'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[local]!sass-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader'
      },
      {  test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/, loader: 'file' }
    ]
  }
};
