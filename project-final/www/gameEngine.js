window.requestAnimationFrame = window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		window.mozRequestAnimationFrame;
var Input = {}; // 37~40 are left, up, right, down; mx, my are mouse coords; ml, mr are mouse buttons;
var Entities = [];
var Draw = null; // initialized in Game.start
var Game = {
	canvas: document.createElement('canvas'),
	thisTime: Date.now(),
	prevTime: Date.now()
};
Game.renders = function() {
	Draw.strokeStyle = '#ffffff';
	Draw.fillStyle = '#000000';
    Draw.lineWidth = 1;
	Draw.fillRect(0, 0, this.canvas.width, this.canvas.height)
	for(i = 0; i < Entities.length; i++) {
        Draw.strokeStyle = '#ffffff';
        Draw.fillStyle = '#000000';
        Draw.lineWidth = 2;
        if (Entities[i].tag == 'player') {
            let player = Entities[i];
            Draw.beginPath();
            Draw.moveTo(player.x, player.y);
            Draw.moveTo(player.x + Math.cos(player.angle) * 20, player.y + Math.sin(player.angle) * 20);
            Draw.lineTo(player.x + Math.cos(player.angle + 2.5) * 20, player.y + Math.sin(player.angle + 2.5) * 20);
            Draw.lineTo(player.x + Math.cos(player.angle - 2.5) * 20, player.y + Math.sin(player.angle - 2.5) * 20);
            Draw.closePath();
            Draw.lineWidth = 5;
            Draw.strokeStyle = '#aaaaaa';
            Draw.stroke();
            Draw.fillStyle = 'ff0000';
            Draw.fill();
        }
        else if (Entities[i].tag == 'shot') {
            let shot = Entities[i];
            Draw.strokeStyle='#ff0000';
            Draw.beginPath();
            Draw.arc(shot.x, shot.y, shot.r, 0, 2 * Math.PI);
            Draw.stroke();
        }
	}
};
Game.run = function(dt) {
	Game.renders();
	window.requestAnimationFrame(Game.run);
};
Game.start = function(canvasId = null) { // Call at bottom of your code
    if (canvasId != null) Game.canvas = document.getElementById(canvasId);
	Game.canvas.width = 700;
	Game.canvas.height = 700;
    if (canvasId == null) document.body.appendChild(Game.canvas);
	addEventListener('keydown', 
		function(e) {Input[e.keyCode] = true;},
		false);
	addEventListener('keyup', 
		function(e) {delete Input[e.keyCode];}, 
		false);
    addEventListener('mousemove',
        function(e) {
            Input['mx'] = e.clientX - Game.canvas.getBoundingClientRect().left;
            Input['my'] = e.clientY - Game.canvas.getBoundingClientRect().top;
        },
        false);
    addEventListener('mousedown',
        function(e) {
            if (e.button == 0) Input['ml'] = true;
            else if (e.button == 2) Input['mr'] = true;
        },
        false);
    addEventListener('mouseup',
        function(e) {
            if (e.button == 0) delete Input['ml'];
            else if (e.button == 2) delete Input['mr'];
        },
        false);
    Draw = Game.canvas.getContext('2d');
	Game.run();
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