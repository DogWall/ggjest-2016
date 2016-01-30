'use strict';

var TEAM_SIZE = process.env.PLAYERS || 1;

var _         = require('lodash');
var shortid   = require('shortid');
var debug     = require('debug')('ocult:matchmaking')

var Team      = require('./team');
var Sync      = require('./sync');

module.exports = Match;

function Match (io) {

    this.id = shortid.generate(),

    this.io      = io;
    this.room    = '/match-' + this.id;
    this.running = false;

    this.solist  = 0;
    this.round   = 0;
    this.timer   = null;
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

Match.prototype.playerSummary = function() {
    var summary = [];
    return summary.join('\n');
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

    // Check latency (not usefull yet)
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

        player.socket.removeAllListeners('user-tapped-score');
        player.socket.on('user-tapped-score', function (score) {
            debug('user %o tapped a score of %o', player.name, score);
            self.tappedScore(player, score);
        });

        player.socket.removeAllListeners('user-good-glyphed');
        player.socket.on('user-good-glyphed', function () {
            debug('user %o glyphed good', player.name);
            self.glyphSuccess(player);
        });

        player.socket.removeAllListeners('user-mis-glyphed');
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
        self.setupGames();
    }, 3000);
};

Match.prototype.end = function() {

    // self.teams.white.addScore(Math.round(Math.random() * 10000));
    // self.teams.black.addScore(Math.round(Math.random() * 10000));

    debug('match %o is ending, winner is %o', this.id, this.winner());
    this.emit('match-end', {
        winner: this.teams[this.winner()].toJSON(),
        looser: this.teams[this.looser()].toJSON(),
    });
};

Match.prototype.winner = function() {
    return this.teams.white.getScore() > this.teams.black.getScore() ? 'white' : 'black';
};

Match.prototype.looser = function() {
    return this.winner() === 'white' ? 'black' : 'white';
};

Match.prototype.tappedScore = function(player, score) {
    var team  = this.findTeamOfPlayer(player);
    team.playerScored(player, score);
    //this.sendScores();
};

Match.prototype.glyphSuccess = function(player) {
    var team = this.findTeamOfPlayer(player);
    player.glyph += 1;
    console.log(player.name, "glyphed success")
    team.playerScored(player, 1500);
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
        scores[t.id] = byTeam;
        _.each(t.players, function (p) {
            byTeam.players[p.id] = {
                score: p.getScore(),
                glyph: p.glyph
            };
        });
        scores[t.id] = byTeam;
    });
    return scores;
};

Match.prototype.setupGames = function() {
    var self = this;
    if (this.round < 6) {
        _.each(this.teams, function (t) {
            var i = 0;
            for (var p in t.players) {
                if (self.solist == i) {
                    // console.log('solist', self.solist);
                    t.players[p].setGame('Runes');
                    // console.log('game-start: Rune', i);
                } else {
                    t.players[p].setGame('Runes');
                    // console.log('game-start: Tempo', i);
                }
                i++;
            }
        });
        self.solist = (self.solist + 1 ) % TEAM_SIZE;

        setTimeout(function () {
            self.setupGames();
        }, 5000);
        //}, 24000);

    } else {
        clearInterval(this.timer);
        self.end();
    }
    this.round++;
}
