/*
  Horizontal, endlessly looping text track (plain DOM, so it stays readable, selectable and accessible).
  Every line steps out of the badge's oval keep-out zone like a magnet and settles back once it passes.
*/

const SANS = '"Geist", "Noto Sans KR", system-ui, sans-serif';
const SERIF = '"Newsreader", "Noto Serif KR", Georgia, serif';

const measureCtx = document.createElement("canvas").getContext("2d");
const measure = (text, font) => {
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
};

function wrap(text, font, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, font) > max) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

export class Track {
  constructor({ host, onFirstScroll }) {
    this.host = host;
    this.onFirstScroll = onFirstScroll;
    this.off = 0;
    this.target = 0;
    this.vel = 0;
    this.blocks = [];
  }

  /* ---------------- build ---------------- */
  build(spec) {
    this.spec = spec;
    const W = (this.W = this.host.clientWidth || innerWidth);
    this.H = this.host.clientHeight || innerHeight;
    const phone = W <= 640;
    const tablet = W <= 1024;
    this.host.textContent = "";
    this.blocks = [];

    const blockMax = phone ? Math.min(W - 56, 300) : 320;
    const head = (text) => ({ text, cls: "tl--head", font: `500 12px ${SANS}`, h: 16, gap: 16 });

    const make = (s) => {
      const L = [];
      switch (s.type) {
        case "hero": {
          let fs = phone ? 40 : 75;
          const maxW = W - (phone ? 32 : 64);
          const font = (f) => `300 ${f}px ${SERIF}`;
          const widest = Math.max(...s.lines.map((l) => measure(l.text, font(fs)) + (l.sup ? fs * 0.45 : 0)));
          if (widest > maxW) fs = Math.max(tablet ? (phone ? 34 : 44) : 52, Math.floor((fs * maxW) / widest));
          const step = Math.round(fs * 1.18);
          s.lines.forEach((l) => {
            const parts = measure(l.text, font(fs)) > maxW ? wrap(l.text, font(fs), maxW) : [l.text];
            parts.forEach((p, i) =>
              L.push({ text: p, sup: i === parts.length - 1 ? l.sup : null, after: i === parts.length - 1 ? l.after : "", cls: "tl--hero", style: `font-size:${fs}px`, h: step, gap: 0, center: true })
            );
          });
          L[L.length - 1].gap = 56 - (step - fs);
          L.push({ text: s.sub, link: s.subLink, cls: "tl--sub", h: 18, gap: 0, center: true });
          break;
        }
        case "para": {
          L.push(head(s.head));
          wrap(s.text, `300 22px ${SERIF}`, blockMax).forEach((t) => L.push({ text: t, cls: "tl--para", h: 29, gap: 0 }));
          break;
        }
        case "list": {
          L.push(head(s.head));
          s.items.forEach((t) => L.push({ text: t, cls: "tl--list", h: 22, gap: 7 }));
          break;
        }
        case "chapter": {
          L.push(head(s.head));
          L.push({ text: s.numeral, cls: "tl--num", h: 72, gap: 10 });
          wrap(s.text, `300 19px ${SERIF}`, phone ? blockMax : 300).forEach((t) => L.push({ text: t, cls: "tl--chap", h: 26, gap: 0 }));
          break;
        }
        case "quote": {
          const fs = phone ? 30 : 40;
          wrap(s.text, `italic 300 ${fs}px ${SERIF}`, phone ? blockMax : 440).forEach((t) =>
            L.push({ text: t, cls: "tl--quote", style: `font-size:${fs}px`, h: Math.round(fs * 1.12), gap: 0 })
          );
          L[L.length - 1].gap = 16;
          L.push({ ...head(s.cite), gap: 0 });
          break;
        }
        case "stats": {
          L.push(head(s.head));
          s.items.forEach(([n, t]) => L.push({ text: t, num: n, cls: "tl--stat", h: 22, gap: 9 }));
          break;
        }
        case "links": {
          L.push(head(s.head));
          s.items.forEach((it) => L.push({ text: it.text, href: it.href, ext: it.ext, cls: it.href ? "tl--link" : "tl--link is-mute", h: 29, gap: 2 }));
          break;
        }
      }
      return L;
    };

    let x = 0;
    let first = true;
    let above = true;
    let lastEnd = 0;
    spec.forEach((s, bi) => {
      const lines = make(s);
      const el = document.createElement("div");
      el.className = `tb tb--${s.type}`;
      let y = 0;
      lines.forEach((ln) => {
        const d = document.createElement(ln.href ? "a" : "div");
        d.className = `tl ${ln.cls}`;
        if (ln.style) d.style.cssText = ln.style;
        if (ln.href) {
          d.href = ln.href;
          if (ln.ext) {
            d.target = "_blank";
            d.rel = "noopener noreferrer";
          }
        }
        const inner = document.createElement("span");
        inner.className = "tl__in";
        if (ln.num) {
          const n = document.createElement("b");
          n.textContent = ln.num;
          inner.append(n, document.createTextNode(ln.text));
        } else if (ln.link) {
          const [a, b] = ln.text.split("|");
          const link = document.createElement("a");
          link.href = ln.link.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = b;
          inner.append(document.createTextNode(a), link);
        } else inner.textContent = ln.text;
        if (ln.sup) {
          const sup = document.createElement("sup");
          sup.textContent = ln.sup;
          inner.append(sup);
        }
        if (ln.after) inner.append(document.createTextNode(ln.after));
        d.append(inner);
        d.style.top = `${y}px`;
        el.append(d);
        ln.el = d;
        ln.inner = inner;
        ln.y = y;
        y += ln.h + ln.gap;
        ln.shift = 0;
      });
      const h = y - (lines.at(-1)?.gap || 0);
      this.host.append(el);
      const w = Math.max(...lines.map((ln) => ln.inner.offsetWidth));
      lines.forEach((ln) => {
        ln.w = ln.inner.offsetWidth;
        ln.ox = ln.center ? (w - ln.w) / 2 : 0;
        if (ln.center) ln.el.style.left = `${ln.ox}px`;
      });
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;

      const b = { el, lines, w, h, i: bi };
      if (s.type === "hero") {
        b.x = -w / 2;
        b.top = -h / 2;
        lastEnd = w / 2;
      } else {
        if (first) {
          x = lastEnd + W / 2 + (phone ? 70 : 200);
          first = false;
        }
        b.x = x;
        const g = phone ? 64 : 78;
        b.top = above ? -g - h : g;
        above = !above;
        x += phone ? 150 + 60 : Math.max(0.62 * w, 200) + 90;
        lastEnd = Math.max(lastEnd, b.x + w);
      }
      // keyboard focus brings a block on screen
      el.addEventListener("focusin", () => this.focus(b));
      this.blocks.push(b);
    });
    const heroW = this.blocks[0]?.w || 0;
    this.L = lastEnd + (phone ? 140 : 260) + W / 2 + heroW / 2;
  }

  focus(b) {
    const want = b.x + b.w / 2;
    const k = Math.round((this.off - want) / this.L);
    this.target = want + k * this.L;
  }

  /* ---------------- input ---------------- */
  wheel(e) {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    this.nudge(d * (e.deltaMode === 1 ? 32 : 1));
  }

  nudge(d) {
    this.target += d;
    if (!this.scrolled && Math.abs(this.target) > 4) {
      this.scrolled = true;
      this.onFirstScroll?.();
    }
  }

  /* ---------------- frame ---------------- */
  frame(dt, badge, reduced) {
    if (!this.blocks.length) return;
    const f = Math.min(dt * 60, 3);
    if (Math.abs(this.vel) > 0.1) {
      this.target += this.vel * f;
      this.vel *= Math.pow(0.95, f);
    }
    this.off += (this.target - this.off) * (1 - Math.pow(1 - 0.12, f));
    const { W, H, L } = this;
    const wrapX = (x) => ((((x + L / 2) % L) + L) % L) - L / 2;

    // keep-out oval around the card body (px, relative to the screen centre, y down)
    const pad = 22;
    const Rx = badge.hw + 34;
    const Ry = badge.hh + 6;
    const on = badge.visible;

    for (const b of this.blocks) {
      const x = wrapX(b.x - this.off);
      const vis = x < W / 2 + 60 && x + b.w > -W / 2 - 60;
      if (!vis) {
        if (b.vis) {
          b.el.style.visibility = "hidden";
          b.vis = false;
          b.lines.forEach((ln) => {
            ln.shift = 0;
            ln.el.style.transform = "";
          });
        }
        continue;
      }
      if (!b.vis) {
        b.el.style.visibility = "visible";
        b.vis = true;
      }
      b.el.style.transform = `translate3d(${(W / 2 + x).toFixed(2)}px, ${(H / 2 + b.top).toFixed(2)}px, 0)`;

      // magnet
      const up = [];
      const down = [];
      for (const ln of b.lines) {
        const top = b.top + ln.y;
        const mid = top + ln.h / 2;
        (mid < badge.y ? up : down).push(ln);
        ln._top = top;
        const l = x + ln.ox;
        const r = l + ln.w;
        ln._d = badge.x < l ? l - badge.x : badge.x > r ? badge.x - r : 0;
      }
      up.sort((a, c) => c._top - a._top);
      down.sort((a, c) => a._top - c._top);
      const solve = (arr, sign) => {
        let inner = 0;
        arr.forEach((ln, k) => {
          let need = 0;
          if (on && ln._d < Rx) {
            const hh = Ry * Math.sqrt(1 - (ln._d / Rx) ** 2) + pad;
            need = sign < 0 ? Math.min(0, badge.y - hh - (ln._top + ln.h)) : Math.max(0, badge.y + hh - ln._top);
          }
          need = sign < 0 ? Math.min(need, inner) : Math.max(need, inner);
          if (reduced) ln.shift = need;
          else ln.shift += (need - ln.shift) * (1 - Math.pow(1 - Math.max(0.1, 0.14 - 0.012 * k), f));
          // an outer line may lag, but never cross the line inside it
          ln.shift = sign < 0 ? Math.min(ln.shift, inner) : Math.max(ln.shift, inner);
          inner = ln.shift;
          const v = Math.abs(ln.shift) < 0.05 ? "" : `translate3d(0, ${ln.shift.toFixed(2)}px, 0)`;
          if (ln._v !== v) {
            ln.el.style.transform = v;
            ln._v = v;
          }
        });
      };
      solve(up, -1);
      solve(down, 1);
    }
  }
}
