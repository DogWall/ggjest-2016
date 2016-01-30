'use strict';

var _       = require('lodash');
var shortid = require('shortid');

module.exports = Team;

function Team (io, options) {

    this.id      = shortid.generate();
    this.name    = options.name;

    this.io      = io;
    this.nsp     = io.of('/team-' + this.id);

    this.score   = 0;
    this.players = {};
};

Team.prototype.hasPlayer = function(player) {
    return !! this.players[player.id];
};

Team.prototype.addPlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        this.players[player.id] = player;
    }
    this.nsp.emit('user-joined', player.toJSON());
};

Team.prototype.removePlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        delete this.players[player.id];
        this.nsp.emit('user-left', player.toJSON());
    }
};

Team.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        players: _.invokeMap(this.players, 'toJSON')
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

