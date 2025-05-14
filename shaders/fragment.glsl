precision mediump float;
uniform float uTime;
uniform float uAmp;
uniform float uFrequency;
uniform vec3 uColor;

varying vec3 vNormal;
varying float vNoise;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec3 color1 = vec3(vNoise * 0.01);

    vec3 color2 = palette(
        vNormal.z,
        vec3(uColor.r,uColor.r,vNoise*uColor.g*0.1),
        vec3(vNoise,uColor.r,uColor.g),
        vec3(uColor.b*0.4,uColor.b,vNoise),
        vec3(uColor.r * 5.,vNoise,uColor.r)
    );

    vec3 finalColor = mix(color1, color2, uAmp * 5.);
    gl_FragColor = vec4(finalColor + uColor + uFrequency  * 0.001,1.);
}

// precision mediump float;

// uniform float uTime;
// uniform float uAmp;

// varying vec2 vUv;
// varying float vDistort;

// // Paleta de colores psicodélica
// vec3 palette(float t) {
//     return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
// }

// void main() {
//     // Creamos un patrón circular
//     vec2 uv = vUv * 2.0 - 1.0;
//     float r = length(uv);
//     float angle = atan(uv.y, uv.x);

//     // Modulamos con el tiempo y el beat
//     float t = uTime * 0.5 + uAmp * 10.0;

//     // Crea anillos pulsantes con colores locos
//     float rings = sin(10.0 * r - t) + cos(5.0 * angle + t * 2.0);

//     // Normalizamos y aplicamos la paleta de color
//     float intensity = smoothstep(0.2, 0.0, abs(rings));
//     vec3 color = palette(angle / 6.28318 + t * 0.2) * intensity;

//     // Acentuamos la locura con el beat
//     color *= 1.0 + uAmp * 2.0;

//     gl_FragColor = vec4(color, 1.0);
// }
