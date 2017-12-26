let THREE = require('three');


let camera = camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 2, 1,4 );


window.c = camera;

export  default camera;