import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. CONFIGURACIÓN DE ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 50, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// 2. DATOS DE LOS SILOS
const silosData = [
    { x: -30, z: 0, d: 20, h: 30, nivel: 75, nombre: "Silo 01", producto: "Soya", stockMax: 2000 },
    { x: 0, z: 0, d: 20, h: 30, nivel: 40, nombre: "Silo 02", producto: "Soya", stockMax: 2000 },
    { x: 25, z: 10, d: 12, h: 20, nivel: 85, nombre: "Silo 03", producto: "Trigo", stockMax: 800 }
];

const objetosDeteccion = [];

// 3. FUNCIÓN PARA CREAR CADA SILO
function crearPlanta() {
    silosData.forEach(data => {
        const grupo = new THREE.Group();
        const radio = data.d / 2;

        // Cuerpo
        const cuerpoGeo = new THREE.CylinderGeometry(radio, radio, data.h, 32);
        const cuerpoMat = new THREE.MeshPhongMaterial({ color: 0x999999, transparent: true, opacity: 0.3 });
        const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat);
        
        // Techo
        const techoGeo = new THREE.ConeGeometry(radio * 1.05, 5, 32);
        const techoMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
        const techo = new THREE.Mesh(techoGeo, techoMat);
        techo.position.y = data.h / 2 + 2.5;

        // Grano
        const alturaGrano = (data.nivel / 100) * data.h;
        const granoGeo = new THREE.CylinderGeometry(radio * 0.98, radio * 0.98, alturaGrano, 32);
        const colorGrano = data.producto === "Soya" ? 0xffa500 : 0xe3af66;
        const granoMat = new THREE.MeshPhongMaterial({ color: colorGrano });
        const grano = new THREE.Mesh(granoGeo, granoMat);
        grano.position.y = -(data.h / 2) + (alturaGrano / 2);

        grupo.add(cuerpo, techo, grano);
        grupo.position.set(data.x, 0, data.z);
        grupo.userData = data; 
        
        scene.add(grupo);
        objetosDeteccion.push(cuerpo);
    });
}

// 4. LUCES
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(10, 50, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0x404040, 1.5));

// 5. MOUSE Y TOOLTIP
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.getElementById('tooltip');

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objetosDeteccion);

    if (intersects.length > 0 && tooltip) {
        const d = intersects[0].object.parent.userData;
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 15 + 'px';
        tooltip.style.top = event.clientY + 15 + 'px';
        
        document.getElementById('tooltip-nombre').innerText = d.nombre;
        document.getElementById('tooltip-producto').innerText = d.producto;
        document.getElementById('tooltip-stock').innerText = (d.stockMax * d.nivel / 100).toFixed(0);
        document.getElementById('tooltip-porcentaje').innerText = d.nivel;
    } else if (tooltip) {
        tooltip.style.display = 'none';
    }
});

// 6. INICIO
crearPlanta();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
