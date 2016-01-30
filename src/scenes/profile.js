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

            var self = this, userName;

            if (userName = this.savedUserName()) {

                // show a loader here

                return setTimeout(function () {
                    self.onConfirm(userName);
                }, 500);
            }

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
            field.style.position     = 'absolute';
            field.style.top          = 300;
            field.style.left         = 22;
            field.style.width        = 276;
            field.style.border       = 'none';
            field.style.outlineWidth = 0;
            field.style.fontSize     = '2em';
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

            this.body = document.getElementsByTagName('body')[0];

            this.body.appendChild(this.field);
        },

        hideForm: function () {
            if (this.field) {
                this.body.removeChild(this.field);
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