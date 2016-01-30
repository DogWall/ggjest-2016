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

            var self = this;

            if (localStorage) {
                var userName = localStorage.getItem('userName');

                // show a loader here

                if (userName) {
                    return setTimeout(function () {
                        self.onConfirm(userName);
                    }, 500);
                }
            }

            this.panel = document.createElement('div');

            var text = this.game.add.text(5, 50, 'Your name ?');

            var input = document.createElement('input');
            input.type = 'text';
            input.style.position = 'absolute';
            input.style.top      = '20%';
            input.style.left     = 5;
            input.style.width    = this.game.canvas.width - 10;
            input.style.fontSize = '2em';
            input.addEventListener('keypressed', function (e) {
                if (e.keyCode === 13) {
                    self.onConfirm();
                }
            });

            var button = document.createElement('button');
            button.innerHTML      = 'Enter';
            button.style.position = 'absolute';
            button.style.top      = '60%';
            button.style.left     = 5;
            button.style.width    = this.game.canvas.width - 10;
            button.style.fontSize = '2em';
            button.addEventListener('click', function (e) {
                self.onConfirm(input.value);
            });

            this.body = document.getElementsByTagName('body')[0];
            this.panel.appendChild(input);
            this.panel.appendChild(button);

            this.body.appendChild(this.panel);
        },

        update: function () {
        },

        unload: function () {
            if (this.panel) {
                this.body.removeChild(this.panel);
            }
        },

        onConfirm: function (userName) {
            if (localStorage) {
                localStorage.setItem('userName', userName);
            }
            this.game.network.register(userName);
            this.unload();
        }
    };

    return Profile;
});