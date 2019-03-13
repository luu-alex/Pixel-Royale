function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }
function distance(pos1,pos2){
	var x = Math.abs(pos1.x - pos2.x);
	var y = Math.abs(pos1.y - pos2.y);
	return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}
// Model handles events  dealt in the canvas
class Stage {
	constructor(canvas){
		this.canvas = canvas; //creating lists to store objects
		this.actors= []; // all actors on this stage (monsters, player, boxes, ...)
		this.weapons = [];
		this.bullets = [];
		this.bots = [];
		this.ammos = [];
		this.terrain = [];
		this.teleporters = [];
		this.trees = [];
		this.walls = [];
		this.wall_mode = false;
		this.deaths = [];
		// the logical width and height of the stage
		this.width=2000;
		this.height=2000;
		this.safezone = new Safezone(this, new Pair(0,0), new Pair(this.width, this.height));
		this.addActor(this.safezone);

		// Add the player to the center of the stage
		this.player = new player(this, new Pair(this.width/2,this.height/2),5);
		this.addPlayer(this.player);

		//Add GUI to users screen
		this.GUI = new GUI(this, this.player);

		//The wall user holds but is not placed yet
		this.ghost_wall = new Wall(this, this.player.position);
		this.addActor(this.ghost_wall);

		//creates two teleporter to travel to eachother
		var teleporter = new Teleporter(this, new Pair(0, this.height/2));
		var teleporter2 = new Teleporter(this, new Pair(this.width-100,this.height/2));
		this.addActor(teleporter);
		this.addActor(teleporter2);
		this.teleporters.push(teleporter);
		this.teleporters.push(teleporter2);

		//where the cursor is placed
		this.cursor = 0;

		// Generate a random map
		var num_rows = 8; var num_tiles = 8; var terrain_types = ["desert","grassy"];
		for (var i = 0; i < num_rows; i++) {
			for (var j = 0; j < num_tiles; j++) {
				var rand_terrain_type = terrain_types[Math.floor(Math.random() * terrain_types.length)];
				this.terrain.push(new Terrain(rand_terrain_type, new Pair(i * (this.width/num_tiles), j * (this.height/num_rows)), new Pair(this.width/num_tiles,this.height/num_rows)));
			}
		}

		// Generate Some Weapons around the map.
		var weapon_types = ["flame thrower", "bazooka", "9 mm", "sniper", "shotgun"];
		for (var i = 0; i < 10; i++) {
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var rand_gun_type = weapon_types[Math.floor(Math.random() * weapon_types.length)];
				var weapon = new Weapon(this, new Pair(x,y),rand_gun_type);
				this.addWeapon(weapon);
				this.addActor(weapon);
			}
		}

		// Generate some Smart Bots around the map.
		for (var i = 0; i < 10; i++) {
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var bot = new Bot(this, new Pair(x,y));
				this.addBot(bot);
				this.addActor(bot);
			}
		}

		//Generate some Dumb Bots around the map.
		for (var i = 0; i < 10; i++) {
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
			}
		}

		// Generate Ammo Boxes around the map.
		for (var i = 0; i < 15; i++) {
			var x = Math.floor((Math.random()*this.width));
			var y = Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var a = new Ammo(this,new Pair(x,y),new Pair(15,15));
				this.ammos.push(a);
				this.addActor(a);
			}
		}

		// Generate Trees around the map.
		for (var i = 0; i < 15; i++) {
			var x = Math.floor((Math.random()*this.width));
			var y = Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var a = new Tree(this,new Pair(x,y));
				this.trees.push(a);
				this.addActor(a);
			}
		}

	}
	removeAmmo(ammo){ //Ammo being removed from the stage
		var index=this.ammos.indexOf(ammo);
		if(index!=-1){
			this.ammos.splice(index,1);
		}
	}
	getAmmo(){//Getting ammo list
		return this.ammos;
	}
	add_gun_GUI(weapon){ //Player equipping weapon
		this.GUI.addWeapon(weapon);
	}
	remove_gun_GUI(weapon){ //dropping weapon
		this.GUI.removeWeapon();
	}
	addBot(bot){ //Add bot to list
		this.bots.push(bot);
	}
	removeBot(bot){ //when a bot dies
		this.player.kills++;
		var index=this.bots.indexOf(bot);
		if(index!=-1){
			this.bots.splice(index,1);
		}
	}
	removeBot(death){ //when a bot dies
		var index=this.deaths.indexOf(death);
		if(index!=-1){
			this.death.splice(index,1);
		}
	}
	removeTree(tree){ //remove tree from the list
		var index=this.trees.indexOf(tree);
		if(index != -1) {
			this.trees.splice(index,1);
		}
	}
	createBullet(player,target,radius,speed,range,color,type){ //Create a bullet when shot from a weapon
		var bullet = new Bullet(this,player,target,radius,speed,range,color,type);
		this.bullets.push(bullet);
		this.addActor(bullet);
	}
	getBots(){ //return bot list
		return this.bots;
	}
	getCursor(){//return cursor
			return this.cursor;
	}
	updateCursor(positionY,positionX){ //update cursor position
		this.cursor = new Pair(positionX, positionY);
		var rect = this.canvas.getBoundingClientRect();

	}
	addWeapon(weapon){//add weapon to list
		this.weapons.push(weapon);
	}
	addPlayer(player){//create a new player
		this.addActor(player);
		this.player=player;
	}
	removePlayer(){//when the player dies
		this.removeActor(this.player);
		this.player=null;
	}
	addActor(actor){//Actor is pushed into the list and wants to be drawn
		this.actors.push(actor);
	}
	removeActor(actor){//Actor being removed
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}
	step(){//Next frames of the game
		if (this.bots.length==0) {
			$.getScript('./singepage.js', function(){
		    submitScore(3,3)
		  })
		}
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
		for (var i=0; i<this.terrain.length;i++){ //Draw terrain
			context.setTransform(1, 0, 0, 1, -1*(this.player.cameraPosX), -1*this.player.cameraPosY);
			this.terrain[i].draw(context);
		}
		for(var i=0;i<this.actors.length;i++){ //Draw actors
			this.actors[i].draw(context);
		}
		this.GUI.draw(context);
	}
	getActor(x, y){ //Get the actor at X,Y
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;}

	createWall(wall){ //wall being created
		this.walls.push(wall);
	}
	getWalls(){//return walls
		return this.walls;
	}
}
