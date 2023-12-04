const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackConfig, {

    devtool: 'inline-source-map',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            inject: 'head'
        })
    ]
});
