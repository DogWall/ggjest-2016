define([
    'blather'
], function (Blather) {
    'use strict';

    function Lyrics(game) {
        this.game   = game;
        this.lyrics = this.game.cache.getJSON('lyrics');
        // this.blatherer = new Blather();
        // this.blatherer.addText(lyrics.join(' '));
    }

    Lyrics.prototype = {
        constructor: Lyrics,
        sentence: function(start) {
            return this.lyrics[~~(Math.random() * this.lyrics.length)];
            // return this.blatherer.sentence(start || 'Ὣς');
        }
    };

    return Lyrics;
});
