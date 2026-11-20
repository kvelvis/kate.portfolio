/**
 * Three.js scene: renderer, camera framing, lighting and the object hierarchy.
 *
 * Hierarchy
 *   scene
 *   ├─ background (full-screen quad)
 *   ├─ halo       (gold glow behind the form)
 *   ├─ shadow     (contact blob on an invisible "floor")
 *   ├─ float      ← idle up/down + pointer parallax
 *   │   ├─ spin   ← very slow Y rotation + scroll-driven turn
 *   │   │   └─ tilt  ← cube rests on an angle, the pebble settles level
 *   │   │       ├─ sculpture mesh
 *   │   │       └─ shards (InstancedMesh, same object space as the cube)
 *   │   └─ dust   (doesn't inherit the spin; orbits on its own)
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSculpture, organicAmount, smoothstep } from './sculpture.js';
import { createFragments } from './fragments.js';
import { createDust } from './dust.js';
import { createBackground, createShadow, createHalo } from './backdrop.js';
import { getTheme } from './theme.js';

const FOV = 28;
const OBJECT_SIZE = 1.45;       // on-screen extent of the tilted cube, world units
const HEIGHT_SHARE = 0.35;      // object ≈ 35% of viewport height
const WIDTH_SHARE = 0.62;       // …but never wider than this share on portrait phones

export function createScene(canvas, { reducedMotion = false, theme = getTheme() } = {}) {
  const isSmall = Math.min(window.innerWidth, window.innerHeight) < 700;

  // ── Renderer ──────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral tone mapping keeps whites white and hues true — ideal for a
  // "product shot" look (ACES would grey/yellow the marble).
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = theme.exposure.from;

  const scene = new THREE.Scene();

  // Soft studio reflections for the clearcoat
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = theme.envIntensity;
  pmrem.dispose();

  // ── Camera ────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
  const lookAt = new THREE.Vector3(0, -0.04, 0);

  // ── Lights ────────────────────────────────────────────────────────────
  // Key: soft daylight from upper-left-front
  const key = new THREE.DirectionalLight(theme.key.color, theme.key.intensity);
  key.position.set(-3.5, 4.2, 3.2);
  // Rim: from behind-right — paints the glowing edge (pale jade / pearl)
  const rim = new THREE.DirectionalLight(theme.rim.color, theme.rim.intensity);
  rim.position.set(3.4, 1.6, -4.2);
  // Low fill so the shadow side never goes dead grey
  const fill = new THREE.HemisphereLight(theme.fill.sky, theme.fill.ground, theme.fill.intensity);
  scene.add(key, rim, fill);

  // ── Backdrop ──────────────────────────────────────────────────────────
  const bg = createBackground(theme);
  const halo = createHalo(theme);
  halo.mesh.position.set(0.32, 0.18, -1.4);
  halo.mesh.scale.setScalar(3.6);
  const shadow = createShadow(theme);
  shadow.mesh.position.y = -0.98;
  scene.add(bg.mesh, halo.mesh, shadow.mesh);

  // ── Object hierarchy ──────────────────────────────────────────────────
  const floatG = new THREE.Group();
  const spinG = new THREE.Group();
  const tiltG = new THREE.Group();
  floatG.add(spinG);
  spinG.add(tiltG);
  scene.add(floatG);

  const sculpture = createSculpture({ segments: isSmall ? 96 : 128, theme });
  const fragments = createFragments({ theme });
  const dust = createDust({ count: isSmall ? 260 : 400, color: theme.dust });
  tiltG.add(sculpture.mesh, fragments.mesh);
  floatG.add(dust.points);
  dust.uniforms.uPixelRatio.value = renderer.getPixelRatio();

  // The cube rests on an elegant diagonal; the pebble settles almost level.
  const TILT_CUBE = new THREE.Euler(0.42, 0.0, 0.2);
  const TILT_PEBBLE = new THREE.Euler(0.1, 0.0, 0.06);

  // ── Pointer parallax (very subtle) ────────────────────────────────────
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reducedMotion && matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  // ── Resize / framing ──────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;

    // Distance so the object covers HEIGHT_SHARE of the height, clamped by width
    const k = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dH = OBJECT_SIZE / (HEIGHT_SHARE * k);
    const dW = OBJECT_SIZE / (WIDTH_SHARE * k * aspect);
    const dist = Math.max(dH, dW);
    camera.position.set(0, dist * 0.11, dist); // slightly above → shadow reads as an ellipse
    camera.lookAt(lookAt);

    // On narrow layouts the copy sits at the bottom; lift the object into the
    // upper part of the frame with a view offset (no perspective change).
    const lift = w <= 1024 ? 0.12 : 0.0;
    camera.setViewOffset(w, h, 0, h * lift, w, h);
    camera.updateProjectionMatrix();

    bg.uniforms.uAspect.value = aspect;
  }
  resize();

  // ── Per-frame update ──────────────────────────────────────────────────
  const tmpQ1 = new THREE.Quaternion();
  const tmpQ2 = new THREE.Quaternion();
  const qCube = new THREE.Quaternion().setFromEuler(TILT_CUBE);
  const qPebble = new THREE.Quaternion().setFromEuler(TILT_PEBBLE);

  /**
   * @param {number} progress 0..1 — morph progress from the scroll timeline
   * @param {number} time     seconds
   * @param {number} dt       seconds since last frame
   */
  function update(progress, time, dt) {
    const org = organicAmount(progress);

    sculpture.setProgress(progress);
    fragments.update(progress, time);
    dust.uniforms.uTime.value = time;
    dust.uniforms.uProgress.value = progress;

    // Idle float: slow breath up/down + a lazy turn. Calm, never bouncy.
    const motion = reducedMotion ? 0 : 1;
    const bob = Math.sin(time * 0.55) * 0.045 * motion;
    floatG.position.y = bob;
    spinG.rotation.y = time * 0.045 * motion + progress * Math.PI * 0.55;

    // Tilt eases from the cube's diagonal pose to the pebble's level rest
    tiltG.quaternion.copy(tmpQ1.copy(qCube).slerp(qPebble, org));

    // Pointer parallax with critically-damped smoothing
    const a = 1 - Math.exp(-dt * 2.2);
    pointer.sx += (pointer.x - pointer.sx) * a;
    pointer.sy += (pointer.y - pointer.sy) * a;
    floatG.rotation.set(pointer.sy * 0.06, pointer.sx * 0.09, 0);

    // Contact shadow: softer and wider as the object rises, slightly wider pebble
    const lift = (bob + 0.045) / 0.09; // 0..1
    const sw = THREE.MathUtils.lerp(1.25, 1.5, org) * (1 + lift * 0.08);
    shadow.mesh.scale.set(sw, THREE.MathUtils.lerp(0.95, 1.05, org) * (1 + lift * 0.08), 1);
    shadow.uniforms.uOpacity.value = theme.shadow.opacity * THREE.MathUtils.lerp(1.1, 0.8, lift);

    // As the true form is revealed the light gets a touch brighter — not warmer:
    // the halo opens up and exposure lifts slightly (background shader is
    // not tone-mapped, so only the object and its glow brighten).
    const reveal = smoothstep(0.35, 1.0, progress);
    halo.uniforms.uStrength.value = THREE.MathUtils.lerp(theme.halo.from, theme.halo.to, reveal);
    renderer.toneMappingExposure = THREE.MathUtils.lerp(theme.exposure.from, theme.exposure.to, reveal);
    tmpQ2.copy(camera.quaternion);
    halo.mesh.quaternion.copy(tmpQ2); // billboard

    renderer.render(scene, camera);
  }

  function dispose() {
    window.removeEventListener('pointermove', onPointer);
    sculpture.dispose(); fragments.dispose(); dust.dispose();
    scene.environment?.dispose();
    renderer.dispose();
  }

  return { renderer, resize, update, dispose };
}
