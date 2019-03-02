stage=null;
view = null;
interval=null;
keys = null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('keyup', stopMove)
}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function moveByKey(event){
	var key = event.key;
	console.log(key);
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
}
function stopMove(event){
	keys[event.key] = false;
}
