import {
    SphereGeometry,
    HemisphereLight,
    AmbientLight,
    DirectionalLight,
    Mesh,
    Fog,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Color,
    ShaderMaterial,
    TextureLoader,
    AdditiveBlending,
    BackSide,
    MeshBasicMaterial
} from 'three';

import ThreeGlobe from 'three-globe';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import globeVertexShader from '$lib/shaders/globe/vertex.glsl';
import globeFragmentShader from '$lib/shaders/globe/fragment.glsl';
// import earth from './earth.jpg';

import atmosphereVertexShader from '$lib/shaders/atmosphere/vertex.glsl';
import atmosphereFragmentShader from '$lib/shaders/atmosphere/fragment.glsl';
import * as GeoJSON from './geo.json';
import * as mapJSON from './custom.geo.json';


const scene = new Scene();

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const material = new MeshStandardMaterial({
    color: 0x0099FF,
    emissive: new Color(0x220038),
    emissiveIntensity: 0.5,
    metalness: 0.7
});

// Globe
const globe = new Mesh(new SphereGeometry(2.5, 50, 50), new ShaderMaterial({
    vertexShader: globeVertexShader,
    fragmentShader: globeFragmentShader,
    uniforms: {
        globeTexture: {
            value: new TextureLoader().load('./src/lib/earth.jpg')
        }
    }
}));
scene.add(globe);

// const globe = new ThreeGlobe({
//     waitForGlobeReady: true,
//     animateIn: true
// }).globeImageUrl('./src/lib/earth.jpg');
// // globe.globeImageUrl
// //     .globeImageUrl('./src/lib/earth.jpg')
// //     .pointsData(mapJSON);
// scene.add(globe);

//Atmosphere
const atmosphere = new Mesh(new SphereGeometry(2.5, 50, 50), new ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: AdditiveBlending,
    side: BackSide
}));
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere);



// Light
const hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 1.);
scene.add(hemisphereLight);

const ambientLight = new AmbientLight(0xbbbbbb, 0.3);
ambientLight.position.set(-10, 10, -10).normalize();
scene.add(ambientLight);

const dirLight = new DirectionalLight(0xffffff, 0.8);
dirLight.position.set(-800, 2000, 400);
scene.add(dirLight);

const dirLight2 = new DirectionalLight(0x7982f6, 1);
dirLight.position.set(-200, 500, 200);
scene.add(dirLight2);

const dirLight3 = new DirectionalLight(0x8566cc, 0.8);
dirLight.position.set(-200, 500, 200);
scene.add(dirLight3);

scene.fog = new Fog(0x535ef3, 400, 2000);

let renderer: WebGLRenderer;
let controls: OrbitControls

// // Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dynamicDampingFactor = 0.01;
// controls.enablePan = false;
// controls.minDistance = 3.5;
// controls.maxDistance = 8;
// controls.rotateSpeed = .001;
// controls.zoomSpeed = .005;
// controls.autoRotate = false;
// controls.update();


// GeoJSON.features.forEach((feature) => {
//     const lon = feature.geometry.coordinates[0];
//     const lat = feature.geometry.coordinates[1];

//     const latitudeRad: number = (lat * Math.PI) / 180;
//     const longitudeRad: number = ((lon + 180) * Math.PI) / 180; // Adjust for the longitude range [-180, 180]


//     // const phi = (90 - lat) * (Math.PI / 180);
//     // const theta = (180 - lon) * (Math.PI / 180);
//     const phi: number = Math.PI / 2 - latitudeRad;
//     const theta: number = longitudeRad;

//     const markerGeometry = new SphereGeometry(0.20);
//     const markerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
//     const marker = new Mesh(markerGeometry, markerMaterial);

//     // marker.position.setFromSphericalCoords(2, phi, theta);
//     // Convert spherical coordinates to Cartesian coordinates
//     const x = 2 * Math.sin(phi) * Math.cos(theta);
//     const y = 2 * Math.cos(phi);
//     const z = 2 * Math.sin(phi) * Math.sin(theta);

//     marker.position.set(x, y, z);
//     marker.scale.set(0.01, 0.01, 5.0)
//     globe.add(marker);
// });

const animate = () => {
    requestAnimationFrame(animate);
    // globe.rotation.x += 0.001;
    // scene.rotation.y += 0.001;

    renderer.render(scene, camera);
};

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

export const createScene = (el: HTMLCanvasElement) => {
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 3.5;
    controls.maxDistance = 8;
    resize();
    animate();
};



//https://observablehq.com/@wolfiex/world-map-geojson-mesh-in-three-js-using-dem