class Bot extends People{
	constructor(stage,position){
    super(stage,position)
		this.name = "bot";
		this.speed = 3;
		this.radius = 50;
		this.pickup_range = 50;
		this.equipped = null;	//holding no gun to begin with
    	this.img = new Image()
    	this.img.src = './ogre.png'
		this.closest_weapon = null;
		this.closest_ammo = null;
		this.target = this.stage.player;
    	this.hp=5; 	//hp is monsters health
	}
	shoot(){
		// position of the gun on the moving paper
		var raw_pos_gun = this.equipped.position;
		if(this.equipped.shoot()){
			if (this.equipped.type == "flame thrower") {
				for (var i = 0; i < 10; i++) {
					var position = new Pair(raw_pos_gun.x+i*3,raw_pos_gun.y+i*3);
					this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color, this.equipped.type);
				}
			}
			if (this.equipped.type == "shotgun") {
				for (var i = 0; i < 3; i++) {
					var j= i;
					var k = i;
					if (this.equipped.rotation < 0 && this.equipped.rotation > -(90*Math.PI/180) ){k = -i;}
					if (this.equipped.rotation < (180*Math.PI/180) && this.equipped.rotation > (90*Math.PI/180) ){j = -i;}
					var position = new Pair(raw_pos_gun.x+j*5,raw_pos_gun.y+k*5);
					this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color, this.equipped.type);
				}
			}
			else {
				this.stage.createBullet(this,raw_pos_gun,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color, this.equipped.type);
			}
		}
	}
	hit(){
		//hp is monsters' health
		this.hp--;
		if (this.hp==0){
			//Makings sure the gun object name tagged by the user anymore
      		this.equipped.drop();
			// exiting the actor off canvas
			this.stage.removeActor(this)
			this.stage.removeBot(this)
		}
	}
	draw(context){
		context.setTransform(1, 0, 0, 1, -1*(this.cameraPosX), -1*this.cameraPosY);
		context.save();
		context.beginPath();
		context.drawImage(this.img,this.position.x- this.radius,this.position.y - this.radius);
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

			// If the weapon is in reach
			if (this.position.x - this.pickup_range < weaponPosition.x &&
			weaponPosition.x < this.position.x + this.pickup_range &&
			this.position.y - this.pickup_range < weaponPosition.y &&
			weaponPosition.y < this.position.y + this.pickup_range){

				// If the bot is originally holding a gun...
				if (this.equipped){
					/* Drops the gun but also makes sure the gun is reloaded and randommly placed at a different place on the map, causing a better gaming experience.*/
					this.closest_weapon = null;
					var x=Math.floor((Math.random()*this.stage.width));
					var y=Math.floor((Math.random()*this.stage.height));
					this.equipped.drop();
					this.equipped.ammo = 30;
					this.equipped.position = new Pair(x,y);
					this.equipped = null;
				}
				// Grab the new object
				this.equipped = object;
				object.held(this);
			}
		}
		else if (object.name == "ammo" && this.equipped!= null) {
			var ammoPosition = object.position;

			// if in vacinity
			if (this.position.x - this.pickup_range < ammoPosition.x &&
			ammoPosition.x < this.position.x + this.pickup_range &&
			this.position.y - this.pickup_range < ammoPosition.y &&
			ammoPosition.y < this.position.y + this.pickup_range){
				/* To make game experience great, instead of removing ammo object from canvas, after usage, it repositions it to a random location on canvas.*/
				this.equipped.ammo = object.grab_ammo(this.equipped.type);
				var x=Math.floor((Math.random()*this.stage.width));
				var y=Math.floor((Math.random()*this.stage.height));
				object.position = new Pair(x,y);
				this.closest_ammo = null;

			}
		}
	}
	switchVelocity(){
		return
	}
}
