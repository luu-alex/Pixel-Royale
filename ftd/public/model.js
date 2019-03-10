function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
function distance(pos1,pos2){
	var x = Math.abs(pos1.x - pos2.x);
	var y = Math.abs(pos1.y - pos2.y);
	return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}

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
		this.trees = [];
		// the logical width and height of the stage
		this.width=2000;
		this.height=2000;

		// Add the player to the center of the stage
		this.player= new player(this, new Pair(this.width/2,this.height/2),5);
		this.addPlayer(this.player);

		var z = new Bot(this, new Pair(0,0));
		this.addBot(z);
		this.addActor(z);

		//Add GUI to users screen
		this.GUI = new GUI(this, this.player)
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
		var teleporter2 = new Teleporter(this, new Pair(this.width-100,this.height/2))
		this.addActor(teleporter)
		this.addActor(teleporter2)
		this.teleporters.push(teleporter);
		this.teleporters.push(teleporter2);
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
				var a = new Ammo(this,new Pair(x,y),new Pair(15,15));
				this.ammos.push(a);
				this.addActor(a);
				total--;
			}
		}
		var total=5;
		while(total>0){
			var x = Math.floor((Math.random()*this.width));
			var y = Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var a = new Tree(this,new Pair(x,y));
				this.trees.push(a);
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
	addBot(bot){
		this.bots.push(bot);
	}
	removeBot(bot){
		var index=this.bots.indexOf(bot);
		if(index!=-1){
			this.bots.splice(index,1);
		}
	}
	removeTree(tree){
		var index=this.trees.indexOf(tree);
		if(index != -1) {
			this.trees.splice(index,1);
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
			context.setTransform(1, 0, 0, 1, -1*(this.player.cameraPosX), -1*this.player.cameraPosY);
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




/*
class Blocks {
	constructor(){
		this.stage = stage;
		this.position = // when constructed, position needs to be players at first ;
	}
}
*/

class Bot{
	constructor(stage,position){
		this.name = "bot";
		this.stage = stage;
		this.position = position;
		this.speed = 3;
		this.colour = 'rgba('+255+','+205+','+148+','+1+')';
		this.radius = 50;

		this.pickup_range = 50;
		this.equipped = null;

		this.closest_weapon = null;
		this.closest_ammo = null;
		this.target = this.stage.player;
	}
	shoot(){
		// position of the gun on the moving paper
		var raw_pos_gun = this.equipped.position;

		if(this.equipped.shoot()){
			if (this.equipped.type == "flame thrower") {
				for (var i = 0; i < 10; i++) {
					var position = new Pair(raw_pos_gun.x+i*3,raw_pos_gun.y+i*3);
					this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);

				}

			}
			if (this.equipped.type == "shotgun") {
				for (var i = 0; i < 3; i++) {
					var j= i;
					var k = i;
					if (this.equipped.rotation < 0 && this.equipped.rotation > -(90*Math.PI/180) ){k = -i;}
					if (this.equipped.rotation < (180*Math.PI/180) && this.equipped.rotation > (90*Math.PI/180) ){j = -i;}

					var position = new Pair(raw_pos_gun.x+j*5,raw_pos_gun.y+k*5);
					this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);

				}

			}
			else {
				this.stage.createBullet(this,raw_pos_gun,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color);
			}
		}
	}
	hit(){
		this.hp--;
		console.log("monster hit")
		if (this.hp==0){
			this.stage.removeActor(this)
			this.stage.removeBot(this)
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
		// update closest weapon
		for (var i = 0; i < this.stage.weapons.length; i++) {

			if (this.stage.weapons[i] == this.equipped ||
				this.stage.weapons[i] == this.target.equipped ||
				this.stage.weapons[i].ammo == 0) {continue;}

			else if((this.closest_weapon == null) ||
				   (distance(this.stage.weapons[i].position,this.position) < distance(this.closest_weapon.position,this.position))){
				this.closest_weapon = this.stage.weapons[i];
			}
		}

		// update closest ammo
		for (var i = 0; i < this.stage.ammos.length; i++) {

			if((this.closest_ammo == null) ||
			  (distance(this.stage.ammos[i].position,this.position) < distance(this.closest_ammo.position,this.position))){
				this.closest_ammo = this.stage.ammos[i];
			}
		}

		var in_vacinity = (this.target.position.x - 200 < this.position.x &&
						  this.position.x < this.target.position.x + 200 &&
						  this.target.position.y - 200 < this.position.y &&
						  this.position.y < this.target.position.y + 200);

		// If you don't have a gun go to the closest gun and grab it.
		// console.log(this.equipped == null);
		if (this.equipped == null) {
			var d = new Pair(this.closest_weapon.position.x - this.position.x,this.closest_weapon.position.y - this.position.y);
			d.normalize();
			this.position.x += d.x * this.speed;
			this.position.y += d.y * this.speed;

			this.pickUp(this.closest_weapon);
		}
		// If you have ran out of ammo, either get a new gun or get ammo, whichever one is the closest
		else if (this.equipped && this.equipped.ammo == 0) {

			if (distance(this.position,this.closest_weapon.position) < distance(this.position, this.closest_ammo.position)) {
				var d = new Pair(this.closest_weapon.position.x - this.position.x,this.closest_weapon.position.y - this.position.y);
				d.normalize();
				this.position.x += d.x * this.speed;
				this.position.y += d.y * this.speed;

				this.pickUp(this.closest_weapon);
				this.closest_weapon = null;

			}
			else if (distance(this.position,this.closest_weapon.position) >= distance(this.position, this.closest_ammo.position)) {

				var d = new Pair(this.closest_ammo.position.x - this.position.x,this.closest_ammo.position.y - this.position.y);
				d.normalize();
				this.position.x += d.x * this.speed;
				this.position.y += d.y * this.speed;

				this.pickUp(this.closest_ammo);
				this.closest_ammo = null;
			}
		}
		// If you are not near the player
		else if (!in_vacinity) {
			var d = new Pair(this.target.position.x - this.position.x,this.target.position.y - this.position.y);
			d.normalize();
			this.position.x += d.x * this.speed;
			this.position.y += d.y * this.speed;

		}
		// If you are near the player
		else if (in_vacinity) {
			this.shoot();
		}

	}
	pickUp(object){
		if (object.name == "weapon") {
			var weaponPosition = object.position;

			if (this.position.x - this.pickup_range < weaponPosition.x &&
			weaponPosition.x < this.position.x + this.pickup_range &&
			this.position.y - this.pickup_range < weaponPosition.y &&
			weaponPosition.y < this.position.y + this.pickup_range){
				if (this.equipped){
					this.closest_weapon = null;
					var x=Math.floor((Math.random()*this.stage.width));
					var y=Math.floor((Math.random()*this.stage.height));
					this.equipped.drop();
					this.equipped.ammo = 30;
					this.equipped.position = new Pair(x,y);
					this.equipped = null;
				}
				this.equipped = object;
				object.held(this);
			}
		}
		else if (object.name == "ammo" && this.equipped!= null) {
			var ammoPosition = object.position;

			if (this.position.x - this.pickup_range < ammoPosition.x &&
			ammoPosition.x < this.position.x + this.pickup_range &&
			this.position.y - this.pickup_range < ammoPosition.y &&
			ammoPosition.y < this.position.y + this.pickup_range){

					this.equipped.ammo = object.grab_ammo(this.equipped.type);
					var x=Math.floor((Math.random()*this.stage.width));
					var y=Math.floor((Math.random()*this.stage.height));
					object.position = new Pair(x,y);
					this.closest_ammo = null;
					// this.stage.removeAmmo(object);
					// this.stage.removeActor(object);
				}
			}
	}

}
