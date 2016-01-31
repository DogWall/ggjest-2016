define([
], function () {
    'use strict';

    function State(game) {
        this.team = null;
        this.ombreScale = 0;
        this.glyphedScore = 0;
        this.monster = null;
        this.nbPlayers = 0;
        this.playerPosition = 0;
        this.currentMusic = null;
        this.game = game;
    }

    State.prototype = {
        constructor: State,
        setTeam: function (team) {
            this.team = team;
        },
        getTeam: function () {
            return this.team;
        },
        getMonster: function () {
            var monsters = ['licorne', 'dino', 'chouette'];
            return monsters[this.monster];
        },
        playMusic: function (music, loop) {
            loop = typeof loop !== 'undefined' ? loop : true;
            if(this.currentMusic != music) {
                this.currentMusic = music;
                if(this.game.music) {
                    this.game.music.stop();
                }
                this.game.music = this.game.add.audio(music);
                
                this.game.music.loop = loop;
                this.game.music.play();
                this.game.music.volume = 1.0;
            }
        }
    };
    
    return State;
});
