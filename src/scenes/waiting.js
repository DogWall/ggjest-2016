define([
    'phaser'
], function (Phaser) {
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

            var banner =  this.game.add.sprite(0, 0, 'empty-banner');
            banner.scale.setTo(0.5, 0.5);
            this.game.add.text(10, this.game.height - 86, 'Waiting for network', {font: '32px comicrunes', fill: '#fff'});
            
            this.game.game_state.playMusic('home-soundtrack');
        }
    };

    return Waiting;
});