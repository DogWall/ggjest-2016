define([
    'phaser','sprites/window'
], function (Phaser, Window) {
    'use strict';

    function Profile(game) {
        this.body  = null;
        this.panel = null;
    }

    Profile.prototype = {
        constructor: Profile,
        create: function () {
            this.game.stage.backgroundColor = 0x5d5d5d;

            var self = this, userName;

            console.log( this.game.lyrics.sentence() );

            if (userName = this.savedUserName()) {

                // show a loader here

                return setTimeout(function () {
                    self.onConfirm(userName);
                }, 500);
            }

            this.showForm();
        },

        update: function () {
        },

        showForm: function () {

            var self = this;

            this.panel = document.createElement('div');

            var totalHeight = this.game.canvas.height;
            var totalWidth  = this.game.canvas.width;

            var text = this.game.add.text(5, 50, 'Your name ?');

            var input = document.createElement('input');
            input.type           = 'text';
            input.style.position = 'absolute';
            input.style.top      = totalHeight * .30;
            input.style.left     = 5;
            input.style.width    = totalWidth - 10;
            input.style.fontSize = '2em';
            input.addEventListener('keypressed', function (e) {
                if (e.keyCode === 13) {
                    self.onConfirm(input.value);
                }
            });

            var button = document.createElement('button');
            button.innerHTML      = 'Enter';
            button.style.position = 'absolute';
            button.style.top      = totalHeight * .50;
            button.style.left     = 5;
            button.style.width    = totalWidth - 10;
            button.style.fontSize = '2em';
            button.addEventListener('click', function (e) {
                self.onConfirm(input.value);
            });

            this.body = document.getElementsByTagName('body')[0];
            this.panel.appendChild(input);
            this.panel.appendChild(button);

            this.body.appendChild(this.panel);
        },

        hideForm: function () {
            if (this.panel) {
                this.body.removeChild(this.panel);
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