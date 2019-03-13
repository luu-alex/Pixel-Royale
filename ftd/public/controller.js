stage=null;
view = null;
interval=null;
keys = null;
music = null;
var rightMouseClicked = false;

function handleMouseDown(e) {
	/*
	e.button describes the mouse button that was clicked
	0 is left, 1 is middle, 2 is right
	*/
	if (e.button === 2) {
		rightMouseClicked = true;
		if (stage.wall_mode) {
			changeFormation();
		}
	} else if (e.button === 0) {
		if (stage.wall_mode) {
			positionWall();
		} else {
			shoot(e);
		}
	}
}

function handleMouseUp(e) {
	if (e.button === 2) {
		rightMouseClicked = false;
	}
}
function setupGame(){
		stage=new Stage(document.getElementById('stage'));
		music = new Audio ('/Woods.mp3');
		music.play();
		console.log(music)

		// https://javascript.info/keyboard-events
		document.addEventListener('keydown', moveByKey);
		document.addEventListener('keyup', stopMove);

		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('contextmenu', function(e) {e.preventDefault();});

		document.addEventListener('mousemove', aim);
}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}
function pauseGame(){
	console.log(music);
	if (music)
		music.pause();
	clearInterval(interval);
	interval= null;
}
function endGame(kills){ //When player or all monsters die
	pauseGame();
	statsswitch(kills);

}
function getGame(){
	return stage;
}
function aim(event){
	stage.updateCursor(event.clientY,event.clientX);
}
function shoot(event){

	stage.player.shoot(event.offsetX,event.offsetY);

}
function moveByKey(event){ //Handles the player movements
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

	if (key == 1) {
		stage.player.switchTo(1);
	}
	if (key == 2) {
		stage.player.switchTo(2);
	}
	if (key == 3) {
		stage.player.switchTo(3);
	}


}
function stopMove(event){ //When a key stops being pressed
	keys[event.key] = false;
	stage.player.stopMovement(event.key);
}
function stopGame() {
	clearInterval(interval);
	interval= null;
	// document.getEle
}
function changeFormation(){
	stage.player.flipWall();
}
function positionWall(){
	stage.player.setWall();
}
