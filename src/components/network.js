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

            socket.emit('search-matchs');
        });

        socket.on('has-joined-match', function (match) {
            console.log('joining match', match);

            self.currentMatch = match;
            self.currentNSP   = game.io(match.room);

            self.currentNSP.on('lobby-ready', self.startLobby.bind(self));
        });
    }

    Network.prototype = {
        constructor: Network,

        startLobby: function () {
            console.log('in lobby', this.currentMatch);
        }
    };

    return Network;
});