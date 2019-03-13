class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.name = "ball";
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.hp = 3; //hit 3 times the ball dies
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.images = [];

		// 4 images of the monster, representing different positions of the mouth.
		var myImage = new Image(); 	myImage.src = '/monster.png';
		var myImage1 = new Image();	myImage1.src = '/monster1.png';
		var myImage2 = new Image();	myImage2.src = '/monster2.png';
		var myImage3 = new Image();	myImage3.src = '/monster3.png';

		this.images.push(myImage);
		this.images.push(myImage1);
		this.images.push(myImage2);
		this.images.push(myImage3);

		// for animation, frames
		this.increment = 0;
	}
	// Determines the unit velocity vector of the monster
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}
	hit(){
		// hp is the health level of the monster
		this.hp--;
		if (this.hp==0){
			this.stage.removeActor(this);
			this.stage.removeBot(this);
		}
	}
	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		this.increment++;
		if (this.increment > 79)
			this.increment=0;

		// bounce off the walls
		if(this.position.x<this.stage.safezone.position.x){
			this.position.x=this.stage.safezone.position.x;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.safezone.size.x-this.stage.safezone.position.x){
			this.position.x=this.stage.safezone.size.x-this.stage.safezone.position.x;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<this.stage.safezone.position.y){
			this.position.y=this.stage.safezone.position.y;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.safezone.size.y-this.stage.safezone.position.y){
			this.position.y=this.stage.safezone.size.y-this.stage.safezone.position.y;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
		this.intPosition();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
		context.strokeStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath();
		context.drawImage(this.images[Math.floor(this.increment/20)], this.position.x - this.radius, this.position.y - this.radius);
		// context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
}
