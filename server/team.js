'use strict';

var _       = require('lodash');
var shortid = require('shortid');
var debug   = require('debug')('ocult:teams')

module.exports = Team;

function Team (io, options) {

    this.id      = shortid.generate();
    this.name    = options.name;

    this.io      = io;
    this.nsp     = io.of('/team-' + this.id);

    this.score   = 0;
    this.players = {};

    this.glyphedScore = 0;
    this.tapScoreByRound = {};
    this.previousRoundTapsAccuracy = 0;
};

Team.prototype.hasPlayer = function(player) {
    return !! this.players[player.id];
};

Team.prototype.addPlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        this.players[player.id] = player;
        debug('user %o joined team %o', player.name, this.name);
    }
    this.nsp.emit('user-joined', player.toJSON());
};

Team.prototype.removePlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        var json = player.toJSON();
        debug('user %o left team %o', json.name, this.name);
        this.nsp.emit('user-left', json);
        delete this.players[json.id];
    }
};

Team.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        score: this.score,
        tapScoreByRound: this.tapScoreByRound,
        players: _.invokeMap(this.players, 'toJSON'),
        previousRoundTapsAccuracy: this.previousRoundTapsAccuracy,
    };
};

Team.prototype.size = function() {
    return _.size(this.players)
};

Team.prototype.addScore = function(increment) {
    this.score += increment;
    return this.score;
};

Team.prototype.getScore = function() {
    return this.score;
};

Team.prototype.playerScored = function(player, score) {
    this.addScore(score);
    player.addScore(score);
};

Team.prototype.tapSuccess = function(player, score) {
    this.playerScored(player, score);
};

Team.prototype.glyphSuccess = function(player) {
    player.glyph += 1;
    this.glyphedScore += 1;
    this.playerScored(player, 1500);
    return this.glyphedScore;
};

Team.prototype.glyphMiss = function(player) {
    player.glyph -= 1;
    this.glyphedScore -= 1;
    this.playerScored(player, -500);
    return this.glyphedScore;
};

Team.prototype.getTapAccuracyForRound = function(round) {
    var acc, score = this.tapScoreByRound[round] = this.getTapScoreOfRound(round);

    if (score <= 800)
        acc = this.previousRoundTapsAccuracy = 1;
    else if (score <= 1600)
        acc = this.previousRoundTapsAccuracy = 2;
    else
        acc = this.previousRoundTapsAccuracy = 3;

    return acc;
};

Team.prototype.getTapScoreOfRound = function(round) {
    var sum = _.sum(_.invokeMap(this.players, 'getTapScoreOfRound', round));
    return Math.min(2400, Math.max(0, Math.round(sum / this.size())));
};

