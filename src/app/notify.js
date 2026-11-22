/*
  Visit notifications to Telegram, through the Cloudflare Worker in worker/notify.js
  (it holds the bot token; GitHub Pages can't run server code).

  - Fires once per visit, only after the page has been visible for a few seconds
    AND the visitor scrolled, moved the mouse, touched or pressed a key, so link previews
    and link-safety scanners (they only load the page) don't count.
  - ?r=code in the link says which resume it came from (keep your own list of codes).
  - Open the site once with ?me=1 on your own devices to stop notifications from them
    (?me=0 turns them back on).
  - Nothing is stored about the visitor: no IP, no cookies.
*/

const KEY = "notify-off";
const SENT = "notify-sent";
// the worker's address (dash.cloudflare.com → Workers); empty = notifications off
const ENDPOINT = "https://kate-notify.kvelvis74.workers.dev";
const DELAY = 4000;

const ref = new URLSearchParams(location.search).get("r") || "";
const store = (s, k, v) => {
  try {
    return v === undefined ? s.getItem(k) : s.setItem(k, v);
  } catch {
    return null;
  }
};

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
    send({ type: "visit", human: acted });
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
  send({ type: "project", title });
}

/** The like button was pressed. (?me=1 devices stay silent here too.) */
export function notifyLike() {
  if (off()) return;
  send({ type: "like" });
}
