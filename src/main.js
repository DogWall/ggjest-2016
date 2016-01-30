(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src/",
        paths: {
            //  Edit the below path to point to where-ever you have placed the phaser.min.js file
            phaser: '../node_modules/phaser/dist/phaser.min',
            blather: '../node_modules/blather/blather-browser'
        },
        shim: {
            phaser: {
                exports: 'Phaser'
            },
            blather: {
                exports: 'Blather'
            }
        }
    });

    require(['phaser', 'scenes/game', 'scenes/boot', 'scenes/preloader', 'scenes/menu', 'scenes/credit', 'scenes/runes', 'scenes/lobby', 'scenes/profile'], function (Phaser, Game, Boot, Preloader, Menu, Credit, Runes, Lobby, Profile) {
        var SAFE_ZONE_WIDTH = 640;
        var SAFE_ZONE_HEIGHT = 1136;
        var game = new Phaser.Game(SAFE_ZONE_WIDTH / 2, SAFE_ZONE_HEIGHT / 2, Phaser.AUTO, 'game_div');
        game.state.add('Boot', Boot, true);
        game.state.add('Preloader', Preloader, true);
        game.state.add('Runes', Runes, false);
        game.state.add('Lobby', Lobby, false);
        game.state.add('Profile', Profile, false);
        /*
        game.state.add('Preloader', Preloader, false);
        game.state.add('Menu', Menu, false);
        game.state.add('Credit', Credit, false);
        game.state.add('Game', Game, false);
        */
    });
}());
