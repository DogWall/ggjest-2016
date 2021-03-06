'use strict';

var _       = require('lodash');
var shortid = require('shortid');

module.exports = Player;

function Player (io, id, socket) {

    this.id              = id;
    this.socket          = socket;
    this.name            = 'unknown';
    this.score           = 0;
    this.glyphs          = 0;
    this.tapScoreByRound = 0;
    this.currentGame     = null;
}

Player.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        score: this.score
    };
};

Player.prototype.setName = function(name) {
    this.name = name;
};

Player.prototype.addScore = function(increment) {
    this.score += increment;
    return this.score;
};

Player.prototype.getScore = function() {
    return this.score;
};

Player.prototype.setGame = function(game, options) {
    if(this.currentGame !== game) {
        this.currentGame = game;
        options = options || {};
        options.game = game;
        this.socket.emit('game-start', options);
    }
};

Player.prototype.clearGame = function() {
    this.currentGame = null;
};

Player.prototype.getTapScoreOfRound = function(round) {
    return this.tapScoreByRound[round] || 0;
};

Player.prototype.setTapScoreOfRound = function(round, score) {
    this.tapScoreByRound[round] = score;
};
