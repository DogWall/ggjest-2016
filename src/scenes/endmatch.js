define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Endmatch(game) {
    }

    Endmatch.prototype = {
        constructor: Endmatch,
        init: function(winnerTeam, looserTeam) {
            this.winnerTeam = winnerTeam;
            this.looserTeam = looserTeam;
        },
        isWhiteWinning: function () {
            return this.winnerTeam.name === 'white';
        },
        isBlackWinning: function () {
            return this.winnerTeam.name === 'black';
        },
        create: function () {
            this.background = this.game.add.sprite(0, 0, 'win-' + this.winnerTeam.name);
            this.background.scale.setTo(0.5, 0.5);
        }
    };

    return Endmatch;
});