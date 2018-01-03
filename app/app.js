import camera from './components/Camera';
import barrel from './components/barrel';
import Event from './lib/Event';

let THREE = require('three');
var container, stats, clock, mixer;
var scene, renderer, objects;
var monster;
init();


function init() {

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);
    mixer = new THREE.AnimationMixer(scene);

    require('three-fbx-loader')(THREE);
    var manager = new THREE.LoadingManager();
    manager.onProgress = function( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var loader2 = new THREE.FBXLoader( manager );
    loader2.load( 'assets/1.fbx', function( object ) {
        scene.add( object );
    }, () => {}, e => {} );
// lights
    var ambientLight = new THREE.AmbientLight(0xcccccc);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight(0xff4400, 5, 30);
    pointLight.position.set(5, 0, 0);
    scene.add(pointLight);
// renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
// stats

// events
    window.addEventListener('resize', onWindowResize, false);
}

//
function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


barrel.then(Const => scene.add(Const.create()) );

barrel.then(Const => {
    let mesh = Const.create();
    mesh.position.x = 3;
    scene.add(mesh);
    Event.on('RENDER',function () {
        mesh.rotation.z += 0.01;
    });
});

barrel.then(Const => {
    let mesh = Const.create();
    mesh.position.x = 1;
    scene.add(mesh);
    Event.on('RENDER',function () {
        mesh.rotation.y += 0.01;
    });
});

function animate() {
    Event.emit('RENDER');
    requestAnimationFrame(animate);
}
animate();

Event.on('RENDER',function render() {
    renderer.render(scene, camera);
});


var size = 10;
var divisions = 10;

var gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);


