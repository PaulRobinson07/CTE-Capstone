//class that specifies the car and it's general functions
class car {
	constructor() {
		this.reward = 0;
		this.active = true;
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.angle = angle;
		this.accel = 0;
		this.dx = 0;
		this.color = "ivory";
		//variable that specifies how far the car's viewlines are
		this.car_sight = 500;
		//this variable determines how far the input line is to a wall
		//if the value is equal to -1, the line goes beyond the car's sight
		this.distances = [this.car_sight,this.car_sight,this.car_sight,this.car_sight,this.car_sight];
		//the angles for the lines
		this.ray_angles= [-90,-45,0,45,90];
		/*this array is the output neurons that the AI controls
		the first value controls the left
		the second value controls the right
		the third controls the accelerator*/
		this.ai_input = [0,0,0.005];
		this.border = [[25,20],[25,-20],[-25,-20],[-25,20]];
		this.car_color = "lightgreen";
		this.neurons = [[],[],];
		for (let i=0;i<5;i++) {
			this.neurons[0][i] = new input_neuron(40, i*70+40,i,this);
		}
		for (let i=0;i<3;i++) {
			this.neurons[1][i] = new output_neuron(180, i*70+40,i,this);
		}
	}
	draw() {
		//rotates the draw plane
		ctx.setTransform(1, 0, 0, 1, canvas.width/2+this.x-focused_car.x, canvas.height/2+this.y-focused_car.y);
		//sets the color
		ctx.fillStyle = this.car_color;
		ctx.rotate(((this.angle-90) * Math.PI) / 180);
		ctx.fillRect(-20,-25,40,50);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.draw_rays();
	}
	draw_rays() {
		ctx.setTransform(1, 0, 0, 1, -focused_car.x+canvas.width/2, -focused_car.y+canvas.height/2);
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
		for (let i=0;i<walls.length;i++) {
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
			this.distances[ray_n] = this.car_sight;
		}
	}
	move() {
		// PLAYER MOVEMENT SCRIPT
		if (w && this.dx<5) {
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
		}
		this.ai_input[0] = this.neurons[1][0].value*max_accel;
		this.ai_input[1] = this.neurons[1][1].value*max_turn;
		this.ai_input[2] = this.neurons[1][2].value*max_turn;
		this.angle-=this.ai_input[1];
		this.angle+=this.ai_input[2];
		this.dx+=this.ai_input[0];
		max_turn = this.dx/10;
		this.x+=this.dx*Math.cos((this.angle*Math.PI)/180); 
		this.y+=this.dx*Math.sin((this.angle*Math.PI)/180); 
		for (let i=0;i<this.distances.length;i++) {
			if (this.distances[i] <= 20) {
				this.active = false;
				this.car_color = "crimson";
			}
		}
	}
	update_neurons() {
		for (let i=0;i<this.neurons.length;i++) {
			for (let j=0;j<this.neurons[i].length;j++) {
				this.neurons[i][j].update();
			}
		}
	}
	update() {
		this.update_neurons();
		if (this.active) {
			this.move();
		}
		this.draw();
	}
}
