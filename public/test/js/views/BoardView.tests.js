'use strict';

import 'expectations';
import $ from 'jquery';
import _ from 'underscore';
import Game from '../../../js/models/Game.js';
import BoardView from '../../../js/views/BoardView.js';

const NODE = 'main';

describe('BoardView', () => {
    let sandbox;
    let boardNumber;
    let model;
    let view;

    let moveStub;
    let resetStub;

    function addTestNode() {
        $('body').append(document.createElement(NODE));
    }

    function removeTestNode() {
        $('body').find(NODE).remove();
    }

    function createView() {
        model = new Game();
        boardNumber = 1;

        view = new BoardView({
            model,
            boardNumber
        });
    }

    function renderView() {
        view.render();
        $(view.el).appendTo(NODE);
    }

    before(() => {
        sandbox = sinon.sandbox.create();
        addTestNode();
    });

    beforeEach(() => {
        createView();
    });

    afterEach(() => {
        sandbox.restore();
        view.remove();
        view = undefined;
    });

    after(() => {
        removeTestNode();
    });

    describe('initialize', () => {
        describe('model', () => {
            it('is defined', () => {
                expect(view.model).toBeDefined();
            });

            it('is an instance of a Game model', () => {
                expect(view.model instanceof Game).toEqual(true);
            });
        });

        describe('boardNumber', () => {
            it('is defined', () => {
                expect(view.boardNumber).toBeDefined();
            });

            it('is set to 1', () => {
                expect(view.boardNumber).toEqual(1);
            });
        });

        describe('listenTo', () => {
            let listenToSpy;

            before(() => {
                listenToSpy = sandbox.spy(BoardView.prototype, 'listenTo');
            });

            it('is called once', () => {
                expect(listenToSpy.calledOnce).toEqual(true);
            });

            describe('model', () => {
                it('listens for change events', () => {
                    expect(listenToSpy.args[0][0] instanceof Game).toEqual(true);
                    expect(listenToSpy.args[0][1]).toEqual('change');
                    expect(listenToSpy.args[0][2]).toEqual(view.render);
                });
            });
        });
    });

    describe('className', () => {
        it('is set to js-board flex-item', () => {
            expect(view.className()).toEqual('js-board flex-item');
        });
    });

    describe('events', () => {
        describe('view', () => {
            it('is defined', () => {
                expect(view.events).toBeDefined();
            });

            it('has the onClickTableCell event handler', () => {
                expect(view.events().hasOwnProperty('click td.js-cell')).toEqual(true);
                expect(typeof(view.events()['click td.js-cell'])).toEqual('function');
            });

            it('has the onClickResetBoard event handler', () => {
                expect(view.events().hasOwnProperty('click button.js-reset-board')).toEqual(true);
                expect(typeof(view.events()['click button.js-reset-board'])).toEqual('function');
            });

            describe('on cell click', () => {
                let cell;

                beforeEach(() => {
                    moveStub = sandbox.stub(view, 'move');
                    renderView();

                    cell = view.$('td.js-cell').eq(0);
                    cell.click();
                });

                it('calls move and passes the cell identifier', () => {
                    expect(moveStub.calledOnce).toEqual(true);
                    expect(moveStub.args[0][0]).toEqual('0');
                });
            });

            describe('on reset button click', () => {
                beforeEach(() => {
                    resetStub = sandbox.stub(view, 'reset');
                    renderView();

                    // make button active to check this event handler
                    view.$('button.js-reset-board').attr('disabled', false);
                    view.$('button.js-reset-board').click();
                });

                it('calls reset once', () => {
                    expect(resetStub.calledOnce).toEqual(true);
                });
            });
        });

        describe('model', () => {
            let renderSpy;

            beforeEach(() => {
                renderSpy = sandbox.spy(BoardView.prototype, 'render');
                createView();

                view.model.trigger('change');
            });

            it('calls render on model change event', () => {
                expect(renderSpy.calledOnce).toEqual(true);
            });
        });
    });

    describe('move', function() {
        let updatedBoardStub;

        beforeEach(() => {
            updatedBoardStub = sandbox.stub(model, 'updateBoard');
            view.move(123);
        });

        it('calls model.updateBoard once', () => {
            expect(updatedBoardStub.calledOnce).toEqual(true);
        });

        it('passes the cell identifier', () => {
            expect(updatedBoardStub.args[0][0]).toEqual(123);
        });
    });

    describe('reset', function() {
        let resetStub;

        beforeEach(() => {
            resetStub = sandbox.stub(model, 'reset');
            view.reset();
        });

        it('calls model.reset once', () => {
            expect(resetStub.calledOnce).toEqual(true);
        });
    });

    describe('render', function() {
        beforeEach(() => {
            renderView();
        });

        it('shows the board header', () => {
            expect(view.$('h2').text()).toEqual('Board 1');
        });

        it('shows the remaining moves', () => {
            expect(view.$('.js-moves').text()).toEqual('Remaining moves: 9');
        });

        it('shows the player turns', () => {
            expect(view.$('.js-player').text()).toEqual('"X" player\'s turn');
        });

        describe('initial state', () => {
            it('shows the board empty', () => {
                let cells = _.map(view.$('td.js-cell'), (cell) => {
                    return cell.textContent;
                });

                cells.forEach((cellText) => {
                    expect(cellText).toEqual('');
                });
            });

            it('does not show the draw notification', () => {
                expect(view.$('.js-draw').length).toEqual(0);
            });

            it('does not show the invalid notification', () => {
                expect(view.$('.js-invalid').length).toEqual(0);
            });

            it('does not show the win notification', () => {
                expect(view.$('.js-win').length).toEqual(0);
            });

            it('sets the reset button to disabled', () => {
                expect(view.$('.js-reset-board').prop('disabled')).toEqual(true);
            });
        });

        describe('with state', () => {
            let renderSpy;

            beforeEach(() => {
                renderSpy = sandbox.spy(view, 'render');
            });

            describe('top left', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['X','','','','','','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(0).text()).toEqual('X');
                });
            });

            describe('top middle', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','X','','','','','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(1).text()).toEqual('X');
                });
            });

            describe('top right', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','X','','','','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(2).text()).toEqual('X');
                });
            });

            describe('middle row left', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','X','','','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(3).text()).toEqual('X');
                });
            });

            describe('middle row middle', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','','X','','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(4).text()).toEqual('X');
                });
            });

            describe('middle row right', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','','','X','','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(5).text()).toEqual('X');
                });
            });

            describe('bottom row left', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','','','','X','','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(6).text()).toEqual('X');
                });
            });

            describe('bottom row middle', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','','','','','X','']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(7).text()).toEqual('X');
                });
            });

            describe('bottom row right', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['','','','','','','','','X']
                    });
                });

                it('shows X in correct cell', () => {
                    expect(view.$('td.js-cell').eq(8).text()).toEqual('X');
                });
            });

            describe('multiple positions', () => {
                beforeEach(() => {
                    view.model.set({
                        state: ['O','X','','O','X','','','O','X']
                    });
                });

                it('shows board with multiple X\'s and O\'s', () => {
                    expect(view.$('td.js-cell').eq(1).text()).toEqual('X');
                    expect(view.$('td.js-cell').eq(4).text()).toEqual('X');
                    expect(view.$('td.js-cell').eq(8).text()).toEqual('X');

                    expect(view.$('td.js-cell').eq(0).text()).toEqual('O');
                    expect(view.$('td.js-cell').eq(3).text()).toEqual('O');
                    expect(view.$('td.js-cell').eq(7).text()).toEqual('O');
                });
            });
        });

        describe('on move', () => {
            beforeEach(() => {
                view.render();
            });

            describe('remaining moves', () => {
                it('is reduced by one', () => {
                    view.$('td.js-cell').eq(0).click();
                    expect(view.$('.js-moves').text()).toEqual('Remaining moves: 8');

                    view.$('.js-cell').eq(1).click();
                    expect(view.$('.js-moves').text()).toEqual('Remaining moves: 7');
                });
            });

            describe('player', () => {
                it('is switched to next player', () => {
                    view.$('td.js-cell').eq(0).click();
                    expect(view.$('.js-player').text()).toEqual('"O" player\'s turn');

                    view.$('.js-cell').eq(1).click();
                    expect(view.$('.js-player').text()).toEqual('"X" player\'s turn');
                });
            });

            describe('when draw', () => {
                beforeEach(() => {
                    view.model.set({status: 'draw'});
                });

                it('shows the draw notification', () => {
                    expect(view.$('.js-draw').length).toEqual(1);
                    expect(view.$('.js-draw').text()).toEqual('Game was a draw.');
                });
            });

            describe('when invalid', () => {
                beforeEach(() => {
                    view.model.set({status: 'invalid'});
                });

                it('shows the invalid notification', () => {
                    expect(view.$('.js-invalid').length).toEqual(1);
                    expect(view.$('.js-invalid').text()).toEqual('Invalid move, please try again!');
                });
            });

            describe('when win', () => {
                beforeEach(() => {
                    view.model.set({status: 'win'});
                });

                it('shows the invalid notification', () => {
                    expect(view.$('.js-win').length).toEqual(1);
                    expect(view.$('.js-win').text()).toEqual('Player "X" won the game.');
                });
            });
        });
    });
});
