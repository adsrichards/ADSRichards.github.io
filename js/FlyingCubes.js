var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

window.addEventListener('resize', onWindowResize, false);

{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(30, 30, 50);
  scene.add(light);
}

{
  const color = 0x000000;
  const near = 10;
  const far = 55;
  scene.fog = new THREE.Fog(color, near, far);
}

var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(document.documentElement.clientWidth, window.innerHeight + 1);
renderer.setSize(document.documentElement.clientWidth, window.innerHeight);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(document.documentElement.clientWidth, window.innerHeight);

}

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshPhongMaterial({ color: 0x3f80e8 });

var Lz = 55.0;
var Lx = 25.0;
var Ly = 20.0;

var cN = 30;
var cube = [];
var cubeRotation = [];

for (var i = 0; i < cN; i++) {
  cube.push(new THREE.Mesh(geometry, material));
  scene.add(cube[i]);
  cube[i].position.x = (1.0 - 2.0 * Math.random()) * Lx;
  cube[i].position.y = (1.0 - 2.0 * Math.random()) * Ly;
  cube[i].position.z = Math.random() * Lz;

  cubeRotation.push((1.0 - 2.0 * Math.random()) * 0.01);
  cubeRotation.push((1.0 - 2.0 * Math.random()) * 0.01);

}

camera.position.z = Lz;

var animate = function () {
  requestAnimationFrame(animate);

  for (var i = 0; i < cube.length; i++) {
    cube[i].position.z += 0.1;
    cube[i].rotation.x += cubeRotation[i];
    cube[i].rotation.y += cubeRotation[i];

    if (cube[i].position.z > Lz) {
      cube[i].position.z = 0.0;
      cube[i].position.x = (1.0 - 2.0 * Math.random()) * Lx;
      cube[i].position.y = (1.0 - 2.0 * Math.random()) * Ly;
    }
  }

  renderer.render(scene, camera);
};

animate();