import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Fondo gris oscuro para resaltar el metal

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// --- FUNCIÓN MAESTRA PARA CREAR TU SILO ---
function crearSiloIndustrial(x, z, diametro, altura, nivelPorcentaje, nombre) {
    const grupoSilo = new THREE.Group();
    const radio = diametro / 2;

    // 1. Cuerpo Cilíndrico (Metal corrugado)
    const geoCuerpo = new THREE.CylinderGeometry(radio, radio, altura, 32);
    const matCuerpo = new THREE.MeshPhongMaterial({ 
        color: 0x999999, 
        transparent: true, 
        opacity: 0.4,
        shininess: 100 
    });
    const cuerpo = new THREE.Mesh(geoCuerpo, matCuerpo);
    grupoSilo.add(cuerpo);

    // 2. Techo Cónico (Estilo Kepler Weber)
    const geoTecho = new THREE.ConeGeometry(radio * 1.05, 5, 32);
    const matTecho = new THREE.MeshPhongMaterial({ color: 0x777777 });
    const techo = new THREE.Mesh(geoTecho, matTecho);
    techo.position.y = altura / 2 + 2.5;
    grupoSilo.add(techo);

    // 3. Contenido (Grano/Stock)
    const alturaGrano = (nivelPorcentaje / 100) * altura;
    const geoGrano = new THREE.CylinderGeometry(radio * 0.99, radio * 0.99, alturaGrano, 32);
    const matGrano = new THREE.MeshPhongMaterial({ color: 0xffa500 }); // Color Naranja/Soya
    const grano = new THREE.Mesh(geoGrano, matGrano);
    grano.position.y = -(altura / 2) + (alturaGrano / 2);
    grupoSilo.add(grano);

    grupoSilo.position.set(x, 0, z);
    scene.add(grupoSilo);
}

// --- BLOQUE DE POSICIONAMIENTO (Basado en tu layout) ---
// Aquí es donde ajustas las coordenadas X y Z para que queden como en la foto
crearSiloIndustrial(-25, 0, 20, 30, 75, "Silo A"); // Grande Izquierda
crearSiloIndustrial(0, 0, 20, 30, 40, "Silo B");  // Grande Centro
crearSiloIndustrial(20, 10, 10, 20, 90, "Silo C"); // Pequeño Fondo

// Iluminación para efecto metálico
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(10, 50, 20);
scene.add(light1);
const light2 = new THREE.AmbientLight(0x404040, 2);
scene.add(light2);

camera.position.set(60, 60, 60);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
