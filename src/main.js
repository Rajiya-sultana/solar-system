import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Global variables for scene setup
let scene, camera, renderer, controls, skybox;

// Planet mesh references
let planet_sun,
  planet_mercury,
  planet_venus,
  planet_earth,
  planet_mars,
  planet_jupiter,
  planet_saturn,
  planet_uranus,
  planet_neptune;

// Default revolution speeds for each planet (can be changed via sliders)
let revolutionSpeeds = {
  mercury: 2,
  venus: 1.5,
  earth: 1,
  mars: 0.8,
  jupiter: 0.7,
  saturn: 0.6,
  uranus: 0.5,
  neptune: 0.4,
};

// Orbit radii for each planet from the Sun
const orbitRadii = {
  mercury: 50,
  venus: 60,
  earth: 70,
  mars: 80,
  jupiter: 100,
  saturn: 120,
  uranus: 140,
  neptune: 160,
};

// Function to load six-sided skybox texture
function createMatrixArray() {
  const skyboxImagePaths = [
    "/Assets/skybox/space_ft.png",
    "/Assets/skybox/space_bk.png",
    "/Assets/skybox/space_dn.png",
    "/Assets/skybox/space_up.png",
    "/Assets/skybox/space_rt.png",
    "/Assets/skybox/space_lf.png",
  ];

  // Convert each image into a MeshBasicMaterial for cube sides
  return skyboxImagePaths.map((image) => {
    const texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
}

// Add skybox cube to the scene
function setSkyBox() {
  const materialArray = createMatrixArray();
  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

// Utility to create a textured planet sphere
function loadPlanetTexture(texture, radius) {
  const geometry = new THREE.SphereGeometry(radius, 100, 100);
  const map = new THREE.TextureLoader().load(texture);
  const material = new THREE.MeshBasicMaterial({ map });
  return new THREE.Mesh(geometry, material);
}

// Add orbit ring for planet visualization
function createRing(radius) {
  const geometry = new THREE.RingGeometry(radius, radius + 0.1, 100);
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2; // Rotate to lie flat
  scene.add(ring);
}

// Main function to initialize everything
function init() {
  // Basic scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  // Renderer setup
  const canvas = document.querySelector("canvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // User controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  // Load skybox background
  setSkyBox();

  // Load planet models
  planet_sun = loadPlanetTexture("/Assets/sun_hd.jpg", 20);
  planet_mercury = loadPlanetTexture("/Assets/mercury_hd.jpg", 2);
  planet_venus = loadPlanetTexture("/Assets/venus_hd.jpg", 3);
  planet_earth = loadPlanetTexture("/Assets/earth_hd.jpg", 4);
  planet_mars = loadPlanetTexture("/Assets/mars_hd.jpg", 3.5);
  planet_jupiter = loadPlanetTexture("/Assets/jupiter_hd.jpg", 10);
  planet_saturn = loadPlanetTexture("/Assets/saturn_hd.jpg", 8);
  planet_uranus = loadPlanetTexture("/Assets/uranus_hd.jpg", 6);
  planet_neptune = loadPlanetTexture("/Assets/neptune_hd.jpg", 5);

  // Add all planets and sun to the scene
  scene.add(
    planet_sun,
    planet_mercury,
    planet_venus,
    planet_earth,
    planet_mars,
    planet_jupiter,
    planet_saturn,
    planet_uranus,
    planet_neptune
  );

  // Create circular orbit rings
  for (let key in orbitRadii) {
    createRing(orbitRadii[key]);
  }

  // Set Earth's initial position (others set dynamically)
  planet_earth.position.x = orbitRadii.earth;

  // Add speed sliders for each planet
  createSpeedSliders();
}

// Function to update a planet’s orbit position around the Sun
function planetRevolver(time, speed, planet, radius) {
  const angle = time * 0.001 * speed;
  planet.position.x = planet_sun.position.x + radius * Math.cos(angle);
  planet.position.z = planet_sun.position.z + radius * Math.sin(angle);
}

// Animation loop
function animate(time) {
  const speed = 0.005; // Rotation speed of each planet

  // Rotate each planet (not orbit, just self-rotation)
  planet_sun.rotation.y += speed;
  planet_mercury.rotation.y += speed;
  planet_venus.rotation.y += speed;
  planet_earth.rotation.y += speed;
  planet_mars.rotation.y += speed;
  planet_jupiter.rotation.y += speed;
  planet_saturn.rotation.y += speed;
  planet_uranus.rotation.y += speed;
  planet_neptune.rotation.y += speed;

  // Update orbital position of each planet
  planetRevolver(time, revolutionSpeeds.mercury, planet_mercury, orbitRadii.mercury);
  planetRevolver(time, revolutionSpeeds.venus, planet_venus, orbitRadii.venus);
  planetRevolver(time, revolutionSpeeds.earth, planet_earth, orbitRadii.earth);
  planetRevolver(time, revolutionSpeeds.mars, planet_mars, orbitRadii.mars);
  planetRevolver(time, revolutionSpeeds.jupiter, planet_jupiter, orbitRadii.jupiter);
  planetRevolver(time, revolutionSpeeds.saturn, planet_saturn, orbitRadii.saturn);
  planetRevolver(time, revolutionSpeeds.uranus, planet_uranus, orbitRadii.uranus);
  planetRevolver(time, revolutionSpeeds.neptune, planet_neptune, orbitRadii.neptune);

  // Update camera controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Loop the animation
  requestAnimationFrame(animate);
}

// Create UI sliders to control orbital speeds
function createSpeedSliders() {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "10px";
  container.style.left = "10px";
  container.style.background = "rgba(0,0,0,0.6)";
  container.style.padding = "10px";
  container.style.color = "#fff";
  container.style.fontFamily = "sans-serif";
  container.style.zIndex = 1000;

  for (let planet in revolutionSpeeds) {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "4px";

    // Label and input range element
    const text = document.createTextNode(
      `${planet.charAt(0).toUpperCase() + planet.slice(1)} Speed: `
    );
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "5";
    input.step = "1";
    input.value = revolutionSpeeds[planet];

    // Update speed on slider input
    input.oninput = (e) => {
      revolutionSpeeds[planet] = parseFloat(e.target.value);
    };

    label.appendChild(text);
    label.appendChild(input);
    container.appendChild(label);
  }

  document.body.appendChild(container);
}

// Handle screen resize to keep canvas responsive
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// Start the whole setup
init();
animate(0);
