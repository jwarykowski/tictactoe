'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('index', () => {
    let sandbox = sinon.sandbox.create();

    let compressionStub;
    let configStub;
    let expressStub;
    let httpProxyStub;
    let loggerStub;
    let packageStub;
    let proxyStub;
    let requestLoggerStub;
    let serveStaticStub;
    let stubs;
    let webpackDevServerStub;

    beforeEach(() => {
        compressionStub = sandbox.stub().returns({});

        configStub = {
            util: {
                getEnv: sandbox.stub()
            }
        };

        expressStub = {
            all: sandbox.spy(),
            listen: sandbox.stub(),
            use: sandbox.spy()
        };

        loggerStub = {
            error: sandbox.stub(),
            info: sandbox.stub()
        };

        packageStub = {
            name: 'tictactoe'
        };

        proxyStub = {
            on: sandbox.stub(),
            web: sandbox.stub()
        };

        httpProxyStub = {
            createProxyServer: sandbox.stub().returns(proxyStub)
        };

        requestLoggerStub = {};

        serveStaticStub = sandbox.stub().returns({});

        webpackDevServerStub = sandbox.stub();

        stubs = {
            compression: compressionStub,
            config: configStub,
            express: sandbox.stub().returns(expressStub),
            'http-proxy': httpProxyStub,
            './lib/logger': loggerStub,
            './middleware/requestLogger': requestLoggerStub,
            './package': packageStub,
            'serve-static': serveStaticStub,
            './webpack.dev.server': webpackDevServerStub
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('setup', () => {
        beforeEach(() => {
            configStub.util.getEnv.returns('testing');
            proxyquire('../index', stubs);
        });

        it('should create an express instance', () => {
            expect(stubs.express.calledOnce).toEqual(true);
        });

        it('should create a proxy instance', () => {
            expect(httpProxyStub.createProxyServer.calledOnce).toEqual(true);
            expect(httpProxyStub.createProxyServer.args[0][0]).toEqual({
                changeOrigin: true
            });
        });

        describe('proxy', () => {
            describe('non-production', () => {
                it('should start the webpack dev server', () => {
                    expect(webpackDevServerStub.calledOnce).toEqual(true);
                });

                it('should proxy all /build/* requests to the webpack dev server', () => {
                    expect(expressStub.all.args[0][0]).toEqual('/build/*');
                    expect(typeof(expressStub.all.args[0][1])).toEqual('function');
                });

                describe('on request', () => {
                    beforeEach(() => {
                        expressStub.all.args[0][1]({}, {});
                    });

                    it('should call proxy web', () => {
                        expect(proxyStub.web.args[0][0]).toEqual({});
                        expect(proxyStub.web.args[0][1]).toEqual({});
                        expect(proxyStub.web.args[0][2]).toEqual({
                            target: 'http://0.0.0.0:8080'
                        });
                    });
                });
            });

            describe('production', () => {
                beforeEach(() => {
                    webpackDevServerStub.reset();
                    expressStub.all.reset();

                    configStub.util.getEnv.returns('production');
                    proxyquire('../index', stubs);
                });

                it('should not start the webpack dev server', () => {
                    expect(webpackDevServerStub.callCount).toEqual(0);
                });
            });

            describe('on error', () => {
                beforeEach(() => {
                    proxyStub.on.callArgWith(1, {
                        error: 'error text'
                    });
                });

                it('should call the logger error function', () => {
                    expect(loggerStub.error.callCount).toEqual(1);
                });

                it('should state the error information', () => {
                    expect(loggerStub.error.args[0][0]).toEqual('Could not connect to proxy');
                    expect(loggerStub.error.args[0][1]).toEqual({
                        'error': 'error text'
                    });
                });
            });
        });

        describe('middleware', () => {
            describe('serveStatic', () => {
                it('should use the middleware', () => {
                    expect(expressStub.use.args[0][0]).toEqual({});
                    expect(serveStaticStub.args[0][0].includes('/build')).toEqual(true);
                });
            });

            describe('requestLogger', () => {
                it('should use the middleware', () => {
                    expect(expressStub.use.args[1][0]).toEqual({});
                });
            });

            describe('compression', () => {
                it('should use the middleware', () => {
                    expect(expressStub.use.args[2][0]).toEqual({});
                    expect(compressionStub.calledOnce).toEqual(true);
                });
            });
        });

        describe('configuration', () => {
            it('should listen on the default host and port', () => {
                expect(expressStub.listen.calledOnce).toEqual(true);
                expect(expressStub.listen.args[0][0]).toEqual(8888);
                expect(expressStub.listen.args[0][1]).toEqual('0.0.0.0');
                expect(typeof(expressStub.listen.args[0][2])).toEqual('function');
            });

            describe('logger', () => {
                beforeEach(() => {
                    expressStub.listen.callArg(2);
                });

                it('should call the logger info function twice', () => {
                    expect(loggerStub.info.callCount).toEqual(2);
                });

                it('should state application host and port information', () => {
                    expect(loggerStub.info.args[0][0]).toEqual('tictactoe application: 0.0.0.0:8888');
                });

                it('should state node environment mode', () => {
                    expect(loggerStub.info.args[1][0]).toEqual('Running in testing mode');
                });
            });
        });
    });
});
