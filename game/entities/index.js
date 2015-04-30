var THREE = require('three');
var CANNON = require('cannon');

// Collision filter groups - must be powers of 2!
var GROUND = 1;

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

exports.ground = function() {

	var ground = {};

	var geometry = new THREE.PlaneBufferGeometry(10000, 10000);
	var material = new THREE.MeshPhongMaterial({
		color: 0xB1CED2
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.set(0,5,0);
	mesh.receiveShadow = true;

	var shape = new CANNON.Plane();
	var body = new CANNON.Body({ mass: 0 });
	body.addShape(shape);
	body.position.set(0,5,0);
	body.collisionFilterGroup = GROUND;
	body.collisionFilterMask =  GROUND;

	ground.mesh = mesh;
	ground.body = body;

	return ground;
};

exports.mountain = function(callback) {

	var mountain = {};
	var mFaces = [], mVerts = [];

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
			var mesh = new THREE.Mesh( geometry, material );

			mesh.receiveShadow = true;
			mesh.castShadow = true;

			var faces = mesh.geometry.faces;
			var verts = mesh.geometry.vertices;

			for(var f = 0; f < faces.length; f++){
				mFaces.push([faces[f].a, faces[f].b, faces[f].c]);
			}
			for(var v = 0; v < verts.length; v++){
				mVerts.push(new CANNON.Vec3(verts[v].z, verts[v].y, verts[v].x));
			}

			//Create Mountain Body
			var body = new CANNON.Body({ mass: 1000 });

			// Construct polyhedron
			var shape = new CANNON.ConvexPolyhedron(mVerts, mFaces);

			// Add to compound
			body.addShape(shape);

			body.position.x = 0;
			body.position.y = 0;

			mountain.mesh = mesh;
			mountain.body = body;

			return callback(mountain);
		}
	);
};
