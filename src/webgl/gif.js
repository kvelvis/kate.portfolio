import * as THREE from "three";

/*
 * Animated GIF → THREE texture.
 * A GIF handed to TextureLoader shows only its first frame, so this decodes the file
 * itself and paints frames onto a canvas. The player has the same play()/pause()
 * shape as a <video>, so the sphere manages it like one. Frames are decoded one at a
 * time while playing — nothing is kept in memory beyond the current picture.
 * LZW decoder adapted from omggif (MIT).
 */

function parse(buf) {
  const b = new Uint8Array(buf);
  if (b[0] !== 0x47 || b[1] !== 0x49 || b[2] !== 0x46) throw new Error("not a gif");
  const width = b[6] | (b[7] << 8);
  const height = b[8] | (b[9] << 8);
  const pf = b[10];
  let p = 13;
  let gct = null;
  if (pf & 0x80) {
    gct = p;
    p += 3 * (1 << ((pf & 7) + 1));
  }
  const frames = [];
  let delay = 0;
  let trans = -1;
  let disposal = 0;
  const skipBlocks = () => {
    while (p < b.length) {
      const n = b[p++];
      if (!n) break;
      p += n;
    }
  };
  while (p < b.length) {
    const block = b[p++];
    if (block === 0x21) {
      const label = b[p++];
      if (label === 0xf9) {
        const f = b[p + 1];
        delay = (b[p + 2] | (b[p + 3] << 8)) * 10;
        trans = f & 1 ? b[p + 4] : -1;
        disposal = (f >> 2) & 7;
        p += b[p] + 1;
        skipBlocks();
      } else skipBlocks();
    } else if (block === 0x2c) {
      const x = b[p] | (b[p + 1] << 8);
      const y = b[p + 2] | (b[p + 3] << 8);
      const w = b[p + 4] | (b[p + 5] << 8);
      const h = b[p + 6] | (b[p + 7] << 8);
      const f = b[p + 8];
      p += 9;
      let pal = gct;
      if (f & 0x80) {
        pal = p;
        p += 3 * (1 << ((f & 7) + 1));
      }
      const data = p;
      p++; // min code size
      skipBlocks();
      frames.push({ x, y, w, h, interlaced: !!(f & 0x40), pal, data, trans, disposal, delay: delay < 20 ? 100 : delay });
      delay = 0;
      trans = -1;
      disposal = 0;
    } else break; // 0x3b trailer or junk
  }
  return { b, width, height, frames };
}

function lzw(s, p, out, len) {
  const minSize = s[p++];
  const clear = 1 << minSize;
  const eoi = clear + 1;
  let next = eoi + 1;
  let size = minSize + 1;
  let mask = (1 << size) - 1;
  let shift = 0;
  let cur = 0;
  let op = 0;
  let sub = s[p++];
  const table = new Int32Array(4096);
  let prev = null;
  for (;;) {
    while (shift < 16) {
      if (sub === 0) break;
      cur |= s[p++] << shift;
      shift += 8;
      if (sub === 1) sub = s[p++];
      else --sub;
    }
    if (shift < size) break;
    const code = cur & mask;
    cur >>= size;
    shift -= size;
    if (code === clear) {
      next = eoi + 1;
      size = minSize + 1;
      mask = (1 << size) - 1;
      prev = null;
      continue;
    } else if (code === eoi) break;
    const chaseCode = code < next ? code : prev;
    let chaseLen = 0;
    let chase = chaseCode;
    while (chase > clear) {
      chase = table[chase] >> 8;
      ++chaseLen;
    }
    const k = chase;
    if (op + chaseLen + (chaseCode !== code ? 1 : 0) > len) return;
    out[op++] = k;
    op += chaseLen;
    let bb = op;
    if (chaseCode !== code) out[op++] = k;
    chase = chaseCode;
    while (chaseLen--) {
      chase = table[chase];
      out[--bb] = chase & 0xff;
      chase >>= 8;
    }
    if (prev !== null && next < 4096) {
      table[next++] = (prev << 8) | k;
      if (next >= mask + 1 && size < 12) {
        ++size;
        mask = (mask << 1) | 1;
      }
    }
    prev = code;
  }
}

class GifPlayer {
  constructor(gif) {
    this.gif = gif;
    this.videoWidth = gif.width;
    this.videoHeight = gif.height;
    const c = (this.canvas = document.createElement("canvas"));
    c.width = gif.width;
    c.height = gif.height;
    this.ctx = c.getContext("2d");
    this.img = this.ctx.createImageData(gif.width, gif.height);
    this.px = new Uint32Array(this.img.data.buffer);
    this.idx = new Uint8Array(gif.width * gif.height);
    this.saved = null;
    this.i = -1;
    this.timer = 0;
    const t = (this.texture = new THREE.CanvasTexture(c));
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    this.step(); // first frame right away
  }

  step() {
    const { gif, px } = this;
    const W = gif.width;
    const last = gif.frames[this.i];
    // undo the previous frame as its disposal asks
    if (last) {
      if (last.disposal === 2) {
        for (let y = last.y; y < last.y + last.h; y++) px.fill(0, y * W + last.x, y * W + last.x + last.w);
      } else if (last.disposal === 3 && this.saved) px.set(this.saved);
    }
    this.i = (this.i + 1) % gif.frames.length;
    if (this.i === 0) px.fill(0);
    const f = gif.frames[this.i];
    if (f.disposal === 3) this.saved = px.slice();
    const n = f.w * f.h;
    const idx = this.idx;
    idx.fill(0, 0, n);
    lzw(gif.b, f.data, idx, n);
    const b = gif.b;
    const pal = f.pal;
    const little = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
    let row = 0;
    let pass = 0;
    let stepY = f.interlaced ? 8 : 1;
    for (let r = 0; r < f.h; r++) {
      const dy = f.y + (f.interlaced ? row : r);
      if (dy < gif.height) {
        let o = dy * W + f.x;
        const src = r * f.w;
        for (let x = 0; x < f.w; x++, o++) {
          const ci = idx[src + x];
          if (ci === f.trans || pal === null || f.x + x >= W) continue;
          const q = pal + ci * 3;
          px[o] = little ? 0xff000000 | (b[q + 2] << 16) | (b[q + 1] << 8) | b[q] : (b[q] << 24) | (b[q + 1] << 16) | (b[q + 2] << 8) | 0xff;
        }
      }
      if (f.interlaced) {
        row += stepY;
        while (row >= f.h && pass < 3) {
          pass++;
          row = [0, 4, 2, 1][pass];
          stepY = [8, 8, 4, 2][pass];
        }
      }
    }
    this.ctx.putImageData(this.img, 0, 0);
    this.texture.needsUpdate = true;
  }

  play() {
    if (!this.timer && !this.dead && this.gif.frames.length > 1) {
      const tick = () => {
        this.step();
        this.timer = setTimeout(tick, this.gif.frames[this.i].delay);
      };
      this.timer = setTimeout(tick, this.gif.frames[this.i].delay);
    }
    return Promise.resolve();
  }

  /** Back to frame 1 (keeps playing if it was). */
  restart() {
    const wasPlaying = !!this.timer;
    this.pause();
    this.px.fill(0);
    this.saved = null;
    this.i = -1;
    this.step();
    if (wasPlaying) this.play();
  }

  pause() {
    clearTimeout(this.timer);
    this.timer = 0;
  }

  destroy() {
    this.pause();
    this.dead = true;
    this.texture.dispose();
  }
}

/** Downloads and parses a GIF; resolves to a player (or null on failure). */
export async function loadGif(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const gif = parse(await res.arrayBuffer());
    return gif.frames.length ? new GifPlayer(gif) : null;
  } catch {
    return null;
  }
}
