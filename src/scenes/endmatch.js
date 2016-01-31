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
            var team = this.game.game_state.getTeam();
            if(team.name == winnerTeam.name) {
                this.game.game_state.playMusic('sfx-win', false);
            }
            else {
                this.game.game_state.playMusic('sfx-lose', false);
            }
            
        },
        isWhiteWinning: function () {
            return this.winnerTeam.name === 'white';
        },
        isBlackWinning: function () {
            return this.winnerTeam.name === 'black';
        },
        showVersus: function () {
            console.log('team', this.team);

            this.myMonster = this.game.game_state.getMonster(this.game.game_state.myMonster);
            this.theOtherMonster = this.game.game_state.getMonster(this.game.game_state.theOtherMonster);



            if (this.team == 'black') {
                this.blackMonsterId = this.myMonster;
                this.whiteMonsterId = this.theOtherMonster;
            } else {
                this.blackMonsterId = this.theOtherMonster;
                this.whiteMonsterId = this.myMonster;
            }

            //black magic champion
            this.blackBackgnd = this.game.add.sprite(0, -this.game.height, 'vs-bg-black');
            this.blackBackgnd.scale.setTo(0.5, 0.5);

            // Fix Me : get other team monster
            this.blackMonster = this.game.add.sprite(-this.game.width - 180 , 0, 'vs-black-' + this.blackMonsterId + '-' + (this.isBlackWinning() ? 'good' : 'bad'));
            this.blackMonster.scale.setTo(0.4, 0.4);

            // white magic champion
            this.whiteBackgnd = this.game.add.sprite(0, this.game.height, 'vs-bg-white');
            this.whiteBackgnd.scale.setTo(0.5, 0.5);

            // Fix Me : get other team monster
            this.whiteMonster = this.game.add.sprite(this.game.width + 180, 240, 'vs-white-' + this.whiteMonsterId + '-' + (this.isWhiteWinning() ? 'good' : 'bad'));
            this.whiteMonster.scale.setTo(0.4, 0.4);

            // add animation in 2 groups of VS
           var  anim1 = this.game.add.tween(this.blackBackgnd).to({y: 0} , 600, "Quad.easeIn", true);
           var  anim2 = this.game.add.tween(this.whiteBackgnd).to({y: 0} , 900, "Quad.easeIn", true);
           // .chain does not seem to works so add more delay on second animation.

           var  animMonster1 = this.game.add.tween(this.blackMonster).to({x: -80} , 1100, "Quad.easeIn", true);
           var  animMonster2 = this.game.add.tween(this.whiteMonster).to({x: 140} , 1300, "Quad.easeIn", true);
           // .chain does not seem to works so add more delay on third animation

            var style = {font: '32px comicrunes', fill: '#fff'};
            this.game.add.text(220, 20, this.blackTeam.score, style);
            this.game.add.text(10, this.game.height - 46, this.whiteTeam.score, style);
        },
        showWinner: function () {

            if(this.winnerTeam.name == 'white') {
              this.game.add.tween(this[this.winnerTeam.name + 'Backgnd']).to({x: 0, y:0}, 500, "Quad.easeIn", true);
              this.game.add.tween(this[this.looserTeam.name + 'Monster']).to({x: -this.game.width - 180, y:0} , 500, "Quad.easeIn", true);
              this.game.add.tween(this[this.winnerTeam.name + 'Monster']).to({x: 0, y:0} , 500, "Quad.easeIn", true);
            }else {
              this.game.add.tween(this[this.looserTeam.name + 'Backgnd']).to({x: 0, y:this.game.height}, 500, "Quad.easeIn", true);
              this.game.add.tween(this[this.looserTeam.name + 'Monster']).to({x: this.game.width + 180, y:0} , 500, "Quad.easeIn", true);
            }

            this.game.add.tween(this[this.winnerTeam.name + 'Monster'].scale).to({x: 0.6, y:0.6} , 500, "Quad.easeIn", true);

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
