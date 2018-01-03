let THREE = require('three');

export default function loaderMesh(material, loader, geometrySrc) {
    return new Promise(function (resolve, reject) {
        loader.load(geometrySrc, function (geometry) {
            let mesh = {
                create: () => new THREE.Mesh(geometry, material)
            };

            resolve(mesh);
        });
    })
}