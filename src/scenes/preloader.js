define([
    'phaser', 'components/state', 'components/network', 'components/lyrics'
], function (Phaser, State, Network, Lyrics) {
    'use strict';

    function Preloader(game) {
        this.background = null;
        this.preloadBar = null;
        this.ready = false;
        this.game = game;

        this.images = [
            ['dot', 'assets/images/dot.png'],
            ['logo', 'assets/images/logo.png'],
            ['lobby', 'assets/images/fond-choix.png'],
            ['home', 'assets/images/fond-start.png'],
            ['join', 'assets/images/start-button-only.png'],
            ['empty-banner', 'assets/images/empty-banner.png'],
            ['start-white', 'assets/images/start-white.png'],
            ['start-black', 'assets/images/start-black.png'],
            ['hide-white', 'assets/images/hide-white.png'],
            ['hide-black', 'assets/images/hide-black.png'],
            ['tap', 'assets/images/tap.png'],
            ['zone-jeu-black', 'assets/images/zone-jeu-black.png'],
            ['zone-jeu-white', 'assets/images/zone-jeu-white.png'],
            ['points', 'assets/images/points.png'],
            ['fond-jeu-black', 'assets/images/fond-jeu-black.png'],
            ['fond-jeu-white', 'assets/images/fond-jeu-white.png'],
            ['ombre-licorne-black', 'assets/images/ombre-licorne-black.png'],
            ['ombre-licorne-white', 'assets/images/ombre-licorne-white.png'],
            ['ombre-dino-black', 'assets/images/ombre-dino-black.png'],
            ['ombre-dino-white', 'assets/images/ombre-dino-white.png'],
            ['ombre-chouette-black', 'assets/images/ombre-chouette-black.png'],
            ['ombre-chouette-white', 'assets/images/ombre-chouette-white.png'],
            ['halo-black', 'assets/images/halo-black.png'],
            ['halo-white', 'assets/images/halo-white.png'],
            ['moine-black', 'assets/images/moine-black.png'],
            ['moine-white', 'assets/images/moine-white.png'],
            ['win-white', 'assets/images/WINNER-whitemagic.png'],
            ['win-black', 'assets/images/WINNER-blackmagic.png'],
            ['vs-bg-white', 'assets/images/vs-fond-white.png'],
            ['vs-bg-black', 'assets/images/vs-fondblack.png'],
            ['vs-white-licorne-bad', 'assets/images/VS-licorne-white-null.png'],
            ['vs-white-licorne-good', 'assets/images/VS-licorne-white-ok.png'],
            ['vs-black-licorne-bad', 'assets/images/VS-licorne-black-null.png'],
            ['vs-black-licorne-good', 'assets/images/VS-licorne-black-ok.png'],
            ['vs-white-dino-bad', 'assets/images/VS-dino-white-null.png'],
            ['vs-white-dino-good', 'assets/images/VS-dino-white-ok.png'],
            ['vs-black-dino-bad', 'assets/images/VS-dino-black-null.png'],
            ['vs-black-dino-good', 'assets/images/VS-dino-black-ok.png'],
            ['vs-white-chouette-bad', 'assets/images/VS-chouette-white-null.png'],
            ['vs-white-chouette-good', 'assets/images/VS-chouette-white-ok.png'],
            ['vs-black-chouette-bad', 'assets/images/VS-chouette-black-null.png'],
            ['vs-black-chouette-good', 'assets/images/VS-chouette-black-ok.png']
        ];

        this.sprites = [
//            ['bbq', 'assets/images/bbq-sprites.png', 90, 130, 6],
        ];

        this.scripts = [
        ];

        this.json = [
            ['glyphs', 'assets/data/glyph.json'],
            ['lyrics', 'assets/data/lyrics.json'],
            ['names', 'assets/data/names.json']
        ];

        this.audio = [
            ['main-soundtrack', 'assets/sounds/OCult_Main.mp3']
//            ['clic', 'assets/sounds/clic_menu_1.wav'],
//            ['cri_wilhelm', 'assets/sounds/cri_wilhelm.wav'],
//            ['cri_saucisse', 'assets/sounds/cri_2.wav'],
//            ['cri_saucisse_sol', 'assets/sounds/cri_3.wav'],
        ];
    }

    Preloader.prototype = {
        constructor: Preloader,
        preload: function () {
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            var logo = this.game.add.sprite(0, 10, 'preload-logo');
            logo.scale.setTo(0.5, 0.5);

            this.preloadBar = this.game.add.sprite(0, this.game.world.centerY, 'preload-bar');
            this.preloadBar.anchor.setTo(0, 0.5);
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            this.load.setPreloadSprite(this.preloadBar);

            this.game.load.binary('woff', 'assets/font/comicrunes.woff');

            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            for(var key in this.images) {
                this.game.load.image(this.images[key][0], this.images[key][1]);
            }

            for(var key in this.json) {
                this.game.load.json(this.json[key][0], this.json[key][1]);
            }

            for(var key in this.sprites) {
                this.game.load.spritesheet(this.sprites[key][0], this.sprites[key][1], this.sprites[key][2], this.sprites[key][3], this.sprites[key][4]);
            }

            for(var key in this.scripts) {
                this.game.load.script(this.scripts[key][0], this.scripts[key][1], this.scripts[key][2], this.scripts[key][3], this.sprites[key][4]);
            }

            for(var key in this.audio) {
                this.game.load.audio(this.audio[key][0], this.audio[key][1], this.audio[key][2], this.audio[key][3], this.audio[key][4]);
            }

        },
        create: function () {
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            
            this.preloadBar.cropEnabled = false;
            

            // Initialize network, search games once connected
            this.game.game_state = new State(this.game);
            this.game.network = new Network(this.game);
            this.game.lyrics  = new Lyrics(this.game);

        },
        update: function () {
            if (this.cache.isSoundDecoded('main-soundtrack') && this.ready == false) {
                this.ready = true;
                this.game.network.reconnect();
            }

        }
    };

    return Preloader;
});
