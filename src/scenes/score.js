define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Score(game) {
    }

    Score.prototype = {
        constructor: Score,
        create: function () {
            this.game.add.text(5, 50, 'Score \\o/');
        }
    };

    return Score;
});