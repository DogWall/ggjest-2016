define([
    'phaser', 'controls/controls'
], function (Phaser, Controls) {
    'use strict';

    function Tempo(game) {
        this.bgColor = 0;
        this.tempo = 100;    // bpm
        this.timeSinceBlink = 0;
    }

    Tempo.prototype = {
        constructor: Tempo,
        create: function () {

            this.setupBackground();
            this.setupForeground();
                       
            this.timer = this.game.time.create(this.game);
            this.timer.loop(Math.floor(60 / this.tempo * 1000), this.blink, this);
            this.timer.start();
            
            this.game.input.onDown.add(this.tapControl, this);
           
            
        },
        update: function () {
            this.bgColor = Math.max(0, this.bgColor - 20);
            var hx = (this.bgColor).toString(16);
            hx = hx.length < 2 ? '0' + hx : hx;
            this.game.stage.backgroundColor = "#" + hx + hx + hx;
        },
        tapControl: function () {
            this.bgColor = 255;
        },
        blink: function () {
            this.bgColor = 255;
        },
        setupBackground: function () {
             this.game.stage.backgroundColor = "#000";
        },
        setupForeground: function () {
        },
        end: function () {
        }
    };

    return Tempo;
});