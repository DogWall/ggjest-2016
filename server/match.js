'use strict';

var _       = require('lodash');
var shortid = require('shortid');

module.exports = Match;

function Match () {

    this.id = shortid.generate(),

    this.teams = {
      white: {
        players: {}
      },
      black: {
        players: {}
      }
    }
};

Match.prototype.playersIn = function(team) {
    return _.size(this.teams[team].players);
}

Match.prototype.smallestTeam = function() {
    var p, smallest = 10000000;
    _.each(this.teams, function (t) {
        if (_.size(t.players) < smallest) {
            smallest = t;
        }
    });
    return t;
}

Match.prototype.smallestTeamWithoutPlayer = function(playerId) {
    var p, smallest = 10000000;
    _.each(this.teams, function (t) {
        if (_.size(t.players) < smallest && ! t.players[playerId]) {
            smallest = t;
        }
    });
    return t;
}

Match.prototype.canBeJoined = function() {
    return true;
};

Match.prototype.join = function(player) {
    var team = this.smallestTeamWithoutPlayer(player.id);
    if (team) {
        team.players[player.id] = player;
    }
    return team;
};
