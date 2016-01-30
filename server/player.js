'use strict';

var _       = require('lodash');
var shortid = require('shortid');

module.exports = Player;

function Player (io, id, socket) {

    this.id     = id;
    this.socket = socket;
    this.name   = 'unknown';
    this.score  = 0;
}

Player.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        score: this.score
    };
};

Player.prototype.setName = function(name) {
    this.name = name;
};

Player.prototype.addScore = function(increment) {
    this.score += increment;
    return this.score;
};

Player.prototype.getScore = function() {
    return this.score;
};
