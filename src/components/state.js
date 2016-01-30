define([
], function () {
    'use strict';

    function State(game) {
        this.team = null;
        this.game = game;
    }

    State.prototype = {
        constructor: State,
        setTeam: function (team) {
            this.team = team.name;
        },
        getTeam: function () {
            return this.team;
        }
    };
    
    return State;
});
