define([
    'blather'
], function (Blather) {
    'use strict';

    function Lyrics(game) {
        this.game   = game;
        this.lyrics = this.game.cache.getJSON('lyrics');
        this.names  = this.game.cache.getJSON('names');
    }

    Lyrics.prototype = {
        constructor: Lyrics,
        fullname: function () {
            return this.name() + ' ' + this.name();
        },
        name: function () {
            return this.names[~~(Math.random() * this.names.length)];
        },
        sentence: function(start) {
            return this.lyrics[~~(Math.random() * this.lyrics.length)];
        }
    };

    return Lyrics;
});
