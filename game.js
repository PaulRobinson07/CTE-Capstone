canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


angle = 0;


function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	car0.draw();
	window.requestAnimationFrame(draw);
}

a = false;
w = false;
d = false;

class car {
	constructor() {
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.rotation = angle;
		this.accel = 0.1;
		this.dx = 0;
	}
	draw() {
		this.move();
		ctx.setTransform(1, 0, 0, 1, this.x, this.y);
		ctx.fillStyle = "blue";
		ctx.rotate(((angle-90) * Math.PI) / 180);
		ctx.fillRect(-20,-25,40,50);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	move() {
		if (w) {
			this.dx+=this.accel;
		}
		if (!w){
			if (this.dx-this.accel*2 >= 0) {
				this.dx-=this.accel*2;
			}
			else {
				this.dx = 0;
			}
		}
		if (a) {
			angle-=this.dx/5;
		}
		if (d) {
			angle+=this.dx/5;
		}
		car0.x+=this.dx*Math.cos((angle*Math.PI)/180); 
		car0.y+=this.dx*Math.sin((angle*Math.PI)/180); 
	}
}

car0 = new car();
draw();
document.addEventListener('keydown', function(event) {
	switch (event.code) {
		case 'KeyW':
			w = true;
		break;
		case 'KeyA':
			a = true;
		break;
		case 'KeyD':
			d = true;
		break;
	}
});
document.addEventListener('keyup', function(event) {
	switch (event.code) {
		case 'KeyW':
			w = false;
		break;
		case 'KeyA':
			a = false;
		break;
		case 'KeyD':
			d = false;
		break;
	}
});
