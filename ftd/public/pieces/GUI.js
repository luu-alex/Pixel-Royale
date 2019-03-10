class GUI{
	constructor(player){
		this.player = player;
		this.ammo = 0;
		this.health = 3;
		this.x=this.player.cameraPosX;
		this.weapon = null;
	}
	draw(context){
		context.save();
		if (!this.player.cameraPosX)
			var x=0;
		else
			var x=this.player.cameraPosX;
		context.translate(x,this.player.cameraPosY);
		context.beginPath();
		context.fillStyle="black"
		context.font = "30px Arial";
		context.fillText("Ammo: "+this.ammo,150,context.canvas.clientHeight-30);
		context.fillText("Health: "+this.health,10,context.canvas.clientHeight-30);
		context.restore();
	}
	step(){
		if(this.weapon)
			this.ammo = this.weapon.ammo;
	}
	addWeapon(weapon){
		this.weapon = weapon;
	}
	removeWeapon(){
		this.ammo = 0;
		this.weapon = null;
	}
}
