/*
  Cloudflare Worker: sends Kate a Telegram message when someone opens the portfolio.
  Replaces public/notify.php, which can't run on GitHub Pages.

  Setup (dash.cloudflare.com → Workers & Pages → Create → Worker):
    1. paste this file as the worker code, Deploy;
    2. Settings → Variables and Secrets → add two secrets:
         TG_TOKEN — the bot token, TG_CHAT — the chat id;
    3. put the worker's URL into NOTIFY_URL in src/app/notify.js.

  Limits: one message of each kind per visitor per 20 s, at most 40 messages an hour
  (kept in memory, so they are best-effort). Nothing about the visitor is saved.
*/

const ORIGINS = ["https://kvelvis.github.io", "http://localhost:5173"];
const BOTS = /bot|crawl|spider|preview|facebookexternalhit|kakaotalk-scrap|headless|curl|wget|python|lighthouse|pagespeed|scanner/i;
// Networks of data centres and security scanners: people browse from home / mobile providers, robots from these.
// (Akamai, Cloudflare and Fastly are left out on purpose: iCloud Private Relay users come through them.)
const DATACENTER =
  /amazon|aws|google(?! fiber)|microsoft|azure|digitalocean|ovh|hetzner|linode|akamai connected cloud|oracle|alibaba|tencent|huawei cloud|vultr|choopa|contabo|leaseweb|m247|datacamp|cdn77|scaleway|ionos|hostinger|colocrossing|zscaler|palo alto|fortinet|proofpoint|mimecast|barracuda|forcepoint|netskope|censys|shodan|internet measurement|psychz|quadranet|g-?core|stark industries|aeza|bytedance|facebook|meta platforms|linkedin|yandex cloud|selectel|timeweb|kamatera|hostroyale|tzulo|servers\.com/i;

const flag = (cc) => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : "");
const countryName = (cc) => {
  try {
    return new Intl.DisplayNames(["ru"], { type: "region" }).of(cc) || cc;
  } catch {
    return cc;
  }
};

const recent = new Map(); // visitor+kind → time
let hour = { key: "", count: 0 };

const cors = (origin) => ({
  "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
});

const clean = (v, max = 60) =>
  (typeof v === "string" ? v : "")
    .replace(/[^\p{L}\p{N} \-_.:/·()]/gu, "")
    .trim()
    .slice(0, max);

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const h = cors(origin);
    const done = (status) => new Response(null, { status, headers: h });

    if (req.method === "OPTIONS") return done(204);
    if (req.method !== "POST") return done(405);
    if (!ORIGINS.includes(origin)) return done(403);
    if (!env.TG_TOKEN || !env.TG_CHAT) return done(204);

    const ua = req.headers.get("User-Agent") || "";
    if (!ua || BOTS.test(ua)) return done(204);

    let input;
    try {
      const raw = await req.text();
      if (raw.length > 2048) return done(413);
      input = JSON.parse(raw);
    } catch {
      return done(400);
    }
    if (!input || typeof input !== "object") return done(400);

    // ---- people only ----
    const net = clean(req.cf?.asOrganization || "", 50);
    if (DATACENTER.test(net)) return done(204);
    const type0 = typeof input.type === "string" ? input.type : "visit";
    if (type0 === "visit" && !input.human) return done(204); // no scroll / mouse / touch → robot

    // ---- rate limits ----
    const now = Date.now();
    const type = typeof input.type === "string" ? input.type : "visit";
    const ip = req.headers.get("CF-Connecting-IP") || "";
    const who = `${ip}|${ua}|${type}|${clean(input.title)}`;
    if (now - (recent.get(who) || 0) < 20000) return done(429);
    recent.set(who, now);
    if (recent.size > 500) for (const [k, t] of recent) if (now - t > 20000) recent.delete(k);

    const hourKey = new Date(now).toISOString().slice(0, 13);
    if (hour.key !== hourKey) hour = { key: hourKey, count: 0 };
    if (++hour.count > 40) return done(429);

    // ---- message ----
    const r = clean(input.r, 30);
    const device = { phone: "📱 телефон", tablet: "📱 планшет", desktop: "💻 компьютер" }[input.device] || "";
    const tz = clean(input.tz, 40);
    const lang = clean(input.lang, 12);
    const time = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Asia/Seoul",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .format(now)
      .replace(",", "");

    const cc = req.cf?.country || "";
    const city = clean(req.cf?.city || "", 40);
    const where = cc ? `${flag(cc)} ${[city, countryName(cc)].filter(Boolean).join(", ")}${net ? ` · ${net}` : ""}` : "";

    let text;
    let silent = false;
    if (type === "like") {
      text = `❤️ Портфолио лайкнули!${r ? `\nСсылка: ${r}` : ""}${where ? `\n${where}` : ""}\n${device} · ${time} (KST)`;
    } else if (type === "project") {
      text = `📂 Открыли проект: ${clean(input.title)}${r ? `  · ссылка ${r}` : ""}`;
      silent = true;
    } else {
      text = [
        "👀 Портфолио открыли",
        r ? `Ссылка: ${r}` : "Ссылка: без метки",
        where,
        [device, tz, lang].filter(Boolean).join(" · "),
        `${time} (KST)`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TG_CHAT, text, disable_notification: silent }),
    });
    return done(204);
  },
};
