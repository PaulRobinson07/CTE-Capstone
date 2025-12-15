canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	car0.update();
	for (let i=0;i<neurons.length;i++) {
		for (let j=0;j<neurons[i].length;j++) {
			neurons[0][j].value = car0.distances[j];
			neurons[0][j].update();
		}
	}
	for (var i = 0; i<walls.length;i++) {
		walls[i].update();
	}
	window.requestAnimationFrame(draw);
}

//movement controls
a = false;
w = false;
d = false;

//sets the angle of the car
angle = 0.00001;

//class that specifies the car and it's general functions
class car {
	constructor() {
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.angle= angle;
		this.accel = 0;
		this.dx = 0;
		this.color = "white";
		//variable that specifies how far the car's viewlines are
		this.car_sight = 500;
		//this variable determines how far the input line is to a wall
		//if the value is equal to -1, the line goes beyond the car's sight
		this.distances = [-1,-1,-1,-1,-1];
		//the angles for the lines
		this.ray_angles= [-90,-45,0,45,90];
		/*this array is the output neurons that the AI controls
		the first value controls the left
		the second value controls the right
		the third controls the accelerator*/	
		this.ai_input = [0,0,0.001];
		this.border = [[25,20],[25,-20],[-25,-20],[-25,20]];
	}
	draw() {
		//rotates the draw plane
		ctx.setTransform(1, 0, 0, 1, canvas.width/2, canvas.height/2);
		//sets the color
		ctx.fillStyle = "blue";
		ctx.rotate(((this.angle-90) * Math.PI) / 180);
		ctx.fillRect(-20,-25,40,50);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.draw_rays();
	}
	draw_rays() {
		ctx.setTransform(1, 0, 0, 1, -this.x+canvas.width/2, -this.y+canvas.height/2);
		for (let i=0;i<this.ray_angles.length;i++) {
			this.check_ray_collision(this.ray_angles[i]+this.angle,i);
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x+this.car_sight*Math.cos((this.angle+this.ray_angles[i])*Math.PI/180),this.y+this.car_sight*Math.sin((this.angle+this.ray_angles[i])*Math.PI/180));
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	check_ray_collision(angle_input,ray_n) {
		let closest = this.car_sight;
		let closest_cords = [];
		for (let i=1;i<walls.length;i++) {
			if (linesIntersect(this.x,this.y,this.x+this.car_sight*Math.cos(angle_input*Math.PI/180),this.y+this.car_sight*Math.sin(angle_input*Math.PI/180),walls[i].x1,walls[i].y1,walls[i].x2,walls[i].y2)) {
				var point = lines_intersection_point(this.x,this.y,this.x+this.car_sight*Math.cos(angle_input*Math.PI/180),this.y+this.car_sight*Math.sin(angle_input*Math.PI/180),walls[i].x1,walls[i].y1,walls[i].x2,walls[i].y2);
				let d = Math.sqrt(Math.pow(point[0]-this.x,2)+Math.pow(point[1]-this.y,2));
				if (d<closest) {	
					//draws a circle at the point of intersection
					ctx.arc(point[0], point[1], 15, 0, 360);
					ctx.lineWidth = 3;
					closest = d;
					closest_cords = point;
				}
			}
		}
		if (closest != this.car_sight) {
			ctx.beginPath();
			this.color = "red";
			ctx.strokeStyle = this.color;
			ctx.arc(closest_cords[0], closest_cords[1], 15, 0, 360);
			ctx.lineWidth = 3;
			ctx.stroke();
			this.distances[ray_n] = closest;
		}
		else {
			this.color = "white";
			ctx.strokeStyle = this.color;
			this.distances[ray_n] = car0.car_sight;
		}
	}
	move() {
		/* PLAYER MOVEMENT SCRIPT
		(if (w && this.dx<5) {
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
			this.angle-=this.dx/10;
		}
		if (d) {
			this.angle+=this.dx/10;
		}*/
		this.angle-=this.ai_input[0];
		this.angle+=this.ai_input[1];
		this.dx+=this.ai_input[2];
		car0.x+=this.dx*Math.cos((this.angle*Math.PI)/180); 
		car0.y+=this.dx*Math.sin((this.angle*Math.PI)/180); 
	}
	update() {
		this.move();
		this.draw();
	}
}

car0 = new car();

neurons = [[]];

for (let i=0;i<5;i++) {
	neurons[0][i] = new input_neuron(40, i*70+40,i);
}
walls = [];

last_x = 0;
last_y = Math.floor(Math.random()*400)+200;
wall_dx = 400;
new_x = wall_dx;
new_y = 0;

wall_count = 20;

for (i=0; i<wall_count;i++) {
	new_y = Math.floor(Math.random()*400)+wall_dx;
	new_x+=wall_dx;
	console.log(new_x);
	walls[i] = new wall(last_x,last_y,new_x,new_y,car0);
	walls[i+1] = new wall(last_x,last_y+300,new_x,new_y+300,car0);
	last_x = new_x;	
	last_y = new_y;
	i++;
}

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

//function for checking line intersection
function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	function orientation(ax, ay, bx, by, cx, cy) {
		const val = (by - ay) * (cx - bx) - (bx - ax) * (cy - by);
		if (val === 0) return 0;      // collinear
		return val > 0 ? 1 : 2;       // clockwise or counterclockwise
	}

	function onSegment(ax, ay, bx, by, cx, cy) {
		return (
			Math.min(ax, cx) <= bx && bx <= Math.max(ax, cx) &&
			Math.min(ay, cy) <= by && by <= Math.max(ay, cy)
		);
	}

	const o1 = orientation(x1, y1, x2, y2, x3, y3);
	const o2 = orientation(x1, y1, x2, y2, x4, y4);
	const o3 = orientation(x3, y3, x4, y4, x1, y1);
	const o4 = orientation(x3, y3, x4, y4, x2, y2);

	// General case
	if (o1 !== o2 && o3 !== o4) return true;
	// Special cases (collinear)
	if (o1 === 0 && onSegment(x1, y1, x3, y3, x2, y2)) return true;
	if (o2 === 0 && onSegment(x1, y1, x4, y4, x2, y2)) return true;
	if (o3 === 0 && onSegment(x3, y3, x1, y1, x4, y4)) return true;
	if (o4 === 0 && onSegment(x3, y3, x2, y2, x4, y4)) return true;
	return false;
}

//function for finding line intersection point
function lines_intersection_point(x1, y1, x2, y2, x3, y3, x4, y4) {
	var slope1 = (y2-y1)/(x2-x1);
	var slope2 = (y4-y3)/(x4-x3);
	var y_inter1 = y1-slope1*x1;
	var y_inter2 = y3-slope2*x3;
	var x = (y_inter2-y_inter1)/(slope1-slope2);
	var y = slope1*x+y_inter1;
	return [x,y];
}
