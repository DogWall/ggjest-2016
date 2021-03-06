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
            ['ombre-belier-black', 'assets/images/ombre-belier-black.png'],
            ['ombre-belier-white', 'assets/images/ombre-belier-white.png'],
            ['tap-bleu', 'assets/images/tap-bleu.png'],
            ['tap-rouge', 'assets/images/tap-rouge.png'],
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
            ['vs-black-chouette-good', 'assets/images/VS-chouette-black-ok.png'],
            ['vs-white-belier-bad', 'assets/images/VS-belier-white-null.png'],
            ['vs-white-belier-good', 'assets/images/VS-belier-white-ok.png'],
            ['vs-black-belier-bad', 'assets/images/VS-belier-black-null.png'],
            ['vs-black-belier-good', 'assets/images/VS-belier-black-ok.png'],
            ['credit-img', 'assets/images/credits.png'],
            ['bouton-credit', 'assets/images/bouton-credit.png'],
            ['bouton-play', 'assets/images/bouton-play.png'],
            ['bouton-titre', 'assets/images/bouton-titre.png'],
            ['bouton-fullscreen', 'assets/images/bouton-fullscreen.png']
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
            ['main-soundtrack', 'assets/sounds/OCult_Main_Master.mp3'],
            ['home-soundtrack', 'assets/sounds/OCult_Acceuil_Master.mp3'],
            ['sfx-bougie-ok', 'assets/sounds/SFX_Bougie_Reussie.mp3'],
            ['sfx-bougie-fail', 'assets/sounds/SFX_Bougie_Ratee.mp3'],
            ['sfx-white', 'assets/sounds/SFX_Camp_White.mp3'],
            ['sfx-black', 'assets/sounds/SFX_Camp_Black.mp3'],
            ['sfx-lose', 'assets/sounds/SFX_Defaite.mp3'],
            ['sfx-win', 'assets/sounds/SFX_Victoire.mp3'],
            ['sfx-halo', 'assets/sounds/SFX_Hallo.mp3'],
            ['sfx-monster', 'assets/sounds/SFX_Monstre_Croissance.mp3'],
            ['sfx-rune-fail', 'assets/sounds/SFX_Rune_Ratee.mp3'],
            ['sfx-rune-ok', 'assets/sounds/SFX_Rune_Reussie.mp3']
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
            if (this.cache.isSoundDecoded('home-soundtrack') && this.ready == false) {
                this.ready = true;
                this.game.game_state.playMusic('home-soundtrack');
                this.game.network.reconnect();
            }

        }
    };

    return Preloader;
});
