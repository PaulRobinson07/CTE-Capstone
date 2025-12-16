class input_neuron {
	constructor(x,y,index,car) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.color = "red";
		this.value = 0;
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		//this is the variable that shows the strength towards the output neurons
		this.connection_strength = [0,0,0];
		this.randomize_weights();
		this.car = car;
	}
	randomize_weights() {
		for (let i=0;i<this.connection_strength.length;i++) {
			this.connection_strength[i] = (Math.random()-0.5)*2;
		}
	}
	draw() {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.arc(this.x, this.y, 30, 0, 360);
		ctx.lineWidth = 3;
		ctx.stroke()
		ctx.fillStyle = "white";
		//ctx.fillText(Math.floor(this.value), this.x, this.y+10);
		ctx.fillText((this.value/this.car.car_sight).toFixed(2), this.x, this.y+10);
	}
	update() {
		this.value = this.car.distances[this.index];
		this.draw();
	}
}
