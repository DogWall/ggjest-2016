define([
], function () {
    'use strict';

    function State(game) {
        this.team = null;
        this.ombreScale = 0;
        this.glyphedScore = 0;
        this.game = game;
    }

    State.prototype = {
        constructor: State,
        setTeam: function (team) {
            this.team = team;
        },
        getTeam: function () {
            return this.team;
        }
    };
    
    return State;
});
