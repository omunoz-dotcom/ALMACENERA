// 1. Array de Datos (Esto simula tu base de datos WMS)
const silosData = [
    { x: -30, z: 0, d: 20, h: 30, nivel: 75, nombre: "Silo 01", producto: "Soya", stockMax: 2000 },
    { x: 0, z: 0, d: 20, h: 30, nivel: 40, nombre: "Silo 02", producto: "Soya", stockMax: 2000 },
    { x: 25, z: 10, d: 12, h: 20, nivel: 85, nombre: "Silo 03", producto: "Trigo", stockMax: 800 }
];

const objetosSilos = []; // Para que el raycaster los detecte

function renderizarPlanta() {
    silosData.forEach(data => {
        const grupo = new THREE.Group();
        
        // Cuerpo y Techo (Igual al anterior)
        const cuerpo = new THREE.Mesh(
            new THREE.CylinderGeometry(data.d/2, data.d/2, data.h, 32),
            new THREE.MeshPhongMaterial({ color: 0x999999, transparent: true, opacity: 0.3 })
        );
        
        const techo = new THREE.Mesh(
            new THREE.ConeGeometry(data.d/2 * 1.05, 5, 32),
            new THREE.MeshPhongMaterial({ color: 0x555555 })
        );
        techo.position.y = data.h / 2 + 2.5;

        // Grano
        const hGrano = (data.nivel / 100) * data.h;
        const grano = new THREE.Mesh(
            new THREE.CylinderGeometry(data.d/2 - 0.1, data.d/2 - 0.1, hGrano, 32),
            new THREE.MeshPhongMaterial({ color: data.producto === "Soya" ? 0xffa500 : 0xe3af66 })
        );
        grano.position.y = -(data.h / 2) + (hGrano / 2);

        grupo.add(cuerpo, techo, grano);
        grupo.position.set(data.x, 0, data.z);
        
        // Guardamos metadatos en el objeto 3D para el tooltip
        grupo.userData = data; 
        
        scene.add(grupo);
        objetosSilos.push(cuerpo); // El raycaster detecta la colisión con el cuerpo
    });
}

// 3. Lógica del Raycaster (Detección de Mouse)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objetosSilos);

    const tooltip = document.getElementById('tooltip');
    if (intersects.length > 0) {
        const d = intersects[0].object.parent.userData;
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        
        document.getElementById('tooltip-nombre').innerText = d.nombre;
        document.getElementById('tooltip-producto').innerText = d.producto;
        document.getElementById('tooltip-stock').innerText = (d.stockMax * d.nivel / 100).toFixed(0);
        document.getElementById('tooltip-porcentaje').innerText = d.nivel;
    } else {
        tooltip.style.display = 'none';
    }
});

renderizarPlanta();
