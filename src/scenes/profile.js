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
            field.value              = this.savedUserName();
            field.style.textAlign    = 'center';
            field.style.position     = 'absolute';
            field.style.top          = 307;
            field.style.left         = '50%';
            field.style.width        = 276;
            field.style.marginLeft   = -138;
            field.style.border       = 'none';
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
            fsText.events.onInputDown.add(function (e) {
                self.scale.startFullScreen(false);
            }, this);

            this.container = document.getElementById(this.game.parent);

            this.container.appendChild(this.field);
        },

        hideForm: function () {
            if (this.field /*&& this.field.parentNode === this.body*/) {
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