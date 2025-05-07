// ===== THREE.JS INITIALIZATION =====
const canvas = document.querySelector('.webgl-canvas');
const loadingScreen = document.querySelector('.loading-screen');
const loadingBar = document.querySelector('.loading-bar');
const loadingText = document.querySelector('.loading-text');

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2);
const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(ambientLight, directionalLight);

// ===== CUSTOM SHADER MATERIAL =====
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    mouse: { value: new THREE.Vector2(0.5, 0.5) }
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    
    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      float dist = length(uv);
      
      // Plasma effect
      float plasma = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
      plasma += sin(uv.x * 10.0 + time) * 0.3;
      plasma += sin(uv.y * 10.0 + time * 1.5) * 0.3;
      
      // Mouse interaction
      vec2 mouseUV = (mouse * 2.0 - 1.0) * vec2(resolution.x/resolution.y, 1.0);
      float mouseDist = length(uv - mouseUV);
      plasma += sin(mouseDist * 30.0 - time * 3.0) * 0.5;
      
      // Vought color scheme
      vec3 color = mix(
        vec3(0.0, 0.8, 1.0),
        vec3(0.0, 0.4, 1.0),
        plasma
      );
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: true
});

// Fullscreen plane for shader
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  shaderMaterial
);
scene.add(plane);

// ===== LOADING MANAGER =====
const loadingManager = new THREE.LoadingManager(
  // When everything is loaded
  () => {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        loadingScreen.style.display = 'none';
      }
    });
  },
  // Progress update
  (item, loaded, total) => {
    const progress = loaded / total;
    loadingBar.style.width = `${progress * 100}%`;
    loadingText.textContent = `LOADING ASSETS: ${Math.round(progress * 100)}%`;
  }
);

// ===== MOUSE INTERACTION =====
document.addEventListener('mousemove', (e) => {
  shaderMaterial.uniforms.mouse.value.x = e.clientX / window.innerWidth;
  shaderMaterial.uniforms.mouse.value.y = 1.0 - e.clientY / window.innerHeight;
});

// ===== SCROLL ANIMATIONS =====
let scrollY = window.scrollY;
let targetScrollY = 0;

window.addEventListener('scroll', () => {
  targetScrollY = window.scrollY;
});

function smoothScroll() {
  scrollY += (targetScrollY - scrollY) * 0.1;
  document.querySelector('.content').style.transform = `translateY(${-scrollY}px)`;
  
  // Parallax effect
  camera.position.z = 5 + (scrollY / window.innerHeight) * 10;
  
  requestAnimationFrame(smoothScroll);
}

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  shaderMaterial.uniforms.resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
});

// ===== ANIMATION LOOP =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  // Update shader time
  shaderMaterial.uniforms.time.value = clock.getElapsedTime();
  
  // Render scene
  renderer.render(scene, camera);
}

// Start everything
animate();
smoothScroll();
