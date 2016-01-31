var express      = require('express');
var compression  = require('compression');
var cacheControl = require('./server/cache-control');

var app     = express();
var server  = require('http').Server(app);

app.use(compression());
app.use(express.static('./', { setHeaders: cacheControl }));

// lance le serveur web
// écoute les connexions de type http
server.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://'+host+':'+port);
});

// écoute les connexions de type websocket
var io = require('socket.io')(server);

// exit on CTRL+C
exitOnSignal('SIGINT');
exitOnSignal('SIGTERM');
function exitOnSignal(signal) {
  process.on(signal, function() {
    console.log('Caught ' + signal + ', exiting');
    process.exit(1);
  });
}

var game = require('./server')(app, io);
