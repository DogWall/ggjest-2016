define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Profile(game) {
        this.body  = null;
        this.field = null;
    }

    Profile.prototype = {
        constructor: Profile,
        create: function () {
            var bg = this.game.add.sprite(0, 0, 'home');
            bg.scale.setTo(0.5, 0.5);
            this.showForm();

            this.game.game_state.playMusic('home-soundtrack');
        },

        update: function () {
        },

        showForm: function () {

            var self = this;

            // this.panel = document.createElement('div');

            var totalHeight = this.game.canvas.height;
            var totalWidth  = this.game.canvas.width;

            var field = this.field   = document.createElement('input');
            field.type               = 'text';
            field.value              = this.savedUserName() || this.game.lyrics.fullname();
            field.style.textAlign    = 'center';
            field.style.position     = 'relative';
            field.style.top          = -262;
            field.style.left         = '50%';
            field.style.width        = 276;
            field.style.padding      = 5;
            field.style.marginLeft   = -138;
            field.style.border       = 'none';
            field.style.borderRadius = 5;
            field.style.outlineWidth = 0;
            field.style.font     = '32px comicrunes';
            field.addEventListener('keypressed', function (e) {
                if (e.keyCode === 13) {
                    self.onConfirm(field.value);
                }
            });

            var btn = this.game.add.sprite(0, 450, 'join');
            btn.scale.setTo(0.5, 0.5);
            btn.inputEnabled = true;
            btn.events.onInputDown.add(function (e) {
                self.onConfirm(field.value);
            }, this);

            var fsText = this.game.add.text(this.game.width/2, 535, 'fullscreen', {font: '16px comicrunes', fill: '#fff'});
            fsText.anchor.setTo(0.5, 0.5);
            fsText.inputEnabled = true;
            
            self.game.scale.onFullScreenChange.add( function() {
                var canvas = document.getElementsByTagName('canvas');
                canvas[0].parentNode.appendChild(self.field);
                self.field.style.marginTop = canvas[0].style.marginTop;
            });
            
            fsText.events.onInputDown.add(function (e) {
                self.scale.startFullScreen(false);
            }, this);

            this.container = document.getElementById(this.game.parent);

            this.container.appendChild(this.field);
        },

        hideForm: function () {
            if (this.field) {
                this.field.style.display = 'none';
                try {
                    this.container.removeChild(this.field);
                } catch (e) { }
            }
        },

        savedUserName: function () {
            if (localStorage) {
                return localStorage.getItem('userName');
            }
            return null;
        },

        onConfirm: function (userName) {
            userName = userName || this.game.lyrics.fullname();
            if (localStorage) {
                localStorage.setItem('userName', userName);
            }
            this.game.network.register(userName);
            this.hideForm();
        }
    };

    return Profile;
});