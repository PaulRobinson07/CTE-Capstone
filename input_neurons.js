class input_neuron {
	constructor(x,y,index,car) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.color = "red";
		this.value = 0;
		//this is the variable that shows the strength towards the output neurons
		this.connection_strength = [0,0,0];
		this.randomize_weights();
		this.car = car;
	}
	randomize_weights() {
		this.connection_strength[0] = (Math.random()-0.5)*2;
		this.connection_strength[1] = Math.random();
		this.connection_strength[2] = Math.random();
	}
	draw_weights() {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.lineWidth = this.width;
		for (let i=0;i<this.car.neurons[1].length;i++) {
			ctx.globalAlpha = Math.abs(this.connection_strength[i]);
			if (this.connection_strength[i]>0) {
				ctx.strokeStyle = "green";
			}
			else {
				ctx.strokeStyle = "red";
			}
			ctx.beginPath();
			ctx.moveTo(this.x+30,this.y);
			ctx.lineTo(this.car.neurons[1][i].x-30,this.car.neurons[1][i].y);
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
	}
	draw() {
		if (focused_car == this.car) {
			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.arc(this.x, this.y, 30, 0, 360);
			ctx.lineWidth = 3;
			ctx.stroke()
			ctx.fillStyle = "white";
			ctx.fillText((this.value/this.car.car_sight).toFixed(2), this.x, this.y+10);
			this.draw_weights();
		}
	}
	update() {
		this.value = this.car.distances[this.index];
		this.draw();
	}
}
