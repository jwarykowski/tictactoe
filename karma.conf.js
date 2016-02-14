const webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        client: {
            mocha: {
                ui: 'bdd'
            }
        },
        frameworks: ['mocha', 'sinon'],
        files: [
            'public/test/**/*.tests.js'
        ],
        preprocessors: {
            'public/test/**/*.tests.js': ['webpack', 'sourcemap']
        },
        webpack: {
            module: webpackConfig.module
        },
        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-sinon',
            'karma-sourcemap-loader',
            'karma-webpack'
        ]
    });
};
