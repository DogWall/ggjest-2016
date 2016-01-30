'use strict';

var _       = require('lodash');
var debug   = require('debug')('ocult:matchmaking')

module.exports = Sync;

function Sync (match) {
    this.match = match;
};

Sync.prototype.latency = function() {
    this.emitForAll('latency', Date.now(), function(startTime) {
        var latency = Date.now() - startTime;
        console.log('Latency: ' + latency);
    });
};

Sync.prototype.gotoScene = function(sceneName) {
    this.emitForAll('goto', sceneName);
};

Sync.prototype.emitForAll = function(event, data, callback) {
    _.each(this.match.teams, function (t) {
        _.each(t.players, function (p) {
            p.socket.emit(event,data, callback);
        });
    });
};