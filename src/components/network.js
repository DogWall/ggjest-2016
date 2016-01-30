define([
    'socket.io/socket.io.js'
], function (io) {
    'use strict';

    function Network(game) {

        this.game = game;

        this.currentMatch = null;
        this.currentNSP   = null;
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
            });

            socket.on('disconnect', function () {
                self.game.state.start('Waiting');
            });

            socket.on('has-joined-match', function (event) {
                var match = event.match;
                var team  = event.team;
                var hash  = '#' + match.id + '-' + team.id;
                console.log('joining match', match, 'in team', team.id, '=>', hash);

                var matchUrl = location.toString().replace(/#.*$/, hash);
                console.log('invite friends to', matchUrl);
                location.hash = hash;

                self.currentNSP = game.io(match.room);
                self.currentMatch = match;
                self.showLobby();

                // FIXME: comment attendre que l'ecran Lobby soit bien affiché ?
                setTimeout(function () {
                    event.match.teams.forEach(function (t) {
                        t.players.forEach(function (p) {
                            self.game.lobby.addPlayer(p, t);
                        });
                    });
                }, 2000);
            });

            socket.on('latency', function (timestamp, callback) {
                callback(timestamp);
            });
        },

        register: function (userName) {
            this.game.socket.emit('search-matchs', {
                prefered: location.hash.substr(1),
                name: userName,
            });
        },

        showLobby: function () {
            var self = this;
            console.log('in lobby', this.currentMatch);
            self.game.state.start('Lobby');

            self.currentNSP.on('user-joined', function (event) {
                self.game.lobby.addPlayer(event.player, event.team);
            });

            self.currentNSP.on('game-start', function () {
                console.log('start game !!!');

                self.currentNSP.on('team-scores', function (scores) {
                    console.log('scores are', scores);
                });

                var glyphs = self.game.cache.getJSON('glyphs');
                var glyph = glyphs[self.game.rnd.integerInRange(0, glyphs.length)];
                self.game.state.start('Runes', true, false, glyph);
            });
        },

        userGoodGlyphed: function () {
            this.currentNSP.emit('user-good-glyphed');
        },

        userMisGlyphed: function () {
            this.currentNSP.emit('user-mis-glyphed');
        },

        userTapped: function () {
            this.currentNSP.emit('user-tapped');
        }

    };

    return Network;
});