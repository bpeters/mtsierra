var THREE = require('three');
var CANNON = require('cannon');

// Collision filter groups - must be powers of 2!
var PLAYER = 1;

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

exports.groundMesh = function() {

	var groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
	var groundMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff
	});
	var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.rotation.x = -Math.PI / 2;
	groundMesh.position.x = 0;
	groundMesh.position.y = 0;
	groundMesh.position.z = 0;

	return groundMesh;
};

exports.playerPhysics = function(size) {

	var playerShape = new CANNON.Box(new CANNON.Vec3(size, size, size));

	var player = new CANNON.Body({
		mass: size
	});
	player.addShape(playerShape);
	player.angularVelocity.set(0,1,0);
	player.angularDamping = 0;
	player.position.x = 0;
	player.position.y = 1000;
	player.position.z = 0;
	player.collisionFilterGroup = PLAYER;
	player.linearDamping = 0.9;

	return player;
};

exports.playerMesh = function(size) {

	var playerGeometry = new THREE.BoxGeometry(size, size, size);
	var playerMaterial = new THREE.MeshLambertMaterial({
			color: 0x81B4E4
	});
	var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
	playerMesh.castShadow = true;

	return playerMesh;
};
