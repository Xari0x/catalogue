const mainContainer = document.getElementById('main-container');
const navDotsContainer = document.getElementById('nav-dots-container');
const sections = document.querySelectorAll('.weapon-section');
const numSections = sections.length;
let currentIndex = 0;
let isScrolling = false;

function goToSection(index) {
    if (index < 0 || index >= numSections) return;
    currentIndex = index;
    mainContainer.style.transform = `translateX(-${currentIndex * 100}vw)`;
    updateNavDots();
}

function updateNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function createNavDots() {
    for (let i = 0; i < numSections; i++) {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        dot.addEventListener('click', () => goToSection(i));
        navDotsContainer.appendChild(dot);
    }
}

function handleWheel(event) {
    if (isScrolling) return;
    isScrolling = true;
    const direction = event.deltaY > 0 ? 1 : -1;
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < numSections) {
        goToSection(newIndex);
    }
    setTimeout(() => { isScrolling = false; }, 100);
}

const scenes = [];
const gltfLoader = new THREE.GLTFLoader();

function initThree() {
    const canvases = document.querySelectorAll('.weapon-canvas');
    canvases.forEach(canvas => {
        const scene = new THREE.Scene();
        const container = canvas.parentElement;

        const camera = new THREE.PerspectiveCamera(10, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
                
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;

        const sceneData = { scene, camera, renderer, controls, container, mesh: null };
        scenes.push(sceneData);

        const modelSrc = canvas.dataset.src;
        if (modelSrc && modelSrc.includes('.glb')) {
            gltfLoader.load(
                modelSrc,
                (gltf) => {
                    const model = gltf.scene;

                    model.scale.set(5, 5, 5);
                    scene.add(model);
                    sceneData.mesh = model;
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the model:', error);
                    const geometry = new THREE.BoxGeometry(3, 0.4, 0.7);
                    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                    const errorMesh = new THREE.Mesh(geometry, material);
                    scene.add(errorMesh);
                    sceneData.mesh = errorMesh;
                }
            );
        }
    });
}
        
function animate() {
    requestAnimationFrame(animate);
    scenes.forEach(s => {
        if (s.mesh) {
            s.mesh.rotation.y += 0.005;
        }
        s.controls.update();
        s.renderer.render(s.scene, s.camera);
    });
}
        
function onWindowResize() {
    scenes.forEach(s => {
        s.camera.aspect = s.container.clientWidth / s.container.clientHeight;
        s.camera.updateProjectionMatrix();
        s.renderer.setSize(s.container.clientWidth, s.container.clientHeight);
    });
}

window.onload = function() {
    mainContainer.style.width = `${numSections * 100}vw`;
    createNavDots();
    updateNavDots();
    
    initThree();
    animate();

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('resize', onWindowResize);
};