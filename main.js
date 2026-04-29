import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- ESCENA Y CÁMARA ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// --- LUCES ---
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 1.5));

// --- DATOS DE LOS SILOS ---
const silos = [
    { x: -25, z: 0, d: 20, h: 30, nivel: 70, nombre: "Silo 01" },
    { x: 5, z: 0, d: 20, h: 30, nivel: 35, nombre: "Silo 02" }
];

const objetosDeteccion = [];

// --- DIBUJAR ---
silos.forEach(data => {
    const grupo = new THREE.Group();
    const radio = data.d / 2;

    // Cuerpo
    const cuerpo = new THREE.Mesh(
        new THREE.CylinderGeometry(radio, radio, data.h, 32),
        new THREE.MeshPhongMaterial({ color: 0x999999, transparent: true, opacity: 0.3 })
    );
    
    // Techo
    const techo = new THREE.Mesh(
        new THREE.ConeGeometry(radio * 1.05, 5, 32),
        new THREE.MeshPhongMaterial({ color: 0x555555 })
    );
    techo.position.y = data.h / 2 + 2.5;

    // Grano (Stock)
    const hGrano = (data.nivel / 100) * data.h;
    const grano = new THREE.Mesh(
        new THREE.CylinderGeometry(radio * 0.98, radio * 0.98, hGrano, 32),
        new THREE.MeshPhongMaterial({ color: 0xffa500 })
    );
    grano.position.y = -(data.h / 2) + (hGrano / 2);

    grupo.add(cuerpo, techo, grano);
    grupo.position.set(data.x, 0, data.z);
    grupo.userData = data;
    
    scene.add(grupo);
    objetosDeteccion.push(cuerpo);
});

// --- ANIMACIÓN ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
