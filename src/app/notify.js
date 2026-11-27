/*
  Visit notifications to Telegram, through the Cloudflare Worker in worker/notify.js
  (it holds the bot token; GitHub Pages can't run server code).

  - Fires once per visit, only after the page has been visible for a few seconds
    AND the visitor scrolled, moved the mouse, touched or pressed a key, so link previews
    and link-safety scanners (they only load the page) don't count.
  - Client tag: send each company its own link, ?r=a, ?r=b … (?c=a works too).
    The tag is remembered on that device, so a later visit without it still shows "a".
  - Each visit message says how many times the portfolio was opened on that device
    (and in total for the tag, if the worker has the STATS store, see worker/notify.js).
  - Also reported, silently: opening a project, clicking a site / brand book / prototype /
    Figma / contact link ([data-go] attribute), and closing the portfolio (time spent + what was seen).
  - Open the site once with ?me=1 on your own devices to stop notifications from them
    (?me=0 turns them back on).
  - Nothing is stored about the visitor on the server: no IP, no cookies.
*/

const KEY = "notify-off";
const SENT = "notify-sent";
// the worker's address (dash.cloudflare.com → Workers); empty = notifications off
const ENDPOINT = "https://kate-notify.kvelvis74.workers.dev";
const DELAY = 4000;

const store = (s, k, v) => {
  try {
    return v === undefined ? s.getItem(k) : s.setItem(k, v);
  } catch {
    return null;
  }
};

// client tag: from the link, otherwise the one this device came with last time
const q = new URLSearchParams(location.search);
const urlRef = (q.get("r") || q.get("c") || "").trim().slice(0, 30);
if (urlRef) store(localStorage, "notify-ref", urlRef);
const ref = urlRef || store(localStorage, "notify-ref") || "";
const refOld = !urlRef && !!ref;

// what this visit did, for the "closed" message
const seen = { projects: [], gos: [], sent: false, closed: false };
let visibleMs = 0;
let visibleSince = document.visibilityState === "visible" ? performance.now() : 0;
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") visibleSince = performance.now();
  else if (visibleSince) {
    visibleMs += performance.now() - visibleSince;
    visibleSince = 0;
  }
});

function off() {
  if (!ENDPOINT || import.meta.env.DEV) return true;
  const me = new URLSearchParams(location.search).get("me");
  if (me === "1") store(localStorage, KEY, "1");
  if (me === "0") {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
  return store(localStorage, KEY) === "1" || navigator.webdriver;
}

function send(data) {
  const body = JSON.stringify({
    ...data,
    r: ref,
    refOld,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    device: matchMedia("(pointer: coarse)").matches ? (innerWidth < 760 ? "phone" : "tablet") : "desktop",
  });
  navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" })) ||
    fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
}

// Signs of a person: robots that only load the page (link scanners, previews) never do these.
const HUMAN = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"];

/** Call once at start-up. Sends after the page was visible for DELAY ms AND the visitor did something. */
export function notifyVisit() {
  if (off() || store(sessionStorage, SENT)) return;
  let timer = 0;
  let waited = false; // visible long enough
  let acted = ""; // first human action
  const opts = { passive: true, capture: true };
  const stop = () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", arm);
    HUMAN.forEach((e) => removeEventListener(e, onAct, opts));
  };
  const fire = () => {
    if (!waited || !acted || store(sessionStorage, SENT)) return;
    store(sessionStorage, SENT, "1");
    stop();
    const n = Number(store(localStorage, "notify-visits") || 0) + 1;
    store(localStorage, "notify-visits", String(n));
    seen.sent = true;
    send({ type: "visit", human: acted, n });
  };
  // a mouse that never moves (scripted clicks) or a "scroll" on load doesn't count
  function onAct(e) {
    if (e.type === "scroll" && scrollY < 40) return;
    if (e.type === "pointermove" && !(e.movementX || e.movementY)) return;
    acted = e.type;
    HUMAN.forEach((t) => removeEventListener(t, onAct, opts));
    fire();
  }
  function arm() {
    clearTimeout(timer);
    if (document.visibilityState !== "visible") return;
    timer = setTimeout(() => {
      waited = true;
      fire();
    }, DELAY);
  }
  HUMAN.forEach((e) => addEventListener(e, onAct, opts));
  document.addEventListener("visibilitychange", arm);
  arm();
}

const opened = new Set();
/** A project panel was opened (each project once per visit, max 8). */
export function notifyProject(title) {
  if (off() || !title || opened.has(title) || opened.size >= 8) return;
  opened.add(title);
  seen.projects.push(title);
  send({ type: "project", title });
}

const went = new Set();
/** A site / brand book / prototype / Figma / contact link was clicked (each once per visit, max 12). */
export function notifyGo(label) {
  if (off() || !label || went.has(label) || went.size >= 12) return;
  went.add(label);
  seen.gos.push(label);
  send({ type: "site", title: label });
}

// any link with data-go="Проект · сайт" reports itself (left or middle click)
const onGo = (e) => {
  const a = e.target.closest?.("a[data-go]");
  if (a && (e.type === "click" || e.button === 1)) notifyGo(a.dataset.go);
};
addEventListener("click", onGo, true);
addEventListener("auxclick", onGo, true);

// the tab was closed / the visitor left: how long they stayed and what they looked at
addEventListener("pagehide", () => {
  if (!seen.sent || seen.closed || off()) return;
  seen.closed = true;
  const ms = visibleMs + (visibleSince ? performance.now() - visibleSince : 0);
  send({ type: "close", secs: Math.round(ms / 1000), projects: seen.projects.slice(0, 8), gos: seen.gos.slice(0, 12) });
});

/** The like button was pressed. (?me=1 devices stay silent here too.) */
export function notifyLike() {
  if (off()) return;
  send({ type: "like" });
}
