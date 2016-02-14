'use strict';

import {View} from 'backbone';
import BoardView from './BoardView';
import Game from '../models/Game';
import template from'../templates/layoutView.template';

const BOARD_SELECTOR = '.js-boards';

class LayoutView extends Backbone.View {
    initialize() {
        this.boards = [];
    }

    events() {
        return {
            'click button.js-add-board': function onClickAddBoard(event) {
                event.preventDefault();
                this.addBoard();
            },
            'click button.js-reset-boards': function onClickReset(event) {
                event.preventDefault();
                this.reset();
            }
        };
    }

    addBoard() {
        let boardNumber = this.boards.length + 1;
        let model = new Game();

        let board = new BoardView({
            boardNumber,
            model
        });

        board.render();

        this.boards.push(board);
        this.$(BOARD_SELECTOR).append(board.el);
    }

    removeBoards() {
        this.boards.forEach((board) => {
            board.remove();
        });

        this.boards = [];
    }

    render() {
        this.$el.html(template);
        this.addBoard();
    }

    reset() {
        this.removeBoards();
        this.addBoard();
    }
};

export default LayoutView;
