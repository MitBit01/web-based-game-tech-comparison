(function() {
    var Input = {}; // 37~40 are left, up, right, down; mx, my are mouse coords; ml, mr are mouse buttons;
    var Entities = [];
    var Draw = null; // initialized in Game.start
    var Game = {
        canvas: /*document.createElement('canvas')*/{},
        thisTime: Date.now(),
        prevTime: Date.now()
    };
    Game.updates = function(dt) {
        for(i = 0; i < Entities.length; i++) {
            Entities[i].update(dt);
        }
    };
    Game.collided = function(a, b) {
        var rc = false;
        var distSq = (a.x - b.x) * (a.x - b.x) + (a.y- b.y) * (a.y- b.y);
        var radSq = (a.r + b.r) * (a.r + b.r);
        if(distSq <= radSq) {
            rc = true;
        }
        return rc;
    };
    Game.collisions = function() {
        for(i = 0; i < Entities.length; i++) {
            for(j = i + 1; j < Entities.length; j++) {
                if(this.collided(Entities[i], Entities[j])) {
                    Entities[i].collide(Entities[j]);
                    Entities[j].collide(Entities[i]);
                }
            }
        }
    };
    Game.run = function(dt) {
        Game.thisTime = Date.now();
        Game.updates((Game.thisTime - Game.prevTime) / 1000);
        Game.dt = (Game.thisTime - Game.prevTime) / 1000;
        Game.collisions();
        Game.prevTime = Game.thisTime;
    };
    Game.start = function(canvasId = null) { // Call at bottom of your code
        Game.canvas.width = 700;
        Game.canvas.height = 700;
    };
    var Entity = function(x = 0, y = 0, r = 0) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.update = function(dt) {};
        this.collide = function(e) {};
        this.render = function() {};
        this.destroy = function() {
            this.update = function(dt) {
                Entities.splice(Entities.indexOf(this),1);
            };
        }
        Entities.push(this);
    };
    module.exports.Input = Input;
    module.exports.Entities = Entities;
    module.exports.Draw = Draw;
    module.exports.Game = Game;
    module.exports.Entity = Entity;
    module.exports.Random = (m = 700) => (Math.floor(Math.random() * Math.floor(m)));
})();