class Bullet {
	constructor(stage,player,position, radius, speed,range, color, bulletType){
		this.name = "bullet";
		this.stage = stage;
		this.position = new Pair(player.equipped.position.x,player.equipped.position.y);
		this.range = range;
		this.initial = new Pair(this.position.x,this.position.y);

		// movement vectors of the bullet
		this.dx = position.x-player.position.x;
		this.dy = position.y-player.position.y;
		this.radius = radius;
		this.color = color;
		this.speed = speed ;
		this.color ="Black";
		this.myImage = new Image();
		this.myImage.src = '/'+bulletType+'bullet.png';
    	this.player = player;
	}
	draw(context){
		context.save();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		context.drawImage(this.myImage, this.position.x-this.radius/2, this.position.y-this.radius/2);
		context.fill();
		context.closePath();
		context.restore();
	}
	step(){
		/* updating position of bullet */
		// the larger the fraction, the greater the speed of the bullet
		this.position.x+=(this.dx) * this.speed;
		this.position.y+=(this.dy) * this.speed;

		/* collision check with borders and range */
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

		/* collision check with walls */
		var walls = this.stage.getWalls();
		for (var i = 0; i < walls.length; i++) {
			if (walls[i].current_formation == 90) {
				var width = walls[i].length.y;
				var height = wall[i].length.x;
			}
			else {
				var width = walls[i].length.x;
				var height = walls[i].length.y;
			}

			if (this.collision(walls[i].position.x,walls[i].position.y,width,height)) {
				walls[i].hit();
				stage.removeActor(this);
			}

		}

		//check collision with trees
		var trees = this.stage.trees;
		for (var i=0; i<trees.length; i++) {
			if (this.collision(trees[i].position.x, trees[i].position.y, trees[i].size.x, trees[i].size.y)) {
				trees[i].hit();
				stage.removeActor(this);
			}
		}

		/* collision check with enemies */
		var enemies = this.stage.getBots();
		for (var i=0; i<enemies.length; i++) {
			if (this.collision(enemies[i].position.x - enemies[i].radius,
				 enemies[i].position.y - enemies[i].radius,
				  enemies[i].radius, enemies[i].radius) && this.player != enemies[i]) {
						enemies[i].hit();
						
					}
		}


		//check collision with player
		var p = this.stage.player;
    	if (this.collision(p.position.x - p.radius, p.position.y - p.radius, p.radius, p.radius) && this.player != p)  {
      		p.hit();
    	}
	}

	// returns true if collision has occured
	collision(x, y, width, height) {
		return ((x < this.position.x && this.position.x < x + width ) &&
			  (y < this.position.y && this.position.y < y + height))
	}
}
