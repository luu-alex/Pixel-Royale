class Safezone { //these will teleport you across the map
	constructor(stage,position,size){
		this.counter = 1;
		this.position = position;
    this.size = size;
    this.stage=  stage;
	}
	draw(context){
		context.beginPath();
    context.strokeStyle = "red";
		context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    context.stroke();
		context.closePath();
	}
	step(){
    this.counter++;
    this.withinRadius(this.stage.player);
		for (var i=0; i<this.stage.bots.length; i++) {
			this.withinRadius(this.stage.bots[i]);
		}
    if (this.counter>10 && this.size.x - this.position.x > 100 ) {
      this.position.x++;
      this.position.y++;
      this.size.x-=2;
      this.size.y-=2;
      this.counter = 0;
    }
	}
  withinRadius(pPosition){
    if (pPosition.position.x < this.position.x || pPosition.position.x > this.size.x +this.position.x || pPosition.position.y < this.position.y || pPosition.position.y > this.size.y + this.position.y)
      pPosition.hit();
  }
}
