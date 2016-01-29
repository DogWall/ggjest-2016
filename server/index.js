'use strict';

var matchMaking = require('./match-making');

module.exports = function (app, io) {

    io.on('connection', function (socket) {
      console.log('client connecté via la websocket ' + socket.id);
      matchMaking.connection(io, socket);
    });

};
