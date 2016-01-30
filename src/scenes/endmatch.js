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
            this.whiteTeam  = winnerTeam.name === 'white' ? winnerTeam : looserTeam;
            this.blackTeam  = winnerTeam.name === 'black' ? winnerTeam : looserTeam;
        },
        isWhiteWinning: function () {
            return this.winnerTeam.name === 'white';
        },
        isBlackWinning: function () {
            return this.winnerTeam.name === 'black';
        },
        showVersus: function () {
            this.blackBackgnd = this.game.add.sprite(0, 0, 'vs-bg-black');
            this.blackBackgnd.scale.setTo(0.5, 0.5);
            this.blackUnicorn = this.game.add.sprite(-80, 0, 'vs-black-unicorn-' + (this.isBlackWinning() ? 'good' : 'bad'));
            this.blackUnicorn.scale.setTo(0.5, 0.5);
            this.whiteBackgnd = this.game.add.sprite(0, 0, 'vs-bg-white');
            this.whiteBackgnd.scale.setTo(0.5, 0.5);
            this.whiteUnicorn = this.game.add.sprite(80, 200, 'vs-white-unicorn-' + (this.isWhiteWinning() ? 'good' : 'bad'));
            this.whiteUnicorn.scale.setTo(0.5, 0.5);

            var style = {font: '32px comicrunes', fill: '#fff'};
            this.game.add.text(220, 20, this.blackTeam.score, style);
            this.game.add.text(10, this.game.height - 46, this.whiteTeam.score, style);
        },
        showWinner: function () {
            this.background = this.game.add.sprite(0, -this.game.height, 'win-' + this.winnerTeam.name);
            this.background.scale.setTo(0.5, 0.5);

            this.timer = this.game.time.create(this.game);
            this.timer.loop(5, this.scrollWinner, this);
            this.timer.start();
        },
        scrollWinner: function () {
            if (this.background.y < 0) {
                this.background.y += 5;
            }
        },
        create: function () {
            var self = this;
            this.showVersus();
            setTimeout(function () {
                self.showWinner();
            }, 3000);
        }
    };

    return Endmatch;
});