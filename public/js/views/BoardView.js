'use strict';

import _ from 'underscore';
import {View} from 'backbone';
import template from '../templates/boardView.template';

function buildCellState(state) {
    return _.reduce(state, function(memo, value, index) {
        memo[`cell${index}`] = value;
        return memo;
    }, {});
}

class BoardView extends View {
    initialize(options) {
        this.model = options.model;
        this.boardNumber = options.boardNumber;

        this.listenTo(this.model, 'change', this.render);
    }

    className() {
        return 'js-board flex-item';
    }

    events() {
        return {
            'click td.js-cell': function onClickTableCell(event) {
                event.preventDefault();
                this.move(event.currentTarget.dataset.cell);
            },
            'click button.js-reset-board': function onClickResetBoard(event) {
                event.preventDefault();
                this.reset();
            }
        };
    }

    move(cell) {
        this.model.updateBoard(cell);
    }

    reset() {
        this.model.reset();
    }

    render() {
        let modelJSON = this.model.toJSON();

        let boardNumber = this.boardNumber;
        let cells = buildCellState(modelJSON.state);

        let isPlaying;
        let isDraw;
        let isInvalid;
        let isWin;

        if (modelJSON.moveCount < 9) {
            isPlaying = true;
        }
        if (modelJSON.status === 'draw') {
            isDraw = true;
        }
        if (modelJSON.status === 'invalid') {
            isInvalid = true;
        }
        if (modelJSON.status === 'win') {
            isWin = true;
        }

        this.$el.html(template(_.extend({
            boardNumber,
            isPlaying,
            isInvalid,
            isDraw,
            isWin
        }, modelJSON, cells)));
    }
}

export default BoardView;
