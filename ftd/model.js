function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)

		// the logical width and height of the stage
		this.width=1000;
		this.height=1500;

		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
		this.player= new player(this,50,50,"red", new Pair(this.width/2,this.height/2)); // a special actor, the player
		this.addPlayer(this.player);


		//Add weapons and weapons list
		this.weapons = []
		var w = new Weapon(this,new Pair(600,700),20,50)
		this.addWeapon(w);
		this.addActor(w);
		// Add in somew Balls
		var total=20;
		while(total>0){
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(20), rand(20));
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = randint(20);
				var alpha = Math.random();
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var b = new Ball(this, position, velocity, colour, radius);
				this.addActor(b);
				total--;
			}
		}
	}
	addWeapon(weapon){
		this.weapons.push(weapon)
	}
	getWeapons(){
		return this.weapons
	}
	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step.
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	}

	draw(){
		//drawing the stage of the map
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		context.beginPath();
		context.lineWidth = "6";
		context.strokeStyle = "black";
		context.rect(0, 0, this.width, this.height);
		context.stroke();
		context.closePath();
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		//drawing the player

	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}
} // End Class Stage
class player {
	constructor(stage,width,height,color,position,speed){
		this.stage= stage;
		this.width = width;
		this.height = height;
		this.position = position
		this.color = color;
		this.speed = 5;
		this.equipped = null;

	}
	equip(weapon){
		if (weapon =="gun"){
			this.equipped = "gun"
		}

	}
	draw(context){
		//creating the camera for the player so it follows the player
		var cameraPosX = this.position.x-context.canvas.clientWidth/2;
		if (this.position.x<context.canvas.clientWidth/2){
			cameraPosX =+(context.canvas.clientWidth/2-this.x+5)
		} else if (this.position.x+context.canvas.clientWidth/2>this.stage.width) {
			cameraPosX = this.stage.width-context.canvas.clientWidth
		}
		var cameraPosY = this.position.y-context.canvas.clientHeight/2
		if (this.position.y<context.canvas.clientHeight/2){
			cameraPosY =+(context.canvas.clientHeight/2-this.position.y)
		} else if (this.position.y+context.canvas.clientHeight/2>this.stage.height) {
			cameraPosY = this.stage.height-context.canvas.clientHeight
		}
		// console.log(this.position.x+context.canvas.clientWidth)
		// console.log("X: " +this.position.x+" Y: "+this.position.y)
		// console.log("cameraPosY: " +cameraPosY+" CameraPosX: "+cameraPosX)
		//horizontal and vertical transformations for the camera
		context.setTransform(
			1, 0,
			0, 1,
			-1*(cameraPosX),
			-1*cameraPosY);
		// }
		//drawing the player
		context.beginPath();
		context.strokeStyle = this.color;
		context.rect(this.position.x,this.position.y,this.width,this.height)
		context.stroke();
		context.closePath();
	}
	step(){


	}
	pickUp(){
		if (!this.equipped) {
			var weaps = this.stage.getWeapons();
			for (var i=0; i<weaps.length;i++){
				var weaponPosition = weaps[i].getPosition();
				var weaponLength = weaps[i].getLength();
				if (this.position.x-weaponLength.x<weaponPosition.x && weaponPosition.x < this.position.x+this.width
					&& this.position.y-weaponLength.y<weaponPosition.y && weaponPosition.y <this.position.y+this.height){
						this.equipped= weaps[i]
						weaps[i].held(this)
					}
			}
		}


	}
	interaction(x,y){
		if (this.equipped) {
			this.equipped.shoot(this.equipped.getPosition(),x,y)
		}

	}
	move(player,keys){
		if (keys && keys['a']) {
			this.position.x += -this.speed;

		}
  	if (keys && keys['d']) {
			this.position.x+= this.speed;
		}
  	if (keys && keys['w']) {
			this.position.y += -this.speed;
		}
  	if (keys && keys['s']) {
			this.position.y += this.speed;
		}

	}

}
class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}
class Weapon {
	constructor(stage, position,width,height) {
		this.stage = stage;
		this.position = position;
		this.equipped = false;
		this.length = new Pair(width,height);
	}
	draw(context){
		context.fillStyle = "green";
		context.strokeStyle = "green";
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath();
		context.rect(this.position.x,this.position.y,20,40)
		context.fill();
		context.stroke();
		context.closePath();
	}
	held(player){
		if (!this.equipped){
			this.equipped = player
		}
	}
	step(){
		if (this.equipped){
			this.position.x = this.equipped.position.x // XXX:
			this.position.y = this.equipped.position.y
		}
	}
	getPosition(){
		return this.position
	}
	getLength(){
		return this.length
	}
	shoot(position,x,y){
		this.stage.bullet(position,x,y,3)

	}
}
class Bullet {
	construct(position,x,y,velocity){
		this.position=position;
		this.velocity=10;
	}
}
class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position

		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
	}

	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;

		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
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
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
}
