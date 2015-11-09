(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var Boss = AlienDestroyer.Boss = function (options) {
    options.vel = options.vel || Util.randomAlienVec((Math.random()*Boss.SPEED)+5);
    options.radius = options.radius || Boss.RADIUS;
    options.color = options.color || Boss.COLOR;
    AlienDestroyer.MovingObject.call(this, options);
    this.weaponCooldown;
    this.health = Boss.RADIUS/2;
  }

  Boss.SPEED = 4;
  Boss.RADIUS = 50;
  Boss.COLOR = "#C14242";
  Boss.WEAPONSPEED = 6;

  Util.inherits(Boss, AlienDestroyer.MovingObject);

  Boss.prototype.render = function (ctx) {
    var boss_image = new Image();
    if(this.explode) {
      boss_image.src = 'images/bossexplosion.png';
    } else {
      boss_image.src = 'images/alienboss.png';
      ctx.fillStyle = "Magenta";
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
    ctx.drawImage(boss_image, this.pos[0] - Boss.RADIUS/2, this.pos[1] - Boss.RADIUS);
  };

  Boss.prototype.move = function () {
    if(!this.explode) {
      this.pos[0] = this.pos[0] + this.vel[0]*5;
      this.pos[1] = this.pos[1] + this.vel[1]/10;
      if ((this.vel[1] > 0 && this.pos[1] + this.radius > (this.game.yDim * 2/3)) || (this.pos[1] - this.radius < this.radius && this.vel[1] < 0 )){
        this.vel[1] = -this.vel[1];
      } else if (this.pos[0] + this.radius > this.game.xDim){
        this.pos[0] = this.game.xDim - this.radius;
        this.vel[0] = -this.vel[0];
      } else if (this.pos[0] - this.radius < 0) {
        this.pos[0] = this.radius;
        this.vel[0] = -this.vel[0];
      }
    }
  }

  Boss.prototype.reduceHealth = function () {
    if(this.radius > Boss.RADIUS/2) {
      this.radius -= 1;
    } else {
      this.health -= 1;
      if(this.health < 1) {
        this.explode = true;
        return true;
      }
    }
    return false;
  }

  Boss.prototype.setCooldowns = function (FPS) {
    if (this.weaponCooldown === undefined) {
      this.weaponCooldown = FPS;
      this.fireSpeed = FPS/this.radius * 10;
    } else if (this.weaponCooldown !== FPS) {
      this.weaponCooldown += 1;
    }
  }

  Boss.prototype.fireWeapon = function () {
    if (this.weaponCooldown >= this.fireSpeed * 5) {
      var speed = [];
      speed = Util.findFireAngle(this.pos, this.game.ship.pos);
      speed[0] = speed[0] * Boss.WEAPONSPEED;
      speed[1] = speed[1] * Boss.WEAPONSPEED;
      var weapons = this.getWeaponPos();
      for(var i = 0; i < weapons.length; i++) {
        this.game.addBullet(new AlienDestroyer.Bullet({
          pos: weapons[i],
          color: this.color,
          game: this.game,
          vel: speed,
          mark: "Alien"
        }))
      }
      this.weaponCooldown = 0;
    }
  }

  Boss.prototype.getWeaponPos = function () {
    var positions = [];
    var pos1 = this.pos.slice();
    positions.push(pos1);
    positions.push([pos1[0] + this.radius, pos1[1]]);
    positions.push([pos1[0] - this.radius, pos1[1]]);
    return positions.slice();
  };

  Boss.prototype.collision = function (otherObject) {
    if(otherObject instanceof AlienDestroyer.Ship) {
      if(!(otherObject.invincible || otherObject.explode)) {
        this.game.remove(otherObject);
      }
    }
  };

})();
