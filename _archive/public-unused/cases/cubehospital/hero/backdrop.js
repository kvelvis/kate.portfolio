/**
 * Backdrop pieces that make the object feel "placed" without a visible floor:
 *   • background  — full-screen radial gradient (dithered to kill banding)
 *   • shadow      — soft contact-shadow blob under the object
 *   • halo        — faint glow behind-right, echoing the rim light
 *
 * All three are ShaderMaterials that write raw values (no colorspace chunk),
 * so their colours are exact display sRGB and match the CSS page background.
 * Colours come from theme.js.
 */
import * as THREE from 'three';

// THREE.Color('#…') converts hex to linear (color management is on). These
// shaders write raw display values, so read the hex back as plain sRGB numbers.
const srgb = (h) => new THREE.Color(h).convertLinearToSRGB();

export function createBackground(theme) {
  const material = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uAspect: { value: 1 },
      uCenter: { value: srgb(theme.bg.center) },
      uMid:    { value: srgb(theme.bg.mid) },    // == CSS --bg
      uEdge:   { value: srgb(theme.bg.edge) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uAspect;
      uniform vec3 uCenter, uMid, uEdge;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec2 p = vUv - vec2(0.5, 0.56);
        p.x *= uAspect;
        float r = length(p);
        vec3 col = mix(uCenter, uMid, smoothstep(0.0, 0.45, r));
        col = mix(col, uEdge, smoothstep(0.45, 1.1, r));
        col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;   // dither
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return { mesh, uniforms: material.uniforms };
}

export function createShadow(theme) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uOpacity: { value: theme.shadow.opacity },
      uColor: { value: srgb(theme.shadow.color) },   // tinted, never flat black
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        float r = length(vUv - 0.5) * 2.0;
        // tight contact core + wide penumbra
        float a = pow(1.0 - smoothstep(0.0, 1.0, r), 2.2) * 0.75
                + pow(1.0 - smoothstep(0.0, 0.45, r), 2.0) * 0.25;
        gl_FragColor = vec4(uColor, a * uOpacity);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = -5;
  return { mesh, uniforms: material.uniforms };
}

export function createHalo(theme) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    // premultiplied "glow-over": brightens without washing out (see dust.js)
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: {
      uStrength: { value: 0.0 },
      uColor: { value: srgb(theme.halo.color) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uStrength; uniform vec3 uColor; varying vec2 vUv;
      void main(){
        float r = length(vUv - 0.5) * 2.0;
        float g = pow(1.0 - smoothstep(0.0, 1.0, r), 2.6) * uStrength;
        gl_FragColor = vec4(uColor * g * 0.55, g * 0.35);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.renderOrder = -4;
  return { mesh, uniforms: material.uniforms };
}
