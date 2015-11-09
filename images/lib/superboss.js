(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var SuperBoss = AlienDestroyer.SuperBoss = function(options) {
    options.vel = Util.randomAlienVec(SuperBoss.SPEED);
    options.radius = SuperBoss.RADIUS;
    options.color = SuperBoss.COLOR;
    AlienDestroyer.Boss.call(this, options);
    this.weaponCooldown;
    this.health = 225;
  }

  SuperBoss.SPEED = 2;
  SuperBoss.RADIUS = 150;
  SuperBoss.COLOR = "black";

  Util.inherits(SuperBoss, AlienDestroyer.Boss);

  SuperBoss.prototype.render = function (ctx) {
    var superboss_image = new Image();
    if (this.explode) {
      superboss_image.src = 'images/superbossexplosion.png';
    } else {
      superboss_image.src = 'images/superboss.png';
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
    ctx.drawImage(superboss_image, this.pos[0] - SuperBoss.RADIUS, this.pos[1] - SuperBoss.RADIUS);
  };

  SuperBoss.prototype.getWeaponPos = function () {
    var positions = [];
    var pos1 = this.pos.slice();
    positions.push(pos1);
    positions.push([pos1[0] + this.radius, pos1[1]]);
    positions.push([pos1[0] - this.radius, pos1[1]]);
    positions.push([pos1[0] + this.radius, pos1[1] + this.radius]);
    positions.push([pos1[0] + this.radius, pos1[1] - this.radius]);
    positions.push([pos1[0] - this.radius, pos1[1] + this.radius]);
    positions.push([pos1[0] - this.radius, pos1[1] - this.radius]);
    positions.push([pos1[0] - this.radius, pos1[1] + this.radius]);
    positions.push([pos1[0], pos1[1] + this.radius]);
    positions.push([pos1[0], pos1[1] - this.radius]);
    return positions;
  };

  SuperBoss.prototype.reduceHealth = function () {
    if(this.radius > SuperBoss.RADIUS/2) {
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
})();
