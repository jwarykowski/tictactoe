import 'expectations';
import Game from '../../../js/models/Game.js';

describe('Game', () => {
    let sandbox;
    let model;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        model = new Game();
    });

    afterEach(() => {
        sandbox.restore();
        model = undefined;
    });

    describe('defaults', () => {
        it('is defined', () => {
            expect(model.defaults).toBeDefined();
        });

        it('returns the defaults', () => {
            expect(model.defaults()).toEqual({
                player: 'X',
                moveCount: 9,
                state: ['','','','','','','','',''],
                status: undefined
            });
        });
    });

    describe('isDraw', () => {
        it('returns true when move count is 0', () => {
            model.set({moveCount: 0});
            expect(model.isDraw()).toEqual(true);
        });

        it('returns false when move count is greater than 0', () => {
            model.set({moveCount: 1});
            expect(model.isDraw()).toEqual(false);
        });
    });

    describe('isFinished', () => {
        it('returns true when status is draw', () => {
            model.set({status: 'draw'});
            expect(model.isFinished()).toEqual(true);
        });

        it('returns true when status is win', () => {
            model.set({status: 'win'});
            expect(model.isFinished()).toEqual(true);
        });

        it('returns false when status is invalid', () => {
            model.set({status: 'invalid'});
            expect(model.isFinished()).toEqual(false);
        });

        it('returns false when status is undefined', () => {
            model.set({status: undefined});
            expect(model.isFinished()).toEqual(false);
        });
    });

    describe('isInvalid', () => {
        it('returns true when state already set in cell', () => {
            model.set({state: ['X','','','','','','','','']});
            expect(model.isInvalid(0)).toEqual(true);
        });

        it('returns false when state not set in cell', () => {
            model.set({state: ['X','','','','','','','','']});
            expect(model.isInvalid(8)).toEqual(false);
        });
    });

    describe('isWin', () => {
        describe('rows', () => {
            describe('top', () => {
                it('returns true when all set', () => {
                    model.set({state: ['X','X','X','','','','','','']});
                    expect(model.isWin()).toEqual(true);
                });
            });

            describe('middle', () => {
                it('returns true when all set', () => {
                    model.set({state: ['','','','X','X','X','','','']});
                    expect(model.isWin()).toEqual(true);
                });
            });

            describe('bottom', () => {
                it('returns true when all set', () => {
                    model.set({state: ['','','','','','','X','X','X']});
                    expect(model.isWin()).toEqual(true);
                });
            });
        });

        describe('cols', () => {
            describe('left', () => {
                it('returns true when all set', () => {
                    model.set({state: ['X','','','X','','','X','','']});
                    expect(model.isWin()).toEqual(true);
                });
            });

            describe('center', () => {
                it('returns true when all set', () => {
                    model.set({state: ['','X','','','X','','','X','']});
                    expect(model.isWin()).toEqual(true);
                });
            });

            describe('right', () => {
                it('returns true when all set', () => {
                    model.set({state: ['','','X','','','X','','','X']});
                    expect(model.isWin()).toEqual(true);
                });
            });
        });

        describe('diagonals', () => {
            describe('down right', () => {
                it('returns true when all set', () => {
                    model.set({state: ['X','','','','X','','','','X']});
                    expect(model.isWin()).toEqual(true);
                });
            });

            describe('down left', () => {
                it('returns true when all set', () => {
                    model.set({state: ['','','X','','X','','X','','']});
                    expect(model.isWin()).toEqual(true);
                });
            });
        });
    });

    describe('nextMove', () => {
        let setSpy;

        beforeEach(() => {
            setSpy = sandbox.spy(model, 'set');
        });

        it('changes the player and updates the status', () => {
            model.nextMove();

            expect(setSpy.calledOnce).toEqual(true);
            expect(setSpy.args[0][0]).toEqual({
                player: 'O',
                status: undefined
            });
        });
    });

    describe('reset', () => {
        it('sets the model to defaults', () => {
            model.reset();

            expect(model.attributes).toEqual({
                player: 'X',
                moveCount: 9,
                state: ['','','','','','','','',''],
                status: undefined
            });
        });
    });

    describe('updateBoard', () => {
        let isDrawStub;
        let isFinishedStub;
        let isInvalidStub;
        let isWinStub;

        let nextMoveSpy;
        let setSpy;
        let updateMoveCountSpy;
        let updateStateSpy;

        beforeEach(() => {
            isDrawStub = sandbox.stub(model, 'isDraw');
            isFinishedStub = sandbox.stub(model, 'isFinished');
            isInvalidStub = sandbox.stub(model, 'isInvalid');
            isWinStub = sandbox.stub(model, 'isWin');

            nextMoveSpy = sandbox.spy(model, 'nextMove');
            setSpy = sandbox.spy(model, 'set');
            updateMoveCountSpy = sandbox.spy(model, 'updateMoveCount');
            updateStateSpy = sandbox.spy(model, 'updateState');
        });

        describe('invalid', () => {
            describe('isFinished', () => {
                beforeEach(() => {
                    isFinishedStub.returns(true);
                    model.updateBoard(4);
                });

                it('is called once', () => {
                    expect(isFinishedStub.calledOnce).toEqual(true);
                });

                it('returns undefined', () => {
                    expect(model.updateBoard(0)).toEqual(undefined);
                });
            });

            describe('isInvalid', () => {
                beforeEach(() => {
                    isInvalidStub.returns(true);
                    model.updateBoard(4);
                });

                it('is called once', () => {
                    expect(isInvalidStub.calledOnce).toEqual(true);
                });

                it('returns undefined', () => {
                    expect(model.updateBoard(0)).toEqual(undefined);
                });

                it('sets the model status to invalid', () => {
                    expect(setSpy.args[0][0]).toEqual({status: 'invalid'});
                });
            });
        });

        describe('valid', () => {
            describe('updateMoveCount', () => {
                beforeEach(() => {
                    model.updateBoard(4);
                });

                it('is called once', () => {
                    expect(updateMoveCountSpy.calledOnce).toEqual(true);
                });

                it('updates the move count', () => {
                    expect(model.get('moveCount')).toEqual(8);
                });
            });

            describe('updateState', () => {
                beforeEach(() => {
                    model.updateBoard(4);
                });

                it('is called once', () => {
                    expect(updateStateSpy.calledOnce).toEqual(true);
                });

                it('updates the state', () => {
                    expect(model.get('state')).toEqual(['','','','','X','','','','']);
                });
            });

            describe('isWin', () => {
                beforeEach(() => {
                    isWinStub.returns(true);
                    model.updateBoard(2)
                });

                it('is called once', () => {
                    expect(isWinStub.calledOnce).toEqual(true);
                });

                it('sets the model status to win and moveCount to 0', () => {
                    expect(setSpy.args[2][0]).toEqual({status: 'win', moveCount: 0});
                });
            });

            describe('isDraw', () => {
                beforeEach(() => {
                    isDrawStub.returns(true);
                    model.updateBoard(2)
                });

                it('is called once', () => {
                    expect(isDrawStub.calledOnce).toEqual(true);
                });

                it('sets the model status to draw', () => {
                    expect(setSpy.args[2][0]).toEqual({status: 'draw'});
                });
            });

            describe('nextMove', () => {
                beforeEach(() => {
                    model.nextMove();
                });

                it('is called once', () => {
                    expect(nextMoveSpy.calledOnce).toEqual(true);
                });

                it('updates the player', () => {
                    expect(model.get('player')).toEqual('O');
                });

                it('updates the status', () => {
                    expect(model.get('status')).toEqual(undefined);
                });
            });
        });
    });

    describe('updateMoveCount', () => {
        let setSpy;

        beforeEach(() => {
            setSpy = sandbox.spy(model, 'set');
        });

        it('updates the move count', () => {
            model.updateMoveCount();

            expect(setSpy.calledOnce).toEqual(true);
            expect(setSpy.args[0][0]).toEqual({
                moveCount: 8
            });
        });
    });

    describe('updateState', () => {
        let setSpy;

        beforeEach(() => {
            setSpy = sandbox.spy(model, 'set');
        });

        it('updates the state', () => {
            model.updateState(4);

            expect(setSpy.calledOnce).toEqual(true);
            expect(setSpy.args[0][0]).toEqual({
                state: ['','','','','X','','','','']
            });
        });
    });
});
