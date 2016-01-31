define([
], function () {
    'use strict';

    function State(game) {
        this.team = null;
        this.teams = null;
        this.ombreScale = 0;
        this.glyphedScore = 0;
        this.myMonster = null;
        this.theOtherMonster = null;
        this.nbPlayers = 0;
        this.playerPosition = 0;
        this.currentMusic = null;
        this.solistPosition = 0;
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
        setTeams: function (teams) {
            this.teams = teams;
        },
        getTeams: function () {
            return this.teams;
        },
        getMonster: function (monster) {
            var monsters = ['licorne', 'dino', 'chouette'];
            return monsters[monster];
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
                this.game.music.volume = 0.75;
            }
        }
    };

    return State;
});
