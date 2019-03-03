stage=null;
view = null;
interval=null;
keys = null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('keyup', stopMove);
	document.addEventListener('click', shoot);
	document.addEventListener('mousemove', aim);
}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function aim(event){
	stage.updateCursor(event.offsetY,event.offsetX);
	// stage.player.aim();
}
function shoot(event){
	console.log("shoot");
	stage.player.shoot(event.offsetX,event.offsetY);

}
function moveByKey(event){
	var key = event.key;
	keys = (keys || []);
	keys[key] = true
	var moveMap = {
		'a': { "dx": -1, "dy": 0},
		's': { "dx": 0, "dy": 1},
		'd': { "dx": 1, "dy": 0},
		'w': { "dx": 0, "dy": -1}
	};
	if(key in moveMap){
		stage.player.move(stage.player, keys);
	}
	if (key=='e'){
		stage.player.pickUp();
	}
}
function stopMove(event){
	keys[event.key] = false;
}
