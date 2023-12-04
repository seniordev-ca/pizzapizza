const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = merge(webpackConfig, {

  devtool: false,

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'pp-sdk-bundle.js'
  },

  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],

  optimization: {
    minimizer: [

      new UglifyJsPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          mangle: {
            toplevel: true
          },
        },
      })
    ]
  }

});
