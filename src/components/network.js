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
            });

            socket.on('disconnect', function () {
                self.game.state.start('Waiting');
            });

            socket.on('has-joined-match', function (event) {
                var match = event.match;
                var team  = event.team;
                var hash  = '#' + match.id + '-' + team.id;
                console.log('Current player', event.player);
                console.log('invite friends to', matchUrl);
                console.log('joining match', match, 'in team', team.id, '=>', hash);

                var matchUrl = location.toString().replace(/#.*$/, hash);
                console.log('invite friends to', matchUrl);
                location.hash = hash;

                self.currentMatch = match;
                self.showLobby();

                // FIXME: comment attendre que
                // l'ecran Lobby soit bien affiché ?
                setTimeout(function () {
                    self.game.game_state.setTeam(team);
                    self.game.lobby.setTeam(team);
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

            self.game.socket.on('user-joined', function (event) {
                self.game.lobby.addPlayer(event.player, event.team);
            });

            self.game.socket.on('game-start', function () {
                console.log('start game !!!');

                self.game.socket.on('team-scores', function (scores) {
                    console.log('scores are', scores);
                });

                var glyphs = self.game.cache.getJSON('glyphs');
                var glyph = glyphs[self.game.rnd.integerInRange(0, glyphs.length)];
                self.game.state.start('Runes', true, false, glyph);
            });
        },

        userGoodGlyphed: function () {
            this.game.socket.emit('user-good-glyphed');
        },

        userMisGlyphed: function () {
            this.game.socket.emit('user-mis-glyphed');
        },

        userTapped: function () {
            this.game.socket.emit('user-tapped');
        }

    };

    return Network;
});
