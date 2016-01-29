'use strict';

var _       = require('lodash');
var shortid = require('shortid');

module.exports = Team;

function Team (io, options) {

    this.id   = shortid.generate();
    this.name = options.name;

    this.io  = io;
    this.nsp = io.of('/team-' + this.id);

    this.players = {};
};

Team.prototype.hasPlayer = function(player) {
    return !! this.players[player.id];
};

Team.prototype.addPlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        this.players[player.id] = player;
    }
    this.nsp.emit('user-joined', { id:player.id });
};

Team.prototype.removePlayer = function(player) {
    if (! this.hasPlayer(player.id)) {
        delete this.players[player.id];
        this.nsp.emit('user-left', { id:player.id });
    }
};

Team.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        players: _.map(this.players, function (p) {
            return { id:p.id }
        })
    }
};

Team.prototype.size = function() {
    return _.size(this.players)
};

