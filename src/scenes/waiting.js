define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Waiting(game) {
    }

    Waiting.prototype = {
        constructor: Waiting,
        create: function () {
            var bg = this.game.add.sprite(0, 0, 'lobby');
            bg.scale.setTo(0.5, 0.5);

            var logo = this.game.add.sprite(0, 0, 'logo');
            logo.scale.setTo(0.5, 0.5);

            this.game.add.text(10, this.game.height - 46, 'Waiting for network', {font: '32px comicrunes', fill: '#fff'});
        }
    };

    return Waiting;
});