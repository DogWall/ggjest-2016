'use strict';

module.exports = function (app, io) {

    var matchMaking = require('./match-making')(io);

    io.on('connection', function (socket) {
      console.log('client connecté via la websocket ' + socket.id);
      matchMaking.connection(socket);
    });

    var stats = require('./stats')(app, io, matchMaking);
};
