(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var Ship = AlienDestroyer.Ship = function (options) {
    options.color = Ship.COLOR;
    options.pos = [400,585];
    AlienDestroyer.MovingObject.call(this, options);
    this.vel = [0,0]
    this.invincible = false;
    this.empCooldown = false;
    this.lives = 3;
    this.armShip();
  };

  Ship.COLOR = "#00C";
  Ship.EMP = 2;
  Ship.BOMBS = 3;
  Ship.RADIUS = 20;
  Ship.SPEED = 3;
  Ship.FIRESPEED = 15;
  Ship.BULLETSPEED = 10;
  Ship.WEAPONMOUNT = 1;
  Util.inherits(Ship, AlienDestroyer.MovingObject);

  Ship.prototype.armShip = function () {
    this.radius = Ship.RADIUS;
    this.fireSpeed = Ship.FIRESPEED;
    this.speed = Ship.SPEED;
    this.gunMount = Ship.WEAPONMOUNT;
    this.bombs = Ship.BOMBS;
    this.emp = Ship.EMP;
  };

  Ship.prototype.render = function (ctx) {
    var ship_image = new Image();
    if (this.explode) {
      ship_image.src = 'images/ShipExplosion.png';
    } else {
      ship_image.src = 'images/ship.png';
      ctx.fillStyle = "Cornflowerblue";
      if(this.invincible) {
        ctx.fillStyle = "Black";
      }
      ctx.beginPath();
      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
    ctx.drawImage(ship_image, this.pos[0] - 15, this.pos[1] - 15);
  };

  Ship.prototype.power = function (impulse) {
    this.vel[0] = this.speed * impulse[0];
    this.vel[1] = this.speed * impulse[1];
  };

  Ship.prototype.move = function () {
    if(!this.explode) {
      this.pos[1] += this.vel[1];
      this.pos[0] += this.vel[0];
      this.setBounds();
    }
  };

  Ship.prototype.setBounds = function () {
    if(this.pos[0] + this.radius > this.game.xDim) {
      this.pos[0] = this.game.xDim - this.radius;
    } else if(this.pos[0] - this.radius < 0) {
      this.pos[0] = this.radius;
    }

    if (this.pos[1] + this.radius > this.game.yDim) {
      this.pos[1] = this.game.yDim - this.radius;
    } else if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
    }
  };

  Ship.prototype.invinc = function () {
    this.invincible = true;
    this.color = "#000";
    window.clearTimeout(this.invTime);
    this.invTime = window.setTimeout(function(){
      this.color = Ship.COLOR;
      this.invincible = false;
    }.bind(this), 3000);
  };

  Ship.prototype.reduceHealth = function () {
    if(!this.invincible) {
      this.radius -= 6;
      if(this.radius < 8) {
        this.lives -= 1;
        if (this.lives < 0) {
          this.game.loseGame();
        } else {
          this.relocate();
          this.armShip();
        }
      }
    }
  };

  Ship.prototype.relocate = function () {
    this.explode = true;
    setTimeout(function (){
      this.explode = false;
      this.pos = [400,585];
      this.invinc();
    }.bind(this), 400);
  };

  Ship.prototype.setCooldowns = function (FPS) {
    if (this.gunCooldown === undefined) {
      this.gunCooldown = FPS;
      this.bombCooldown = FPS * 2;
      this.bombSpeed = FPS * 2;
    } else {
      this.gunCooldown += 1;
      this.bombCooldown += 1;
    }
  };

  Ship.prototype.fireBomb = function () {
    if (this.bombCooldown >= this.bombSpeed && this.bombs > 0) {
      this.game.addBomb(new AlienDestroyer.Bomb({
        pos: this.pos.slice(),
        color: "Red",
        game: this.game,
        vel: [0, -(Ship.BULLETSPEED)],
        mark: "Ship"
      }))
      this.bombCooldown = 0;
      this.bombs -= 1;
    }
  }

  Ship.prototype.emitEMP = function () {
    if(!this.empCooldown && this.emp > 0) {
      this.game.EMP()
      this.empCooldown = true;
      this.emp -= 1;
      setTimeout(function(){
        this.empCooldown = false;
      }.bind(this), 3000);
    }
  }

  Ship.prototype.fireBullet = function () {
    if (this.gunCooldown >= this.fireSpeed) {
      var bullets = this.setGuns();
      var pos = bullets[0];
      var speed = bullets[1];
      for (var i = 0; i < pos.length; i++) {
        this.game.addBullet(new AlienDestroyer.Bullet({
          pos: pos[i],
          color: Ship.COLOR,
          game: this.game,
          vel: speed[i],
          mark: "Ship"
        }))
      }
      this.gunCooldown = 0;
    }
  };

  Ship.prototype.setGuns = function () {
    var pos = [];
    var speed = [];
    switch(this.gunMount) {
      case 1:
        pos.push(this.pos.slice());
        speed.push([0, -(Ship.BULLETSPEED)]);
        break;
      case 2:
        pos.push([this.pos[0] + this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] - this.radius/2, this.pos[1] - this.radius/3]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        break;
      case 3:
        pos.push([this.pos[0], this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] + this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] - this.radius/2, this.pos[1] - this.radius/3]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([-(Ship.BULLETSPEED) * 0.707/4, -(Ship.BULLETSPEED) * 0.707]);
        speed.push([-(Ship.BULLETSPEED) * -0.707/4, -(Ship.BULLETSPEED) * 0.707]);
        break;
      case 4:
        pos.push([this.pos[0] + this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] - this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] + this.radius, this.pos[1]]);
        pos.push([this.pos[0] - this.radius, this.pos[1]]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        break;
      case 5:
        pos.push([this.pos[0], this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] + this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] - this.radius/2, this.pos[1] - this.radius/3]);
        pos.push([this.pos[0] + this.radius, this.pos[1]]);
        pos.push([this.pos[0] - this.radius, this.pos[1]]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([-(Ship.BULLETSPEED) * 0.707/4, -(Ship.BULLETSPEED) * 0.707]);
        speed.push([-(Ship.BULLETSPEED) * -0.707/4, -(Ship.BULLETSPEED) * 0.707]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        speed.push([0, -(Ship.BULLETSPEED)]);
        break;
    }
    return [pos, speed];
  };

  Ship.prototype.powerUp = function (powerUp) {
    if (powerUp === "H") {
      if(this.radius < Ship.RADIUS * 2) {
        this.radius += 6;
      } else {
        this.game.score += 20;
      }
    } else if (powerUp === "S") {
      if(this.speed < Ship.SPEED + 2) {
        this.speed += 1;
      } else {
        this.game.score += 20;
      }
    } else if (powerUp === "W") {
      if (this.fireSpeed > 10) {
        this.fireSpeed /= 1.5;
      } else {
        this.game.score += 20;
      }
    } else if (powerUp === "I") {
      this.invinc();
      if(this.radius < Ship.RADIUS) {
        this.radius = Ship.RADIUS;
      }
    } else if (powerUp === "G") {
      if (this.gunMount < 5) {
        this.gunMount += 1
        this.fireSpeed *= 1.5;
      } else {
        this.game.score += 20;
      }
    } else if (powerUp === "B") {
      if (this.bombs < 4) {
        this.bombs += 1;
      } else {
        this.game.score += 30;
      }
    } else if (powerUp === "E") {
      if (this.emp < 4) {
        this.emp += 1;
      } else {
        this.game.score += 30;
      }
    } else if (powerUp === "L") {
      this.lives += 1;
    } else if (powerUp === "BB") {
      this.powerUp("H");
      this.powerUp("S");
      this.powerUp("W");
      this.powerUp("B");
      this.powerUp("E");
    }
  };

})();
