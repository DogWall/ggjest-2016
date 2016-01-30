define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Wow(game, x, y, text, style) {
        
        Phaser.Text.call(this, game, x, y, text, style);
        this.angle += game.rnd.integerInRange(-50, 50);
        this.disappear();
    }

    Wow.prototype = Object.create(Phaser.Text.prototype);
    Wow.prototype.constructor = Wow;
    Wow.prototype.disappear = function() {
        this.game.add.tween(this).to( {alpha: 0}, 1500, "Quart.easeIn", true);
        this.game.add.tween(this).to( {y: this.y - 100}, 600, "Quart.easeOut", true);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, this.kill, this);
    }

    return Wow;
});
