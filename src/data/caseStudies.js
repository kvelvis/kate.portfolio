import { featured } from "./featured";

// Case studies: problem → process → result.
// A "Case study" button appears on the site only when `problem` or `result` is filled in.
// Images: import them at the top and add to `images` as { src, alt, width, height }.
// Any text can be a plain string or { ko, en }.

export const caseStudies = {
  dano: {
    title: "Dano",
    titleKo: "단어",
    type: { ko: "개인 프로젝트 · Mobile app", en: "Personal project · Mobile app" },
    period: "2026.11", // TODO: Kate — confirm
    role: featured.role,
    tools: ["Figma (Variables)", "AI 3D"], // TODO: Kate — confirm / add tools
    lead: featured.summary,
    problem: "", // TODO: Kate — what problem did you see? (who struggles with what, and why existing apps don't solve it)
    process: [
      // TODO: Kate — 3–5 steps, e.g. { title: "리서치", text: "..." }
      ...featured.features.map((f) => ({ title: f.title, text: f.text })), // key decisions you listed; add text where empty
    ],
    result: "", // TODO: Kate — outcome: screens finished, prototype, test feedback, what you learned
    next: featured.next,
    images: [], // TODO: Kate — key screens, design-system page, mascot
    links: { figma: featured.figmaUrl, live: "" },
  },

  celine: {
    title: "Celine",
    type: "Website redesign",
    period: "", // TODO: Kate
    role: "", // TODO: Kate — e.g. "기획 · 디자인 · 퍼블리싱"
    tools: [], // TODO: Kate — e.g. ["Figma", "HTML", "CSS", "jQuery"]
    lead: "", // TODO: Kate — one-sentence summary
    problem: "", // TODO: Kate — what was wrong with the original site
    process: [], // TODO: Kate — { title, text } steps
    result: "", // TODO: Kate — what changed / improved
    next: [],
    images: [], // TODO: Kate — before / after screenshots
    links: { live: "/cases/celine/celine.html" },
  },

  gatto: {
    title: "Gatto",
    type: "Cafe website redesign · Responsive (PC · Tablet · Mobile)",
    period: "", // TODO: Kate
    role: "", // TODO: Kate
    tools: [], // TODO: Kate
    lead: "", // TODO: Kate — one-sentence summary
    problem: "", // TODO: Kate
    process: [], // TODO: Kate
    result: "", // TODO: Kate
    next: [],
    images: [], // TODO: Kate — PC / tablet / mobile screenshots
    links: { live: "/cases/cat cafe/cat.html" }, // TODO: Kate — "/cases/cat cafe/renew/index.html" once confirmed
  },
};

// Filled = non-empty string, or { ko, en } with at least the Korean text.
const filled = (v) => Boolean(v && (typeof v === "string" || v.ko));

export const hasCaseStudy = (key) => {
  const cs = caseStudies[key];
  return Boolean(cs && (filled(cs.problem) || filled(cs.result)));
};
