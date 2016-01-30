define([
    'phaser', 'sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Status(game) {
        this.sprites = null;
        this.game = game;

        this.ombreScale = 0.25;
        this.ombre = null;
        this.playerPosition = game.playerPosition;
        this.nbPlayers = game.nbPlayers;
        this.solistPosition = game.solistPosition;

        var team = game.game_state.team;
        var bg = 'fond-jeu-'+team;

        Phaser.Sprite.call(this, game, 0, 0, bg);
        this.scale.setTo(0.5, 0.5);
        game.add.existing(this);

        this.constructStatus();
        game.add.existing(this.sprites);
    }

    Status.prototype = Object.create(Phaser.Sprite.prototype);
    Status.prototype.constructor = Status;
    Status.prototype.constructStatus = function () {
        this.sprites = this.game.add.group();
        var team = this.game.game_state.team;

        var scale = this.ombreScale;
        var shiftx = Math.ceil((640 - 459 * scale) /4);
        console.log(shiftx);

        this.ombre = new Phaser.Sprite(this.game, shiftx, 1136 / 4 * (1 - scale), 'ombre-licorne-'+team);
        this.ombre.scale.setTo(scale * 0.5, scale * 0.5);
        this.sprites.add(this.ombre);
                    //var window = new Window(this.game, 97 + j * 60, 200 + i * 60, wType[i][j]);
                    //this.sprites.add(window);

        var step = 640/2/this.nbPlayers;

        // gestion du halo
        var halo = new Phaser.Sprite(this.game, step *this.solistPosition + step/2, 1136/4, 'halo-'+team);
        halo.anchor.x = 0.5;
        halo.anchor.y = 0.8;
        halo.scale.setTo(0.5);
        this.sprites.add(halo);

        // gestion des moines
        for (var i=0; i<this.nbPlayers; i++) {

            var dauphin = new Phaser.Sprite(this.game, step *i + step/2, 1136/4, 'moine-'+team);
            dauphin.anchor.x = 0.5;
            dauphin.anchor.y = 0.7;
            if (this.playerPosition == i) {
                dauphin.scale.setTo(0.5);
            } else {
                dauphin.scale.setTo(0.3);
            }

            this.sprites.add(dauphin);
        }


    }

    Status.prototype.updateOmbreScale = function(newScale) {
        this.ombreScale = newScale;

    }


    Status.prototype.update = function () {
    };

    return Status;
});
