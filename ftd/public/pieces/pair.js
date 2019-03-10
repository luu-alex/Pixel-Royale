class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}
	toString(){
		return "("+this.x+","+this.y+")";
	}
	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}
