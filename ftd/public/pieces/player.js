class player extends People{
	constructor(stage,position,speed){ //Constructing the playable character
    super(stage, position);
		this.name = "player";
		this.speed = new Pair(0,0);
		this.colour = 'rgba('+255+','+205+','+148+','+1+')';
		this.radius = 50;
		this.pickup_range = 75;
		this.inventory = [];
		this.equipped = null;
    this.hp = 100;
		this.cameraPosX = this.position.x - this.stage.canvas.clientWidth/2;
		this.cameraPosY = this.position.y - this.stage.canvas.clientHeight/2;
		this.images = [];
		var myImage = new Image();
		myImage.src = '/elf.png';
		var myImage1 = new Image();
		myImage1.src = '/elf1.png';
		var myImage2 = new Image();
		myImage2.src = '/elf2.png';
		this.images.push(myImage);
		this.images.push(myImage1);
		this.images.push(myImage2);
    this.die = false;
		this.kills = 0;
		this.increment =0;
	}
	shoot() {
		// If the player has a gun.
		if (this.equipped) {
			// position of the gun on the camera
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
    if (!this.die) { //if character isn't dead draw them
  		context.save();
  		context.fillStyle = this.colour;
  		context.beginPath();
			if(!this.speed) //Idle animation
  		context.drawImage(this.images[0], this.position.x - this.radius, this.position.y - this.radius);
			else { //Running animation
				context.drawImage(this.images[Math.floor(this.increment/5)], this.position.x - this.radius, this.position.y - this.radius);
			}
  		context.fill();
  		context.closePath();
    } else {
      context.beginPath(); //You are dead screen
  		context.fillStyle="black"
  		context.font = "70px pixelFont";
  		context.fillText("You have Died",this.cameraPosX + this.stage.canvas.clientWidth/2-200,this.cameraPosY + this.stage.canvas.clientHeight/2 );
  		context.closePath();
    }
	}
	collisionLeft(pSpeed, pPosition, objPosition, objSize) { //Check collision of player and object from left and right
		return pPosition.x <
				objPosition.x+objSize.x &&
				pPosition.x> objPosition.x &&
				pPosition.y> objPosition.y &&
				pPosition.y<objPosition.y+objSize.y
	}
	collisionTop(pSpeed, pPosition, objPosition, objSize) { //Check collision of player and object from up and down
		return pPosition.y <
				objPosition.y+objSize.y &&
				pPosition.y> objPosition.y &&
				pPosition.x> objPosition.x &&
				pPosition.x<objPosition.x+objSize.x
	}

	step(){
		//check if player is walking on terrain which may cause player to slow
    	//walking through terrain causes different velocity
		var trees = this.stage.trees;
		for (var i=0; i<trees.length; i++) { //checking collision of trees
			if (this.collisionLeft(this.speed, this.position, trees[i].position, trees[i].size) && this.speed.x < 0 )
					this.position.x+=30;
			if (this.collisionTop(this.speed, this.position, trees[i].position, trees[i].size) && this.speed.y > 0)
					this.position.y-=30;
			if (this.collisionTop(this.speed, this.position, trees[i].position, trees[i].size) && this.speed.y <0)
					this.position.y+=30;
			if (this.collisionLeft(this.speed, this.position, trees[i].position, trees[i].size) && this.speed.x >0)
					this.position.x-=30;
		}
		var walls = this.stage.walls;
		for (var i=0; i<walls.length; i++) { //checking collision of walls
			if (this.collisionLeft(this.speed, this.position, walls[i].position, walls[i].length) && this.speed.x < 0 )
					this.position.x+=30;
			if (this.collisionTop(this.speed, this.position, walls[i].position, walls[i].length) && this.speed.y > 0)
					this.position.y-=30;
			if (this.collisionTop(this.speed, this.position, walls[i].position, walls[i].length) && this.speed.y <0)
					this.position.y+=30;
			if (this.collisionLeft(this.speed, this.position, walls[i].position, walls[i].length) && this.speed.x >0)
					this.position.x-=30;
		}
		var enemies = this.stage.bots; //checking collision of bots with the player
		for (var i=0; i<enemies.length; i++) {
			var enemySize = new Pair(enemies[i].radius*2,enemies[i].radius)
			if (this.collisionLeft(this.speed, this.position, new Pair(enemies[i].position.x-enemies[i].radius, enemies[i].position.y-enemies[i].radius), enemySize)) {
					this.hit();
					enemies[i].switchVelocity();
			}
			if (this.collisionTop(this.speed, this.position, new Pair(enemies[i].position.x-enemies[i].radius, enemies[i].position.y-enemies[i].radius), enemySize)) {
					this.hit();
					enemies[i].switchVelocity();
			}
			if (this.collisionTop(this.speed, this.position, new Pair(enemies[i].position.x-enemies[i].radius, enemies[i].position.y-enemies[i].radius), enemySize)) {
					this.hit();
					enemies[i].switchVelocity();
			}
			if (this.collisionLeft(this.speed, this.position, new Pair(enemies[i].position.x-enemies[i].radius, enemies[i].position.y-enemies[i].radius), enemySize)) {
					this.hit();
					enemies[i].switchVelocity();
			}
		}

		var terrainSpeed=1; //terrain speed that affects the movement of player
		if (this.position.x <= this.stage.width/2 && this.position.y <= this.stage.height/2){
			var terrainSpeed =  this.stage.terrain[0].speed;
		} //collision of terrain
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


		if (this.speed.x < 0 && this.position.x - this.radius> 5) this.position.x += this.speed.x; //player movement
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

		if (this.inventory.length < 3) {
			var weaps = this.stage.weapons;
			for (var i=0; i<this.stage.weapons.length;i++){
			    if (this.inventory.indexOf(weaps[i]) == -1 && this.pickUpHelper(weaps[i])){
					this.equipped = weaps[i];
					this.inventory.push(weaps[i]);
					weaps[i].held(this);
					this.stage.add_gun_GUI(weaps[i]);
					console.log(this.inventory.length);
					break;
				}
			}
		}

		for (var i=0; i < this.stage.teleporters.length; i++){
			if (this.pickUpHelper(this.stage.teleporters[i])){
				this.teleport(this.stage.teleporters[i].position.x)
				break;
			}
		}
		var ammos = this.stage.getAmmo(); //check if ammo is within pick up radius

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
	teleport(posX) { //player teleporting across the map
		if (posX <400) this.position.x = this.stage.width-50;
		else this.position.x = 50;
	}
	pickUpHelper(pickUp) {
		var objPos = pickUp.position;
		if (this.position.x - this.pickup_range < objPos.x &&
		objPos.x < this.position.x + this.pickup_range &&
		this.position.y - this.pickup_range < objPos.y &&
		objPos.y < this.position.y + this.pickup_range){
			return true;
		}
	}
	dropDown(){ //drop item
		if (this.equipped){
			this.equipped.drop();
			var index = this.inventory.indexOf(this.equipped);
			if (index > -1) {
			  this.inventory.splice(index, 1);
			}
			if (this.inventory.length > 0) {
				this.equipped = this.inventory[-1];
				this.stage.add_gun_GUI(this.inventory[-1]);

			}else{
				this.equipped = null;
				this.stage.remove_gun_GUI();

			}
		}
	}
	stopMovement(keys) { //player stops moving
		if(keys=='a' || keys=='d') this.speed.x= 0;
		if(keys=='w' || keys=='s') this.speed.y= 0;
		this.increment = 0;
	}
	move(player,keys) { //key is pressed down moves player
    if(!this.die) {
			this.increment++;
			if (this.increment > 14) this.increment=0;
    	if (keys && keys['a'] && this.position.x+ this.radius > 5)this.speed.x = -5;
    	if (keys && keys['d'] && this.position.x<this.stage.width) this.speed.x = 5;
    	if (keys && keys['w'] && this.position.y + this.radius >5) this.speed.y = -5;
    	if (keys && keys['s'] && this.position.y<this.stage.height)this.speed.y = 5;
	   }

	}
	hit() { //player gets shot
	  if(this.hp>0)
	    this.hp--;
		if (this.hp<=0) {
			this.die = true;
			endGame(this.kills);
		}
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

	switchTo(gun_num){
		this.equipped = this.inventory[gun_num-1];
		this.stage.add_gun_GUI(this.inventory[gun_num-1]);

		// console.log(a-1);
	}
}
