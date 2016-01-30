define([
    'phaser', 'sprites/wow'
], function (Phaser, Wow) {
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
            this.setupLocalBackground();
            this.setupForeground();
                       
            this.timer = this.game.time.create(this.game);
            this.timer.loop(Math.floor(60 / this.tempo * Phaser.Timer.SECOND), this.blink, this);
            this.timer.start();
            this.timer._last = this.timer._now;
            this.lastTap = this.timer._now;
            
            this.game.input.onDown.add(this.tapControl, this);
//            this.scoreText = this.game.add.text(10, 10, '', {font: '32px comicrunes', fill: '#fff'});
//            this.resultText = this.game.add.text(10, this.game.height - 46, '', {font: '32px comicrunes', fill: '#fff'});
        },
        
        update: function () {
            this.bgColor = Math.max(0, this.bgColor - 20);
            var hx = (this.bgColor).toString(16);
            hx = hx.length < 2 ? '0' + hx : hx;
            this.game.stage.backgroundColor = "#" + hx + hx + hx;
        },
        
        tapControl: function () {
            var latency = Math.min(Math.abs(this.timer._now - this.timer._last), Math.abs(this.timer._now - this.timer.next) );
            var color;
            var text;
            if( latency < 30) {
                text = "PERFECT !";
                color = "#ff0";
                this.score += 100;
            }
            else if( latency < 60) {
                text = "Good !";
                color = "#fff";
                this.score += 100;
            }
            else if( latency < 100) {
                text = "Ok";
                color = "#fff";
                this.score += 100;
            }
            else {
                text = "Bad";
                color = "#f66";
                this.score -= 50;
                
            }
            
            var wow = new Wow(this.game, this.game.rnd.integerInRange(50, this.game.width - 100), this.game.input.y , text, {font: '32px comicrunes', fill: color, align: 'center'});
            this.texts.add(wow);
            
//            this.scoreText.text = this.score;
            this.lastTap = this.timer._now;
        },
        
        blink: function () {
            this.tap.alpha = 1;
            this.game.add.tween(this.tap).to({alpha: 0}, 1000, "Quart.easeOut", true);
            
            this.bgColor = 255;
//            if(this.lastTap < this.timer._last){
//                this.resultText.text = "" ;    
//            }
            this.timer._last = this.timer._now + 10;    // 10ms : Human latency
        },
        
        
        
        setupBackground: function () {
        },
        
        setupLocalBackground: function () {
            switch(this.game.game_state.getTeam()) {
                case 'white':             
                    var zone =  this.game.add.sprite(0, 0, 'zone-jeu-white');
                    zone.scale.setTo(0.5, 0.5);
                    break;
                case 'black':             
                    var zone =  this.game.add.sprite(0, 0, 'zone-jeu-black');
                    zone.scale.setTo(0.5, 0.5);
                    break;
            }
        },
        
        setupForeground: function () {
            this.tap =  this.game.add.sprite(0, 0, 'tap');
            this.tap.scale.setTo(0.5, 0.5);
            this.tap.alpha = 0;
            
            this.texts = this.game.add.group();
        },
        
        shutdown: function () {
            console.log('Sending score ' + this.score)
            this.game.network.userSendTappedScore(this.score);
        }
    };

    return Tempo;
});