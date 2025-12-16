canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for (var i=0;i<cars.length;i++) {
		cars[i].update();
	}
	for (var i = 0; i<walls.length;i++) {
		walls[i].update();
	}
	let fittest_car = focused_car;
	for (let i=0;i<cars.length;i++) {
		if (fittest_car.x<cars[i].x) { fittest_car = cars[i];}
	}
	if (fittest_car != focused_car) {
		focused_car = fittest_car;
		for (i=0; i<wall_count;i++) {
			walls[i].car_ref = focused_car;
		}
	}
	generation_controller.update();
	ctx.fillText("Acceleration", this.x, this.y+10);
	ctx.fillText("Right Turning", this.x, this.y+10);
	ctx.fillText("Left Turning", this.x, this.y+10);
	window.requestAnimationFrame(draw);
}
//movement controls
a = false;
w = false;
d = false;

//sets the angle of the car
angle = 0.00001;
max_accel = 0.005;
max_turn = 0; 

car_count = 25;

cars = [];

for (let i=0;i<car_count;i++) {
	cars[i] = new car();
}

focused_car = cars[0];


walls = [];

last_x = 0;
last_y = Math.floor(Math.random()*400)+200;
wall_dx = 800;
wall_height = 300;
for (i=0;i<cars.length;i++) {
	cars[i].y = last_y+wall_height/2;
	cars[i].x = 0;
}
new_x = wall_dx;
new_y = 0;

wall_count = 20;

for (i=0; i<wall_count;i++) {
	new_y = Math.floor(Math.random()*400);
	new_x+=wall_dx;
	walls[i] = new wall(last_x,last_y,new_x,new_y,focused_car);
	walls[i+1] = new wall(last_x,last_y+300,new_x,new_y+300,focused_car);
	last_x = new_x;	
	last_y = new_y;
	i++;
}

generation_controller = new evolution_hander(cars);

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
		); }

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
