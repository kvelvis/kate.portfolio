// Small accessibility helpers shared by Modal and MobileMenu.

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export const getFocusable = (root) =>
  [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest("[inert]") && el.getClientRects().length);

/** Keeps Tab / Shift+Tab inside `root`. Call from a keydown handler. */
export function trapTab(e, root) {
  if (e.key !== "Tab" || !root) return;
  const items = getFocusable(root);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  } else if (!root.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  }
}

/** Makes everything except `keep` elements unreachable for keyboard and screen readers. Returns an undo function. */
export function inertOutside(selectors) {
  const els = selectors.map((s) => document.querySelector(s)).filter(Boolean);
  els.forEach((el) => (el.inert = true));
  return () => els.forEach((el) => (el.inert = false));
}
