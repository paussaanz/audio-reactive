import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

export default class ReactiveSphere {
    constructor() {
        const geometry = new THREE.SphereGeometry(2, 200, 200);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            wireframe: true,
            uniforms: {
                uTime: { value: 0 },
                uAmp: { value: 0 },
                uFrequency: { value: 0 },
                uColor: { value: new THREE.Color('#4c777a') },
                uDisplacement : {value: 0}
            }
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
    }

    update(time, audioStrength) {
        this.material.uniforms.uTime.value = time;
        this.material.uniforms.uAmp.value = audioStrength;
    }
}
