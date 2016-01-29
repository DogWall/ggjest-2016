'use strict';

var _     = require('lodash');
var debug = require('debug')('ocult:matchmaking')

var Match = require('./match');

var matchs = {};

module.exports = {

  boot: function (io) {
    createMatch(io, { name: 'Test' }, function (error, match) {
      debug('created a first match');
    });
  },

  connection: function (io, socket) {

    var user = { id:socket.id, socket:socket };

    socket.on('search-matchs', function () {
      debug('find an open match for %o', user.id);

      findJoinableMatch(function (error, match) {
        debug('found an open match for %o : %o', user.id, match.id);

        joinUserToMatch(user, match, function (error) {

          if (match.isReady()) {
            match.startLobby();
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
  callback(null, _.find(matchs, function (m) {
    return m.canBeJoined();
  }));
}

function joinUserToMatch (user, match, callback) {
  match.join(user);
  callback(null);
}
