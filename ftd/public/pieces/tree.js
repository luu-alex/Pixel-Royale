class Tree extends Obstacles{
	constructor(stage, position) {
		super(stage, position);
		this.size = new Pair(200, 279);
		this.hp = 50; //Takes 5 bullets to break
		this.myImage = new Image();
		this.myImage.src = '/bigTree.png';
	}
	draw(context) {
		context.save();
		context.beginPath();
		// context.drawImage(this.myImage, this.position.x, this.position.y);
		context.drawImage(this.myImage, this.position.x, this.position.y);
		context.closePath();
	}
	hit(){
		this.hp--;
		console.log(this.hp)
		if (this.hp==0){
			this.stage.removeActor(this)
			this.stage.removeTree(this)
		}
	}
	step(){

	}
}
