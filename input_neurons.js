class input_neuron {
	constructor(x,y,index) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.color = "red";
		this.value = 0;
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
	}
	draw() {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.arc(this.x, this.y, 30, 0, 360);
		ctx.lineWidth = 3;
		ctx.stroke()
		ctx.fillStyle = "white";
		//ctx.fillText(Math.floor(this.value), this.x, this.y+10);
		ctx.fillText(Math.round(this.value*100/car0.car_sight), this.x, this.y+10);
	}
	update() {
		this.draw();
	}
}
