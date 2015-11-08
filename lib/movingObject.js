(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  var MovingObject = AlienDestroyer.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.moveCount = 0;
    this.mark = options.mark;
    this.explode = false;
  };

  MovingObject.prototype.outOfYBounds = function () {
    if (this.pos[1] > this.game.yDim || this.pos[1] < 0) {
       return true;
    } else {
      return false;
    }
  };

  MovingObject.prototype.outOfXBounds = function () {
    if (this.pos[0] > this.game.xDim || this.pos[0] < 0) {
       return true;
    } else {
      return false;
    }
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var dist = Util.dist(this.pos, otherObject.pos);
    var check = dist < (this.radius + otherObject.radius);
    return check;
  };

  MovingObject.prototype.collision = function (otherObject) {

  };

})();
