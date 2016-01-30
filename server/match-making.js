'use strict';

var _     = require('lodash');
var debug = require('debug')('ocult:matchmaking')

var Match = require('./match');

var matchs = {};

module.exports = function (io) {

  createMatch(io, { name: 'Test' }, function (error, match) {
    debug('created a first match');
  });

  return  {

    connection: function (socket) {

      var user = { id:socket.id, socket:socket };

      socket.on('search-matchs', function (clientUser) {
        if (! clientUser) return;

        user.name = clientUser.name;

        debug('find an open match for %o', user.name);

        findJoinableMatch(function (error, match) {
          if (error || ! match) {
            console.error('No matchs available :(');
            return;
          }

          debug('found an open match for %o : %o', user.name, match.id);

          joinUserToMatch(user, match, function (error) {
            if (match.isReady()) {
              match.start();
            }
          });
        });
      });

      socket.emit('connection', { user:socket.id });
    }
  };



  function createMatch (io, options, callback) {
    var match = new Match(io, options);
    matchs[match.id] = match;
    callback(null, match);
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

  function joinUserToMatch (user, match, callback) {
    match.join(user);
    callback(null);
  }

};

