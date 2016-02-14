'use strict';

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        path.resolve(__dirname, 'public', 'js', 'main.js')
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        loaders: [{
            exclude: /(node_modules)/,
            loader: 'babel',
            test: /\.js$/
        }, {
            test: /\.template$/,
            loader: 'mustache'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            inject: true
        })
    ]
};
