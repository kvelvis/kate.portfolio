/**
 * The marble sculpture: a dense box whose vertices are pushed, in the vertex
 * shader, from "perfect cube" → "rounded cube" → "water-shaped pebble".
 *
 * ── How the morph works ───────────────────────────────────────────────────
 * Every vertex of the box is re-expressed as   position = dir * R(dir)
 * where dir = normalize(restPosition) and R is a radial function:
 *
 *   • Superellipsoid radius  R = 0.5 / ‖dir‖ₙ   (‖·‖ₙ = Lⁿ-norm)
 *       n → ∞   : exactly the cube (the L∞ norm)
 *       n ≈ 5   : rounded cube
 *       n = 2   : sphere
 *   • The pebble adds low-frequency simplex noise to R, a gentle anisotropic
 *     squash and a soft twist, all gated by an "organic" curve.
 *
 * Because R depends only on the direction, the mapping is smooth everywhere,
 * so normals can be recomputed with finite differences: we step a tiny
 * distance along two tangents of the ORIGINAL cube face, push both through
 * the same function and cross the resulting edges.
 *
 * ── Why veins stay attached ──────────────────────────────────────────────
 * The fragment shader samples the marble pattern with the REST (cube-space)
 * position, not the morphed one. A given surface point therefore keeps its
 * vein pattern for the whole transformation instead of "swimming".
 */
import * as THREE from 'three';
import { NOISE_GLSL } from './glsl/noise.js';

// ─── Shape curves (shared JS ⇄ GLSL so CPU-side effects stay in sync) ─────
export const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
/** 0 for cube/rounded cube, → 1 for the finished pebble. */
export const organicAmount = (p) => smoothstep(0.42, 1.0, p);

const SHAPE_GLSL = /* glsl */ `
uniform float uProgress;
varying vec3 vRest;

// Superellipsoid exponent along the story.
//   0.00 → 300  (indistinguishable from a sharp cube)
//   0.50 → ~5   (rounded cube, edges clearly softened)
//   1.00 → 2.25 (almost spherical base for the pebble)
float shapeExponent(float p){
  float soften = smoothstep(0.02, 0.55, p);
  float n = exp(mix(log(300.0), log(5.0), soften));   // log-space = even-feeling change
  return mix(n, 2.25, smoothstep(0.45, 1.0, p));
}

vec3 sculpt(vec3 rest){
  float p   = uProgress;
  float org = smoothstep(0.42, 1.0, p);               // organic amount (see organicAmount())
  vec3  d   = normalize(rest);

  // Superellipsoid radius, computed in a numerically stable way:
  // divide by the max component first so pow() never sees tiny numbers.
  vec3  a = abs(d);
  float m = max(a.x, max(a.y, a.z));
  vec3  r = max(a / m, vec3(1e-5));
  float n = shapeExponent(p);
  float R = (0.5 / m) * pow(pow(r.x, n) + pow(r.y, n) + pow(r.z, n), -1.0 / n);

  // Grow slightly while rounding so the pebble keeps a similar visual mass
  // (an inscribed sphere would read as "shrinking").
  R *= mix(1.0, 1.22, smoothstep(0.1, 1.0, p));

  vec3 pos = d * R;

  if (org > 0.0){
    // Low-frequency noise on the sphere of directions → asymmetric, balanced bulges
    const vec3 SEED = vec3(3.1, 7.7, 1.3);
    // Kept VERY low-frequency: anything above ~1.2 reads as lumpy, not water-worn.
    float bulge = snoise(d * 0.62 + SEED) * 0.16
                + snoise(d * 1.15 + SEED * 1.7) * 0.035;
    pos *= 1.0 + bulge * org;

    // River-stone proportions: a little wider, a little flatter
    pos *= mix(vec3(1.0), vec3(1.14, 0.84, 0.98), org);

    // A soft twist around Y gives the flowing, hand-shaped curve
    float ang = pos.y * 0.55 * org;
    float c = cos(ang), s = sin(ang);
    pos.xz = mat2(c, -s, s, c) * pos.xz;
  }
  return pos;
}

// Finite-difference normal. faceN is the original (axis-aligned) box normal.
vec3 sculptNormal(vec3 rest, vec3 faceN, vec3 P){
  vec3 helper = abs(faceN.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(faceN, helper));
  vec3 t2 = cross(faceN, t1);                         // t1 × t2 = faceN (right-handed)
  const float e = 0.0025;
  vec3 A = sculpt(rest + t1 * e) - P;
  vec3 B = sculpt(rest + t2 * e) - P;
  vec3 N = normalize(cross(A, B));
  return dot(N, P) < 0.0 ? -N : N;                    // star-shaped → must face outward
}
`;

const MARBLE_GLSL = /* glsl */ `
varying vec3 vRest;
uniform vec3  uRimColor;
uniform vec3  uRimDir;       // view-space direction the gold rim comes from
uniform float uRimStrength;
uniform vec3  uSubsurface;   // tint of the light "bleeding" through the calcite
float marbleVein;           // shared between color and roughness chunks

// Polished Carrara: warm white body, faint clouding, thin soft grey veins.
// Returns sRGB-ish albedo; converted to linear by the caller.
vec3 carrara(vec3 p){
  vec3 q = p * 1.15;

  // Gently domain-warped field: veins meander like silt in water,
  // without turning into crackle (keep warp low-frequency).
  float w = fbm(q * 0.7 + fbm(q * 0.5 + 1.7) * 0.6);

  // Main vein family: ridges of |sin| sharpened with pow → soft line + wide haze
  float t     = dot(q, normalize(vec3(0.82, 0.38, -0.42))) * 1.1 + w * 1.5;
  float ridge = 1.0 - abs(sin(t * 3.14159));
  float core  = pow(ridge, 14.0) * 0.85;
  float halo  = pow(ridge, 3.0) * 0.22;
  float presence = smoothstep(-0.3, 0.3, fbm(q * 0.45 + 12.0)); // veins fade along their length

  // A few fine secondary veins crossing at another angle
  float t2   = dot(q, normalize(vec3(-0.35, 0.88, 0.3))) * 1.7 + fbm(q * 0.9 + 3.1) * 1.1;
  float hair = pow(1.0 - abs(sin(t2 * 3.14159)), 40.0) * 0.3 * smoothstep(0.0, 0.45, w);

  marbleVein = clamp((core + halo) * presence + hair, 0.0, 1.0);

  float cloud = fbm(q * 0.6 + 20.0) * 0.5 + 0.5;
  vec3 base   = mix(vec3(0.950, 0.938, 0.920), vec3(0.990, 0.983, 0.970), cloud);
  vec3 veinC  = vec3(0.60, 0.598, 0.606);             // soft cool grey
  return mix(base, veinC, marbleVein * 0.62);
}
`;

/**
 * @param {object} opts
 * @param {number} opts.segments  box subdivisions per side (128 desktop)
 * @param {object} opts.theme     THEMES[…] from theme.js
 */
export function createSculpture({ segments = 128, theme }) {
  // Unit box: half-extent 0.5. 128 segs → ~100k vertices, trivial for the GPU.
  const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,          // albedo comes from the marble shader
    roughness: 0.25,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.16,
    sheen: 0.25,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(theme.marble.sheen),
    ior: 1.49,                // calcite-ish
    specularIntensity: 0.7,
  });

  const uniforms = {
    uProgress:    { value: 0 },
    uRimColor:    { value: new THREE.Color(theme.marble.rim) },
    uRimDir:      { value: new THREE.Vector3(0.88, 0.42, -0.2).normalize() },
    uRimStrength: { value: theme.marble.rimStrength },
    uSubsurface:  { value: new THREE.Color(theme.marble.subsurface) },
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    // ── vertex ──
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${NOISE_GLSL}\n${SHAPE_GLSL}`)
      // Compute the morphed position + its normal once, up front.
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        vRest = position;
        vec3 sculptPos = sculpt(position);
        vec3 objectNormal = sculptNormal(position, normal, sculptPos);
      `)
      .replace('#include <begin_vertex>', 'vec3 transformed = sculptPos;');

    // ── fragment ──
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${NOISE_GLSL}\n${MARBLE_GLSL}`)
      .replace('#include <color_fragment>', /* glsl */ `
        #include <color_fragment>
        diffuseColor.rgb *= pow(carrara(vRest), vec3(2.2));   // sRGB → linear
      `)
      // Veins are a touch less polished than the surrounding calcite
      .replace('#include <roughnessmap_fragment>', /* glsl */ `
        #include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + marbleVein * 0.12, 0.0, 1.0);
      `)
      .replace('#include <opaque_fragment>', /* glsl */ `
        {
          vec3  V    = normalize(vViewPosition);
          float NdV  = clamp(dot(normal, V), 0.0, 1.0);
          float fres = pow(1.0 - NdV, 3.0);

          // Glowing rim on the side facing the back-right light (theme colour)
          float side = smoothstep(-0.15, 0.85, dot(normal, uRimDir));
          outgoingLight += uRimColor * fres * side * uRimStrength;

          // Subsurface-like glow: light "bleeding" through thin calcite,
          // strongest at grazing angles and in the shadowed side.
          outgoingLight += uSubsurface * 0.035 * (1.0 - NdV * 0.6);
        }
        #include <opaque_fragment>
      `);
  };
  material.customProgramCacheKey = () => 'cube-marble-v2';

  const mesh = new THREE.Mesh(geometry, material);
  // Bounding volume never exceeds ~0.9 radius in any stage; a fixed sphere
  // avoids culling surprises since the GPU (not JS) moves the vertices.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.0);

  return {
    mesh,
    uniforms,
    setProgress(p) { uniforms.uProgress.value = p; },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
