'use strict';

module.exports = {

  connection: function (io, socket) {
    // réagit quand un client a envoyé l'événement ping
    socket.on('ping', function () {

      socket.emit('has-ping', { user:socket.id });

      // avertit tous les autres clients que cette bière est bue
      socket.broadcast.emit('has-ping', { user:socket.id });

    });

    socket.emit('connection', { user:socket.id });
  }

};
