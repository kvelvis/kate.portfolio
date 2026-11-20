/**
 * Sculptor's chips — ~150 small marble shards (one InstancedMesh).
 *
 * Each shard is born on a cube corner or edge, exactly where the morph is
 * removing material. Between progress 0.15 and 0.6 it fades in as it breaks
 * free, drifts outward on an ease-out curve with a lazy spin, then fades away.
 *
 * Everything is a pure function of progress, so scrolling back reverses it
 * perfectly (no simulation state).
 */
import * as THREE from 'three';

const COUNT = 150;

// Deterministic PRNG so the composition is identical on every load
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Irregular flake: a jittered, flattened octahedron with faceted normals. */
function chipGeometry(rand) {
  const g = new THREE.OctahedronGeometry(1, 0); // non-indexed: each face owns its verts
  const pos = g.attributes.position;
  const jitter = new Map(); // same corner → same jitter, so faces stay closed
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!jitter.has(key)) jitter.set(key, [0.65 + rand() * 0.6, rand() * 0.3 - 0.15]);
    const [s, o] = jitter.get(key);
    pos.setXYZ(i, pos.getX(i) * s + o, pos.getY(i) * s * 0.42, pos.getZ(i) * s * 0.75 - o);
  }
  g.computeVertexNormals();
  return g;
}

export function createFragments({ theme }) {
  const rand = mulberry32(20261114);
  const geometry = chipGeometry(rand);

  // Per-instance opacity (InstancedMesh has no built-in per-instance alpha)
  const alpha = new Float32Array(COUNT);
  geometry.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(alpha, 1));

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#F2F3F1'),        // white marble, neutral
    roughness: 0.38,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
    // Chips are tiny and often back-lit; a faint self-light keeps them
    // reading as white marble instead of dark specks of dirt.
    emissive: new THREE.Color(theme.marble.chips),
    emissiveIntensity: 0.35,
    transparent: true,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aAlpha;\nvarying float vAlpha;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAlpha = aAlpha;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vAlpha;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= vAlpha;');
  };

  const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false; // instances move far from the base geometry's bounds

  // ── Spawn data ──────────────────────────────────────────────────────────
  // 8 corners + 12 edges of the unit cube (half-size 0.5).
  const corners = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push(new THREE.Vector3(x, y, z));
  const edges = [];
  for (let axis = 0; axis < 3; axis++) {
    for (const a of [-1, 1]) for (const b of [-1, 1]) {
      // the edge runs along `axis`; the other two coordinates are fixed at ±1
      const fixed = [0, 1, 2].filter((k) => k !== axis);
      edges.push({ axis, fixed, signs: [a, b] });
    }
  }

  const shards = [];
  for (let i = 0; i < COUNT; i++) {
    const origin = new THREE.Vector3();
    const outward = new THREE.Vector3();
    let start;

    if (i < 40) {
      // Corners go first — the sculptor knocks off the sharpest points early
      const c = corners[i % 8];
      origin.copy(c).multiplyScalar(0.47).addScaledVector(randomUnit(rand), 0.03);
      outward.copy(c).normalize();
      start = 0.15 + rand() * 0.13;
    } else {
      const e = edges[Math.floor(rand() * edges.length)];
      const t = (rand() * 2 - 1) * 0.42;
      const v = [0, 0, 0];
      v[e.axis] = t;
      v[e.fixed[0]] = e.signs[0] * 0.47; // slightly inset: inside the region being rounded away
      v[e.fixed[1]] = e.signs[1] * 0.47;
      origin.fromArray(v);
      outward.set(0, 0, 0);
      outward.setComponent(e.fixed[0], e.signs[0]);
      outward.setComponent(e.fixed[1], e.signs[1]);
      outward.normalize();
      start = 0.2 + rand() * 0.24;
    }

    // Drift direction: mostly away from the surface, a little random, a little upward
    const dir = outward.clone()
      .addScaledVector(randomUnit(rand), 0.4)
      .add(new THREE.Vector3(0, 0.18, 0))
      .normalize();

    const s = 0.016 + Math.pow(rand(), 1.8) * 0.04; // many tiny, few larger
    shards.push({
      origin,
      dir,
      start,
      dur: 0.12 + rand() * 0.06,                     // ends ≤ 0.62
      dist: 0.35 + rand() * 0.6,
      scale: new THREE.Vector3(s, s * (0.6 + rand() * 0.5), s * (0.7 + rand() * 0.5)),
      q0: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6.28, rand() * 6.28, rand() * 6.28)),
      axis: randomUnit(rand),
      spin: (0.6 + rand() * 1.4) * (rand() < 0.5 ? -1 : 1),
    });
  }

  // Scratch objects (no allocations per frame)
  const m = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const qs = new THREE.Quaternion();
  const sc = new THREE.Vector3();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(progress, time) {
    for (let i = 0; i < COUNT; i++) {
      const s = shards[i];
      const lt = (progress - s.start) / s.dur; // local 0..1 life

      if (lt <= 0 || lt >= 1) {
        alpha[i] = 0;
        m.makeScale(0, 0, 0);
        mesh.setMatrixAt(i, m);
        continue;
      }

      const e = easeOut(lt);
      p.copy(s.origin)
        .addScaledVector(s.dir, s.dist * e)
        .add(sc.set(0, Math.sin(time * 0.6 + i) * 0.01 * lt, 0)); // faint float once free

      qs.setFromAxisAngle(s.axis, s.spin * e + time * 0.05 * s.spin);
      q.copy(s.q0).premultiply(qs);

      sc.copy(s.scale).multiplyScalar(1 - 0.35 * lt); // erode slightly as it goes
      m.compose(p, q, sc);
      mesh.setMatrixAt(i, m);

      // quick appear, long gentle fade
      alpha[i] = smooth(0, 0.12, lt) * (1 - smooth(0.45, 1, lt));
    }
    mesh.instanceMatrix.needsUpdate = true;
    geometry.attributes.aAlpha.needsUpdate = true;
  }

  return {
    mesh,
    update,
    dispose() { geometry.dispose(); material.dispose(); },
  };
}

function smooth(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function randomUnit(rand) {
  const u = rand() * 2 - 1;
  const th = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return new THREE.Vector3(r * Math.cos(th), u, r * Math.sin(th));
}
