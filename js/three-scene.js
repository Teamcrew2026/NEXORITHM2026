/**
 * Nexorithm 2026 - Interactive 3D WebGL Background Engine
 * Powered by Three.js
 */

class NexorithmScene {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.meshes = [];
    this.particleSystem = null;
    this.pointLight1 = null;
    this.pointLight2 = null;
    this.pointLight3 = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;

    this.init();
  }

  init() {
    try {
      // 1. Scene Setup
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x05070c, 0.025);

      // 2. Camera Setup
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
      this.camera.position.z = 28;

      // 3. Renderer Setup
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: !this.isMobile,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;

      // 4. Lighting System
      this.setupLights();

      // 5. 3D Floating Geometries
      this.createFloatingGeometries();

      // 6. Particle Field / Cyber Constellation
      this.createParticleField();

      // 7. Event Listeners
      this.bindEvents();

      // 8. Animation Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    } catch (err) {
      console.warn('Three.js WebGL initialization failed or unsupported, rendering CSS fallback:', err);
    }
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.2);
    this.scene.add(ambientLight);

    // Cyan Neon Point Light
    this.pointLight1 = new THREE.PointLight(0x00f0ff, 3.5, 50);
    this.pointLight1.position.set(15, 12, 10);
    this.scene.add(this.pointLight1);

    // Electric Purple Point Light
    this.pointLight2 = new THREE.PointLight(0x8b5cf6, 4.0, 50);
    this.pointLight2.position.set(-15, -10, 8);
    this.scene.add(this.pointLight2);

    // Rose/Pink Accent Light
    this.pointLight3 = new THREE.PointLight(0xec4899, 2.5, 40);
    this.pointLight3.position.set(0, -18, 5);
    this.scene.add(this.pointLight3);
  }

  createFloatingGeometries() {
    const group = new THREE.Group();

    // Shaders / Materials
    const wireframeCyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x005577,
      emissiveIntensity: 0.4
    });

    const wireframePurpleMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: 0x3b156b,
      emissiveIntensity: 0.5
    });

    const glossyGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x091428,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 1.5,
      transparent: true,
      opacity: 0.75,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    // Object 1: Large Central Torus Knot (Glowinn / Algorithmic Ribbon)
    const torusKnotGeo = new THREE.TorusKnotGeometry(4.5, 1.1, this.isMobile ? 64 : 128, 16);
    const torusKnot = new THREE.Mesh(torusKnotGeo, glossyGlassMat);
    torusKnot.position.set(0, 0, -2);
    torusKnot.userData = { rotSpeedX: 0.003, rotSpeedY: 0.005, rotSpeedZ: 0.002, baseY: 0, floatSpeed: 0.8 };
    group.add(torusKnot);
    this.meshes.push(torusKnot);

    // Object 2: Wireframe Icosahedron (Top Right)
    const icoGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const ico = new THREE.Mesh(icoGeo, wireframeCyanMat);
    ico.position.set(16, 8, -6);
    ico.userData = { rotSpeedX: -0.004, rotSpeedY: 0.006, rotSpeedZ: 0.002, baseY: 8, floatSpeed: 1.1 };
    group.add(ico);
    this.meshes.push(ico);

    // Object 3: Wireframe Octahedron Crystal (Bottom Left)
    const octaGeo = new THREE.OctahedronGeometry(2.8, 0);
    const octa = new THREE.Mesh(octaGeo, wireframePurpleMat);
    octa.position.set(-16, -7, -4);
    octa.userData = { rotSpeedX: 0.005, rotSpeedY: -0.004, rotSpeedZ: 0.003, baseY: -7, floatSpeed: 0.9 };
    group.add(octa);
    this.meshes.push(octa);

    // Object 4: Floating Dodecahedron Core (Top Left)
    const dodecaGeo = new THREE.DodecahedronGeometry(2.2, 0);
    const dodeca = new THREE.Mesh(dodecaGeo, glossyGlassMat);
    dodeca.position.set(-14, 11, -8);
    dodeca.userData = { rotSpeedX: 0.003, rotSpeedY: 0.004, rotSpeedZ: -0.002, baseY: 11, floatSpeed: 1.3 };
    group.add(dodeca);
    this.meshes.push(dodeca);

    // Object 5: Wireframe Sphere (Bottom Right)
    const sphereGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const sphere = new THREE.Mesh(sphereGeo, wireframeCyanMat);
    sphere.position.set(14, -12, -7);
    sphere.userData = { rotSpeedX: -0.002, rotSpeedY: -0.005, rotSpeedZ: 0.001, baseY: -12, floatSpeed: 0.7 };
    group.add(sphere);
    this.meshes.push(sphere);

    this.scene.add(group);
    this.geometryGroup = group;
  }

  createParticleField() {
    const count = this.isMobile ? 800 : 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const cyan = new THREE.Color(0x00f0ff);
    const purple = new THREE.Color(0x8b5cf6);
    const pink = new THREE.Color(0xec4899);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread across 3D space
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      // Color variation
      const r = Math.random();
      const chosenColor = r < 0.5 ? cyan : (r < 0.8 ? purple : pink);
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      sizes[i] = Math.random() * 2.5 + 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    this.isMobile = window.innerWidth < 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
  }

  animate() {
    requestAnimationFrame(this.animate);

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Lerp for Mouse and Scroll Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

    if (!this.isReducedMotion) {
      // 1. Camera Parallax
      this.camera.position.x = this.mouseX * 3;
      this.camera.position.y = -this.mouseY * 3 - (this.scrollY * 0.008);
      this.camera.lookAt(0, - (this.scrollY * 0.008), 0);

      // 2. Rotate and Float 3D Meshes
      this.meshes.forEach((mesh) => {
        const u = mesh.userData;
        mesh.rotation.x += u.rotSpeedX;
        mesh.rotation.y += u.rotSpeedY;
        mesh.rotation.z += u.rotSpeedZ;
        mesh.position.y = u.baseY + Math.sin(elapsedTime * u.floatSpeed) * 0.8;
      });

      // 3. Dynamic Orbit for Point Lights
      if (this.pointLight1) {
        this.pointLight1.position.x = Math.sin(elapsedTime * 0.7) * 20 + this.mouseX * 4;
        this.pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 15;
      }
      if (this.pointLight2) {
        this.pointLight2.position.x = Math.cos(elapsedTime * 0.6) * -20;
        this.pointLight2.position.y = Math.sin(elapsedTime * 0.8) * -14;
      }

      // 4. Slowly Rotate Particle Galaxy
      if (this.particleSystem) {
        this.particleSystem.rotation.y = elapsedTime * 0.03;
        this.particleSystem.rotation.x = this.mouseY * 0.15;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.nexorithmScene = new NexorithmScene();
});
