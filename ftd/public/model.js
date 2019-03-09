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
		// the logical width and height of the stage
		this.width=1000;
		this.height=1500;

		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
		this.player= new player(this,50,50,"Red", new Pair(this.width/2,this.height/2)); // a special actor, the player
		this.addPlayer(this.player);
		//Add GUI to users screen
		this.GUI = new GUI(this.player)
		this.addActor(this.GUI);
		//Add weapons and weapons list


		var w = new Weapon(this,new Pair(600,700),"flame thrower");
		this.addWeapon(w);
		this.addActor(w);

		var a = new Weapon(this,new Pair(500,700),"bazooka");
		this.addWeapon(a);
		this.addActor(a);

		var b = new Weapon(this,new Pair(400,700),"9 mm");
		this.addWeapon(b);
		this.addActor(b);

		var c = new Weapon(this,new Pair(300,700),"sniper");
		this.addWeapon(c);
		this.addActor(c);

		var d = new Weapon(this,new Pair(250,700),"shotgun");
		this.addWeapon(d);
		this.addActor(d);



		this.addWeapon(w);
		this.addActor(w);
		//where the cursor is placed
		this.cursor = 0;
		// Add in some Balls
		var total=12;
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
				var b = new Ball(this, position, velocity, colour, radius);
				this.bots.push(b);
				this.addActor(b);
				total--;
			}
		}
		// Create Ammo
		var total=5;
		while(total>0){
			var x = Math.floor((Math.random()*this.width));
			var y = Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var a = new Ammo(this,new Pair(x,y),new Pair(15,15));
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
	createBullet(player,target,radius,speed,range,color){
		var bullet = new Bullet(this,player,target,radius,speed,range,color);
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
		//Drawing most of the objects
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
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
		this.speed = 5;
		this.colour = 'rgba('+255+','+205+','+148+','+1+')';
		this.radius = 50;

		this.pickup_range = 50;

		this.equipped = null;
		this.cameraPosX = this.position.x - this.stage.canvas.clientWidth/2;
		this.cameraPosY = this.position.y - this.stage.canvas.clientHeight/2;
	}
	shoot(x,y){
		// If the player has a gun.
		if (this.equipped){

			// position of the gun on the moving paper
			var raw_pos_gun = this.equipped.position;

			if(this.equipped.shoot()){
				if (this.equipped.type == "flame thrower") {
					for (var i = 0; i < 10; i++) {
						var position = new Pair(raw_pos_gun.x+i*3,raw_pos_gun.y+i*3);
						this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);

					}

				}if (this.equipped.type == "shotgun") {
					for (var i = 0; i < 3; i++) {
						var j= i;
						var k = i;
						if (this.equipped.rotation < 0 && this.equipped.rotation > -(90*Math.PI/180) ){k = -i;}
						if (this.equipped.rotation < (180*Math.PI/180) && this.equipped.rotation > (90*Math.PI/180) ){j = -i;}

						var position = new Pair(raw_pos_gun.x+j*5,raw_pos_gun.y+k*5);
						this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);

					}

				}else {
					this.stage.createBullet(this,raw_pos_gun,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);

				}
			}
		}

	}
	draw(context){

		context.setTransform(1, 0, 0, 1, -1*(this.cameraPosX), -1*this.cameraPosY);

		context.save();
		context.fillStyle = this.colour;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
	}
	step(){
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
			var weaps = this.stage.getWeapons();
			for (var i=0; i<weaps.length;i++){
				var weaponPosition = weaps[i].getPosition();
				var weaponLength = weaps[i].getLength();

				if (this.position.x - this.pickup_range < weaponPosition.x &&
				weaponPosition.x < this.position.x + this.pickup_range &&
				this.position.y - this.pickup_range < weaponPosition.y &&
				weaponPosition.y < this.position.y + this.pickup_range){
						this.equipped= weaps[i];
						weaps[i].held(this);
						this.stage.add_gun_GUI(weaps[i]);
					}
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
	dropDown(){
		if (this.equipped){
			this.equipped.drop();
			this.equipped = null;
			this.stage.remove_gun_GUI();
		}


	}
	move(player,keys){
	if (keys && keys['a'] && this.position.x>5) {
			this.position.x += -this.speed;
		}
  	if (keys && keys['d'] && this.position.x<this.stage.width) {
			this.position.x+= this.speed;
		}
  	if (keys && keys['w'] && this.position.y>5) {
			this.position.y += -this.speed;
		}
  	if (keys && keys['s'] && this.position.y<this.stage.height) {
			this.position.y += this.speed;
		}
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
		context.fillText("Ammo: "+this.ammo,10,50);
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

	constructor(stage, position, type){
		this.stage = stage;
		this.position = position;
		this.equipped = false;
		this.rotation = 0;
		this.type = type;

		if(this.type == "flame thrower"){
			this.length = new Pair(20,30);
			this.ammo = 100;
			this.gun_color = "green";

			this.bullet_size = 10;
			this.bullet_speed = 0.1; //range of 0 to 1
			this.bullet_range = 150;
			this.bullet_color = "#fff605";
		}
		else if(this.type == "sniper"){
			this.length = new Pair(5,30);
			this.ammo = 5;
			this.gun_color = "black";

			this.bullet_size = 4.5;
			this.bullet_speed = 0.6;
			this.bullet_range = 500;
			this.bullet_color = "red";
		}
		else if(this.type == "9 mm"){
			this.length = new Pair(5,10);
			this.ammo = 12;
			this.gun_color = "gray";

			this.bullet_size = 5;
			this.bullet_speed = 0.3;
			this.bullet_range = 250;
			this.bullet_color = "black";

		}

		else if(this.type == "bazooka"){
			this.length = new Pair(30,40);
			this.ammo = 3;
			this.gun_color = "#2b8740";

			this.bullet_size = 20;
			this.bullet_speed = 0.05;
			this.bullet_range = 200;
			this.bullet_color = "#798c6a";
		}

		else if(this.type == "shotgun"){
			this.length = new Pair(10,15);
			this.ammo = 30;
			this.gun_color = "#c97d0c";

			this.bullet_size = 5;
			this.bullet_speed = 0.3;
			this.bullet_range = 200;
			this.bullet_color = "purple";
		}
	}


	draw(context){
		context.save();
		context.translate(this.position.x,this.position.y);
		context.beginPath();
		context.fillStyle = this.gun_color;
		context.strokeStyle = this.gun_color;
		context.rotate(this.rotation);
		context.rect(0,-(this.length.x/2),this.length.y,this.length.x);
		context.fill();
		context.closePath();
		context.stroke();
		context.restore();
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


		}
	}
	getPosition(){
		return this.position;
	}
	getLength(){
		return this.length;
	}
	shoot(){
		if (this.ammo >= 5 && this.type == "flame thrower"){
			this.ammo -= 5;
			return true;
		}
		if (this.ammo >= 3 && this.type == "shotgun"){
			this.ammo -= 3;
			return true;
		}

		if (this.ammo > 0 && (this.type == "sniper" ||
		 					   this.type == "9 mm" ||
						   	   this.type == "bazooka")){
			this.ammo -= 1;
			return true;
		}
			return false;
	}
}
class Bullet {
	constructor(stage,player,position, radius, speed,range, color){
		this.stage = stage;
		this.position = new Pair(player.equipped.position.x,player.equipped.position.y);
		this.range = range;
		this.initial = new Pair(this.position.x,this.position.y);
		this.dx = position.x-player.position.x;
		this.dy = position.y-player.position.y;
		this.radius = radius;
		this.color = color;
		this.speed = speed ;
	}
	draw(context){
		context.save();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
		context.closePath();
		context.restore();
	}
	step(){
		/* updating position of bullet */
		// the larger the fraction, the greater the speed of the bullet
		this.position.x+=(this.dx) * this.speed;
		this.position.y+=(this.dy) * this.speed;

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
class Ammo{
	constructor(stage,position,size){
		this.stage = stage;
		this.position = position;
		this.size = size;
	}
	draw(context){
		context.beginPath();
		context.strokeStyle = "Purple";
		context.fillStyle = "Purple";
		context.rect(this.position.x,this.position.y,this.size.x,this.size.y);
		context.stroke();
		context.fill();
		context.closePath();
	}
	step(){}
}
/*
class Blocks {
	constructor(){
		this.stage = stage;
		this.position = // when constructed, position needs to be players at first ;
	}
}
*/
