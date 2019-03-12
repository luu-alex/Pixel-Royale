class player extends People{
	constructor(stage,position,speed){
    super(stage, position);
		this.name = "player";
		this.speed = new Pair(0,0);
		this.colour = 'rgba('+255+','+205+','+148+','+1+')';
		this.radius = 50;
		this.pickup_range = 75;
		this.equipped = null;
    	this.hp = 100;
		this.cameraPosX = this.position.x - this.stage.canvas.clientWidth/2;
		this.cameraPosY = this.position.y - this.stage.canvas.clientHeight/2;
		this.myImage = new Image();
		this.myImage.src = '/elf.png';
    	this.die = false;


	}
	shoot() {
		// If the player has a gun.
		if (this.equipped) {
			// position of the gun on the moving paper
			var raw_pos_gun = this.equipped.position;
			if(this.equipped.shoot()) {
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
						if (this.equipped.rotation < 0 && this.equipped.rotation > -(90*Math.PI/180) ) k = -i
						if (this.equipped.rotation < (180*Math.PI/180) && this.equipped.rotation > (90*Math.PI/180) ) j = -i;
						var position = new Pair(raw_pos_gun.x+j*5,raw_pos_gun.y+k*5);
						this.stage.createBullet(this,position,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color, this.equipped.type);

					}
				}
				else {
					this.stage.createBullet(this,raw_pos_gun,this.equipped.bullet_size,this.equipped.bullet_speed,this.equipped.bullet_range, this.equipped.bullet_color, this.equipped.type);

				}
			}
		}
	}
	draw(context){
	    if (!this.die) {
	  		context.save();
	  		context.fillStyle = this.colour;
	  		context.beginPath();
	  		// context.drawImage(this.myImage, this.position.x, this.position.y);
	  		context.drawImage(this.myImage, this.position.x - this.radius, this.position.y - this.radius);
	  		context.fill();
	  		context.closePath();
	    } else {
	      context.beginPath();
	  		context.fillStyle="black"
	  		context.font = "50px Arial";
	  		context.fillText("You have Died",this.cameraPosX + this.stage.canvas.clientWidth/2-200,this.cameraPosY + this.stage.canvas.clientHeight/2 );
	  		context.closePath();
	    }
		}
	step(){
		//check if player is walking on terrain which may cause player to slow
    	//walking through terrain causes different velocity
		var terrainSpeed=1;

		// DEBUGGING
		if (this.equipped!= null) {
			// console.log(this.equipped.rotation);
		}

		for (var i = 0; i < this.stage.terrain.length; i++) {
			var current_tile = this.stage.terrain[i];
			if (current_tile.position.x < this.position.x &&
				current_tile.position.y < this.position.y &&
				this.position.x < current_tile.position.x + current_tile.size.x &&
				this.position.y < current_tile.position.y + current_tile.size.y) {
				terrainSpeed = current_tile.speed;
			}

		}

		this.speed.x = this.speed.x * terrainSpeed;
		this.speed.y = this.speed.y * terrainSpeed;


		if (this.speed.x < 0 && this.position.x - this.radius> 5) this.position.x += this.speed.x;
		if (this.speed.x > 0 && this.position.x + this.radius < this.stage.width) this.position.x += this.speed.x;
		if (this.speed.y > 0 && this.position.y < this.stage.height - this.radius) this.position.y += this.speed.y;
		if (this.speed.y < 0 && this.position.y > 5 + this.radius) this.position.y += this.speed.y;
		this.speed.x = this.speed.x/terrainSpeed;
		this.speed.y = this.speed.y/terrainSpeed;

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
  	collision(obj,length,width) {
    if (this.speed.x < 0 && this.position.x - this.radius > obj.position.x + length) return false;
		if (this.speed.x > 0 && this.position.x + this.radius < obj.position.x) return false;
		if (this.speed.y > 0 && this.position.y + this.radius < obj.position.y) return false;
		if (this.speed.y < 0 && this.position.y > obj.position.x + length) return false;
    return true;
  }
	pickUp() {
		if (!this.equipped) {
			var weaps = this.stage.weapons;
			for (var i=0; i<this.stage.weapons.length;i++){
        if ((!this.equipped))
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
		if (this.equipped) {
			for (var i=0;i<ammos.length;i++) {
				var aPosition = ammos[i].position;
				var size = ammos[i].size;
				if (this.position.x - this.pickup_range < aPosition.x &&
				aPosition.x < this.position.x + this.pickup_range &&
				this.position.y - this.pickup_range < aPosition.y &&
				aPosition.y < this.position.y + this.pickup_range) {
					this.equipped.ammo = ammos[i].grab_ammo(this.equipped.type);
					this.stage.removeActor(ammos[i]);
					this.stage.removeAmmo(ammos[i]);
				}
			}
		}
	}
	teleport(posX) {
		if (posX <400) this.position.x = this.stage.width-50;
		else this.position.x = 50;
	}
	pickUpHelper(pickUp) {
		var objPos = pickUp.position;
		// console.log(this.position.x - this.pickup_range)
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
    	if (!this.die) {
    	if (keys && keys['a'] && this.position.x+ this.radius > 5 )this.speed.x = -5;
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
	}
	hit() {
	    if (this.hp>0)
	      this.hp--;
  	}

	setWall(){
		var the_wall = new Wall(this.stage);
		if (this.stage.ghost_wall.current_formation != 0) {
			the_wall.change_formation();
		}
		the_wall.place_wall(this);
	}

	flipWall(){
		this.stage.ghost_wall.change_formation();
	}
	wallMode(){
		this.stage.wall_mode = !(this.stage.wall_mode);
	}
}
