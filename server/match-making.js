'use strict';

var Match = require('./match');

var matchs = {};

module.exports = {

  connection: function (io, socket) {

    findJoinableMatch(function (error, match) {
      match.join({ id:socket.id });
      socket.emit('has-joined-match', match);
    });

    // réagit quand un client a envoyé l'événement ping
    socket.on('ping', function () {

      socket.emit('has-ping', { user:socket.id });

      // avertit tous les autres clients que cette bière est bue
      socket.broadcast.emit('has-ping', { user:socket.id });

    });

    socket.emit('connection', { user:socket.id });
  }

};


function createMatch (callback) {
  var match = new Match();
  matchs[match.id] = match;
  callback(null, match);
}

function findJoinableMatch (callback) {
  callback(null, _.find(matchs, function (m) {
    return m.canBeJoined();
  }));
}