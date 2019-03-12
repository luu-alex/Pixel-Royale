class GUI{
	constructor(stage, player){
		this.player = player;
		this.ammo = 0;
		this.hp = this.player.hp;
		this.weapon = null;
		this.stage = stage;
	}
	draw(context){
		/*	Info	*/
		context.save();
		context.translate(this.player.cameraPosX,this.player.cameraPosY);
		context.beginPath();
		context.fillStyle="black"
		context.font = "20px pixelFont";
		context.fillText("Health: "+this.hp,5,context.canvas.clientHeight-10);
		context.fillText("Ammo: "+this.ammo,150,context.canvas.clientHeight-10);
    	context.fillText("Enemies left: " + this.stage.bots.length, 290, context.canvas.clientHeight-10)
		context.closePath();
		context.restore();

		/*	Mini Map	*/
		context.save();
		context.translate(this.player.cameraPosX, this.player.cameraPosY);
		context.transform(0.07, 0, 0, 0.07, -1, -1);
		context.beginPath();
		context.fillStyle = "rgba("+255+","+255+","+0+","+0.3+")";
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

		/*	Inventory */
		context.save();
		context.translate(this.player.cameraPosX, this.player.cameraPosY);

		context.beginPath();
		context.fillStyle = "rgba("+255+","+255+","+0+","+0.3+")";
		context.fillRect(0, 0, 50, 50);
		context.closePath();

		context.beginPath();
		context.fillStyle = "rgba("+255+","+255+","+0+","+0.3+")";
		context.fillRect(0, -70, 50, 50);
		context.closePath();

		context.beginPath();
		context.fillStyle = "rgba("+255+","+255+","+0+","+0.3+")";
		context.fillRect(0, -130, 50, 50);
		context.closePath();

		context.restore();
		context.resetTransform();

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
