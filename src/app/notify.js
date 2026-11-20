/*
  Visit notifications → Kate's Telegram (through /notify.php on the hosting).

  - Fires once per visit, only after the page has been visible for a few seconds,
    so link-preview robots (KakaoTalk, 사람인 …) don't count.
  - ?r=code in the link says which resume it came from (keep your own list of codes).
  - Open the site once with ?me=1 on your own devices to stop notifications from them
    (?me=0 turns them back on).
  - Nothing is stored about the visitor: no IP, no cookies.
*/

const KEY = "notify-off";
const SENT = "notify-sent";
const ENDPOINT = "/notify.php";
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
  if (import.meta.env.DEV) return true; // notify.php only runs on the hosting
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
  navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" })) ||
    fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {});
}

/** Call once at start-up. */
export function notifyVisit() {
  if (off() || store(sessionStorage, SENT)) return;
  let timer = 0;
  const arm = () => {
    clearTimeout(timer);
    if (document.visibilityState !== "visible") return;
    timer = setTimeout(() => {
      store(sessionStorage, SENT, "1");
      document.removeEventListener("visibilitychange", arm);
      send({ type: "visit" });
    }, DELAY);
  };
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
