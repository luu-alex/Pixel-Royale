class Teleporter { //these will teleport you across to the other teleporter
	constructor(stage,position){
		this.stage =  stage;
		this.position = position;
		this.myImage = new Image();
		this.myImage.src = '/rotated_door.png';
	}
	draw(context){
		context.save();
		context.beginPath();
		context.drawImage(this.myImage, this.position.x, this.position.y);
		context.closePath();
	}
	step(){}
}
