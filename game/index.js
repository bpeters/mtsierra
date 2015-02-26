var THREE = require('three');
var CANNON = require('cannon');
var key = require('keymaster');
var boids = require('boids');
var _ = require('lodash');
var entities = require('./entities');

var world, timeStep=1/60, camera, scene, light, webglRenderer, container, player, mountain;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var CAMERA_START_X = 1000;
var CAMERA_START_Y = 200;
var CAMERA_START_Z = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

initCannon();
initThree();
animate();

function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,-9.8,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	//player physics
	player = entities.playerPhysics(50);
	//world.add(player);

}

function initThree() {

	container = document.createElement('div');
	document.body.appendChild(container);

	//camera
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.x = CAMERA_START_X;
	camera.position.y = CAMERA_START_Y;
	camera.position.z = CAMERA_START_Z;
	camera.lookAt({
		x: 0,
		y: 150,
		z: 0
	});

	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0x000000, 500, 2000 );

	scene.add(camera);

	//hemisphere light
	var hemisphereLight = new THREE.HemisphereLight(0x73CADE, 0xffffff, 1.6);
	hemisphereLight.position.set(1, 0, 1).normalize();
	scene.add(hemisphereLight);

	//lights
	cameraLight = new THREE.DirectionalLight(0xffffff, 0.2);
	cameraLight.position.set(1, 1, 1);
	cameraLight.castShadow = true;

	cameraLight.shadowMapWidth = SCREEN_WIDTH;
	cameraLight.shadowMapHeight = SCREEN_HEIGHT;

	var d = 400;

	cameraLight.shadowCameraLeft = -d;
	cameraLight.shadowCameraRight = d;
	cameraLight.shadowCameraTop = d;
	cameraLight.shadowCameraBottom = -d;

	cameraLight.shadowCameraFar = 1000;
	cameraLight.shadowDarkness = 0.2;

	camera.add(cameraLight);

	//ground
	groundMesh = entities.groundMesh();
	scene.add(groundMesh);

	//playerMesh
	playerMesh = entities.playerMesh(10);
	//scene.add(playerMesh);

	var loader = new THREE.JSONLoader();

	// load a resource
	loader.load(
		// resource URL
		'assets/landscape.json',
		// Function when resource is loaded
		function ( geometry ) {
			var material = new THREE.MeshPhongMaterial({
				color: 0xB1CED2
			});
			mountain = new THREE.Mesh( geometry, material );

			mountain.scale.set(10,10,10);
			mountain.position.x = -120;
			mountain.position.y = -70;
			mountain.receiveShadow = true;
			mountain.castShadow = true;
			console.log(mountain);

			scene.add( mountain );
		}
	);

	//renderer
	webglRenderer = new THREE.WebGLRenderer();
	webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	webglRenderer.domElement.style.position = "relative";
	webglRenderer.shadowMapEnabled = true;
	webglRenderer.shadowMapSoft = true;

	container.appendChild(webglRenderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	webglRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	requestAnimationFrame(animate);
	updatePhysics();

	var rotSpeed = 0.01;
	var zoomSpeed = 0.1;
	var x = camera.position.x,
		y = camera.position.y,
		z = camera.position.z;

	//player input
	if(key.isPressed("left")) {
		camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
		camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
	}
	if(key.isPressed("right")) {
		camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
		camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
	}
	if(key.isPressed("up")) {
		camera.fov -= zoomSpeed;
	}
	if(key.isPressed("down")) {
		camera.fov += zoomSpeed;
	}

	camera.updateProjectionMatrix();
	camera.lookAt({
		x: 0,
		y: 150,
		z: 0
	});

	render();
}

function updatePhysics() {

	// Step the physics world
	world.step(timeStep);

	// Copy coordinates from Cannon.js to Three.js
	//playerMesh.position.copy(player.position);
	//playerMesh.quaternion.copy(player.quaternion);

}

function render() {
	webglRenderer.render(scene, camera);
}
