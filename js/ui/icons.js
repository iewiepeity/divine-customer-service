// ============================================================
// Icons — small inline SVG icons (gold line-art) used in place of
// emoji anywhere the game needs an official-looking glyph but has
// no bespoke art asset (e.g. the 卷宗 hotspot, HUD markers).
// Exported as data: URIs so callers can drop them straight into a
// background-image, same code path as photographed item art.
// ============================================================

function svgDataUri(inner, viewBox = "0 0 48 48") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="%23f3dea3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}

export const SCROLL_ICON = svgDataUri(
  `<rect x="10" y="8" width="28" height="32" rx="3"/>
   <path d="M10 8a4 4 0 0 1 0 8"/>
   <path d="M38 8a4 4 0 0 1 0 8"/>
   <path d="M10 40a4 4 0 0 0 0-8"/>
   <path d="M38 40a4 4 0 0 0 0-8"/>
   <line x1="16" y1="19" x2="32" y2="19"/>
   <line x1="16" y1="25" x2="32" y2="25"/>
   <line x1="16" y1="31" x2="25" y2="31"/>`
);
