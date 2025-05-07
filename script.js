// ===== THREE.JS SETUP =====
const canvas = document.querySelector('.webgl-canvas');
const loadingScreen = document.querySelector('.loading-screen');
const loadingBar = document.querySelector('.loading-bar');
const loadingProgress = document.querySelector('.loading-progress');

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

// ===== SHADER MATERIAL =====
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
      
      float plasma = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
      plasma += sin(uv.x * 10.0 + time) * 0.3;
      plasma += sin(uv.y * 10.0 + time * 1.5) * 0.3;
      
      vec2 mouseUV = (mouse * 2.0 - 1.0) * vec2(resolution.x/resolution.y, 1.0);
      float mouseDist = length(uv - mouseUV);
      plasma += sin(mouseDist * 30.0 - time * 3.0) * 0.5;
      
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

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  shaderMaterial
);
scene.add(plane);

// ===== LOADING SYSTEM =====
let assetsLoaded = 0;
const totalAssets = 10; // Simulating 10 assets to load

function updateProgress() {
  assetsLoaded++;
  const progress = (assetsLoaded / totalAssets) * 100;
  loadingBar.style.width = `${progress}%`;
  loadingProgress.textContent = `${Math.round(progress)}%`;

  if (assetsLoaded >= totalAssets) {
    completeLoading();
  }
}

function completeLoading() {
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      loadingScreen.style.display = 'none';
      initContent();
    }
  });
}

// Simulate asset loading
function simulateAssetLoading() {
  const loadInterval = setInterval(() => {
    if (assetsLoaded < totalAssets) {
      updateProgress();
    } else {
      clearInterval(loadInterval);
    }
  }, 300);
}

// ===== CONTENT INITIALIZATION =====
function initContent() {
  // Leadership Grid
  const leadershipGrid = document.querySelector('.leadership-grid');
  const leaders = [
    {
      name: "NotSad",
      title: "CEO",
      bio: "Former leader of top alliances with strategic expertise",
      image: "https://i.ibb.co/zHhdnjRD/adb8a4518f140928e346eef2567c7764.png"
    },
    {
      name: "Alexio",
      title: "COO",
      bio: "Operations mastermind with years of experience",
      image: "https://i.ibb.co/7Jr9RGxw/162e5feff3502d6fc2b588d04f87150a.png"
    },
    {
      name: "Sneb",
      title: "COO",
      bio: "Tactical specialist in alliance management",
      image: "https://i.ibb.co/bjBrz8Lf/6cc0cf6d4808694a58250f27f3e0f1eb.png"
    }
  ];

  leaders.forEach(leader => {
    const card = document.createElement('div');
    card.className = 'leader-card';
    card.innerHTML = `
      <div class="leader-image">
        <img src="${leader.image}" alt="${leader.name}">
      </div>
      <h3 class="leader-name">${leader.name}</h3>
      <p class="leader-title">${leader.title}</p>
      <p class="leader-bio">${leader.bio}</p>
    `;
    leadershipGrid.appendChild(card);
  });

  // Features Grid
  const featuresGrid = document.querySelector('.features-grid');
  const features = [
    {
      icon: '<i class="fas fa-shield-alt"></i>',
      title: "Active Protection",
      desc: "24/7 defense from our elite military team"
    },
    {
      icon: '<i class="fas fa-coins"></i>',
      title: "Growth Grants",
      desc: "Financial support for developing nations"
    },
    {
      icon: '<i class="fas fa-users"></i>',
      title: "Veteran Network",
      desc: "Learn from former top alliance leaders"
    },
    {
      icon: '<i class="fas fa-bolt"></i>',
      title: "Raid Flexibility",
      desc: "No strict rules on military operations"
    }
  ];

  features.forEach(feature => {
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.innerHTML = `
      <div class="feature-icon">${feature.icon}</div>
      <h3 class="feature-title">${feature.title}</h3>
      <p class="feature-desc">${feature.desc}</p>
    `;
    featuresGrid.appendChild(card);
  });

  // Initialize animations
  initAnimations();
}

// ===== ANIMATIONS =====
function initAnimations() {
  // Smooth scroll
  let scrollY = window.scrollY;
  let targetScrollY = 0;
  
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  function smoothScroll() {
    scrollY += (targetScrollY - scrollY) * 0.05;
    document.querySelector('.content').style.transform = `translateY(${-scrollY}px)`;
    camera.position.z = 5 + (scrollY / window.innerHeight) * 10;
    requestAnimationFrame(smoothScroll);
  }
  smoothScroll();

  // GSAP animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate sections
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });

  // Animate cards
  gsap.utils.toArray('.leader-card, .feature-card').forEach(card => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
}

// ===== EVENT LISTENERS =====
document.addEventListener('mousemove', (e) => {
  shaderMaterial.uniforms.mouse.value.x = e.clientX / window.innerWidth;
  shaderMaterial.uniforms.mouse.value.y = 1.0 - e.clientY / window.innerHeight;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  shaderMaterial.uniforms.resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
});

// ===== START APPLICATION =====
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  shaderMaterial.uniforms.time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

// Initialize everything
animate();
simulateAssetLoading();
