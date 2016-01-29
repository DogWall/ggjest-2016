define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Network(game) {

        game.socket.on('has-joined-match', function (match) {
            console.log('joining match', match);
        });

        game.socket.emit('search-matchs');
    }

    Network.prototype = {
        constructor: Network,
        preload: function () {
        },
        create: function () {
        },
        update: function () {
        }
    };

    return Network;
});