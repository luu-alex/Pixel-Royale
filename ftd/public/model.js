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
		this.walls = [];
		this.wall_mode = false;

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

		this.ghost_wall = new Wall(this, this.player.position);
		this.addActor(this.ghost_wall);

		//create teleporter
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
		for (var i = 0; i < 1; i++) {
			var x=Math.floor((Math.random()*this.width));
			var y=Math.floor((Math.random()*this.height));
			if(this.getActor(x,y)===null){
				var z = new Bot(this, new Pair(x,y));
				this.addBot(z);
				this.addActor(z);
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
	createBullet(player,target,radius,speed,range,color,type){
		var bullet = new Bullet(this,player,target,radius,speed,range,color,type);
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
	/* renderVicinity(actor){
		if ( (this.player.cameraPosX == 0 && actor.position.x < this.canvas.clientWidth/2+100) ||
				 (this.player.cameraPosX != 0 && this.player.cameraPosX - this.canvas.clientWidth/2 - 100 < actor.position.x &&
				  actor.position.x < this.player.cameraPosX + this.canvas.clientWidth/2 + 100))
	}
	*/
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;}

	createWall(player,){
		this.walls.push(wall);
	}
	getWalls(){
		return this.walls;
	}
}

class Wall {
	/*
		-> Should change formation by each right click, should place down with a left click.
	X	-> Each wall should change image of the pic after a couple of bullet hits.
	X	-> Walls should have a health meter that should decrease with a hit.
	X	-> Placement of the walls should change according to the position of the mouse.
		-> When moving with the walls, bullets and other actors should be able to go through the walls, but once set, bullets ghosts should not be able to go across.
	*/
	constructor(stage){
		this.stage = stage;
		this.position = new Pair(this.stage.player.position.x + 100,this.stage.player.position.y);
		this.placed = true;

		// this.player_position = player_position;
		this.health = 3;
		this.length = new Pair(20,100);

		/* CHANGE THIS TO THE ACTUAL LIST OF FORMATIONS */
		// this.formations = [(90*Math.PI/180),0];
		/* CHANGE THIS TO AN ELEMENT IN this.fornmations */
		this.current_formation = 0;

		this.myImage = new Image();
		this.myImage.src = '/wall.jpeg'; /* Set this to the perfect-health wall */
	}

	draw(context){
		if (this.stage.wall_mode == true) {
			context.save();
			context.translate(this.position.x,this.position.y);
			context.beginPath();

			/* SET THESE GUYS */
			if(this.health == 2){this.myImage.src = '/wall.jpeg';}
			else if(this.health == 1){this.myImage.src = '/wall.jpeg';}

			context.rotate(this.current_formation);
			context.drawImage(this.myImage, 0, 0);
			context.fill();
			context.closePath();
			context.stroke();
			context.restore();
		}
	}

	hit(){
		this.health--;
		if (this.health == 0){
			this.stage.removeActor(this)
			this.stage.removeTree(this)
		}
	}

	change_formation(){

		if (this.current_formation == (90*Math.Pi/180)) {
			this.current_formation = 0;
		}else {
			this.current_formation = (90*Math.Pi/180);
		}

		/* Obselete - Multiple Angles
		for (var i = 0; i < this.formations.length; i++) {
			if (this.formations[i] == this.current_formation) {
				this.current_formation = this.formation[i+1];
				break;
			}
		}
 */
	}

	step(){

		if (this.stage.wall_mode) {
			/*
			This is done under assumption that only players can make walls
			*/
			var raw_pos_player = this.stage.player.position;
			//Where the canvas is in relation to the moving paper
			var rect = this.stage.canvas.getBoundingClientRect();

			// position of the player on the moving paper


			var tx = raw_pos_player.x - this.stage.player.cameraPosX;
			var ty = raw_pos_player.y - this.stage.player.cameraPosY;

			// position of the player on the paper with the hole
			var pos_player = new Pair(rect.x + tx, rect.y + ty);
			// cursor position on the paper with the hole
			var cursor = this.stage.getCursor();

			var slope = new Pair(cursor.x - pos_player.x, cursor.y - pos_player.y);


			/*
			 thought: should we even allow bots to make walls? How would that work?
			*/

			this.rotation = Math.atan2(slope.y,slope.x);
			console.log(this.rotation*180/Math.PI);

			// Pointing Right
			if (-(45*Math.PI/180) <= this.rotation && this.rotation < (45*Math.PI/180)) {
				this.position = new Pair(raw_pos_player.x + 100,raw_pos_player.y);
			}
			// Pointing Down
			else if ((45*Math.PI/180) <= this.rotation && this.rotation < (135*Math.PI/180)) {
				this.position = new Pair(raw_pos_player.x,raw_pos_player.y + 100);

			}
			// Pointing Left
			else if ((135*Math.PI/180) <= this.rotation || this.rotation < -(135*Math.PI/180)) {
				this.position = new Pair(raw_pos_player.x - 100,raw_pos_player.y);

			}
			// Pointing Up
			else if (-(135*Math.PI/180) <= this.rotation && this.rotation < -(45*Math.PI/180)) {
				this.position = new Pair(raw_pos_player.x,raw_pos_player.y - 100);

			}
		}
	}

	place_wall(){
		this.stage.addWall(this);
		this.placed = true;
	}
}
