import * as THREE from 'three';
import Model from '../model/reactive-sphere.js';
import * as dat from 'dat.gui';

let audio, audioData, audioContext, analyserNode, sourceNode;
let lastBeatTime = 0;
const beatThreshold = -60; // Ajusta este valor según la sensibilidad de detección de beats
const songs = {
    Energy: '../files/RTL.mp3',
    Chill: '../files/TAK.mp3',
    Soul: '../files/Soul.mp3' ,
    Funky: '../files/Funky.mp3'
};

/*------------------------------
GuI
------------------------------*/
const controls = {
    amplitude: 0.30,
    frequency: 10,
    freqStart: 2600, // Initial highMidStartFreq
    freqEnd: 5200,    // Initial highMidEndFreq
    color: '#4c777a',  // HEX color string
    speed: 20,
    displacementMode: 0,
    song: 'Soul',
    wireframe: true, // Nuevo control para wireframe
    background: 'Reactive'
};


// Create GUI Panel
const gui = new dat.GUI();
gui.width = 300;

gui.add(controls, 'amplitude', 0, 2).step(0.01).name('Amplitude');
gui.add(controls, 'frequency', 0, 250).step(1).name('Frequency');
gui.add(controls, 'freqStart', 20, 10000).step(10).name('Freq Start (Hz)');
gui.add(controls, 'freqEnd', 20, 10000).step(10).name('Freq End (Hz)');
gui.add(controls, 'speed', 0, 80).step(10).name('Speed');
gui.addColor(controls, 'color').name('Base Color').onChange(value => {
    model.material.uniforms.uColor.value.setStyle(value);
});
gui.add(controls, 'displacementMode', { Noise: 0, Sine: 1 }).name('Displacement');
gui.add(controls, 'song', Object.keys(songs)).name('Song').onChange(value => {
    changeSong(songs[value]);
});
gui.add(controls, 'wireframe').name('Wireframe').onChange(value => {
    model.material.wireframe = value;
});
gui.add(controls, 'background', ['Fixed', 'Reactive']).name('Background');


/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*------------------------------
Overlay
------------------------------*/
const overlay = document.createElement('div');
overlay.classList.add("overlay");

// Crear el texto
const text = document.createElement('p');
text.textContent = 'CLICK TO START';
text.style.color = '#fff';
text.style.fontSize = '4rem';
text.style.fontFamily = 'Arial, sans-serif';
text.style.margin = '0';

// Añadir el texto al overlay
overlay.appendChild(text);
document.body.appendChild(overlay);


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 14;

/*------------------------------
Model and Mesh
------------------------------*/
const model = new Model();
scene.add(model.mesh);

/*------------------------------
Audio Setup
------------------------------*/
function changeSong(src) {
    if (!audio) createAudio(); // Ensure audio is initialized

    audio.pause();
    audio.src = src;
    audio.load();
    audio.play();

    // Reset the audio context if needed
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function createAudio() {
    audio = document.createElement('audio');
    audio.src = songs[controls.song]; // Set based on current selection

    audioContext = new AudioContext();
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(audioContext.destination);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 512
    sourceNode.connect(analyserNode);

    audioData = new Float32Array(analyserNode.frequencyBinCount);
}

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock();

/*------------------------------
Background Color
------------------------------*/
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return new THREE.Color(`hsl(${hue}, 60%, 20%)`); // Ajusta el 20% para controlar el brillo
}

/*------------------------------
Animate
------------------------------*/
function animate() {
    requestAnimationFrame(animate);

    if (audioContext && !audio.paused) {
        analyserNode.getFloatFrequencyData(audioData);

        const timeDomainData = new Float32Array(analyserNode.fftSize);
        analyserNode.getFloatTimeDomainData(timeDomainData);

        const rms = Math.sqrt(timeDomainData.reduce((sum, v) => sum + v * v, 0) / timeDomainData.length);
        const mappedAmplitude = mapRange(rms, 0, 0.2, 0, 0.5, true);

        const nyquist = audioContext.sampleRate / 2;
        const bassStartFreq = 20;
        const bassEndFreq = 140;

        const bassStartIndex = Math.floor(bassStartFreq / nyquist * audioData.length);
        const bassEndIndex = Math.floor(bassEndFreq / nyquist * audioData.length);

        const bassEnergy = audioData.slice(bassStartIndex, bassEndIndex).reduce((sum, v) => sum + v, 0) / (bassEndIndex - bassStartIndex);

        // 🥁 Beat Detection
        if (controls.background === 'Reactive') {
            const now = performance.now();
            if (bassEnergy > beatThreshold && now - lastBeatTime > 300) {
                renderer.setClearColor(getRandomColor());
                lastBeatTime = now;
            }
        } else {
            // Modo fijo: Mantener el color definido en controls.color
            renderer.setClearColor(getOppositeColor(controls.color));
        }

        // Update model uniforms
        if (model.material && model.material.uniforms) {
            model.material.uniforms.uTime.value = clock.getElapsedTime() * controls.speed * 0.01;
            model.material.uniforms.uAmp.value = mappedAmplitude + controls.amplitude;
            model.material.uniforms.uFrequency.value = controls.frequency;
            model.material.uniforms.uDisplacement.value = controls.displacementMode;
        }
    }

    renderer.render(scene, camera);
}

animate();

/*------------------------------
User Interaction
------------------------------*/
window.addEventListener('click', (event) => {
    overlay.style.display = 'none';

    // Si el clic ocurrió dentro del panel de dat.GUI, no hagas nada
    if (event.target.closest('.dg')) return;

    // Resto de la lógica
    if (!audioContext) createAudio();

    if (audio.paused) {
        audio.play();
        audioContext.resume();
    } else {
        overlay.style.display = 'flex';
        text.textContent = 'CLICK TO RESUME';
        audio.pause();
        audioContext.suspend();
    }
});

/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

/*------------------------------
Helpers
------------------------------*/
function mapRange(value, inMin, inMax, outMin, outMax, clamp = false) {
    const percent = (value - inMin) / (inMax - inMin);
    let result = outMin + percent * (outMax - outMin);
    if (clamp) {
        result = Math.max(outMin, Math.min(outMax, result));
    }
    return result;
}

function getOppositeColor(hexColor) {
    const color = new THREE.Color(hexColor);
    const hsl = {};
    color.getHSL(hsl);

    // Invertir el hue (color opuesto)
    hsl.h = (hsl.h + 0.5) % 1;

    // Invertir la luminosidad solo si es muy cerca de 0 (negro) o 1 (blanco)
    if (hsl.l < 0.1) {
        hsl.l = 0.9; // Negro → Muy claro
    } else if (hsl.l > 0.9) {
        hsl.l = 0.1; // Blanco → Muy oscuro
    }

    const opposite = new THREE.Color();
    opposite.setHSL(hsl.h, hsl.s, hsl.l);
    return opposite;
}

