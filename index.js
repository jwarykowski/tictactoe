'use strict';

const config = require('config');
const compress = require('compression');
const express = require('express');
const httpProxy = require('http-proxy');
const logger = require('./lib/logger');
const path = require('path');
const pkg = require('./package');
const requestLogger = require('./middleware/requestLogger');
const serveStatic = require('serve-static');

const app = express();
const environment = config.util.getEnv('NODE_ENV');

const proxy = httpProxy.createProxyServer({
    changeOrigin: true
});

app.use(serveStatic(path.resolve(__dirname, 'build')));
app.use(requestLogger);
app.use(compress());

if (environment !== 'production') {
    require('./webpack.dev.server')();

    app.all('/build/*', (req, res) => {
        proxy.web(req, res, {
            target: `http://${config.webpack.server.host}:${config.webpack.server.port}`
        });
    });
}

proxy.on('error', (error) => {
    logger.error('Could not connect to proxy', error);
});

app.listen(config.port, config.host, () => {
    logger.info(`${pkg.name} application: ${config.host}:${config.port}`);
    logger.info(`Running in ${environment} mode`);
});
