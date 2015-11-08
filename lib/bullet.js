(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var Bullet = AlienDestroyer.Bullet = function (options) {
    options.radius = options.radius || Bullet.RADIUS;
    AlienDestroyer.MovingObject.call(this, options);
  };

  Bullet.RADIUS = 3.5;

  Util.inherits(Bullet, AlienDestroyer.MovingObject);

  Bullet.prototype.render = function (ctx) {
    var bullet_image = new Image();
    bullet_image.src = 'images/alienbullet.png';
    if (this.mark === "Ship") {
      bullet_image.src = 'images/shipbullet.png';
    }
    ctx.drawImage(bullet_image, this.pos[0] - Bullet.RADIUS, this.pos[1] - Bullet.RADIUS);
  };

  Bullet.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    if (this.outOfYBounds() || this.outOfXBounds()) {
      this.game.remove(this);
    }
  };

  Bullet.prototype.collision = function (otherObject) {
    if ((otherObject instanceof AlienDestroyer.Aliens || otherObject instanceof AlienDestroyer.Boss) && this.mark !== "Alien") {
      if(!otherObject.explode) {
        this.game.remove(this);
        this.game.remove(otherObject);
      }
    } else if (otherObject instanceof AlienDestroyer.Ship && this.mark !== "Ship") {
      if(!otherObject.explode) {
        this.game.remove(this);
        this.game.remove(otherObject);
      }
    }
  };

})();
