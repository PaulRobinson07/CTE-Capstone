class evolution_hander {
	constructor(array_cars) {
		this.cars = array_cars;
		//frames since start of generation
		this.frame = 0;
		//maximum frames a generation lasts
		this.generation_time = 5000;
		
		this.generation = 1;
	}
	produce_next_generation() {}
	draw() {
		ctx.textAlign = "center";
		ctx.globalAlpha = 1;
		ctx.font = "50px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("Generation " + this.generation, canvas.width/2, 50);
		ctx.font = "30px Arial";
		ctx.fillText("Time Left: " + (this.generation_time-this.frame) + " Frames Left", canvas.width/2, 80);
	}
	update() {
		this.draw();
		this.frame+=1;
		if (this.frame>=this.generation_time) {
			this.frame = 0;
			this.generation+=1;
			this.produce_next_generation();
		}
	}
}
