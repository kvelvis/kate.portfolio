import * as THREE from "three";

export const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

const loader = new THREE.TextureLoader();
/** Image texture (raw sRGB values — every scene here passes colour through unchanged). */
export function loadImage(url, colorSpace = THREE.NoColorSpace) {
  return new Promise((res) => {
    loader.load(
      url,
      (t) => {
        t.colorSpace = colorSpace;
        t.minFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        res(t);
      },
      undefined,
      () => res(null)
    );
  });
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
