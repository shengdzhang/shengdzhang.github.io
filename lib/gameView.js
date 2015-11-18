(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  FPS = 60;

  var GameView = AlienDestroyer.GameView = function (canvasEl) {
    var ctx = canvasEl.getContext("2d");
    this.game = new AlienDestroyer.Game(canvasEl.width, canvasEl.height);
    this.ctx = ctx;
    this.ship = this.game.returnShip();
    this.timerId = null;
    this.map = {};
  };

   GameView.prototype.start = function () {
    this.timerId = window.setInterval((function () {
      this.reset();
      this.game.incrementAliens(FPS);
      this.game.render(this.ctx);
      this.game.handleKeys(this.map);
      this.game.moveObjects();
      this.game.setCooldowns(FPS);
      this.game.checkCollisions();
      this.game.renderMessages(this.ctx);
      if(this.game.gameOver) {
        this.game.renderEnd(this.ctx);
        this.stop();
      }
    }).bind(this), 1000/FPS);

    this.bindKeyHandlers();
  };

  GameView.prototype.bindKeyHandlers = function () {
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        this.map[e.keyCode] = e.type == 'keydown';
    }.bind(this)
  };

  GameView.prototype.stop = function () {
    clearInterval(this.timerId);
  };

  GameView.prototype.reset = function () {
    this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }

  GameView.prototype.filler = function () {
    var ctx = this.ctx;
    var text;
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    text = "Controls:";
    ctx.fillText(text, 200, 150);
    text = "WASD for Movement.";
    ctx.fillText(text, 200, 200);
    text = "Press J to fire bomb.";
    ctx.fillText(text, 200, 300);
    text = "Press K to use EMP.";
    ctx.fillText(text, 200, 350);
    text = "Press Space to fire main gun.";
    ctx.fillText(text, 200, 400);
    text = "Click Reset to clear the screen.";
    ctx.fillText(text, 200, 500);
  }

  GameView.prototype.pauseMessage = function () {
    var ctx = this.ctx;
    ctx.fillStyle = "white";
    ctx.font = "bold 60px Arial";
    var text = "PAUSED";
    ctx.fillText(text, 300, 300);
  }

})();
