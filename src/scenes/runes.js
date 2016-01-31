define([
    'phaser', 'sprites/status'
  ],
  function(Phaser, Status) {
    'use strict';

    function Runes(runes) {
      var bg;
      var width, height;
    }
    Runes.prototype = {
      constructor: Runes,
      init: function(glyph){
        if(glyph) {
          this.patternToMatch = glyph.pattern;
          this.patternName = glyph.name;
        } else {
          /*this.patternName = "Land"
          this.patternToMatch = [2, 4, 0, 3, 6, 4, 8];*/
        }
      },
      create: function() {
        //  TODO look if another one is better
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.width = this.game.width;
        this.height = this.game.height;
        var _dot = this.game.cache.getImage("dot");
        this.dotWidth = _dot.width;
        this.dotHeight = _dot.height;
        this.dots = {};
        this.lineWork = null;

        this.status = new Status(this.game);
        this.setupLocalBackground();
          this.setupBackground();
        this.setupGrid();




        //this.score = 0;



        if (this.game.device.desktop) {
          this.firstSwitch = false;
        }
        this.invoking = false;
        this.pattern = [];

        this.patternNameText = this.game.add.text(10, this.height - 34 , this.patternName, {
          font: '24px comicrunes',
          fill: '#fff'
        });
        this.patternToMatchLines = this.drawPattern(this.patternToMatch);
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.onGameplayStart, this);
      },

        setupLocalBackground: function () {
            var team = this.game.game_state.getTeam();
            switch(team.name) {
                case 'white':
                    var zone =  this.game.add.sprite(0, 0, 'zone-jeu-white');
                    zone.scale.setTo(0.5, 0.5);
                    break;
                case 'black':
                    var zone =  this.game.add.sprite(0, 0, 'zone-jeu-black');
                    zone.scale.setTo(0.5, 0.5);
                    break;
            }
        },
      onGameplayStart: function() {
        this.patternToMatchLines.clear();
        for (var i in this.dots) {
          var dot = this.dots[i];
          this.grid.alpha = 1;
          dot.events.onInputOver.add(this.onDot, this);
          dot.events.onInputDown.add(this.startPattern, this);
          dot.events.onInputUp.add(this.stopPattern, this);

        }
      },
      onDot: function(sprite, event) {
        if (this.invoking && (this.pattern.length && this.pattern[this.pattern.length - 1] != sprite.name)) { /*&& this.pattern.indexOf(sprite.name) == -1 //(if avoid aving twice the same dot)*/
          this.pattern.push(sprite.name);
          if (this.lineWork != null) {
            this.lineWork.clear()
          }
          this.lineWork = this.drawPattern(this.pattern, {color:0xee4444});
        }
      },
      setupBackground: function() {
          this.grid =  this.game.add.sprite(0, 0, 'points');
          this.grid.scale.setTo(0.5, 0.5);
      },
      setupGrid: function() {
        var _dot = this.game.cache.getImage("dot");
        var xStart = 61;
        var yStart = this.height / 2 + 52;
        var xSpacing = 75;
        var ySpacing = 75;
        for (var x = 0; x < 3; x++) {
          for (var y = 0; y < 3; y++) {
            var dot = this.game.add.image(xStart + x * xSpacing, yStart + y * ySpacing , 'dot');
            dot.inputEnabled = true;
            dot.name = x  + y * 3;
            //dot.events.onInputOver.add(this.onDot, this);
            //dot.events.onInputDown.add(this.startPattern, this);
            //dot.events.onInputUp.add(this.stopPattern, this);
            dot.alpha = 0;
            this.grid.alpha = 0;
            this.dots[dot.name] = dot;
          }
        }
      },
      update: function() {

      },
      matchPatterns: function(A,B) {
        if(A.length == B.length) {
          var eq = true;
          for (var i = 0; i < A.length; ++i) {
            eq = eq && A[i]==B[i];
          }
          if(eq)
            return true;
          var rA = A.reverse();
          eq = true;
          for (var i = 0; i < rA.length; ++i) {
            eq = eq && rA[i]==B[i];
          }
          return eq;
        } else
          return false;
      },
      drawPattern: function(pattern, opts) {
        var graphics = this.game.add.graphics();
        // set a fill and line style
        var lWdth = (opts && opts.lineWidth) ? opts.lineWidth : 3;
        var color = (opts && opts.color) ? opts.color : 0xffffff;
        graphics.lineStyle(lWdth, color, 1);
        if (pattern.length) {
          var first = this.dots[pattern[0]];
          var previous = first;
          graphics.moveTo(first.x + this.dotWidth / 2, first.y + this.dotHeight / 2);
          for (var i = 1; i < pattern.length; i++) {
            var current = this.dots[pattern[i]];
            //offset tweaking
            var offsetX = 0;
            var offsetY = 0;
            if(i < pattern.length-1) {
              var next = this.dots[pattern[i+1]];
              if((current.y > previous.y) && (current.y > next.y)){
                offsetY = -5;
              }else if((current.y < previous.y)&&(current.y < next.y)){
                offsetY = 5;
              }

              if((current.x > previous.x) && (current.x > next.x)){
                offsetX = -5;
              }else if((current.x < previous.x)&&(current.x < next.x)){
                offsetX = 5;
              }
            }


            graphics.lineTo(current.x + this.dotWidth / 2 + offsetX, current.y + this.dotHeight / 2 + offsetY);
            var previous = current;
          }
        }
        return graphics;
      },
      startPattern: function(sprite, event) {
        this.invoking = true;
        this.pattern = [];
        this.pattern.push(sprite.name);
      },
      stopPattern: function() {
        this.invoking = false;
        console.log('pattern is', this.pattern)
        if (this.matchPatterns(this.pattern,this.patternToMatch)) {
          this.patternSuccess();
          this.patternNameText.setText( 'ok');
        } else {
          this.patternFailed();
          this.patternNameText.setText('wrong');
        }
        var glyphs = this.game.cache.getJSON('glyphs');
        var glyph = glyphs[this.game.rnd.integerInRange(0, glyphs.length)];
        console.log(glyph)
        this.state.start('Runes',true,false,glyph);
      },
      patternSuccess: function () {
        this.game.network.userGoodGlyphed();
      },
      patternFailed: function () {
        this.game.network.userMisGlyphed();
      }
    };
    return Runes;
  }
);
