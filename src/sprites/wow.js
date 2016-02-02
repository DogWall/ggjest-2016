define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Wow(game, x, y, text, style, moves) {
        moves = typeof moves === 'undefined' ? true : moves;
        Phaser.Text.call(this, game, x, y, text, style);
        if(moves) {
            this.angle += game.rnd.integerInRange(-50, 50);
        }
        this.disappear(moves);
    }

    Wow.prototype = Object.create(Phaser.Text.prototype);
    Wow.prototype.constructor = Wow;
    Wow.prototype.disappear = function(moves) {
        if(moves) {
            this.game.add.tween(this).to( {alpha: 0}, 1500, "Quart.easeIn", true);
            this.game.add.tween(this).to( {y: this.y - 100}, 600, "Quart.easeOut", true);
        }
        else {
            this.game.add.tween(this).to( {alpha: 0}, 500, "Cubic.easeIn", true);
        }
        this.game.time.events.add(Phaser.Timer.SECOND * 4, this.kill, this);
    }

    return Wow;
});
