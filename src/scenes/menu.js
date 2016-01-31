define([
    'phaser'
], function (Phaser) {
    'use strict';

    function Menu(game) {
        this.music = null;
        this.clic = null;
        this.playButton = null;
    }

    Menu.prototype = {
        constructor: Menu,
        create: function () {
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.

            // background
            this.imgCredits = this.add.button(0, 0, 'bouton-credit', this.startCredit, this, 0, 0, 1);
            this.imgCredits.scale.setTo(0.5, 0.5);

            this.imgCredits = this.add.button(0, 454/2, 'bouton-titre', this.startGame, this, 0, 0, 1);
            this.imgCredits.scale.setTo(0.5, 0.5);

            this.imgCredits = this.add.button(0, 454/2 + 228/2, 'bouton-play', this.startGame, this, 0, 0, 1);
            this.imgCredits.scale.setTo(0.5, 0.5);



        },
        startGame: function (pointer) {
            //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
            //this.music.stop();
            //this.clic.play();

            //	And start the actual game
            this.state.start('Profile');

        },
        startCredit: function () {
            //	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
            //this.music.stop();
            //this.clic.play();

            //	And start the actual game
            this.state.start('Credit');

        }
    };

    return Menu;
});