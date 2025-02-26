import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 2.5); 

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);

const cursorLight = new THREE.SpotLight(0xffffff, 2);
cursorLight.castShadow = true;
cursorLight.shadow.mapSize.width = 1024;
cursorLight.shadow.mapSize.height = 1024;
scene.add(cursorLight);



/*Orbit Controls
// 
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Restrict camera tilt
*/



const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 0);
scene.add(directionalLight);

/*
// Add a 3D Grid Helper (size 10x10, divided into 10 segments)
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
*/

// GLTFLoader
const loader = new GLTFLoader();
loader.load(
    '/assets/model/schlossbruecke.glb',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Optional: Adjust model position and scale
        model.position.set(1, -1.5, .7);
        model.scale.set(.3, .3, .3);
        model.rotation.set(0, -.5, 0);

        // Apply MeshPhongMaterial for better shading
        model.traverse((obj) => {
            if (obj.isMesh) {
                obj.material = new THREE.MeshPhongMaterial({
                    color: obj.material.color, 
                    specular: 0x444444, 
                    shininess: 40,
                    flatShading: false // Ensure smooth shading
                });
                    
                obj.geometry.computeVertexNormals(); // Recalculate normals for smooth shading
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
        

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);

// Mouse movement handler
window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to -1 to 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize to -1 to 1

    // Update light position based on mouse movement
    directionalLight.position.set(x * 2, y * 2, .2);
});



// Create title overlay
const title = document.createElement('div');
title.innerText = 'Sebastian Hybel';
title.style.position = 'absolute';
title.style.top = '3rem';
title.style.left = '20rem';
title.style.transform = 'translate(-50%, -50%)';
title.style.color = 'white';
title.style.fontSize = '2rem';
title.style.fontFamily = 'Georgia, sans-serif';
title.style.fontWeight = 'normal';
title.style.textShadow = '2px 2px 10px rgba(0, 0, 0, 0.7)';
title.style.pointerEvents = 'none';

document.body.appendChild(title);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/*
// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    controls.update(); // Update OrbitControls
    renderer.render(scene, camera);
};
animate();
*/