class Terrain {
	constructor(region,position, size){
		this.region = region;
		this.position = position;
		this.size = size;
		if (region == "desert"){
			this.img = new Image();
			this.img.src = '/desert.png';
			this.speed = 0.75;
		} else {
			this.img = new Image();
			this.img.src = '/grass.png';
			this.speed = 1;
		}
	}
	draw(context){
		context.beginPath();
		var pattern = context.createPattern(this.img, 'repeat');
  		context.fillStyle = pattern;
  		context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
		context.closePath();
	}
}
