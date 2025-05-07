// Enhanced 3D JavaScript for Vought International
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js scene
  const canvas = document.getElementById('webgl-canvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x020202, 0.001);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0x00bfff, 1);
  directionalLight.position.set(1, 1, 1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Add point light
  const pointLight = new THREE.PointLight(0x00bfff, 1, 100);
  pointLight.position.set(0, 5, 5);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Add particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 10000;
  const posArray = new Float32Array(particleCount * 3);
  const colorArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
    colorArray[i] = Math.random();
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: 0x00bfff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  particlesMesh.position.z = -10;
  scene.add(particlesMesh);

  // Add floating Vought logo
  const logoTexture = new THREE.TextureLoader().load('https://i.ibb.co/KpN64sP4/IMG-20250413-220627.png');
  const logoGeometry = new THREE.PlaneGeometry(4, 4);
  const logoMaterial = new THREE.MeshStandardMaterial({
    map: logoTexture,
    transparent: true,
    emissive: 0x00bfff,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
    metalness: 0.8,
    roughness: 0.2
  });
  
  const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
  logoMesh.position.set(0, 0, -20);
  logoMesh.rotation.y = Math.PI / 4;
  scene.add(logoMesh);

  // Add floating cubes
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00bfff,
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  
  const cubes = [];
  for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * -50
    );
    cube.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    scene.add(cube);
    cubes.push(cube);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Close menu when clicking a nav item or logo
  document.querySelectorAll('.nav-links a, .nav-logo').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 100;

      if (elementTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  // Logo Rotation on Scroll
  const logoInner = document.querySelector('.logo-inner');
  if (logoInner) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const rotation = scrollY / 3;
      logoInner.style.transform = `rotateY(${rotation}deg)`;
    });
  }

  // Scroll to Top Button
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    });

    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('nav-logo')) return;
    
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Hero Section Animation
  const subtitle = document.querySelector('.subtitle');
  const scrollDown = document.querySelectorAll('.scroll-down span');

  if (subtitle) {
    setTimeout(() => {
      subtitle.style.opacity = '1';
    }, 500);
  }

  if (scrollDown) {
    scrollDown.forEach((span, index) => {
      setTimeout(() => {
        span.style.opacity = '1';
      }, 1000 + (index * 200));
    });
  }

  // Card Hover Effect Enhancement
  const cards = document.querySelectorAll('.card-3d');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const x = e.clientX - card.getBoundingClientRect().left;
      const y = e.clientY - card.getBoundingClientRect().top;
      
      const centerX = card.offsetWidth / 2;
      const centerY = card.offsetHeight / 2;
      
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px) scale(1.03) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(-10px) scale(1.03) translateZ(10px)';
    });
  });

  // GSAP animations for parallax
  gsap.registerPlugin(ScrollTrigger);
  
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  parallaxLayers.forEach(layer => {
    gsap.to(layer, {
      scrollTrigger: {
        trigger: layer,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      },
      y: (i, target) => ScrollTrigger.maxScroll(window) * 0.1 * (i + 1),
      ease: "none"
    });
  });

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Animate particles
    particlesMesh.rotation.x = elapsedTime * 0.05;
    particlesMesh.rotation.y = elapsedTime * 0.05;
    
    // Animate logo
    logoMesh.rotation.y = elapsedTime * 0.1;
    logoMesh.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
    
    // Animate cubes
    cubes.forEach((cube, index) => {
      cube.rotation.x = elapsedTime * 0.1 * (index + 1);
      cube.rotation.y = elapsedTime * 0.1 * (index + 1);
      cube.position.z = Math.sin(elapsedTime * 0.2 + index) * 5 - 20;
    });
    
    renderer.render(scene, camera);
  }
  
  animate();

  // Prevent scrolling when mobile menu is open
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleNoScroll = () => {
      if (navLinks.classList.contains('active')) {
        body.classList.add('no-scroll');
      } else {
        body.classList.remove('no-scroll');
      }
    };
    
    hamburger.addEventListener('click', toggleNoScroll);
  });

  // Mouse move parallax effect
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Move camera slightly based on mouse position
    camera.position.x = (x - 0.5) * 2;
    camera.position.y = -(y - 0.5) * 2;
    camera.lookAt(0, 0, 0);
    
    // Move particles based on mouse
    particlesMesh.position.x = (x - 0.5) * 10;
    particlesMesh.position.y = -(y - 0.5) * 10;
  });
});
