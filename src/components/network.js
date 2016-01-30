define([
    'socket.io/socket.io.js'
], function (io) {
    'use strict';

    function Network(game) {

        this.game = game;

        this.currentMatch = null;
        this.currentNSP   = null;

        var self = this;

        var socket = io.connect();
        socket.on('connection', function (user) {
            console.log('hey', user);
            game.io = io;
            game.socket = socket;
            game.user = user;
            game.user.name = game.userName;
        });

        socket.on('has-joined-match', function (event) {
            var match = event.match;
            console.log('joining match', match);
            self.currentNSP = game.io(match.room);
            self.currentMatch = match;
            self.showLobby();
            setTimeout(function () {
                event.match.teams.forEach(function (t) {
                    t.players.forEach(function (p) {
                        self.game.lobby.addPlayer(p, t);
                    });
                });
            }, 1000);
        });
        
        socket.on('latency', function (timestamp, callback) {
            callback(timestamp);
        });
    }

    Network.prototype = {
        constructor: Network,

        register: function (userName) {
            this.game.socket.emit('search-matchs', { name:userName });
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

                var glyphs = self.game.cache.getJSON('glyphs');
                var glyph = glyphs[self.game.rnd.integerInRange(0, glyphs.length)];
                self.game.state.start('Runes', true, false, glyph);
            });
        }
    };

    return Network;
});