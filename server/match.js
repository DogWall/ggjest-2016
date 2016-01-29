'use strict';

var TEAM_SIZE = 1;

var _       = require('lodash');
var shortid = require('shortid');
var debug   = require('debug')('ocult:matchmaking')

var Team    = require('./team');

module.exports = Match;

function Match (io) {

    this.id = shortid.generate(),

    this.io   = io;
    this.room = '/match-' + this.id;
    this.nsp  = io.of(this.room);

    this.teams = {
      white: new Team(io, { name:'white' }),
      black: new Team(io, { name:'black' }),
    }
};

Match.prototype.toJSON = function() {
    return {
        id: this.id,
        room: this.room,
        teams: _.invokeMap(this.teams, 'toJSON')
    }
};

Match.prototype.playersIn = function(team) {
    return _.size(this.teams[team].players);
}

Match.prototype.smallestTeam = function() {
    var p, smallest = 10000000;
    _.each(this.teams, function (t) {
        if (t.size() < smallest) {
            smallest = t;
        }
    });
    return t;
}

Match.prototype.smallestTeamWithoutPlayer = function(playerId) {
    var team, smallest = 10000000;
    _.each(this.teams, function (t) {
        if (t.size() < smallest && ! t.players[playerId]) {
            smallest = t.size();
            team = t;
        }
    });
    return team;
}

Match.prototype.canBeJoined = function() {
    return true;
};

Match.prototype.join = function(player) {
    var self = this;
    var team = this.smallestTeamWithoutPlayer(player.id);
    if (team) {
        team.players[player.id] = player;
        player.socket.join(this.room);
        player.socket.emit('has-joined-match', this.toJSON());
        this.nsp.emit('user-joined', { id:player.id });

        debug('user %o has joined match %o (%o)', player.id, self.id, self.room);

        player.socket.on('disconnect', function () {
            team.removePlayer(player);
            debug('user %o has left match %o (%o)', player.id, self.id, self.room);
        });
    }
    return team;
};

Match.prototype.isReady = function() {
    return _.every(this.teams, function (t) {
        return t.size() >= TEAM_SIZE;
    })
};

Match.prototype.startLobby = function() {
    debug('match %o is ready', this.id);
    this.nsp.emit('lobby-ready');
};
