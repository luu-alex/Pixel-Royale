
class Weapon {
	constructor(stage, position, type){
		this.name = "weapon";
		this.stage = stage;
		this.position = position;
		this.equipped = false;
		this.rotation = 0;
		this.myImage = new Image();
		this.myImage.src = '/gun2.png';
		this.type = type;

		if(this.type == "flame thrower"){
			this.length = new Pair(20,30);
			this.ammo = 100;
			this.gun_color = "green";

			this.bullet_size = 10;
			this.bullet_speed = 0.1; //range of 0 to 1
			this.bullet_range = 150;
			this.bullet_color = "#fff605";
      this.myImage.src = '/flamethrower.png';
		}
		else if(this.type == "sniper"){
			this.length = new Pair(5,30);
			this.ammo = 5;
			this.gun_color = "black";

			this.bullet_size = 4.5;
			this.bullet_speed = 0.6;
			this.bullet_range = 500;
			this.bullet_color = "red";
      this.myImage.src = '/sniper.png';
		}
		else if(this.type == "9 mm"){
			this.length = new Pair(5,10);
			this.ammo = 12;
			this.gun_color = "gray";

			this.bullet_size = 5;
			this.bullet_speed = 0.3;
			this.bullet_range = 250;
			this.bullet_color = "black";
      this.myImage.src = '/gun2.png';

		}
		else if(this.type == "bazooka"){
			this.length = new Pair(30,40);
			this.ammo = 3;
			this.gun_color = "#2b8740";
  		this.myImage.src = '/bazooka.png';
			this.bullet_size = 20;
			this.bullet_speed = 0.75;
			this.bullet_range = 200;
			this.bullet_color = "#798c6a";
		}
		else if(this.type == "shotgun"){
			this.length = new Pair(40,15);
			this.ammo = 30;
			this.gun_color = "#c97d0c";

			this.bullet_size = 5;
			this.bullet_speed = 0.3;
			this.bullet_range = 200;
			this.bullet_color = "purple";
      this.myImage.src = '/shotgun.png';
		}
	}
	draw(context){
		context.save();
		context.translate(this.position.x,this.position.y);
		context.beginPath();
		context.fillStyle = this.gun_color;
		context.strokeStyle = this.gun_color;
		context.rotate(this.rotation);
		context.drawImage(this.myImage, 0, 0);
		// context.rect(0,-(this.length.x/2),this.length.y,this.length.x);
		context.fill();
		context.closePath();
		context.stroke();
		context.restore();
	}
	name(){
		return "weapon"
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

			var raw_pos_player = this.equipped.position;

			if (this.equipped.name == "player") {
				//Where the canvas is in relation to the moving paper
				var rect = this.stage.canvas.getBoundingClientRect();

				// position of the player on the moving paper

				var tx = raw_pos_player.x - this.equipped.cameraPosX;
				var ty = raw_pos_player.y - this.equipped.cameraPosY;
				// position of the player on the paper with the hole
				var pos_player = new Pair(rect.x + tx, rect.y + ty);
				// cursor position on the paper with the hole (better this way since
				// even if the mouse is placed outside of the canvas, it will still
				//work.)
				var cursor = this.stage.getCursor();

				var slope = new Pair(cursor.x - pos_player.x, cursor.y - pos_player.y);

			}
			else if (this.equipped.name == "bot") {
				slope = new Pair(this.equipped.target.position.x - this.equipped.position.x, this.equipped.target.position.y - this.equipped.position.y);
			}

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
