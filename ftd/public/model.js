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
		this.safezone = new Safezone(this, new Pair(0,0), new Pair(this.width, this.height));
		this.addActor(this.safezone);
		// Add the player to the center of the stage
		this.player= new player(this, new Pair(this.width/2,this.height/2),5);
		this.addPlayer(this.player);

		var z = new Bot(this, new Pair(0,0));
		var z2 = new Bot(this, new Pair(100,100));
		// this.addBot(z);
		// this.addActor(z);
		this.addBot(z2);
		this.addActor(z2);

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
		this.player.kills++;
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
	// endGame(){
	// 	var r = confirm("Do you want to submit your score?");
	// 	if(r){
	// 		showStats(kills);
	// 	}
	// 	pauseGame();
	// }
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
	// renderVicinity(actor){
	// 	if ( (this.player.cameraPosX == 0 && actor.position.x < this.canvas.clientWidth/2+100) ||
	// 			 (this.player.cameraPosX != 0 && this.player.cameraPosX - this.canvas.clientWidth/2 - 100 < actor.position.x &&
	// 			  actor.position.x < this.player.cameraPosX + this.canvas.clientWidth/2 + 100))
	// }
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
