var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ge = require('./gameEngine');
app.use(express.static(__dirname + '/www'));
io.on('connection', function(client){
    client.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    client.on('new player', function(){
        var Player = new ge.Entity(ge.Random(), ge.Random(), 15);
        Player.update = function(dt) {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.99;
            this.vy *= 0.99;
            if (this.x < 0) this.x = ge.Game.canvas.width;
            if (this.y < 0) this.y = ge.Game.canvas.height;
            if (this.x > ge.Game.canvas.width) this.x = 0;
            if (this.y > ge.Game.canvas.height) this.y = 0;
            if (this.cooldown > 0) this.cooldown -= 1;
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
        Player.id = Math.random();
        client.emit('add', {id: Player.id});
    });
    client.on('sync', function(dat) {
        var player = ge.Entities.find(function(e) {
            return e.id === dat.id;
        });
        if (player) {
            player.angle = Math.atan2(dat.my - player.y, dat.mx - player.x);
            if (dat.ml) {
                player.vx += Math.cos(player.angle) * 3 * ge.Game.dt;
                player.vy += Math.sin(player.angle) * 3 * ge.Game.dt;
            }
            if (player.vx > 300) player.vx = 300;
            if (player.vy > 300) player.vy = 300;
            if (player.vx < -300) player.vx = -300;
            if (player.vy < -300) player.vy = -300;
            if (dat.mr && player.cooldown == 0) {
                player.cooldown = 20;
                var shot = new ge.Entity(player.x + Math.cos(player.angle) * player.r * 2,
                    player.y + Math.sin(player.angle) * player.r * 2,
                    10);
                shot.tag = 'shot';
                shot.vx = Math.cos(player.angle) * 200 + player.vx * 3;
                shot.vy = Math.sin(player.angle) * 200 + player.vy * 3;
                shot.life = 240;
                shot.update = function(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    if (this.x < 0) this.x = ge.Game.canvas.width;
                    if (this.y < 0) this.y = ge.Game.canvas.height;
                    if (this.x > ge.Game.canvas.width) this.x = 0;
                    if (this.y > ge.Game.canvas.height) this.y = 0;
                    this.life > 0 ? this.life -= 1 : this.destroy();
                };
            }
        }
        client.emit('sync', {Entities: ge.Entities});
    }) ;
});
ge.Game.start();
setInterval(ge.Game.run, 20);
var server = http.listen(3000, function(){
    console.log('listening on port %s', server.address().port);
});