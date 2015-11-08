(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }


  var PowerUp = AlienDestroyer.PowerUp = function (options) {
    options.vel = [0,1];
    options.radius = PowerUp.RADIUS;
    options.color = PowerUp.COLOR;
    AlienDestroyer.MovingObject.call(this, options);
  };

  PowerUp.COLOR = "#888";
  PowerUp.RADIUS = 10;
  PowerUp.SPEED = 1;

  Util.inherits(PowerUp, AlienDestroyer.MovingObject);

  PowerUp.prototype.move = function () {
    this.pos[1] += this.vel[1];
    if(this.outOfYBounds()) {
      this.game.remove(this);
    }
  }

  PowerUp.prototype.render = function (ctx) {
    var powerup_image = new Image();
    if (this.mark !== "L") {
      powerup_image.src = 'images/powerup.png';
    } else {
      powerup_image.src = 'images/heart.png';
    }

    ctx.drawImage(powerup_image, this.pos[0] - this.radius, this.pos[1] - this.radius);

    ctx.fillStyle = "black";
    ctx.font = "bold 10px Arial";
    var posx = this.pos[0] + 1;
    var posy = this.pos[1] + this.radius;
    if (this.mark === "I") {
      posx += 2;
    } else if (this.mark === "W") {
      posx -= 1;
    } else if (this.mark === "BB") {
      posx -= 3;
    } else if (this.mark === "L") {
      posx += 1.5;
      posy -= 2;
    }
    ctx.fillText(this.mark, posx , posy);
  }

  PowerUp.prototype.collision = function (otherObject) {
    if(otherObject instanceof AlienDestroyer.Ship) {
      this.game.remove(this);
      otherObject.powerUp(this.mark);
    }
  };



})();
