/**
 * Dust — ~400 soft silver-jade sprites drifting calmly around the final form
 * (colour from theme.js).
 *
 * All motion happens in the vertex shader (one draw call, zero CPU per frame
 * apart from two uniforms). Each mote has its own reveal threshold between
 * progress 0.35 and 0.65, so they "condense" mid-transition rather than pop.
 *
 * Blending note: pure additive blending is almost invisible on a pale
 * background (everything clips to white). We use premultiplied "glow-over"
 * blending instead — ONE / ONE_MINUS_SRC_ALPHA with colour stronger than
 * alpha. It's additive in feel (luminous, never muddy) on light AND dark
 * themes.
 */
import * as THREE from 'three';

export function createDust({ count = 400, color = '#D2E3DA' } = {}) {
  const c = new THREE.Color(color).convertLinearToSRGB(); // raw display values
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4); // phase, speed, size, reveal threshold

  for (let i = 0; i < count; i++) {
    // Shell around the object, slightly flattened, denser near the form
    const r = 0.75 + Math.pow(Math.random(), 1.6) * 1.25;
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    positions.set([r * s * Math.cos(th), r * u * 0.72, r * s * Math.sin(th)], i * 3);

    const big = Math.random() < 0.06; // a few out-of-focus "bokeh" motes
    seeds.set([
      Math.random(),
      0.25 + Math.random() * 0.6,
      big ? 2.2 + Math.random() * 1.6 : 0.5 + Math.random() * 0.9,
      0.35 + Math.random() * 0.3,
    ], i * 4);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 3);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 64 },   // px at 1 world unit; camera sits ~8 units away
      // Output is written raw (no colorspace chunk) → values are display sRGB.
      uColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
    },
    vertexShader: /* glsl */ `
      attribute vec4 aSeed;
      uniform float uTime, uProgress, uPixelRatio, uSize;
      varying float vAlpha;

      void main(){
        float phase = aSeed.x * 6.2831;
        float speed = aSeed.y;
        vec3 p = position;

        // slow Lissajous drift
        float t = uTime * speed * 0.35;
        p += vec3(sin(t + phase), sin(t * 0.7 + phase * 2.0) * 1.4, cos(t * 0.8 + phase * 1.5)) * 0.07;

        // very slow orbit around the form
        float ang = uTime * 0.025 * (0.6 + speed);
        float c = cos(ang), s = sin(ang);
        p.xz = mat2(c, -s, s, c) * p.xz;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * aSeed.z * uPixelRatio / -mv.z;

        float reveal  = smoothstep(aSeed.w, aSeed.w + 0.12, uProgress);
        float twinkle = 0.65 + 0.35 * sin(uTime * (0.8 + speed) + phase * 3.0);
        float bokeh   = aSeed.z > 2.0 ? 0.35 : 1.0;   // large ones stay faint
        vAlpha = reveal * twinkle * bokeh;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float glow = pow(smoothstep(0.5, 0.0, d), 2.0);   // soft round sprite
        if (glow * vAlpha < 0.003) discard;
        // premultiplied: colour > alpha → luminous "glow-over"
        gl_FragColor = vec4(uColor * glow * vAlpha * 0.7, glow * vAlpha * 0.5);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  points.renderOrder = 2;

  return {
    points,
    uniforms: material.uniforms,
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
