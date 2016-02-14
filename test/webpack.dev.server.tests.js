'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const webpackConfig = require('../webpack.config');

describe('index', () => {
    let sandbox = sinon.sandbox.create();

    let bundlerStub;
    let compilerStub;
    let loggerStub;
    let webpackDevServerStub;
    let webpackStub;
    let stubs;

    beforeEach(() => {
        bundlerStub = {
            listen: sandbox.stub()
        };

        compilerStub = {
            plugin: sandbox.stub()
        };

        loggerStub = {
            error: sandbox.stub(),
            info: sandbox.stub()
        };

        webpackDevServerStub = sandbox.stub().returns(bundlerStub);

        webpackStub = sandbox.stub().returns(compilerStub);

        stubs = {
            webpack: webpackStub,
            './lib/logger': loggerStub,
            'webpack-dev-server': webpackDevServerStub
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('on call', () => {
        beforeEach(() => {
            proxyquire('../webpack.dev.server', stubs)();
        });

        it('should call webpack and pass the config', () => {
            expect(webpackStub.calledOnce).toEqual(true);
            expect(webpackStub.args[0][0]).toEqual(webpackConfig);
        });

        it('should call webpack and pass the config', () => {
            expect(webpackStub.calledOnce).toEqual(true);
            expect(webpackStub.args[0][0]).toEqual(webpackConfig);
        });

        describe('compiler', () => {
            describe('on compile and done', () => {
                beforeEach(() => {
                    compilerStub.plugin.callArg(1);
                });

                it('it should log out the start and performance times', () => {
                    expect(loggerStub.info.callCount).toEqual(2);
                    expect(loggerStub.info.args[0][0]).toEqual('Bundling project');
                    expect(/Bundled in \dms!/.test(loggerStub.info.args[1][0])).toEqual(true);
                });
            });
        });

        describe('webpack dev server', () => {
            describe('configuration', () => {
                it('it should create a new instance and pass the correct configuration', () => {
                    expect(webpackDevServerStub.calledOnce).toEqual(true);
                    expect(webpackDevServerStub.args[0][0]).toEqual(compilerStub);
                    expect(webpackDevServerStub.args[0][1]).toEqual({
                        'hot': true,
                        'noInfo': true,
                        'publicPath': '/build/',
                        'quiet': false,
                        'stats': {'colors': true}
                    });
                });
            });

            describe('on listen', () => {
                beforeEach(() => {
                    bundlerStub.listen.callArg(2);
                });

                it('calls the listen method and passes arguments', () => {
                    expect(bundlerStub.listen.args[0][0]).toEqual(8080);
                    expect(bundlerStub.listen.args[0][1]).toEqual('0.0.0.0');
                    expect(typeof(bundlerStub.listen.args[0][2])).toEqual('function');
                });

                it('should call the logger info function', () => {
                    expect(loggerStub.info.callCount).toEqual(1);
                    expect(loggerStub.info.args[0][0]).toEqual('Bundling project, please wait...');
                });
            });
        });
    });
});
