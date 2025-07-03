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
    }else if(newIndex < 0){
        goToSection(numSections-1);
    }else if(newIndex >= numSections){
        goToSection(0);
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

        const camera = new THREE.PerspectiveCamera(20, container.clientWidth / container.clientHeight, 0.1, 1000);
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

                    model.scale.set(2, 2, 2);
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

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("goback").addEventListener("click", function(){
        goToSection(0)
    }, false);

    sendWebhook()
    requestPrices()
    setInterval(requestPrices, 60 * 1000);
})

function sendWebhook(){
    const webhookURL = 'https://discord.com/api/webhooks/1390330828537593946/nTYokRumn-SPtR_3kj94WmzqkNPY0BP7cLtdGOcv_k4iT6RgeHwQEmaDZLWrLKRqzyoy'
    const date = new Date();

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: '{"content": null,"embeds": [{"title": "Catalogue","description": "Une personne à ouvert le catalogue.","color": null,"footer": {"text": "' + date.toUTCString() + '"}}],"attachments": []}',
    })
}

function requestPrices(){
    const sheetId = '1mz7-tXjp1VeeVq_q7p3EDfAHnzD2FqN8vxxVteh97-0';
    const sheetKey = 'AIzaSyAwp1jNz5ErHdJ3bkju8xh_CQe2tjz7q6Q';
    const range = "A1:M22"

    const mappings = [
        { id: "price-pistol", col: 2, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-heavypistol", col: 3, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-db", col: 4, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-fap", col: 5, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-uzi", col: 6, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-skp", col: 7, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-ak", col: 8, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-guz", col: 9, rowFalse: 7, rowTrue: 8, fullPage: true, onlyText: false },
        { id: "price-gpb", col: 10, rowFalse: 7, rowTrue: 8, fullPage: false, onlyText: false },
        { id: "price-zip", col: 11, rowFalse: 7, rowTrue: 8, fullPage: false, onlyText: false },
        { id: "price-radio", col: 2, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-hazmat", col: 3, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-machette", col: 4, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-battleaxe", col: 5, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-cran", col: 6, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-9mm12", col: 7, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-9mm16", col: 8, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-cal12", col: 9, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-762", col: 10, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price-45acp", col: 11, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: false },
        { id: "price2-9mm12", col: 7, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price3-9mm12", col: 7, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price2-9mm16", col: 8, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price3-9mm16", col: 8, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price2-cal12", col: 9, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price3-cal12", col: 9, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price2-762", col: 10, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
        { id: "price2-45acp", col: 11, rowFalse: 12, rowTrue: 13, fullPage: false, onlyText: true },
    ];

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${sheetKey}`)
    .then(res => res.json())
    .then(data => {
        
        mappings.forEach(({ id, col, rowFalse, rowTrue, fullPage, onlyText }) => {
            const element = document.getElementById(id);
            if (!element) return;
            let useTrueRow = false;
            if (data.values[rowTrue+1][col] == "TRUE"){ 
                useTrueRow = true;
                if(fullPage == true){
                    element.classList.add("promo-text"); 
                    element.parentElement.parentElement.parentElement.querySelector("#promo").style.display = "block";
                }else{
                    if(onlyText == true){
                        element.classList.add("promo-text"); 
                    }else{
                        element.classList.add("promo-text"); 
                        element.parentElement.classList.add("promo");
                    }
                }
            }else{
                useTrueRow = false;
                if(fullPage == true){
                    element.classList.remove("promo-text"); 
                    element.parentElement.parentElement.parentElement.querySelector("#promo").style.display = "none";
                }else{
                    if(onlyText == true){
                        element.classList.remove("promo-text"); 
                    }else{
                        element.classList.remove("promo-text"); 
                        element.parentElement.classList.remove("promo");
                    }
                }
            }
            
            const row = useTrueRow ? rowTrue : rowFalse;
            const value = data.values?.[row]?.[col] ?? '—';

            if(value == "$0 " && useTrueRow == false){
                console.log("Test")
                element.innerText = "Pas disponible.";
            }else{
                element.innerText = value;
            }
            
        });

        if(data.values[2][1] == "TRUE"){
            document.getElementById("lock").style.display = "flex";
        }else{
            document.getElementById("lock").style.display = "none";
        }

        console.log(data.values);
    });
}

// 121212
// 1f1f1f
// 282828