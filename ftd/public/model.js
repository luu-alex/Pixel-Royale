function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
		this.actors= []; // all actors on this stage (monsters, player, boxes, ...)
		this.weapons = [];
		this.bullets = [];
		this.bots = [];
		this.ammos = [];
		this.terrain = [];
		this.teleporters = [];
		// the logical width and height of the stage
		this.width=2000;
		this.height=2000;

		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
		this.player= new player(this,50,50,"Red", new Pair(this.width/2,this.height/2)); // a special actor, the player
		this.addPlayer(this.player);
		//Add GUI to users screen
		this.GUI = new GUI(this.player)
		//Add weapons and weapons list
		var w = new Weapon(this,new Pair(600,700),20,50);
		this.addWeapon(w);
		this.addActor(w);
		//Create terrain
		var t = new Terrain("grassy", new Pair(0,0), new Pair(this.width/2,this.height/2))
		var t1 = new Terrain("desert", new Pair(this.width/2,0), new Pair(this.width/2,this.height/2))
		var t2 = new Terrain("grassy", new Pair(0,this.height/2), new Pair(this.width/2,this.height/2))
		var t3 = new Terrain("desert", new Pair(this.width/2,this.height/2), new Pair(this.width/2,this.height/2))
		this.terrain.push(t)
		this.terrain.push(t1)
		this.terrain.push(t2)
		this.terrain.push(t3)
		//create teleporter
		var teleporter = new Teleporter(this, new Pair(0, this.height/2));
		this.addActor(teleporter)
		this.teleporters.push(teleporter);
		var teleporter2 = new Teleporter(this, new Pair(this.width-100,this.height/2))
		this.teleporters.push(teleporter2);
		this.addActor(teleporter2)
		//where the cursor is placed
		this.cursor = 0;
		// Add in some Balls
		var total=5;
		while(total>0){
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(11), rand(11));
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = randint(30);
				var alpha = Math.random();
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var b = new Ball(this, position, velocity, colour, 50);
				this.bots.push(b);
				this.addActor(b);
				total--;
			}
		}
		// Create Ammo
		var total=15;
		while(total>0){
			var x = Math.floor((Math.random()*this.width));
			var y = Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var a = new Ammo(this,new Pair(x,y),new Pair(40,40));
				this.ammos.push(a);
				this.addActor(a);
				total--;
			}
		}
	}
	removeAmmo(ammo){
		var index=this.ammos.indexOf(ammo);
		if(index!=-1){
			this.ammos.splice(index,1);
		}
	}
	getAmmo(){
		return this.ammos;
	}
	add_gun_GUI(weapon){
		this.GUI.addWeapon(weapon);
	}
	remove_gun_GUI(weapon){
		this.GUI.removeWeapon();
	}
	removeBot(bot){
		var index=this.bots.indexOf(bot);
		if(index!=-1){
			this.bots.splice(index,1);
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
		var rect = this.canvas.getBoundingClientRect();

	}
	addWeapon(weapon){
		this.weapons.push(weapon);
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
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
		this.GUI.step();
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
		for (var i=0; i<this.terrain.length;i++){
			this.terrain[i].draw(context);
		}
		//Drawing most of the objects
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		this.GUI.draw(context);

	}
	renderVicinity(actor){
		if ( (this.player.cameraPosX == 0 && actor.position.x < this.canvas.clientWidth/2+100) ||
				 (this.player.cameraPosX != 0 && this.player.cameraPosX - this.canvas.clientWidth/2 - 100 < actor.position.x &&
				  actor.position.x < this.player.cameraPosX + this.canvas.clientWidth/2 + 100))
					console.log("its around my x");
	}
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;}
}
class player {
	constructor(stage,width,height,color,position,speed){
		this.stage= stage;
		this.position = position;
		this.speed = new Pair(0,0);
		this.colour = 'rgba('+255+','+205+','+148+','+1+')';
		this.radius = 50;
		this.pickup_range = 75;
		this.equipped = null;
		this.cameraPosX = this.position.x - this.stage.canvas.clientWidth/2;
		this.cameraPosY = this.position.y - this.stage.canvas.clientHeight/2;
		this.myImage = new Image();
		this.myImage.src = '/wall.jpeg';
	}
	name(){
		return "player"
	}
	shoot(x,y){
		// If the player has a gun.
		if (this.equipped){

			// position of the gun on the moving paper
			var raw_pos_gun = this.equipped.position;

			if(this.equipped.shoot()){
				this.stage.createBullet(this,raw_pos_gun,10);
			}
		}

	}
	draw(context){
		context.setTransform(1, 0, 0, 1, -1*(this.cameraPosX), -1*this.cameraPosY);
		context.save();
		context.fillStyle = this.colour;
		context.beginPath();
		// context.drawImage(this.myImage, this.position.x, this.position.y);
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
	step(){
		//check if player is within bounds
		var terrainSpeed=1;
		if (this.position.x <= this.stage.width/2 && this.position.y <= this.stage.height/2){
			var terrainSpeed =  this.stage.terrain[0].speed
		}
		if (this.position.x > this.stage.width/2 && this.position.y < this.stage.height/2){
			var terrainSpeed =  this.stage.terrain[1].speed
		}
		if (this.position.x <= this.stage.width/2 && this.position.y >= this.stage.height/2){
			var terrainSpeed =  this.stage.terrain[2].speed
		}
		if (this.position.x > this.stage.width/2 && this.position.y > this.stage.height/2){
			var terrainSpeed =  this.stage.terrain[3].speed
		}
		this.speed.x = this.speed.x* terrainSpeed
		this.speed.y = this.speed.y*terrainSpeed
		if (this.speed.x < 0 && this.position.x - this.radius> 5) this.position.x += this.speed.x;
		if (this.speed.x > 0 && this.position.x + this.radius < this.stage.width) this.position.x += this.speed.x;
		if (this.speed.y > 0 && this.position.y < this.stage.height - this.radius) this.position.y += this.speed.y;
		if (this.speed.y < 0 && this.position.y > 5 + this.radius) this.position.y += this.speed.y;
		this.speed.x = this.speed.x/terrainSpeed
		this.speed.y = this.speed.y/terrainSpeed

		//walking through terrain causes different velocity


		//creating the camera for the player so it follows the player
		this.cameraPosX = this.position.x-this.stage.canvas.width/2;
		if (this.position.x < this.stage.canvas.clientWidth/2){
			this.cameraPosX =0;
		} else if (this.position.x + this.stage.canvas.clientWidth/2 > this.stage.width) {
			this.cameraPosX = this.stage.width - this.stage.canvas.clientWidth;
		}

		this.cameraPosY = this.position.y - this.stage.canvas.clientHeight/2;
		if (this.position.y < this.stage.canvas.clientHeight/2){ //0 case
			this.cameraPosY = 0;
		} else if (this.position.y + this.stage.canvas.clientHeight/2 > this.stage.height) {
			this.cameraPosY = this.stage.height - this.stage.canvas.clientHeight;
		}
	}
	pickUp(){
		if (!this.equipped){
			var weaps = this.stage.weapons;
			for (var i=0; i<this.stage.weapons.length;i++){
				if (this.pickUpHelper(weaps[i])){
						this.equipped= weaps[i];
						weaps[i].held(this);
						this.stage.add_gun_GUI(weaps[i]);
				}
			}
		}
		for (var i=0; i < this.stage.teleporters.length; i++){
			if (this.pickUpHelper(this.stage.teleporters[i])){
				this.teleport(this.stage.teleporters[i].position.x)
				break;
			}
		}
		var ammos = this.stage.getAmmo();
		if (this.equipped){
			for (var i=0;i<ammos.length;i++){
				var aPosition = ammos[i].position;
				var size = ammos[i].size;
				if (this.position.x - this.pickup_range < aPosition.x &&
				aPosition.x < this.position.x + this.pickup_range &&
				this.position.y - this.pickup_range < aPosition.y &&
				aPosition.y < this.position.y + this.pickup_range){
						this.equipped.ammo=30;
						this.stage.removeActor(ammos[i])
						this.stage.removeAmmo(ammos[i])
					}
				}
			}
	}
	teleport(posX){
		console.log("posX: "+ posX)
		if (posX <400) this.position.x = this.stage.width-50;
		else this.position.x = 50;
	}
	pickUpHelper(pickUp){
		var objPos = pickUp.position;
		console.log(this.position.x - this.pickup_range)
		if (this.position.x - this.pickup_range < objPos.x &&
		objPos.x < this.position.x + this.pickup_range &&
		this.position.y - this.pickup_range < objPos.y &&
		objPos.y < this.position.y + this.pickup_range){
				return true;
		}
	}
	dropDown(){
		if (this.equipped){
			this.equipped.drop();
			this.equipped = null;
			this.stage.remove_gun_GUI();
		}


	}
	stopMovement(keys){
		if(keys=='a' || keys=='d') this.speed.x= 0;
		if(keys=='w' || keys=='s') this.speed.y= 0;
	}
	move(player,keys){
	if (keys && keys['a'] && this.position.x+ this.radius > 5) {
			this.speed.x = -5;
		}
  	if (keys && keys['d'] && this.position.x<this.stage.width) {
			this.speed.x = 5;
		}
  	if (keys && keys['w'] && this.position.y + this.radius >5) {
			this.speed.y = -5;
		}
  	if (keys && keys['s'] && this.position.y<this.stage.height) {
			this.speed.y = 5;
		}
	}
	drawMap(context){
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
}
class GUI{
	constructor(player){
		this.player = player;
		this.ammo = 0;
		this.health = 3;
		this.x=this.player.cameraPosX;
		this.weapon = null;
	}
	draw(context){
		context.save();
		if (!this.player.cameraPosX)
			var x=0;
		else
			var x=this.player.cameraPosX;
		context.translate(x,this.player.cameraPosY);
		context.beginPath();
		context.fillStyle="black"
		context.font = "30px Arial";
		context.fillText("Ammo: "+this.ammo,150,context.canvas.clientHeight-30);
		context.fillText("Health: "+this.health,10,context.canvas.clientHeight-30);
		context.restore();
	}
	step(){
		if(this.weapon)
			this.ammo = this.weapon.ammo;
	}
	addWeapon(weapon){
		this.weapon = weapon;
	}
	removeWeapon(){
		this.ammo = 0;
		this.weapon = null;
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
	constructor(stage, position, width, height) {
		this.stage = stage;
		this.position = position;
		this.equipped = false;
		this.length = new Pair(width,height);
		this.rotation = 0;
		this.ammo = 50;
		this.myImage = new Image();
		this.myImage.src = '/gun2.png';
	}
	draw(context){
		context.save();
		context.translate(this.position.x,this.position.y);
		context.beginPath();
		context.fillStyle = "gray";
		context.strokeStyle = "gray";
		context.rotate(this.rotation);
		context.drawImage(this.myImage, 0, 0);
		context.fill();
		context.closePath();
		context.stroke();
		context.restore();
	}
	name(){
		return "weapon"
	}
	held(player){
		if (!this.equipped){
			this.equipped = player;
		}
	}
	drop(){
		if (this.equipped){
			this.equipped = null;
		}
	}
	step(){
		if (this.equipped){

			//Where the canvas is in relation to the moving paper
			var rect = this.stage.canvas.getBoundingClientRect();

			// position of the player on the moving paper
			var raw_pos_player = this.equipped.position; 	// this should be p,q cuz its the pos of player

			var tx = raw_pos_player.x - this.equipped.cameraPosX;
			var ty = raw_pos_player.y - this.equipped.cameraPosY;
			// position of the player on the paper with the hole
			var pos_player = new Pair(rect.x + tx, rect.y + ty);
			// cursor position on the paper with the hole (better this way since
			// even if the mouse is placed outside of the canvas, it will still
			//work.)
			var cursor = this.stage.getCursor();

			var slope = new Pair(cursor.x - pos_player.x, cursor.y - pos_player.y);
			var angle_Rad = Math.atan2(slope.y,slope.x);
			this.rotation = angle_Rad;

			slope.normalize();	//It converts slope vector into unit vectors.

			// 55 is the distance of the gun from the center of the player.
			this.position.x = raw_pos_player.x + slope.x * 55;
			this.position.y = raw_pos_player.y + slope.y * 55;

			// console.log((angle_Rad*180)/Math.PI);

		}
	}
	getPosition(){
		return this.position;
	}
	getLength(){
		return this.length;
	}
	shoot(){
		if (this.ammo>0){
			this.ammo--;
			return true
		}
			return false
	}
}
class Bullet {
	constructor(stage,player,position, radius){
		this.stage = stage;
		// Bullets should start firing from the gun position.
		this.position = new Pair(player.equipped.position.x,player.equipped.position.y);
		this.range = 300; // What does this do exactly?
		this.initial = new Pair(this.position.x,this.position.y);
		this.dx = position.x-player.position.x;
		this.dy = position.y-player.position.y;
		this.radius = radius;
		this.color ="Black";
		this.myImage = new Image();
		this.myImage.src = '/bullet.png';
	}
	name(){
		return "bullet"
	}
	draw(context){
		context.save();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.drawImage(this.myImage, this.position.x-this.radius/2, this.position.y-this.radius/2);
		// context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
		context.restore();
	}
	step(){
		/* updating position of bullet */
		// the larger the fraction, the greater the speed of the bullet
		this.position.x+=(this.dx)/5;
		this.position.y+=(this.dy)/5;

		/* collision check with walls and range */
		if (this.position.x < 0 ||
			this.position.x > this.stage.width ||
			this.position.y > this.stage.height ||
			this.position.y < 0 ||
			this.initial.x + this.range < this.position.x ||
			this.initial.x - this.range > this.position.x ||
			this.initial.y + this.range < this.position.y ||
			this.initial.y - this.range > this.position.y){
			stage.removeActor(this);
		}

		/* collision check with enemies */
		var enemies = this.stage.getBots();
		for (var i=0; i<enemies.length;i++){
			if ((this.position.x-this.radius <enemies[i].position.x && enemies[i].position.x < this.position.x+this.radius)
			&&
				 (this.position.y-this.radius <enemies[i].position.y && enemies[i].position.y < this.position.y+this.radius)){
						enemies[i].hit();
					}
		}
	}
}
class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.hp=3; //hit 3 times the ball dies
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.images = [];
		var myImage = new Image();
		myImage.src = '/monster.png';
		var myImage1 = new Image();
		myImage1.src = '/monster1.png';
		var myImage2 = new Image();
		myImage2.src = '/monster2.png';
		var myImage3 = new Image();
		myImage3.src = '/monster3.png';
		this.images.push(myImage)
		this.images.push(myImage1)
		this.images.push(myImage2)
		this.images.push(myImage3)
		this.increment = 0;
	}
	name(){
		return "ball"
	}
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}
	hit(){
		this.hp--;
		if (this.hp==0){
			this.stage.removeActor(this)
			this.stage.removeBot(this)
		}
	}
	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
		this.increment++;
		if (this.increment > 79)
			this.increment=0;

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
		context.drawImage(this.images[Math.floor(this.increment/20)], this.position.x - this.radius, this.position.y - this.radius);
		// context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
}
class Ammo {
	constructor(stage,position,size){
		this.stage = stage;
		this.position = position;
		this.size = size;
		this.myImage = new Image();
		this.myImage.src = '/chest.png';
	}
	name(){
		return "ammo"
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
class Teleporter { //these will teleport you across the map
	constructor(stage,position){
		this.stage =  stage;
		this.position = position;
		this.myImage = new Image();
		this.myImage.src = '/rotated_door.png';
	}
	draw(context){
		context.save();
		context.beginPath();
		// context.drawImage(this.myImage, this.position.x, this.position.y);
		context.drawImage(this.myImage, this.position.x, this.position.y);
		context.closePath();
	}
	step(){

	}
}
/*
class Blocks {
	constructor(){
		this.stage = stage;
		this.position = // when constructed, position needs to be players at first ;
	}
}
*/
