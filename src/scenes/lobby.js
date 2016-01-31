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
            this.whiteTeamSound = this.game.add.audio('sfx-white');
            this.blackTeamSound = this.game.add.audio('sfx-black');

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

            if(this.game.game_state.getTeam()) {
                this.setTeam(this.game.game_state.getTeam());
            }

            // FIXME: soundtrack not starting here...
            this.game.game_state.playMusic('home-soundtrack');
        },

        update: function () {
        },

        emptyPlayers: function () {
            this.leftTeam = null;
            this.playerOffsets = {};
        },

        setTeam: function (team) {
            var hide, self = this;
            this.ownTeam = team;
            switch (team.name) {
                case 'white':
                    hide = this.game.add.sprite(0,0, 'hide-black');
                    this.whiteTeamSound.play();
                    break;
                case 'black':
                    hide = this.game.add.sprite(0,0, 'hide-white');
                    this.blackTeamSound.play();
                    break;
            }
            hide.scale.setTo(0.5, 0.5);
            this.backgrounds.add(hide);
            this.statusText.text = "Waiting for players...";

            this.game.game_state.getTeams().forEach(function (t) {
                t.players.forEach(function (p) {
                    self.addPlayer(p, t);
                });
            });
        },

        addPlayer: function (player, team) {
            var leftOffset, color;

            if (team.name == 'black') {
                leftOffset = this.game.canvas.width / 4;
                color = (this.ownTeam && this.ownTeam.name == 'black') ? '#fff' : '#777';
            } else {
                leftOffset = this.game.canvas.width / 4 * 3;
                color = '#222';
            }

            if (! this.playerOffsets[team.id]) {
                this.playerOffsets[team.id] = 0;
            }

            var text = this.game.add.text(leftOffset, 380 + this.playerOffsets[team.id], player.name, { font: '1.1em Helvetica', fill: color });
            text.anchor.setTo(0.5, 0.5);

            this.playerOffsets[team.id] += 13;
        },

        startCountdown: function () {
            this.statusText.text = this.statusText.counter = 3;
            this.timer = this.game.time.create(this.game);
            this.timer.loop(1000, this.countdown, this);
            this.timer.start();
        },
        countdown: function () {
            if (this.statusText.counter > 0) {
                this.statusText.counter--;
                this.statusText.text = this.statusText.text.concat('..', this.statusText.counter);
            } else {
                this.timer.stop();
            }
        },
        shutdown: function() {
            this.game.game_state.playMusic('main-soundtrack');
        }
    };

    return Lobby;
});