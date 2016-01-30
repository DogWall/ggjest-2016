define([
    'phaser', 'controls/controls'
], function (Phaser, Controls) {
    'use strict';

    function Tempo(game) {
        this.bgColor = 0;
        this.tempo = 60;    // bpm
        this.lastTap = 0;
        this.score = 0;
    }

    Tempo.prototype = {
        constructor: Tempo,
        create: function () {

            this.setupBackground();
            this.setupForeground();
                       
            this.timer = this.game.time.create(this.game);
            this.timer.loop(Math.floor(60 / this.tempo * Phaser.Timer.SECOND), this.blink, this);
            this.timer.start();
            this.timer._last = this.timer._now;
            this.lastTap = this.timer._now;
            
            this.game.input.onDown.add(this.tapControl, this);
            this.scoreText = this.game.add.text(10, 10, '', {font: '32px slkscr', fill: '#fff'});
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
                this.resultText.fill = "#ff0";
                this.score += 2;
            }
            else if( latency < 100) {
                this.resultText.text = "Good ! " + latency;     
                this.resultText.fill = "#fff";
                this.score += 1;
            }
            else {
                this.resultText.text = "bad ! " + latency;
                this.resultText.fill = "#f00";
                this.score -= 1;
            }
            
            this.game.network.userTapped();
            this.scoreText.text = this.score;
            this.lastTap = this.timer._now;
        },
        
        blink: function () {
            this.bgColor = 255;
            if(this.lastTap < this.timer._last){
                this.resultText.text = "" ;    
            }
            this.timer._last = this.timer._now + 10;    // 10ms : Human latency
        },
        
        setupBackground: function () {
             this.game.stage.backgroundColor = "#000";
        },
        
        setupForeground: function () {
        },
        
        end: function () {
            // TODO : send score to server
            // this.game.network
        }
    };

    return Tempo;
});