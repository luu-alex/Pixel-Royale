class Ammo {
	constructor(stage,position,size){
		this.name = "ammo";
		this.stage = stage;
		this.position = position;
		this.size = size;
		this.myImage = new Image();
		this.myImage.src = '/chest.png';
	}
	name(){
		return "ammo"
	}
	grab_ammo(type){
		if (type == "flame thrower"){return 100;}
		else if (type == "sniper"){return 5;}
		else if (type == "9 mm"){return 12;}
		else if (type == "bazooka"){return 3;}
		else if (type == "shotgun"){return 30;}
	}
	draw(context){
		context.beginPath();
		context.strokeStyle = "Purple";
		context.fillStyle = "Purple";
		context.drawImage(this.myImage, this.position.x, this.position.y);
		// context.rect(this.position.x,this.position.y,this.size.x,this.size.y);
		context.stroke();
		context.fill();
		context.closePath();
	}
	step(){}
}
