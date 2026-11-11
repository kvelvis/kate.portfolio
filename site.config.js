// Site-wide settings used at build time (SEO tags, sitemap, robots.txt).
// While SITE_URL is the placeholder, URL-based tags (canonical, og:url, og:image, sitemap) are skipped.

export const SITE_URL_PLACEHOLDER = "https://your-domain.com";

export const SITE_URL = SITE_URL_PLACEHOLDER; // TODO: Kate — real domain, e.g. "https://kate-portfolio.com" (no trailing slash)
export const DEPLOY_TARGET = ""; // TODO: Kate — "github-pages" | "vercel" | "netlify"

export const OG_IMAGE = ""; // TODO: Kate — 1200×630 share image in public/, e.g. "/og-image.png"
export const NAVER_SITE_VERIFICATION = ""; // TODO: Kate — code from Naver Search Advisor (searchadvisor.naver.com)
export const GOOGLE_SITE_VERIFICATION = ""; // TODO: Kate — code from Google Search Console (optional)
