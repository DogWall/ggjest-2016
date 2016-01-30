define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Lobby(game) {
    }

    Lobby.prototype = {
        constructor: Lobby,

        create: function () {
            this.emptyPlayers();
            this.game.lobby = this;

            this.backgrounds = this.game.add.group();
            this.tops = this.game.add.group();

            // background
            var bg =  this.game.add.sprite(0, 0, 'lobby');
            bg.scale.setTo(0.5, 0.5);
            this.backgrounds.add(bg);

            var logo =  this.game.add.sprite(0, 0, 'logo');
            logo.scale.setTo(0.5, 0.5);
            this.tops.add(logo);

            var banner =  this.game.add.sprite(0, 0, 'empty-banner');
            banner.scale.setTo(0.5, 0.5);
            this.statusText = this.game.add.text(10, this.game.height - 86, 'Loading...', {font: '32px comicrunes', fill: '#fff'});
        },

        update: function () {
        },

        emptyPlayers: function () {
            this.leftTeam = null;
            this.playerOffsets = {};
        },

        setTeam: function (team) {
            var hide;
            switch(team.name) {
                case 'white':
                    console.log('white');
                    hide = this.game.add.sprite(0,0, 'hide-black');
                    break;
                case 'black':
                    console.log('black');
                    hide = this.game.add.sprite(0,0, 'hide-white');
                    break;
            }
            hide.scale.setTo(0.5, 0.5);
            this.backgrounds.add(hide);
            this.statusText.text = "Waiting for players...";

        },

        addPlayer: function (player, team) {
            /*
            var leftOffset;

            if (!this.leftTeam || team.id === this.leftTeam) {
                this.leftTeam = team.id;
                leftOffset = 5;
            } else {
                leftOffset = this.game.canvas.width / 2;
            }

            if (! this.playerOffsets[team.id]) {
                this.playerOffsets[team.id] = 2;
                this.game.add.text(leftOffset, 150, 'Secte ' + team.name, { font: '1.2em Arial' });
            }

            this.game.add.text(leftOffset, 180 + this.playerOffsets[team.id], player.name, { font: '1.2em Arial' });
            this.playerOffsets[team.id] += 13;
            */
        }
    };

    return Lobby;
});