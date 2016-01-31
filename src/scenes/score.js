define([
    'phaser'
], function (Phaser) {
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