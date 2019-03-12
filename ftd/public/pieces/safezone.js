class Safezone { //Area representing safety, outside it players will take damage
	constructor(stage,position,size){
		this.counter = 1;
		this.position = position;
    	this.size = size;
    	this.stage=  stage;
	}
	draw(context){
		context.beginPath();
    	context.strokeStyle = "blue";
		context.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    	context.stroke();
		context.closePath();
	}
	step(){
    	this.counter++;
    	this.withinRadius(this.stage.player);
		//Check if bots are outside of safezone
		for (var i=0; i<this.stage.bots.length; i++) {
			this.withinRadius(this.stage.bots[i]);
		}
		//Safezone shrinking
    if (this.counter>10 && this.size.x - this.position.x > 100 ) {
      this.position.x++;
      this.position.y++;
      this.size.x-=2;
      this.size.y-=2;
      this.counter = 0;
    }
	}
	withinRadius(pPosition){ //Collision check if object is outside of radius
  	if (pPosition.position.x < this.position.x || pPosition.position.x > this.size.x +this.position.x || pPosition.position.y < this.position.y || pPosition.position.y > this.size.y + this.position.y){
    		pPosition.hit();
		}
	}
}
