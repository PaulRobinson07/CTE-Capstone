class output_neuron {
	constructor(x,y,index,car) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.color = "green";
		this.value = 0;
		this.car = car;
	}
	draw() {
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		if (focused_car == this.car) {
			ctx.beginPath();
			ctx.strokeStyle = this.color;
			ctx.arc(this.x, this.y, 30, 0, 360);
			ctx.lineWidth = 3;
			ctx.stroke()
			ctx.fillStyle = "white";
			ctx.fillText((this.value).toFixed(2), this.x, this.y+10);
		}
	}
	update() {
		for (let i=0;i<this.car.neurons[0].length;i++) {
			this.value+=((this.car.neurons[0][i].value/this.car.car_sight)*this.car.neurons[0][i].connection_strength[this.index]);
		}
		this.value = this.value/this.car.neurons[0].length;
		this.draw();
	}
}
