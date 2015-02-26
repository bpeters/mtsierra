var THREE = require('three');
var CANNON = require('cannon');

// Collision filter groups - must be powers of 2!
var PLAYER = 1;

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

exports.ground = function() {

	var ground = {};

	var groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
	var groundMaterial = new THREE.MeshPhongMaterial({
		color: 0xB1CED2
	});
	var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
	groundMesh.rotation.x = -Math.PI / 2;
	groundMesh.position.set(0,0,0);
	groundMesh.receiveShadow = true;

	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body({ mass: 0 });
	groundBody.addShape(groundShape);
	groundBody.position.set(0,-5,0);

	ground.mesh = groundMesh;
	ground.body = groundBody;

	return ground;
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
	player.position.y = 200;
	player.position.z = 0;
	player.collisionFilterGroup = PLAYER;
	player.linearDamping = 0.9;

	return player;
};

exports.playerMesh = function(size) {

	var playerGeometry = new THREE.BoxGeometry(size, size, size);
	var playerMaterial = new THREE.MeshLambertMaterial({
			color: 0xf4f4f4
	});
	var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
	playerMesh.castShadow = true;

	return playerMesh;
};
