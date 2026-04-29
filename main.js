import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. CONFIGURACIÓN PARAMÉTRICA (Lo que puedes modificar después)
const configuracion = {
    diametro: 20,
    altura: 30,
    nivelPorcentaje: 65 // Cambia esto para ver subir/bajar el grano
};

// 2. ESCENA, CÁMARA Y RENDERER
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 3. ILUMINACIÓN
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(10, 20, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 4. FUNCIÓN PARA CONSTRUIR EL SILO
function crearSiloParametrico() {
    const radio = configuracion.diametro / 2;
    const altura = configuracion.altura;

    // Cuerpo Exterior (Cilindro transparente)
    const geoCuerpo = new THREE.CylinderGeometry(radio, radio, altura, 32);
    const matCuerpo = new THREE.MeshPhongMaterial({ 
        color: 0x888888, 
        transparent: true, 
        opacity: 0.3,
        side: THREE.DoubleSide 
    });
    const siloCuerpo = new THREE.Mesh(geoCuerpo, matCuerpo);
    scene.add(siloCuerpo);

    // Contenido (El Grano)
    const alturaGrano = (configuracion.nivelPorcentaje / 100) * altura;
    const geoGrano = new THREE.CylinderGeometry(radio * 0.98, radio * 0.98, alturaGrano, 32);
    const matGrano = new THREE.MeshPhongMaterial({ color: 0xd2b48c });
    const grano = new THREE.Mesh(geoGrano, matGrano);
    
    // Ajustar posición del grano para que esté en la base
    grano.position.y = -(altura / 2) + (alturaGrano / 2);
    scene.add(grano);

    // Piso de referencia
    const grid = new THREE.GridHelper(100, 10);
    grid.position.y = -(altura / 2);
    scene.add(grid);
}

crearSiloParametrico();

// 5. CICLO DE ANIMACIÓN
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Ajuste de ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('status').innerText = "Estado: Conectado - Visualizando Stock";
