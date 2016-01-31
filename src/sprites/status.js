define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Status(game) {
        this.sprites = null;
        this.game = game;


        this.ombre = null;
        this.playerPosition = game.game_state.playerPosition;
        this.nbPlayers = game.game_state.nbPlayers;
        this.solistPosition = game.game_state.solistPosition;
        this.monster = game.game_state.getMonster(game.game_state.myMonster);
        this.monsterSound = this.game.add.audio('sfx-monster');

        var team = game.game_state.getTeam();
        this.ombreScale = 0.25 + 0.25/6 * game.game_state.glyphedScore;
        var bg = 'fond-jeu-'+team.name;

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
        var team = this.game.game_state.getTeam();

        var scale = this.game.game_state.ombreScale ? this.game.game_state.ombreScale : this.ombreScale;

        
        this.ombre = new Phaser.Sprite(this.game, this.game.width /2, this.game.height / 2, 'ombre-' + this.monster + '-' + team.name);
        this.ombre.scale.setTo(scale * 0.5, scale * 0.5);
        this.ombre.anchor.setTo(0.5, 0.8);
        this.sprites.add(this.ombre);
        
        if(this.ombreScale != scale) {
            this.game.add.tween(this.ombre.scale).to({x: this.ombreScale * 0.5, y: this.ombreScale * 0.5}, 1000, "Cubic.easeInOut", true);
            this.monsterSound.play();
        }
        this.game.game_state.ombreScale = this.ombreScale;
        
        var step = 640/2/this.nbPlayers;

        // gestion du halo
        var halo = new Phaser.Sprite(this.game, step *this.solistPosition + step/2, 1136/4, 'halo-'+team.name);
        halo.anchor.x = 0.5;
        halo.anchor.y = 0.8;
        halo.scale.setTo(0.5);
        this.sprites.add(halo);

        // gestion des moines
        for (var i=0; i<this.nbPlayers; i++) {

            var dauphin = new Phaser.Sprite(this.game, step *i + step/2, 1136/4, 'moine-'+team.name);
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
        // Fix me : not used ?
        this.ombreScale = newScale;
    }

    Status.prototype.update = function () {
    };

    return Status;
});
