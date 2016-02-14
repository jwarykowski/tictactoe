'use strict';

import 'expectations';
import $ from 'jquery';
import LayoutView from '../../../js/views/LayoutView.js';

const NODE = 'main';

describe('LayoutView', () => {
    let sandbox;
    let view;

    let addBoardSpy;
    let removeBoardsSpy;
    let resetSpy;

    function addTestNode() {
        $('body').append(document.createElement(NODE));
    }

    function removeTestNode() {
        $('body').find(NODE).remove();
    }

    function renderView() {
        view.render();
        $(view.el).appendTo(NODE);
    }

    before(() => {
        addTestNode();
    });

    beforeEach(() => {
        view = new LayoutView();
    });

    afterEach(() => {
        view.remove();
    });

    after(() => {
        removeTestNode();
    });

    describe('properties', () => {
        describe('board', () => {
            it('is defined', () => {
                expect(view.boards).toBeDefined();
            });

            it('is an empty array', () => {
                expect(view.boards).toEqual([]);
            });
        });

        describe('events', () => {
            it('is defined', () => {
                expect(view.events).toBeDefined();
            });

            it('has the onClickAddBoard event handler', () => {
                expect(view.events().hasOwnProperty('click button.js-add-board')).toEqual(true);
                expect(typeof(view.events()['click button.js-add-board'])).toEqual('function');
            });

            it('has the onClickResetBoards event handler', () => {
                expect(view.events().hasOwnProperty('click button.js-reset-boards')).toEqual(true);
                expect(typeof(view.events()['click button.js-reset-boards'])).toEqual('function');
            });
        });
    });

    describe('events', () => {
        describe('on add board button click', () => {
            beforeEach(() => {
                addBoardSpy = sinon.spy(view, 'addBoard');
                renderView();

                view.$('button.js-add-board').click();
            });

            it('calls addBoard twice', () => {
                expect(addBoardSpy.calledTwice).toEqual(true);
            });
        });

        describe('on reset button click', () => {
            beforeEach(() => {
                resetSpy = sinon.spy(view, 'reset');
                renderView();

                view.$('button.js-reset-boards').click();
            });

            it('calls reset once', () => {
                expect(resetSpy.calledOnce).toEqual(true);
            });
        });
    });

    describe('addBoard', () => {
        beforeEach(() => {
            renderView();
            view.addBoard();
        });

        it('adds a new board to the boards array', () => {
            expect(view.boards.length).toEqual(2);
        });

        it('renders the new board to the dom', () => {
            expect(view.$('.js-board').length).toEqual(2);
        });
    });

    describe('removeBoards', () => {
        beforeEach(() => {
            renderView();
            view.addBoard();
            view.addBoard();

            view.removeBoards();
        });

        it('removes all boards', () => {
            expect(view.boards.length).toEqual(0);
        });

        it('remove boards from the dom', () => {
            expect(view.$('.js-board').length).toEqual(0);
        });
    });

    describe('render', () => {
        beforeEach(() => {
            addBoardSpy = sinon.spy(view, 'addBoard');
            renderView();
        });

        it('renders a add board button', () => {
            expect(view.$('button.js-add-board').length).toEqual(1);
        });

        it('renders a reset boards button', () => {
            expect(view.$('button.js-reset-boards').length).toEqual(1);
        });

        it('renders the boards containers', () => {
            expect(view.$('.js-boards').length).toEqual(1);
        });

        it('calls addBoard once', () => {
            expect(addBoardSpy.calledOnce).toEqual(true);
        });
    });

    describe('reset', () => {
        beforeEach(() => {
            addBoardSpy = sinon.spy(view, 'addBoard');
            removeBoardsSpy = sinon.spy(view, 'removeBoards');
            view.reset();
        });

        it('calls addBoard once', () => {
            expect(addBoardSpy.calledOnce).toEqual(true);
        });

        it('calls removeBoards once', () => {
            expect(removeBoardsSpy.calledOnce).toEqual(true);
        });
    });
});
