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
            this.monster = this.game.game_state.getMonster();

            //black magic champion
            this.BlackImageChampion = this.game.add.group();
            this.BlackImageChampion.x = 0;
            this.BlackImageChampion.y = -this.game.height;

            this.blackBackgnd = this.game.add.sprite(0, 0, 'vs-bg-black');
            this.blackBackgnd.scale.setTo(0.5, 0.5);

            // Fix Me : get other team monster
            this.blackMonster = this.game.add.sprite(-80, 0, 'vs-black-' + this.monster + '-' + (this.isBlackWinning() ? 'good' : 'bad'));
            this.blackMonster.scale.setTo(0.5, 0.5);

            this.BlackImageChampion.add(this.blackBackgnd);
            this.BlackImageChampion.add(this.blackMonster);

            // white magic champion
            this.WhiteImageChampion = this.game.add.group();
            this.WhiteImageChampion.x = 0;
            this.WhiteImageChampion.y = this.game.height;

            this.whiteBackgnd = this.game.add.sprite(0, 0, 'vs-bg-white');
            this.whiteBackgnd.scale.setTo(0.5, 0.5);

            // Fix Me : get other team monster
            this.whiteMonster = this.game.add.sprite(80, 200, 'vs-white-' + this.monster + '-' + (this.isWhiteWinning() ? 'good' : 'bad'));
            this.whiteMonster.scale.setTo(0.5, 0.5);

            this.WhiteImageChampion.add(this.whiteBackgnd);
            this.WhiteImageChampion.add(this.whiteMonster);

            // add animation in 2 groups of VS
            this.game.add.tween(this.WhiteImageChampion).to({y: 0} , 1300, "Quad.easeIn", true);
            this.game.add.tween(this.BlackImageChampion).to({y: 0} , 1300, "Quad.easeIn", true);

            var style = {font: '32px comicrunes', fill: '#fff'};
            this.game.add.text(220, 20, this.blackTeam.score, style);
            this.game.add.text(10, this.game.height - 46, this.whiteTeam.score, style);
        },
        showWinner: function () {
            this.background = this.game.add.sprite(0, -this.game.height, 'win-' + this.winnerTeam.name);
            this.background.scale.setTo(0.5, 0.5);
            this.game.add.tween(this.background).to({y: 0} , 1700, "Quad.easeIn", true);
        },
        showContinue: function () {
            if (! this.restart) {
                var btn = this.restart = this.game.add.sprite(0, 30, 'start-' + this.winnerTeam.name);
                btn.scale.setTo(0.5, 0.5);
                btn.inputEnabled = true;
                btn.events.onInputDown.add(function (e) {
                    this.game.network.register(this.game.userName);
                }, this);
            }
        },
        create: function () {
            var self = this;
            this.showVersus();
            setTimeout(function () {
                self.showWinner();
            }, 3000);
            setTimeout(function () {
                self.showContinue();
            }, 5000);
        }
    };

    return Endmatch;
});
