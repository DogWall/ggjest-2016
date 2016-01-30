'use strict';

var TEAM_SIZE = 1;

var _       = require('lodash');
var shortid = require('shortid');
var debug   = require('debug')('ocult:matchmaking')

var Team    = require('./team');
var Sync    = require('./sync');

module.exports = Match;

function Match (io) {

    this.id = shortid.generate(),

    this.io      = io;
    this.room    = '/match-' + this.id;
    this.running = false;
    this.sync    = new Sync(this);

    this.teams = {
      white: new Team(io, { name:'white' }),
      black: new Team(io, { name:'black' }),
    }
};

Match.prototype.emit = function(event, data) {
    this.io.to(this.room).emit(event, data);
};

Match.prototype.toJSON = function() {
    return {
        id: this.id,
        room: this.room,
        teams: _.invokeMap(this.teams, 'toJSON')
    }
};

Match.prototype.scoreboard = function() {
    var scoreboard = [];
    _.each(this.teams, function (t) {
        scoreboard.push(
            'Team ' + t.name + ': ' + t.getScore() + ' points' +
            '<ul>' + _.map(t.players, function (p) {
                    return '<li>' + p.name + ' (' + p.getScore() + ')</li>';
                }) +
            '</ul>');
    });
    return '<ul><li>' + scoreboard.join('</li><li>') + '</li></ul>';
};

Match.prototype.playersIn = function(team) {
    return _.size(this.teams[team].players);
}

Match.prototype.smallestTeam = function() {
    var p, smallest = 10000000;
    _.each(this.teams, function (t) {
        if (t.size() < smallest) {
            smallest = t;
            team = t;
        }
    });
    return team;
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
};

Match.prototype.findTeamOfPlayer = function(player) {
    return _.find(this.teams, function (t) {
        return t.hasPlayer(player);
    });
};

Match.prototype.canBeJoined = function() {
    return ! this.running;
};

Match.prototype.join = function(player, team) {
    var self = this;
    team = (team && this.teams[team]) ? this.teams[team] : this.smallestTeamWithoutPlayer(player.id);

    setTimeout(function () {
        self.sync.latency();
    }, 3000);

    if (team) {
        team.players[player.id] = player;
        player.socket.join(this.room);

        var event = {
            player: player.toJSON(),
            match: this.toJSON(),
            team: team.toJSON()
        };

        player.socket.emit('has-joined-match', event);
        player.socket.broadcast.emit('user-joined', event);

        debug('user %o has joined match %o (%o)', player.name, self.id, self.room);

        player.socket.on('user-tapped', function () {
            debug('user %o tapped', player.name);
            self.playerTapped(player);
        });

        player.socket.on('user-good-glyphed', function () {
            debug('user %o glyphed good', player.name);
            // self.playerTapped(user);
        });

        player.socket.on('user-mis-glyphed', function () {
            debug('user %o glyphed bad', player.name);
            // self.playerTapped(user);
        });

        player.socket.on('disconnect', function () {
            team.removePlayer(player);
            debug('user %o has left match %o (%o)', player.name, self.id, self.room);
        });

        if (this.isReady()) {
            this.start();
        }
    }

    return team;
};

Match.prototype.isReady = function() {
    return _.every(this.teams, function (t) {
        return t.size() >= TEAM_SIZE;
    })
};

Match.prototype.start = function() {
    var self = this;
    debug('match %o is starting', this.id);
    this.running = true;

    setTimeout(function () {
        self.emit('game-start');
    }, 3000);
};

Match.prototype.playerTapped = function(player) {
    var team  = this.findTeamOfPlayer(player);
    var score = 10;

    team.playerScored(player, score);
    this.sendScores();
};

Match.prototype.sendScores = function() {
    this.emit('team-scores', this.teamScores());
};

Match.prototype.teamScores = function() {
    var scores = {};
    _.each(this.teams, function (t) {
        var byTeam = {
            score: t.getScore(),
            players: {}
        };
        _.each(t.players, function (p) {
            scores[t.id].players[p.id] = p.getScore();
        });
    });
    return scores;
};