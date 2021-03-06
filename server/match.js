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

    this.io         = io;
    this.room       = '/match-' + this.id;
    this.running    = false;

    this.solist     = 0;
    this.round      = 0;
    this.startTimer = null;
    this.roundTimer = null;
    this.sync       = new Sync(this);

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
    var smallest = 10000000;
    _.each(this.teams, function (t) {
        if (t.size() < smallest) {
            smallest = t.size();
        }
    });
    console.log('max size :'+smallest)
    return smallest;
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
    return (!this.running) && (this.smallestTeam() < 3);
};

Match.prototype.join = function(player, team) {
    var self = this;

    team = (team && this.teams[team]) ? this.teams[team] : this.smallestTeamWithoutPlayer(player.id);
    var theOtherTeam = (team.name == 'white') ? 'black': 'white';
    var initTeam = team.name;
    console.log('team', initTeam);
    console.log('theOtherTeam', theOtherTeam);

    // Check latency (not usefull yet)
    setTimeout(function () {
        self.sync.latency();
    }, 3000);

    if (team) {
        team.players[player.id] = player;
        player.socket.join(this.room);

        var i = 0;
        var pos = 0;
        for (var p in team.players) {
            if (team.players[p] == player) {
                pos = i;
            }
            i++;
        }

        var event = {
            player: player.toJSON(),
            match: this.toJSON(),
            team: team.toJSON(),
            nbPlayers: TEAM_SIZE,
            playerPosition: pos,
            myMonster: team.getMonster(),
            theOtherMonster: this.teams[theOtherTeam].getMonster()
        };

        console.log('myMonster', team.getMonster());
        console.log('theOtherMonster', this.teams[theOtherTeam].getMonster());

        player.socket.emit('has-joined-match', event);
        player.socket.broadcast.emit('user-joined', event);

        debug('user %o has joined match %o (%o)', player.name, self.id, self.room);

        player.socket.on('user-tapped-score', function (score) {
            debug('user %o tapped a score of %o', player.name, score);
            self.tappedScore(player, score);
        });

        player.socket.on('user-good-glyphed', function () {
            debug('user %o glyphed good', player.name);
            self.glyphSuccess(player);
        });

        player.socket.on('user-mis-glyphed', function () {
            debug('user %o glyphed bad', player.name);
            self.glyphMiss(player);
        });

        player.socket.on('disconnect', function () {
            team.removePlayer(player);
            debug('user %o has left match %o (%o)', player.name, self.id, self.room);
        });

        self.reloadStartTimer();
    }

    return team;
};

Match.prototype.reloadStartTimer = function() {
    clearTimeout(this.startTimer);
    this.startTimer = setTimeout(this.startIfPossible.bind(this), 20 * 1000);
};

Match.prototype.startIfPossible = function() {
    if (this.size() > 1) {
        this.start();
    }
};

Match.prototype.isReady = function() {
    return _.every(this.teams, function (t) {
        return t.size() >= TEAM_SIZE;
    })
};

Match.prototype.size = function() {
    return _.sum(_.invokeMap(this.teams, 'size'));
};

Match.prototype.start = function() {
    var self = this;
    debug('match %o is starting', this.id);
    this.running = true;
    this.emit('start-countdown', 3);

    setTimeout(function () {
        self.setupGames();
    }, 3500);
};

Match.prototype.end = function() {
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
    this.findTeamOfPlayer(player).tapSuccess(player, score, this.round);
    // this.sendScores();
};

Match.prototype.glyphSuccess = function(player) {
    this.emit('glyphed-score', {
        score: this.findTeamOfPlayer(player).glyphSuccess(player)
    });
    this.sendScores();
};

Match.prototype.glyphMiss = function(player) {
    this.emit('glyphed-score', {
        score: this.findTeamOfPlayer(player).glyphMiss(player)
    });
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
    // console.log('setupGames');
    // console.log('round:', this.round);


    if (this.round < 6) {
        _.each(this.teams, function (t) {
            console.log('solist', self.solist);

            var lastTapAccuracy = self.round ? t.getTapAccuracyForRound(self.round - 1) : 3;

            var i = 0;
            for (var p in t.players) {
                t.players[p].socket.emit('update-solist', {solist: self.solist});
                if (self.solist == i) {
                    t.players[p].setGame('Runes', {
                        lastTapAccuracy: lastTapAccuracy,
                        mates: t.size()
                    });
                    // console.log('game-start: Rune', i);
                } else {
                    t.players[p].setGame('Tempo', {
                        lastTapAccuracy: lastTapAccuracy,
                        mates: t.size()
                    });
                    // console.log('game-start: Tempo', i);
                }
                i++;
            }
        });
        self.solist = (self.solist + 1 ) % TEAM_SIZE;

        setTimeout(function () {
            self.setupGames();
        }, process.env.CYCLE_TIME || 24000 );

    } else {
         _.each(this.teams, function (t) {
            _.each(t.players, function (p) {
                p.clearGame();
            });
        });
        clearInterval(this.roundTimer);
        self.end();
    }
    this.round++;
}
