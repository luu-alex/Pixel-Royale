stage=null;
view = null;
interval=null;
keys = null;
function setupGame(){
	if (!stage) {
		stage=new Stage(document.getElementById('stage'));

		// https://javascript.info/keyboard-events
		document.addEventListener('keydown', moveByKey);
		document.addEventListener('keyup', stopMove);
		document.addEventListener('click', shoot);
		document.addEventListener('contextmenu', function(ev) {ev.preventDefault(); changeFormation(ev);});
		document.addEventListener('mousemove', aim);
	}
}
function startGame(){
	console.log("game has started!")
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
	console.log(interval)
}
function pauseGame(){
	console.log("i have paused this game");
	console.log(interval)
	clearInterval(interval);
	interval= null;
	// document.getElementById('')
}
function getGame(){
	return stage;
}
function aim(event){
	stage.updateCursor(event.clientY,event.clientX);
	// stage.player.aim();
}
function shoot(event){
	// console.log("x: "+event.offsetX + " Y: "+event.offsetY)
	stage.player.shoot(event.offsetX,event.offsetY);

}
function changeFormation(event){
	stage.player.flipWall();
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
	if (key.toLowerCase()=='e'){
		stage.player.pickUp();
	}
	if (key.toLowerCase()=='q'){
		stage.player.dropDown();
	}
	if (key.toLowerCase()=='r'){
		stage.player.wallMode();
	}
}
function stopMove(event){
	keys[event.key] = false;
	stage.player.stopMovement(event.key);
}
function stopGame() {
	console.log("i have paused this game");
	console.log(interval)
	clearInterval(interval);
	interval= null;
	// document.getEle
}
