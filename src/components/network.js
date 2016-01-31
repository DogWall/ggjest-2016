define([
    'socket.io/socket.io.js',
    'components/state'
], function (io, State) {
    'use strict';

    function Network(game) {

        this.game = game;
        this.currentMatch = null;
    }

    Network.prototype = {
        constructor: Network,

        reconnect: function () {
            var self = this;
            var game = this.game;

            var socket = io.connect();
            socket.on('connection', function (user) {
                console.log('hey', user);
                game.io = io;
                game.socket = socket;
                game.user = user;
                game.user.name = game.userName;
                self.game.state.start('Profile');
            });

            // disconnect
            socket.on('disconnect', function () {
                console.log('disconnect');
                self.game.state.start('Waiting');
            });

            socket.on('has-joined-match', function (event) {
                var match = event.match;
                var team  = event.team;
                self.game.nbPlayers = event.nbPlayers;
                self.game.playerPosition = event.playerPosition;
                var hash  = '#' + match.id + '-' + team.id;
                console.log('Current player', event.player);
                console.log('invite friends to', matchUrl);
                console.log('joining match', match, 'in team', team.id, '=>', hash);
                console.log('nbPlayers', event.nbPlayers);
                console.log('playerPosition', event.playerPosition);


                var matchUrl = location.toString().replace(/#.*$/, hash);
                console.log('invite friends to', matchUrl);
                // location.hash = hash;

                self.currentMatch = match;
                self.showLobby();

                // FIXME: comment attendre que
                // l'ecran Lobby soit bien affiché ?
                self.game.game_state.setTeam(team);
                self.game.lobby && self.game.lobby.setTeam(team);
                event.match.teams.forEach(function (t) {
                    t.players.forEach(function (p) {
                        self.game.lobby && self.game.lobby.addPlayer(p, t);
                    });
                });
            });

            socket.on('latency', function (timestamp, callback) {
                callback(timestamp);
            });
        },

        register: function (userName) {
            this.game.userName = userName;
            this.game.socket.emit('search-matchs', {
                prefered: location.hash.substr(1),
                name: userName,
            });
        },

        showLobby: function () {
            var self = this;
            console.log('in lobby', this.currentMatch);
            self.game.state.start('Lobby');

            self.game.socket.on('start-countdown', function (counter) {
                self.game.lobby && self.game.lobby.startCountdown(counter);
            });
            self.game.socket.on('user-joined', function (event) {
                self.game.lobby.addPlayer(event.player, event.team);
            });
            self.game.socket.on('team-scores', function (scores) {
                console.log('scores are', scores);
            });
            this.game.socket.on('game-start', function (g) {
                console.log('start game !!!');

                // FIXME: redondant avec Match-end?
                // self.game.socket.on('game-end', function () {
                //     self.game.state.start('Score', true, false);
                //     console.log('game end!');
                // });

                if (g.game == 'Runes') {
                    var glyphs = self.game.cache.getJSON('glyphs');
                    var glyph = glyphs[self.game.rnd.integerInRange(0, glyphs.length)];

                    self.game.state.start(g.game, true, false, glyph);
                } else {
                    self.game.state.start(g.game, true, false);
                }

            });

            self.game.socket.on('update-solist', function (event) {
                self.game.solistPosition = event.solist;
                console.log('solist', event.solist);
            });

            self.game.socket.on('glyphed-score', function (event) {
                self.game.glyphedScore = event.score;
            });


            self.game.socket.on('match-end', function (event) {
                self.showEndGame(event.winner, event.looser);
            });
        },

        showEndGame: function (winner, looser) {
            this.game.state.start('Endmatch', true, false, winner, looser);
        },

        userGoodGlyphed: function () {
            this.game.socket.emit('user-good-glyphed');
        },

        userMisGlyphed: function () {
            this.game.socket.emit('user-mis-glyphed');
        },

        userSendTappedScore: function (score) {
            this.game.socket.emit('user-tapped-score', score);
        }

    };

    return Network;
});
