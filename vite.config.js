import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  SITE_URL,
  SITE_URL_PLACEHOLDER,
  OG_IMAGE,
  NAVER_SITE_VERIFICATION,
  GOOGLE_SITE_VERIFICATION,
} from './site.config.js'
import { profile, links } from './src/data/profile.js'

// Adds URL-dependent SEO tags, Person structured data, robots.txt and sitemap.xml.
// Settings live in site.config.js.
function seo() {
  const url = SITE_URL && SITE_URL !== SITE_URL_PLACEHOLDER ? SITE_URL.replace(/\/$/, '') : ''

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: ['Kate', profile.nickname],
    jobTitle: profile.roles.join(' · '),
    knowsLanguage: ['ko', 'en', 'ru'],
    address: { '@type': 'PostalAddress', addressLocality: 'Seoul', addressCountry: 'KR' },
    ...(url && { url: `${url}/` }),
    ...(OG_IMAGE && url && { image: url + OG_IMAGE }),
    sameAs: [links.github, links.linkedin, links.telegram && `https://t.me/${links.telegram}`].filter(Boolean),
  }

  return {
    name: 'seo-tags',
    transformIndexHtml() {
      const tags = []
      const meta = (attrs) => tags.push({ tag: 'meta', attrs, injectTo: 'head' })
      if (url) {
        tags.push({ tag: 'link', attrs: { rel: 'canonical', href: `${url}/` }, injectTo: 'head' })
        meta({ property: 'og:url', content: `${url}/` })
        if (OG_IMAGE) {
          meta({ property: 'og:image', content: url + OG_IMAGE })
          meta({ property: 'og:image:width', content: '1200' })
          meta({ property: 'og:image:height', content: '630' })
          meta({ name: 'twitter:image', content: url + OG_IMAGE })
        }
      }
      if (NAVER_SITE_VERIFICATION) meta({ name: 'naver-site-verification', content: NAVER_SITE_VERIFICATION })
      if (GOOGLE_SITE_VERIFICATION) meta({ name: 'google-site-verification', content: GOOGLE_SITE_VERIFICATION })
      tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(person), injectTo: 'head' })
      return tags
    },
    generateBundle() {
      if (!url) this.warn('site.config.js: SITE_URL is still a placeholder — canonical, og:url, og:image and sitemap.xml were skipped')
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${url ? `\nSitemap: ${url}/sitemap.xml\n` : ''}`,
      })
      if (url) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc></url>\n</urlset>\n`,
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
})
