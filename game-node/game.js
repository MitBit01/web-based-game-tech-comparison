var Player = new Entity(20, 20, 15);
Player.update = function(dt) {
    this.angle = Math.atan2(Input['my'] - this.y, Input['mx'] - this.x);
    if (Input['ml']) {
        this.vx += Math.cos(this.angle) * 3 * dt;
        this.vy += Math.sin(this.angle) * 3 * dt;
    }
    if (this.vx > 300) this.vx = 300;
    if (this.vy > 300) this.vy = 300;
    if (this.vx < -300) this.vx = -300;
    if (this.vy < -300) this.vy = -300;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99;
    this.vy *= 0.99;
    if (this.x < 0) this.x = Game.canvas.width;
    if (this.y < 0) this.y = Game.canvas.height;
    if (this.x > Game.canvas.width) this.x = 0;
    if (this.y > Game.canvas.height) this.y = 0;
    if (this.cooldown > 0) this.cooldown -= 1;
    if (Input['mr'] && this.cooldown == 0) {
        this.cooldown = 20;
        var shot = new Entity(this.x + Math.cos(this.angle) * this.r * 2,
            this.y + Math.sin(this.angle) * this.r * 2,
            10);
        shot.vx = Math.cos(this.angle) * 200 + this.vx * 3;
        shot.vy = Math.sin(this.angle) * 200 + this.vy * 3;
        shot.life = 240;
        shot.update = function(dt) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            if (this.x < 0) this.x = Game.canvas.width;
            if (this.y < 0) this.y = Game.canvas.height;
            if (this.x > Game.canvas.width) this.x = 0;
            if (this.y > Game.canvas.height) this.y = 0;
            this.life > 0 ? this.life -= 1 : this.destroy();
        };
        shot.render = function() {
            Draw.strokeStyle='#ff0000';
            Draw.beginPath();
            Draw.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            Draw.stroke();
        };
        shot.tag = 'shot';
    }
};
Player.render = function() {
    Draw.beginPath();
    Draw.moveTo(this.x, this.y);
    Draw.moveTo(this.x + Math.cos(this.angle) * 20, this.y + Math.sin(this.angle) * 20);
    Draw.lineTo(this.x + Math.cos(this.angle + 2.5) * 20, this.y + Math.sin(this.angle + 2.5) * 20);
    Draw.lineTo(this.x + Math.cos(this.angle - 2.5) * 20, this.y + Math.sin(this.angle - 2.5) * 20);
    Draw.closePath();
    Draw.lineWidth = 5;
    Draw.strokeStyle = '#aaaaaa';
    Draw.stroke();
    Draw.fillStyle = 'ff0000';
    Draw.fill();
};
Player.collide = function(e) {
    if (e.tag == 'shot') {
        this.destroy();
        e.destroy();
    }
};
Player.angle = 0;
Player.vx = 0;
Player.vy = 0;
Player.cooldown = 0;
Player.tag = 'player';
Game.start('gamewindow');