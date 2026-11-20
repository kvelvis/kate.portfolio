/**
 * Single source of truth for the 3D scene colours.
 *
 * The CSS side lives in hero/hero.css (`:root` = Celadon, `[data-theme="night"]`
 * = Gallery Night). Keep the two in sync: `bg.mid` here == `--bg` there.
 *
 * Switch theme: <html data-theme="night"> (read once at start-up).
 *
 * Colours are plain hex. The scene converts them correctly:
 *   – lights / physical materials → linear (three.js colour management)
 *   – background, shadow, halo, dust shaders → written as display sRGB
 */
export const THEMES = {
  /* Celadon — cool daylight, pale jade, white marble */
  celadon: {
    bg: { center: '#EEF1EC', mid: '#E3E8E1', edge: '#DAE0D8' },

    key:  { color: '#F6F9FC', intensity: 2.1 },   // cool daylight white
    rim:  { color: '#BFD8CB', intensity: 4.2 },   // pale jade, behind-right
    fill: { sky: '#F4F7F5', ground: '#CBD6CF', intensity: 0.5 },
    envIntensity: 0.55,

    marble: {
      rim: '#BFD8CB',         // fresnel rim tint (matches rim light)
      rimStrength: 0.5,
      subsurface: '#EEF4F1',  // "light through calcite" — neutral, never warm
      sheen: '#F2F6F4',
      chips: '#E4EAE6',       // faint self-light on the shards
    },

    halo:   { color: '#DCEBE3', from: 0.25, to: 0.75 },
    dust:   '#D2E3DA',        // pale silver-jade
    shadow: { color: '#2F4038', opacity: 0.3 },

    // The finished form gets a touch brighter (exposure), not warmer.
    exposure: { from: 1.0, to: 1.1 },
  },

  /* Gallery Night — dark gallery, cool pearl rim */
  night: {
    bg: { center: '#1B1C1E', mid: '#121213', edge: '#0B0B0C' },

    key:  { color: '#F2F1EE', intensity: 1.6 },
    rim:  { color: '#D9DDE3', intensity: 5.0 },
    fill: { sky: '#3A3C40', ground: '#0E0E10', intensity: 0.35 },
    envIntensity: 0.35,

    marble: {
      rim: '#D9DDE3',
      rimStrength: 0.7,
      subsurface: '#20232A',
      sheen: '#E6E8EC',
      chips: '#2A2C30',
    },

    halo:   { color: '#9EA6B3', from: 0.15, to: 0.5 },
    dust:   '#D9DDE3',
    shadow: { color: '#000000', opacity: 0.55 },

    exposure: { from: 0.95, to: 1.05 },
  },
};

export function getTheme() {
  const name = document.documentElement.dataset.theme === 'night' ? 'night' : 'celadon';
  return THEMES[name];
}
