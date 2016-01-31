define([
], function () {
    'use strict';

    function State(game) {
        this.team = null;
        this.ombreScale = 0;
        this.glyphedScore = 0;
        this.myMonster = null;
        this.theOtherMonster = null;
        this.nbPlayers = 0;
        this.playerPosition = 0;
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
        getMonster: function (monster) {
            var monsters = ['licorne', 'dino', 'chouette'];
            return monsters[monster];
        }
    };
    
    return State;
});
