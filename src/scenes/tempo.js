define([
    'phaser', 'controls/controls'
], function (Phaser, Controls) {
    'use strict';

    function Tempo(game) {
        this.bgColor = 0;
        this.tempo = 80;    // bpm
    }

    Tempo.prototype = {
        constructor: Tempo,
        create: function () {

            this.setupBackground();
            this.setupForeground();
                       
            this.timer = this.game.time.create(this.game);
            this.timer.loop(Math.floor(60 / this.tempo * 1000), this.blink, this);
            this.timer.start();
            this.timer._last = this.timer._now;
            
            this.game.input.onDown.add(this.tapControl, this);
            this.resultText = this.game.add.text(10, this.game.height - 46, '', {font: '32px slkscr', fill: '#fff'});
        },
        
        update: function () {
            this.bgColor = Math.max(0, this.bgColor - 20);
            var hx = (this.bgColor).toString(16);
            hx = hx.length < 2 ? '0' + hx : hx;
            this.game.stage.backgroundColor = "#" + hx + hx + hx;
        },
        
        tapControl: function () {
            var latency = Math.min(Math.abs(this.timer._now - this.timer._last), Math.abs(this.timer._now - this.timer.next) );
            
            if( latency < 30) {
                this.resultText.text = "PERFECT ! " + latency;
            }
            else if( latency < 100) {
                this.resultText.text = "Good ! " + latency;            
            }
            else {
                this.resultText.text = "bad ! " + latency;    
            }
        },
        blink: function () {
            this.bgColor = 255;
            this.timer._last = this.timer._now;
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