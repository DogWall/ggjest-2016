define([
    'socket.io/socket.io.js',
    'components/state'
], function (io, State) {
    'use strict';

    function Network(game) {

        this.game = game;
        this.currentMatch = null;
    }

    Network.prototype = {
        constructor: Network,

        reconnect: function () {
            var self = this;
            var game = this.game;

            var socket = io.connect();
            socket.on('connection', function (user) {
                console.log('hey', user);
                game.io = io;
                game.socket = socket;
                game.user = user;
                game.user.name = game.userName;
                self.game.state.start('Menu');
            });

            // disconnect
            socket.on('disconnect', function () {
                console.log('disconnect');
                self.game.state.start('Waiting');
            });

            socket.on('has-joined-match', function (event) {
                var match = event.match;
                var team  = event.team;

                self.game.game_state.nbPlayers = event.nbPlayers;
                self.game.game_state.playerPosition = event.playerPosition;
                self.game.game_state.myMonster = event.myMonster;
                self.game.game_state.theOtherMonster = event.theOtherMonster;
                self.game.game_state.setMatch(match);
                self.game.game_state.setTeam(team);
                self.game.game_state.setTeams(match.teams);

                var hash  = '#' + match.id + '-' + team.id;
                console.log('Current player', event.player);
                console.log('invite friends to', matchUrl);
                console.log('joining match', match, 'in team', team.id, '=>', hash);
                console.log('nbPlayers', event.nbPlayers);
                console.log('playerPosition', event.playerPosition);
                console.log('myMonster', event.myMonster);
                console.log('theOtherMonster', event.theOtherMonster);



                var matchUrl = location.toString().replace(/#.*$/, hash);
                console.log('invite friends to', matchUrl);
                // location.hash = hash;

                self.currentMatch = match;
                self.showLobby();
            });

            socket.on('latency', function (timestamp, callback) {
                callback(timestamp);
            });
        },

        register: function (userName) {
            this.game.userName = userName;
            this.game.socket.emit('search-matchs', {
                prefered: location.hash.substr(1),
                name: userName,
            });
        },

        showLobby: function () {
            var self = this;
            console.log('in lobby', this.currentMatch);
            self.game.state.start('Lobby');

            var onCountdown = function (counter) {
                self.game.lobby && self.game.lobby.startCountdown(counter);
            };
            
            var onUpdateTeam = function (event) {
                console.log('update team ?', event);
                self.game.lobby.updateTeam(event.team);
            };

            var onUserJoined = function (event) {
                self.game.lobby.addPlayer(event.player, event.team);
            };

            var onTeamScores = function (scores) {
                console.log('scores are', scores);
            };

            var onUpdateSolist = function (event) {
                self.game.game_state.solistPosition = event.solist;
                console.log('solist', event.solist);
            };

            var onGlyphScore = function (event) {
                self.game.game_state.glyphedScore = event.score;
            };

            var onGameEnd = function (event) {
                self.showEndGame(event.winner, event.looser);
            };

            var removeListeners = function (socket) {
                socket.on('start-countdown', onCountdown);
                socket.on('user-joined', onUserJoined);
                socket.on('team-scores', onTeamScores);
                socket.on('game-start', onGameStart);
                socket.on('update-solist', onUpdateSolist);
                socket.on('glyphed-score', onGlyphScore);
                socket.on('match-end', onGameEnd);
                socket.on('update-team', onUpdateTeam);                
            };

            var onGameStart = function (event) {
                console.log('start game !!!');

                removeListeners(self.game.socket);

                if (event.game == 'Runes') {
                    var glyphs = self.game.cache.getJSON('glyphs');

                    // filter by difficulty
                    if (typeof event.lastTapAccuracy != 'undefined' && event.mates > 1) {
                        var gameDifficulty = (3 - event.lastTapAccuracy);
                        glyphs = glyphs.filter(function (g) {
                            return g.difficulty === gameDifficulty;
                        });
                        console.log('filter glyphs of difficulty', gameDifficulty, '(', glyphs.length, ')');
                    }

                    var glyph = glyphs[self.game.rnd.integerInRange(0, glyphs.length - 1)];

                    self.game.state.start(event.game, true, false, glyph);
                } else {
                    self.game.state.start(event.game, true, false);
                }
            };

            self.game.socket.on('start-countdown', onCountdown);
            self.game.socket.on('user-joined', onUserJoined);
            self.game.socket.on('team-scores', onTeamScores);
            self.game.socket.on('game-start', onGameStart);
            self.game.socket.on('update-solist', onUpdateSolist);
            self.game.socket.on('glyphed-score', onGlyphScore);
            self.game.socket.on('match-end', onGameEnd);
        },

        showEndGame: function (winner, looser) {
            this.game.state.start('Endmatch', true, false, winner, looser);
        },

        userGoodGlyphed: function () {
            this.game.socket.emit('user-good-glyphed');
        },

        userMisGlyphed: function () {
            this.game.socket.emit('user-mis-glyphed');
        },

        userSendTappedScore: function (score) {
            this.game.socket.emit('user-tapped-score', score);
        }

    };

    return Network;
});
