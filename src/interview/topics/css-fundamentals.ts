import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'css-fundamentals',
  title: 'CSS — Box Model, Position & Layout',
  icon: '🎨',
  difficulty: 'Core',
  targets: ['General'],
  keyPoints: [
    'box-sizing: border-box makes width include padding + border',
    'position: absolute removes from flow, anchors to nearest non-static ancestor',
    'Flexbox gap — space between items without affecting their width',
    'Responsive = fluid reflow; Adaptive = fixed layouts per device',
    'SCSS nesting max 3 levels to avoid specificity hell',
  ],
  cheatSheet: [
    {
      concept: 'Box Model',
      explanation: `<p class="font-semibold text-gray-800 mb-1">The Four Layers</p><p class="mb-3 text-gray-600">Every element is a rectangular box: <strong>content</strong> → <strong>padding</strong> → <strong>border</strong> → <strong>margin</strong>. Margin is outside the element's own dimensions.</p><p class="font-semibold text-gray-800 mb-1">box-sizing: border-box</p><p class="text-gray-600">The default <code>content-box</code> means <code>width</code> only counts the content — padding and border are added on top. <code>border-box</code> makes <code>width</code> include padding and border. This is why every modern CSS reset applies <code>* { box-sizing: border-box }</code>.</p>`,
      code: `/* Default: content-box — width = content only */
.box { width: 200px; padding: 20px; border: 2px solid; }
/* Actual rendered width: 200 + 40 + 4 = 244px */

/* border-box — width includes padding + border */
*, *::before, *::after { box-sizing: border-box; }
.box { width: 200px; padding: 20px; border: 2px solid; }
/* Actual rendered width: exactly 200px */`,
    },
    {
      concept: 'position Values',
      explanation: `<p class="font-semibold text-gray-800 mb-1">In-flow Values</p><p class="mb-3 text-gray-600"><strong><code>static</code></strong> (default): element is in the normal document flow, no offset. <strong><code>relative</code></strong>: stays in flow but can be nudged with <code>top/left</code> — also creates a positioning context for absolute children.</p><p class="font-semibold text-gray-800 mb-1">Out-of-flow Values</p><p class="text-gray-600"><strong><code>absolute</code></strong>: removed from flow, anchors to the nearest non-static ancestor. <strong><code>fixed</code></strong>: anchors to the viewport — stays visible on scroll. <strong><code>sticky</code></strong>: in-flow until it hits its <code>top</code> threshold, then sticks like <code>fixed</code>.</p>`,
      code: `/* relative — still takes up space, children can use it as anchor */
.parent { position: relative; }

/* absolute — removed from flow, anchors to .parent */
.tooltip { position: absolute; top: 100%; left: 0; }

/* fixed — always visible, ignores scroll */
.navbar { position: fixed; top: 0; width: 100%; }

/* sticky — scrolls with page until it hits top: 0 */
.table-header { position: sticky; top: 0; }`,
    },
    {
      concept: 'Responsive vs Adaptive Design',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Responsive</p><p class="mb-3 text-gray-600">One fluid layout that reflows at any viewport width using percentages, flexbox, grid, and media queries. The same HTML adapts to any screen size. This is the modern standard.</p><p class="font-semibold text-gray-800 mb-1">Adaptive</p><p class="text-gray-600">Multiple fixed layouts — one is served per device class (mobile, tablet, desktop). More work to maintain and can't handle every screen size gracefully.</p>`,
      code: `/* Responsive — fluid grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* Media query breakpoints */
@media (max-width: 768px) {
  .sidebar { display: none; }
}`,
    },
    {
      concept: 'Gap between two 50% buttons',
      explanation: 'Two buttons at 50% each leaves no room for a gap. Solutions: use calc(), use gap in flexbox (which doesn\'t add to element widths), or use CSS custom properties.',
      code: `/* ✅ Flexbox gap — gap is outside the 50% width */
.row {
  display: flex;
  gap: 12px;
}
.row button {
  flex: 1;  /* each takes equal share of remaining space after gap */
}

/* ✅ calc() if you must use percentage widths */
.row button {
  width: calc(50% - 6px);  /* 6px = half of 12px gap */
}`,
    },
    {
      concept: 'Tailwind CSS',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Utility-First Approach</p><p class="mb-3 text-gray-600">Compose styles by applying small, single-purpose classes directly in HTML — no context-switching between HTML and CSS files. You never write a class name, you just use utility tokens.</p><p class="font-semibold text-gray-800 mb-1">Production Bundle</p><p class="text-gray-600">PurgeCSS scans your source files at build time and removes any unused classes. The result is a tiny CSS bundle regardless of how many utilities Tailwind ships.</p>`,
      code: `<!-- Traditional CSS -->
<button class="btn-primary">Save</button>
.btn-primary { background: #3b82f6; color: white; padding: 8px 16px; border-radius: 8px; }

<!-- Tailwind — utilities in markup -->
<button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
  Save
</button>`,
    },
    {
      concept: 'SCSS — Nesting & Mixins',
      explanation: `<p class="font-semibold text-gray-800 mb-1">Nesting</p><p class="mb-3 text-gray-600">SCSS compiles to plain CSS. Nesting mirrors HTML structure but generates high-specificity selectors — limit to <strong>3 levels</strong> max to avoid specificity wars and tight coupling to markup.</p><p class="font-semibold text-gray-800 mb-1">Mixins</p><p class="text-gray-600">Reusable blocks of CSS declarations, optionally parameterised. Define once with <code>@mixin</code>, include anywhere with <code>@include</code>. Great for responsive breakpoints, flex-center patterns, or themed shadows.</p>`,
      code: `// Nesting — limit to 3 levels
.card {
  padding: 1rem;

  &__title {       // BEM — compiles to .card__title
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

// Mixin — reusable, parameterised
@mixin flex-center($direction: row) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: $direction;
}

.hero { @include flex-center(column); }
.nav  { @include flex-center(); }`,
    },
  ],
  spokenAnswer: {
    question: 'You have two buttons side by side, each should be 50% width with a gap between them. How do you do it?',
    answer: `The classic trap here is setting both buttons to width 50% — they add up to 100% and there's no room for any gap. My preferred solution is flexbox. I put both buttons in a flex container with a gap property — gap adds space between flex children without affecting their widths, so each button gets flex: 1 and they share all available space equally after the gap is subtracted. The result is two equal-width buttons with clean spacing. If for some reason I need explicit percentage widths — say for a CSS grid fallback — I'd use calc(50% - 6px) where 6px is half the total gap, so both buttons together plus the gap add up to exactly 100%. But flexbox gap is cleaner and that's what I'd reach for first.`,
  },
  traps: [
    {
      trap: 'Deep SCSS nesting (more than 3 levels)',
      correction: 'Deep nesting generates high-specificity selectors like .card .header .title .link that are hard to override and tightly coupled to HTML structure. Keep nesting to 2–3 levels max. Use BEM naming for elements instead of nesting.',
    },
    {
      trap: 'Forgetting box-sizing: border-box causes layout bugs',
      correction: 'The default box-sizing: content-box means padding and border add to the declared width, breaking percentage-based layouts. Apply box-sizing: border-box globally with the * selector and it eliminates an entire class of layout calculation bugs.',
    },
    {
      trap: 'Using position: absolute without a positioned ancestor',
      correction: 'An absolutely positioned element anchors to the nearest ancestor with any position value other than static. If no ancestor is positioned, it anchors to the viewport. Always set position: relative on the intended parent.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'An element has width: 200px, padding: 20px, border: 2px solid, box-sizing: content-box. What is its rendered width?',
      options: ['200px', '242px', '244px', '222px'],
      correct: 2,
      explanation: 'content-box: width = content(200) + padding-left(20) + padding-right(20) + border-left(2) + border-right(2) = 244px.',
    },
    {
      id: 2,
      question: 'Which position value removes an element from the document flow and anchors it to the viewport?',
      options: ['relative', 'absolute', 'sticky', 'fixed'],
      correct: 3,
      explanation: 'fixed removes the element from flow and positions it relative to the viewport — it stays in place when the page scrolls. absolute positions relative to the nearest non-static ancestor.',
    },
    {
      id: 3,
      question: 'What is the cleanest way to add a 12px gap between two flex children without using margin?',
      options: [
        'Set width: calc(50% - 6px) on each child',
        'Add gap: 12px to the flex container',
        'Add padding: 6px to each child',
        'Use justify-content: space-between on the container',
      ],
      correct: 1,
      explanation: 'gap on a flex/grid container adds space between children without affecting their size or requiring margin hacks. It is the modern, clean solution.',
    },
  ],
}
