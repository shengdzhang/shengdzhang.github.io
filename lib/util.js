(function () {
  if (typeof AlienDestroyer === "undefined") {
    window.AlienDestroyer = {};
  }

  Util = AlienDestroyer.Util = {};

  Util.inherits = function(ChildClass, ParentClass) {
    function Surrogate () {}
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate ();
    ChildClass.prototype.constructor = ChildClass;
  };

  Util.randomAlienVec = function(length) {
    var sqDist = length * length;
    var randXSq = Math.random() * sqDist/2;     // restrict angle of X
    var randY = Math.sqrt(sqDist - randXSq)/2;
    var randX = Math.sqrt(randXSq)/2;
    return [randX*(Math.round(Math.random()) * 2 - 1), randY/2];     // X can go both ways, Y goes down only
  }

    Util.dist = function (pos1, pos2) {
       return Math.sqrt(
         Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
       );
    };

    Util.findFireAngle = function (alienPosition, shipPosition) {
      var hVector = shipPosition[0] - alienPosition[0];
      var vVector = shipPosition[1] - alienPosition[1];
      var mag = Math.sqrt(hVector * hVector + vVector * vVector);
      return [hVector/mag, vVector/mag];
    };

})();
