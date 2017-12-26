import camera from './components/Camera';
import Event from './lib/Event';
import ReactEvent from './lib/React.Event';

ReactEvent(window);

let THREE = require('three')
var container, stats, clock, mixer;
var scene, renderer, objects;
var monster;
init();
animate();

function init() {

    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);
    mixer = new THREE.AnimationMixer(scene);
    var loader = new THREE.JSONLoader();

/*    loader.load('assets/monster.js', function (geometry, materials) {
        // adjust color a bit
        var material = materials[0];
        material.morphTargets = true;
        material.color.setHex(0xffaaaa);
        var mesh = new THREE.Mesh(geometry, materials);
        // random placement in a grid
        mesh.position.set(0, 0, 0);
        var s = THREE.Math.randFloat(0.00075, 0.001);
        mesh.scale.set(s, s, s);
        mesh.rotation.y = THREE.Math.randFloat(-0.25, 0.25);
        mesh.matrixAutoUpdate = false;
        mesh.needsUpdate = true;
        mesh.updateMatrix();
        scene.add(mesh);



        monster = mesh;
        window.m = monster;
/!*        mixer.clipAction(geometry.animations[0], mesh)
            .setDuration(1)			// one second
            .startAt(-Math.random())	// random phase (already running)
            .play();					// let's go*!/

        window.mix = mixer;

    });*/
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

//
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var timer = Date.now() * 0.0005;
 //   mixer.update(clock.getDelta());
    monster && (monster.position.x += 0.01);
    renderer.render(scene, camera);
}


var size = 10;
var divisions = 10;

var gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);


