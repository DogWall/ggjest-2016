define([
    'phaser'
  ],
  function(Phaser) {
    'use strict';

    function Runes(runes) {
      var bg;
      var width, height;
    }
    Runes.prototype = {
      constructor: Runes,
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
        this.setupBackground();
        this.setupGrid();

        this.score = 0;
        this.scoreText = this.game.add.text(10, this.game.height - 46, 'Score: -', {
          font: '32px slkscr',
          fill: '#fff'
        });
        this.scoreText.text = 'Score: 0';

        if (this.game.device.desktop) {
          this.firstSwitch = false;
        }
        this.invoking = false;
        this.pattern = [];
      },
      onDot: function (sprite,event) {
        if(this.invoking && this.pattern.indexOf(sprite.name) == -1) {
          this.pattern.push(sprite.name);

        }
      },
      setupBackground: function() {
        //TODO
      },
      setupGrid: function() {
        var _dot = this.game.cache.getImage("dot");
        var xSpacing = (this.width /*- _dot.width*3*/)/4-_dot.width/2;
        var ySpacing = (this.height/* - _dot.height*3*/)/4- _dot.height/2;
        for(var x=1;x<=3;x++){
          for(var y=1;y<=3;y++){
            var dot = this.game.add.image(x*xSpacing,y*ySpacing, 'dot');
            dot.inputEnabled = true;
            dot.name = x-1+(y-1)*3;
            dot.events.onInputOver.add(this.onDot, this);
            dot.events.onInputDown.add(this.startPattern, this);
            dot.events.onInputUp.add(this.stopPattern, this);
            this.dots[dot.name] = dot;
          }
        }
      },
      update: function () {
        if(this.lineWork != null) {
          this.lineWork.clear()
          this.lineWork = null;
        }
          var graphics = this.game.add.graphics();
          this.lineWork = graphics;
          // set a fill and line style
          graphics.lineStyle(3, 0xffd900, 1);
          if(this.pattern.length) {
            var first = this.dots[this.pattern[0]];
            graphics.moveTo(first.x+this.dotWidth/2,first.y+this.dotHeight/2);
            for(var i=1;i<this.pattern.length;i++) {
              var current = this.dots[this.pattern[i]];
              graphics.lineTo(current.x+this.dotWidth/2, current.y+this.dotHeight/2);
            }
          }
      },
      startPattern: function (sprite,event) {
        this.invoking = true;
        this.pattern = [];
        this.pattern.push(sprite.name);
      },
      stopPattern: function () {
        this.invoking = false;
        console.log('pattern is',this.pattern)
      }
    };
    return Runes;
  }
);
