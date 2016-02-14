'use-strict';

const config        = require('config');
const logger        = require('./lib/logger');
const webpack       = require('webpack');
const webpackConfig = require('./webpack.config');

const WebpackDevServer = require('webpack-dev-server');

module.exports = () => {
    var bundler;
    var compiler;
    var startTime;

    compiler = webpack(webpackConfig);

    compiler.plugin('compile', () => {
        startTime = Date.now();
        logger.info('Bundling project');
    });

    compiler.plugin('done', () => {
        logger.info(`Bundled in ${(Date.now() - startTime)}ms!`);
    });

    bundler = new WebpackDevServer(compiler, {
        hot: true,
        noInfo: true,
        publicPath: '/build/',
        quiet: false,
        stats: {
            colors: true
        }
    });

    bundler.listen(config.webpack.server.port, config.webpack.server.host, () => {
        logger.info('Bundling project, please wait...');
    });
};
