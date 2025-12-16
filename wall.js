class wall {
	constructor(x1,y1,x2,y2, car) {
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.color = "white";
		this.width = 1;
		this.car_ref = car;
	}
	draw() {
		ctx.setTransform(1, 0, 0, 1, -this.car_ref.x+canvas.width/2, -this.car_ref.y+canvas.height/2);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x1,this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.lineWidth = this.width;
		ctx.stroke();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	update() {
		this.draw();
	}
}

