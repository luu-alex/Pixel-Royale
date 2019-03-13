
class Wall {
	/*
	X	-> Should change formation by each right click, should place down with a left click.
	X	-> Each wall should change image of the pic after a couple of bullet hits.
	X	-> Walls should have a health meter that should decrease with a hit.
	X	-> Placement of the walls should change according to the position of the mouse.
		-> When moving with the walls, bullets and other actors should be able to go through the walls, but once set, bullets ghosts should not be able to go across.
	*/
	constructor(stage){
		this.stage = stage;
		this.position = new Pair(this.stage.player.position.x + 100,this.stage.player.position.y);
		this.placed = false;

		// this.player_position = player_position;
		this.health = 3;
		this.length = new Pair(60,240);

		/* CHANGE THIS TO THE ACTUAL LIST OF FORMATIONS */
		// this.formations = [(90*Math.PI/180),0];
		/* CHANGE THIS TO AN ELEMENT IN this.fornmations */
		this.current_formation = 0;

		this.myImage = new Image();
		this.myImage.src = '/wall.jpg'; /* Set this to the perfect-health wall */
	}

	draw(context){
		if (this.stage.wall_mode == true || this.placed == true) {
			context.save();
			context.translate(this.position.x,this.position.y);
			context.beginPath();

			/* SET THESE GUYS */
			if(this.health == 2){this.myImage.src = '/wall.jpg';}
			else if(this.health == 1){this.myImage.src = '/wall.jpg';}

			context.rotate(this.current_formation);
			// context.drawImage(this.myImage, this.position.x - this.length.x/2, this.position.x - this.length.y/2);
			context.drawImage(this.myImage, -this.length.x/2, -this.length.y/2);
			context.fill();
			context.closePath();
			context.stroke();
			context.restore();
		}

	}

	hit(){
		this.health--;
		if (this.health == 0){
			// animation should go here
			this.stage.removeActor(this)
			this.stage.removeTree(this)
		}
	}

	change_formation(){

		if (this.current_formation == 0) {
			this.current_formation = 90*Math.PI/180;
		}else {
			this.current_formation = 0;
		}
	}

	step(){

		if (!this.placed) {
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

			// Pointing Right
			if ((-(45*Math.PI/180) <= this.rotation && this.rotation < (45*Math.PI/180)) || cursor == 0) {
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

	place_wall(player){

		var raw_pos_player = player.position;
		var rect = this.stage.canvas.getBoundingClientRect();
		var cursor = this.stage.getCursor();
		var tx = raw_pos_player.x - player.cameraPosX;
		var ty = raw_pos_player.y - player.cameraPosY;
		var pos_player = new Pair(rect.x + tx, rect.y + ty);
		var slope = new Pair(cursor.x - pos_player.x, cursor.y - pos_player.y);
		this.rotation = Math.atan2(slope.y,slope.x);


		// Pointing Right
		if ((-(45*Math.PI/180) <= this.rotation && this.rotation < (45*Math.PI/180)) || cursor == 0) {
			console.log('right');
			this.position = new Pair(raw_pos_player.x + 100,raw_pos_player.y);
		}
		// Pointing Down
		else if ((45*Math.PI/180) <= this.rotation && this.rotation < (135*Math.PI/180)) {
			console.log('down');
			this.position = new Pair(raw_pos_player.x,raw_pos_player.y + 100);

		}
		// Pointing Left
		else if ((135*Math.PI/180) <= this.rotation || this.rotation < -(135*Math.PI/180)) {
			console.log('left');
			this.position = new Pair(raw_pos_player.x - 100,raw_pos_player.y);
		}
		// Pointing Up
		else if (-(135*Math.PI/180) <= this.rotation && this.rotation < -(45*Math.PI/180)) {
			console.log('up');
			this.position = new Pair(raw_pos_player.x,raw_pos_player.y - 100);

		}

		this.placed = true;
		this.stage.createWall(this);
		this.stage.addActor(this);
	}
}
