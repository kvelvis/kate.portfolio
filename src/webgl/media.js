import * as THREE from "three";

export const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

/** Muted looping video element, ready for a VideoTexture. */
export function makeVideo(src, preload = "metadata") {
  const v = document.createElement("video");
  v.crossOrigin = "anonymous";
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.preload = preload;
  const webmOk = src.webm && v.canPlayType('video/webm; codecs="vp9"') && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  v.src = webmOk ? src.webm : src.mp4;
  return v;
}

/** Resolves once the video has a decodable frame. */
export function videoReady(v) {
  return new Promise((res) => {
    if (v.readyState >= 2) return res(v);
    const done = () => res(v);
    v.addEventListener("loadeddata", done, { once: true });
    v.addEventListener("error", done, { once: true });
  });
}

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

export function videoTexture(v, colorSpace = THREE.NoColorSpace) {
  const t = new THREE.VideoTexture(v);
  t.colorSpace = colorSpace;
  t.minFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  return t;
}

/** Waits for the families the canvases draw with. */
export function fontsReady() {
  const f = document.fonts;
  if (!f) return Promise.resolve();
  return Promise.all([
    f.load('600 16px "Geist"'),
    f.load('500 16px "Geist"'),
    f.load('400 16px "Geist"'),
    f.load('300 16px "Newsreader"'),
    f.load('400 16px "Newsreader"'),
    f.load('italic 300 16px "Newsreader"'),
  ]).then(() => f.ready).catch(() => {});
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
