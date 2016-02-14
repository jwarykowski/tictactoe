'use strict';

import * as _ from 'underscore';
import {Model} from 'backbone';

const DEFAULT_STATE = ['','','','','','','','',''];
const DEFAULT_MOVE_COUNT = 9;
const DEFAULT_PLAYER = 'X';
const DEFAULT_STATUS = '';

const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

class Game extends Backbone.Model {
    defaults() {
        return {
            player: DEFAULT_PLAYER,
            moveCount: DEFAULT_MOVE_COUNT,
            state: _.clone(DEFAULT_STATE),
            status: DEFAULT_STATUS
        };
    }

    isDraw() {
        let moveCount = this.get('moveCount');
        return (moveCount === 0) ? true : false
    }

    isFinished() {
        let status = this.get('status');
        return (status === 'win' || status === 'draw') ? true : false;
    }

    isInValid(cell) {
        let state = this.get('state');
        return (state[cell] !== '') ? true : false;
    }

    isWin() {
        let state = this.get('state');

        return WIN_COMBINATIONS.some(function(COMBINATION) {
            let cell1 = state[COMBINATION[0]];
            let cell2 = state[COMBINATION[1]];
            let cell3 = state[COMBINATION[2]];

            if (cell1 && cell1 == cell2 && cell1 == cell3) {
                return true;
            }
        });
    }

    nextMove() {
        let nextPlayer = (this.get('player') == 'X') ? 'O' : 'X';

        this.set({
            status: undefined,
            player: nextPlayer
        });
    }

    reset() {
        this.set(this.defaults());
    }

    updateBoard(cell) {
        if(this.isFinished()) {
            return;
        }

        if (this.isInValid(cell)) {
            return this.set({status: 'invalid'});
        }

        this.updateMoveCount();
        this.updateState(cell);

        if (this.isWin()) {
            return this.set({moveCount: 0, status: 'win'});
        }
        if (this.isDraw()) {
            return this.set({status: 'draw'});
        }

        this.nextMove();
    }

    updateMoveCount() {
        let moveCount = this.get('moveCount');
        this.set({moveCount: moveCount -= 1});
    }

    updateState(cell) {
        let state = this.get('state');
        state[cell] = this.get('player');

        this.set({state: state});
    }
};

module.exports = Game;
