let THREE = require('three');
let pathToModel = './app/components/barrel/';

import meshLoader from '../../utils/MeshLoader';

let diffuse = THREE.ImageUtils.loadTexture(pathToModel + "Misc_WoodBarrelOldMold_2k_d.jpg");
let specular = THREE.ImageUtils.loadTexture(pathToModel + "Misc_WoodBarrelOldMold_2k_s.jpg");
let normal = THREE.ImageUtils.loadTexture(pathToModel + "Misc_WoodBarrelOldMold_2k_n.jpg");

let loader = new THREE.JSONLoader();
let material = new THREE.MeshPhongMaterial({
    map: diffuse,
    specular: 0xffffff,
    specularMap: specular,
    shininess: 10,
    normalMap: normal
});

export default meshLoader(material, loader, pathToModel + "model.js");
