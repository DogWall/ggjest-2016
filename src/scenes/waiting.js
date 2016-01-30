define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Waiting(game) {
    }

    Waiting.prototype = {
        constructor: Waiting,
        create: function () {
            this.game.add.text(5, 50, 'Waiting\nfor network');
        }
    };

    return Waiting;
});