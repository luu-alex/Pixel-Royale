class GUI{
	constructor(stage, player){
		this.player = player;
		this.ammo = 0;
		this.hp = this.player.hp;
		this.weapon = null;
		this.stage = stage;
	}
	draw(context){
		context.save();
		context.translate(this.player.cameraPosX,this.player.cameraPosY);
		context.beginPath();
		context.fillStyle="black"
		context.font = "30px Arial";
		context.fillText("Ammo: "+this.ammo,150,context.canvas.clientHeight-30);
		context.fillText("Health: "+this.hp,10,context.canvas.clientHeight-30);
		context.closePath();
		context.restore();

		context.save();
		context.translate(this.player.cameraPosX, this.player.cameraPosY);
		context.transform(0.05, 0, 0, 0.05, -1, -1);
		context.beginPath();
		context.fillStyle = "green";
		context.fillRect(0, 0, this.stage.width, this.stage.height);
		context.closePath();
		for (var i=0; i<this.stage.bots.length; i++) {
			this.stage.bots[i].draw(context);
			// this.player.draw(context);
		}
    this.stage.safezone.draw(context);
		this.stage.player.draw(context);
		context.closePath();
		context.restore();
		context.resetTransform();
		// context.setTransform(1, 0, 0, 1, -1*(this.cameraPosX), -1*this.cameraPosY);
	}
	step(){
		if(this.weapon)
			this.ammo = this.weapon.ammo;
    this.hp = this.player.hp;
	}
	addWeapon(weapon){
		this.weapon = weapon;
	}
	removeWeapon(){
		this.ammo = 0;
		this.weapon = null;
	}
}
