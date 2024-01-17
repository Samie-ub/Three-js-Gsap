import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xffffff, 2,3 );
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const texturePaths = [
  "/public/textures/camera_body_baseColor.jpeg",
  "/public/textures/camera_body_emissive.jpeg",
  "/public/textures/camera_body_metallicRoughness.png",
  "/public/textures/camera_body_normal.jpeg",
  "/public/textures/camera_case_baseColor.jpeg",
  "/public/textures/camera_case_metallicRoughness.png",
  "/public/textures/camera_lense_normal.jpeg",
  "/public/textures/ground_baseColor.png",
  "/public/textures/ground_metallicRoughness.png",
];

let model;
loader.load("/public/scene.gltf", (gltf) => {
  model = gltf.scene;

  model.traverse((child, index) => {
    if (child.isMesh) {
      const textureIndex = index % texturePaths.length;

      textureLoader.load(texturePaths[textureIndex], (texture) => {
        child.material.map = texture;
        child.material.needsUpdate = true;
      });
    }
  });
  model.position.set(0, 0, 0);

  scene.add(model);
  const tl = gsap.timeline({ defaults: { duration: 1 } });
  tl.fromTo(model.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.autoRotate = true;
const ambientLight = new THREE.AmbientLight(0xffffff, 6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x468b97, 5);
const directionalLightTwo = new THREE.DirectionalLight(0xc70039, 5);
directionalLight.position.set(500, 500, 500);
directionalLightTwo.position.set(-500, 500, 500);
scene.add(directionalLight);
scene.add(directionalLightTwo);

camera.position.z = 0.5;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
};

animate();
