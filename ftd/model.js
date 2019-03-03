function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
		this.actors= []; // all actors on this stage (monsters, player, boxes, ...)
		this.weapons = [];
		this.bullets = [];
		this.bots = [];
		// the logical width and height of the stage
		this.width=1000;
		this.height=1500;

		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
		this.player= new player(this,50,50,"red", new Pair(this.width/2,this.height/2)); // a special actor, the player
		this.addPlayer(this.player);


		//Add weapons and weapons list

		var w = new Weapon(this,new Pair(600,700),20,50);
		this.addWeapon(w);
		this.addActor(w);

		//where the cursor is placed
		this.cursor = 0;
		// Add in somew Balls
		var total=1;
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
	createBullet(player,target,radius){
		var bullet = new Bullet(this,player,target,radius);
		this.bullets.push(bullet);
		this.addActor(bullet);
	}
	getBots(){
		return this.bots;
	}
	getCursor(){
			return this.cursor;
	}
	updateCursor(positionY,positionX){ //inverted for atan2
		this.cursor = new Pair(positionX, positionY);
	}
	addWeapon(weapon){
		this.weapons.push(weapon);
	}
	getWeapons(){
		return this.weapons;
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
		console.log(this.actors.length)
	}
	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}
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
		this.position = position;
		this.color = color;
		this.speed = 5;
		this.equipped = null;
	}
	shoot(x,y){
		var rect = this.stage.canvas.getBoundingClientRect();
		let x1 = (x - rect.left + this.stage.width/2-75);
		let y1 = (y - rect.left + this.stage.height/2-100)
		if (this.equipped){
			var target = new Pair(x1,y1);
			this.equipped.shoot(target)
			this.stage.createBullet(this,target,5); // new Bullet(this,initial,target,velocity,5);
		}
	}
	draw(context){
		//creating the camera for the player so it follows the player
		var cameraPosX = this.position.x-context.canvas.clientWidth/2;
		if (this.position.x<context.canvas.clientWidth/2){
			cameraPosX =+(context.canvas.clientWidth/2-this.x+5);
		} else if (this.position.x+context.canvas.clientWidth/2>this.stage.width) {
			cameraPosX = this.stage.width-context.canvas.clientWidth;
		}
		var cameraPosY = this.position.y-context.canvas.clientHeight/2;
		if (this.position.y<context.canvas.clientHeight/2){
			cameraPosY =+(context.canvas.clientHeight/2-this.position.y);
		} else if (this.position.y+context.canvas.clientHeight/2>this.stage.height) {
			cameraPosY = this.stage.height-context.canvas.clientHeight;
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
		context.rect(this.position.x,this.position.y,this.width,this.height);
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
						this.equipped= weaps[i];
						weaps[i].held(this);
					}
			}
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
		console.log("x: "+this.position.x +" y: "+this.position.y)
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
		this.rotation = 0;
	}
	draw(context){
		context.save();
		context.translate(this.position.x,this.position.y);
		context.rotate(this.rotation)
		context.fillStyle = "green";
		context.strokeStyle = "green";
		context.rect(0,0,25,12)
		context.fill();
		context.stroke();
		context.restore();
	}
	held(player){
		if (!this.equipped){
			this.equipped = player;
		}
	}
	step(){
		if (this.equipped){
			var rect = this.stage.canvas.getBoundingClientRect();
			var cursor = this.stage.getCursor();
			this.position.x = this.equipped.position.x;
			this.position.y = this.equipped.position.y;

			var x1 = (cursor.x-rect.left-this.equipped.position.x );
			var y1 = cursor.y-(this.stage.canvas.height/2 -rect.top-25)
			console.log("cursorX:" + (cursor.x-rect.left)+ "position x1: "+ x1+" CursorY: "+(cursor.y-rect.top)+" positionY: "+y1)
			this.rotation = Math.atan2(y1,x1);
		}
	}
	getPosition(){
		return this.position;
	}
	getLength(){
		return this.length;
	}
	shoot(position,x,y){
	}
}
class Bullet {
	constructor(stage,player,position, radius){
		this.stage= stage;
		this.position = new Pair(player.position.x,player.position.y);
		console.log("My click Y: "+ position.y+ " Player Pos Y: "+player.position.y)
		this.dx = position.x-player.position.x
		this.dy = position.y-player.position.y
		this.radius = radius;
		this.color ="Black";
	}
	draw(context){
		context.save();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
		context.restore();
	}
	step(){
		//updating position of bullet
		this.position.x+=(this.dx)/4
		this.position.y+=(this.dy)/4

		//collision check with walls
		if (this.position.x<0 || this.position.x>this.stage.width || this.position.y>this.stage.height || this.position.y < 0){
			stage.removeActor(this);
		}
		//collision check with enemies
		// var enemies = this.stage.getBots();
		// for (var i=0; i<enemies.length;i++){
		// }
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
