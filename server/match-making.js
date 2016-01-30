'use strict';

var _      = require('lodash');
var debug  = require('debug')('ocult:matchmaking')

var Match  = require('./match');
var Player = require('./player');

var matchs   = {};
var players  = {};

module.exports = function (io) {

  createMatch(io, { name: 'Test' }, function (error, match) {
    debug('created a first match');
  });

  return  {

    stats: function () {
      var stats = [
        _.size(matchs) + ' matchs',
        _.size(players) + ' players',
        ''
      ];
      _.each(matchs, function (m) {
        stats.push('<h1>Match ' + m.id + ' (' + (m.running?'running':'in lobby') + ')</h1>' + m.scoreboard());
      })
      return stats;
    },

    connection: function (socket) {

      var player = new Player(io, socket);
      players[player.id] = player;

      socket.removeAllListeners('search-matchs').on('search-matchs', function (request) {
        if (! request) return;
        player.setName(request.name);

        findMatch(player, request.prefered, function (error, match, preferedTeam) {
          if (error || ! match) {
            console.error('No matchs available :(');
            return;
          }

          debug('found an open match for %o : %o', player.name, match.id);
          match.join(player, preferedTeam);
        });
      });

      socket.removeAllListeners('disconnect').on('disconnect', function () {
          delete players[player.id];
          debug('player %o left', player.id);
      });

      socket.emit('connection', { user:socket.id });
    }
  };


  function createMatch (io, options, callback) {
    var match = new Match(io, options);
    matchs[match.id] = match;
    callback(null, match);
  }

  function findMatch (player, prefered, callback) {
    if (prefered && prefered.length) {
      prefered = prefered.split('-');
      prefered = {
        match: prefered[0],
        team:  prefered[1],
      };
      debug('player %o ask to join game %o on team %o', player.name, prefered.match, prefered.team);
      var match = matchs[prefered];
      if (match && match.canBeJoined()) {
        debug('honor request to join game %o', match.id);
        return callback(null, match, prefered.team);
      } else {
        debug('cannot honor request to join game %o (match is closed or deleted)', prefered);
      }
    }
    debug('find an open match for %o', player.name);
    findJoinableMatch(callback);
  }

  function findJoinableMatch (callback) {
    var match = _.find(matchs, function (m) {
      return m.canBeJoined();
    });
    if (! match) {
      console.error('No matchs available :(');
      createMatch(io, { name:'Other match' }, function (error, match) {
        callback(null, match);
      });
    } else {
      callback(null, match);
    }

  }

};

