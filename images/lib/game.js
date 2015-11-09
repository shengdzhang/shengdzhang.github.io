(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var Game = AlienDestroyer.Game = function (xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.NUM_ALIENS = [8, 0, 10, 10, 0, 10, 12, 0, "B", "B"];
    this.NUM2_ALIENS = [10, 12, 12, 12, 12, 0, "BB"];
    this.aliens = [];
    this.ship = this.addShip();
    this.bullets = [];
    this.bombs = [];
    this.messages = [];
    this.powerUps = this.randomStartPower();
    this.count = 0;
    this.score = 0;
    this.gameOver = false;
    this.win = false;
    this.emp = false;
  };

  Game.prototype.randomAlienPosition = function () {
      var randX = Math.random() * this.xDim/2 + this.xDim/4;
      return [randX, 0];
  };

  Game.prototype.randomStartPower = function () {
    var powers = [];
    while (powers.length < 2) {
      var power = this.randomPower();
      if(power) {
        powers.push(new AlienDestroyer.PowerUp({pos: this.randomAlienPosition(), mark: power, game: this}));
      }
    }
    return powers;
  };

  Game.prototype.addShip = function () {
    return new AlienDestroyer.Ship({game: this});
  };

  Game.prototype.addBullet = function (bullet) {
    this.bullets.push(bullet);
  };

  Game.prototype.addBomb = function (bomb) {
    this.bombs.push(bomb);
  };

  Game.prototype.returnShip = function () {
    return this.ship;
  };

  Game.prototype.incrementAliens = function (fps) {
    fps = fps * 6
    if(this.count % fps === 0 && this.count/fps < this.NUM_ALIENS.length) {
      if (this.NUM_ALIENS[(this.count/fps)] === "B") {
        this.aliens.push(new AlienDestroyer.Boss({pos: this.randomAlienPosition(), game: this}));
      } else if (this.NUM_ALIENS[(this.count/fps)] === "BB"){
        this.aliens.push(new AlienDestroyer.SuperBoss({pos:this.randomAlienPosition(), game:this}));
      } else {
        for (var i = 0; i < this.NUM_ALIENS[(this.count/fps)]; i++) {
            this.aliens.push(new AlienDestroyer.Aliens({pos: this.randomAlienPosition(), game: this}));
          }
      }
    }
    this.count += 1;
  };

  Game.prototype.allObjects = function () {
     return [].concat(this.ship, this.aliens, this.bullets, this.powerUps, this.bombs);
   };

  Game.prototype.render = function (ctx) {
    if (this.emp) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.xDim, this.yDim);
      setTimeout(function () {
        this.emp = false;
      }.bind(this), 200);
    }
    this.renderScore(ctx);
    this.allObjects().forEach(function (el) {
      el.render(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (el) {
      el.move();
    });
  };

  Game.prototype.checkCollisions = function () {
    var game = this;
    this.allObjects().forEach(function (obj1) {
      game.allObjects().forEach(function (obj2) {
        if (obj1 !== obj2 && obj1.isCollidedWith(obj2)) {
          obj1.collision(obj2);
          if (obj1 instanceof AlienDestroyer.PowerUp && obj2 instanceof AlienDestroyer.Ship) {
            game.displayPowerMessage(obj1);
          }
        }
      });
    });
  };

  Game.prototype.setCooldowns = function (FPS) {
    this.ship.setCooldowns(FPS);
    this.aliens.forEach(function(alien) {
      alien.setCooldowns(FPS);
      alien.fireWeapon();
    })
  };

  Game.prototype.handleKeys = function (map) {
    if (Object.keys(map).length > 0) {
      var impulse = [0,0];
      if (map["65"]) { // a
        impulse[0] += -1;
      }
      if (map["87"]) { //w
        impulse[1] += -1;
      }
      if (map["83"]) { //s
        impulse[1] += 1;
      }
      if (map["68"]) { //d
        impulse[0] +=1;
      }
      if (map["32"]) { //spacebar
        this.ship.fireBullet();
      }
      if (map["74"]) { //j
        this.ship.fireBomb();
      }
      if (map["75"]) { //k
        this.ship.emitEMP();
      }
      this.ship.power(impulse);
    }
  };

  Game.prototype.randomPower = function () {
    var r = Math.floor(Math.random() * 100);
    if(r > 96) {
      return "H";
    } else if (r > 92) {
      return "S";
    } else if (r > 88) {
      return "W";
    } else if (r > 84) {
      return "E";
    } else if (r > 79) {
      return "G";
    } else if (r > 73) {
      return "I";
    } else if (r > 66) {
      return "B";
    } else if (r >= 63) {
      return "L";
    }
    return false;
  };

  Game.prototype.remove = function (object){
    var i;
    if (object instanceof AlienDestroyer.Aliens) {
      if(object.reduceHealth()) {
        this.score += 10;
        var power = this.randomPower();
        if(power) {
          this.powerUps.push(new AlienDestroyer.PowerUp({pos: [object.pos[0], object.pos[1]+object.radius], mark: power, game: this}));
        }
        setTimeout(function () {
          i = this.aliens.indexOf(object);
          this.aliens.splice(i, 1);
        }.bind(this), 400);
      }
    } else if (object instanceof AlienDestroyer.Bullet) {
      i = this.bullets.indexOf(object);
      this.bullets.splice(i, 1);
    } else if (object instanceof AlienDestroyer.Bomb) {
      i = this.bombs.indexOf(object);
      this.bombs.splice(i, 1);
    } else if (object instanceof AlienDestroyer.Ship){
      this.ship.reduceHealth();
    } else if (object instanceof AlienDestroyer.PowerUp){
      i = this.powerUps.indexOf(object);
      this.powerUps.splice(i, 1);
    } else if (object instanceof AlienDestroyer.Boss) {
      if(object.reduceHealth()) {
        if(object instanceof AlienDestroyer.SuperBoss) {
          this.score += 150;
        } else {
          this.powerUps.push(new AlienDestroyer.PowerUp({pos: [object.pos[0], object.pos[1]+object.radius], mark: "BB", game: this}));
        }
        this.score += 100;
        setTimeout(function () {
          i = this.aliens.indexOf(object);
          this.aliens.splice(i, 1);
          if(this.aliens.length === 0) {
            if(this.NUM2_ALIENS.length > 0) {
              this.NUM_ALIENS = this.NUM2_ALIENS;
              this.count = 60;
              this.NUM2_ALIENS = [];
            } else {
              setTimeout(function () {
                this.win = true;
                this.gameOver = true;
              }.bind(this), 1000);
            }
          }
        }.bind(this), 600);
      }
    }
  };

  Game.prototype.renderScore = function (ctx) {
    ctx.fillStyle = "white";
    if (this.emp) {
      ctx.fillStyle = "black";
    }
    ctx.font = "bold 16px Arial";
    var text = "Score: " + this.score;
    var text2 = "Lives: " + this.ship.lives;
    var text3 = "Bombs: " + this.ship.bombs;
    var text4 = "EMP: " + this.ship.emp;
    ctx.fillText(text, 10, 20);
    ctx.fillText(text2, 10, 40);
    ctx.fillText(text3, 10, 60);
    ctx.fillText(text4, 10, 80);
  };

  Game.prototype.renderEnd = function (ctx) {
    ctx.fillStyle = "blue";
    ctx.font = "bold 48px Arial";
    if(this.win) {
      var text = "YOU WIN!!"
    } else {
      var text = "GAME OVER";
    }
    ctx.fillText(text, 250, 300);
  };

  Game.prototype.loseGame = function () {
    this.gameOver = true;
  };

  Game.prototype.bombExplosion = function (bomb) {
    var game = this;
    this.allObjects().forEach(function (obj1) {
      if (!(obj1 instanceof AlienDestroyer.Bomb) && obj1.isCollidedWith(bomb)) {
        if (!(obj1 instanceof AlienDestroyer.Ship) && !(obj1 instanceof AlienDestroyer.PowerUp)){
          if(!obj1.explode) {
            game.remove(obj1);
          }
        }
      }
    });
  };

  Game.prototype.EMP = function () {
    this.bullets = [];
    this.emp = true;
  }

  Game.prototype.renderMessages = function (ctx) {
    ctx.fillStyle = "#6CE4E4";
    ctx.font = "bold 14px Arial";
    for (var i = 0; i < this.messages.length; i++) {
      ctx.fillText(this.messages[i][0], this.messages[i][1], this.messages[i][2]);
    }
  }

  Game.prototype.displayPowerMessage = function (obj1) {
    var text;
    switch (obj1.mark) {
      case "W":
        text = "+Weapon Fire Speed";
        break;
      case "I":
        text = "Invincible 3s";
        break;
      case "H":
        text = "+Shield Health";
        break;
      case "S":
        text = "+Ship Speed";
        break;
      case "E":
        text = "+1 EMP";
        break;
      case "B":
        text = "+1 BOMB";
        break;
      case "G":
        text = "Main Gun Upgrade";
        break;
      case "BB":
        text = "Boss Bonus";
        break;
      case "L":
        text = "+1 Life";
        break;
    }
    var message = [text, obj1.pos[0]-obj1.radius, obj1.pos[1]];
    this.messages.push(message);
    setTimeout(function () {
      this.messages.shift();
    }.bind(this), 700);
  }

})();
