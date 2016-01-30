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
            this.game.stage.backgroundColor = 0x5d5d5d;
            var text = this.game.add.text(5, 50, 'The ritual\nis about to start');
        },
        update: function () {
        },

        emptyPlayers: function () {
            this.leftTeam = null;
            this.playerOffsets = {};
        },

        addPlayer: function (player, team) {
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
        }
    };

    return Lobby;
});