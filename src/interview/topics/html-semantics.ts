import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: 'html-semantics',
  title: 'HTML Semantics & SEO',
  icon: '🏷️',
  difficulty: 'Core',
  targets: ['General'],
  keyPoints: [
    'Semantic elements = meaning for screen readers + SEO',
    'One h1 per page — primary topic signal',
    'section vs div: section has meaning, div is a container',
    'id = unique + high specificity; class = reusable + low specificity',
    'Specificity order: inline > id > class > element',
  ],
  cheatSheet: [
    {
      concept: 'section vs div',
      explanation: '<section> is a semantic landmark — it groups related content with a heading and appears in screen reader navigation. <div> is a generic layout container with no semantic meaning. Use semantic elements whenever the content has a distinct meaning.',
      code: `<!-- ❌ div soup — no semantic meaning -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="content">...</div>

<!-- ✅ Semantic HTML -->
<header>...</header>
<nav>...</nav>
<main>
  <article>
    <section>
      <h2>Related group of content</h2>
    </section>
  </article>
</main>
<aside>...</aside>
<footer>...</footer>`,
    },
    {
      concept: 'div vs span',
      explanation: '<div> is a block-level element — it starts on a new line and takes full width. <span> is inline — it flows with surrounding text. Both are non-semantic; use them only when no semantic element fits.',
      code: `<!-- div — block, causes line break -->
<div>This is a block</div>

<!-- span — inline, flows with text -->
<p>Price: <span class="highlight">$99</span> only</p>`,
    },
    {
      concept: 'id vs class',
      explanation: 'id must be unique per page — used for anchors, JS getElementById, and high-specificity CSS. class is reusable across multiple elements — used for styling and grouping. Never use id for styling components you might reuse.',
      code: `<!-- id — unique, high specificity (0,1,0,0) -->
<div id="main-hero">...</div>
document.getElementById('main-hero')

<!-- class — reusable, lower specificity (0,0,1,0) -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary">Cancel</button>`,
    },
    {
      concept: 'SEO-relevant HTML',
      explanation: 'Search engines parse HTML structure. Key signals: correct heading hierarchy (one h1 per page), meta description, semantic landmarks, alt text on images, and structured data (schema.org).',
      code: `<head>
  <title>Angular Best Practices | StudyPal</title>
  <meta name="description" content="Learn Angular best practices with interactive lessons.">
  <meta property="og:title" content="StudyPal">
</head>
<body>
  <h1>One h1 per page — your main topic</h1>
  <h2>Section headings</h2>
  <img src="hero.png" alt="Developer writing Angular code">
</body>`,
    },
    {
      concept: 'CSS Specificity',
      explanation: 'The browser resolves conflicting rules by specificity score: inline styles (1,0,0,0) > id (0,1,0,0) > class/attribute/pseudo-class (0,0,1,0) > element/pseudo-element (0,0,0,1). Higher score wins regardless of order.',
      code: `/* Specificity: 0,0,0,1 */
p { color: black; }

/* Specificity: 0,0,1,0 — wins over p */
.text { color: blue; }

/* Specificity: 0,1,0,0 — wins over .text */
#hero { color: red; }

/* Inline — wins over everything except !important */
<p style="color: green">

/* !important — nuclear option, avoid */
p { color: purple !important; }`,
    },
  ],
  spokenAnswer: {
    question: 'What is the difference between semantic HTML and div soup, and why does it matter?',
    answer: `Semantic HTML means using elements that describe the meaning of the content — header, nav, main, article, section, aside, footer — rather than using divs for everything. It matters for three reasons: accessibility, where screen readers use landmarks to help users navigate the page; SEO, where search engines give more weight to content inside semantic elements and use heading structure to understand the page hierarchy; and maintainability, where a developer reading semantic HTML immediately understands the structure without reading class names. Div soup — where everything is a div with a class — is readable only if you already know the design. I use divs only when I genuinely need a layout container with no semantic meaning, and I always use a single h1 per page with a logical heading hierarchy below it.`,
  },
  traps: [
    {
      trap: 'Using multiple h1 tags on one page',
      correction: 'One h1 per page is the heading that describes the page\'s primary topic — it is the most important SEO signal. Use h2–h6 for subsections in a logical hierarchy. Multiple h1s confuse both screen readers and search engines.',
    },
    {
      trap: 'Confusing CSS specificity order with source order',
      correction: 'Source order (which rule comes last) only matters when specificity scores are equal. A class rule written first always beats an element rule written last. Fix specificity wars by keeping all selectors at the same level — use classes, not ids or !important.',
    },
    {
      trap: 'Using id selectors for styling reusable components',
      correction: 'id has high specificity and must be unique — if you add a second instance of the component, the id is invalid and the style is unpredictable. Use classes for all styling.',
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'What is the specificity of the selector "#nav .link:hover"?',
      options: ['0,0,2,0', '0,1,2,0', '0,1,1,0', '1,0,1,0'],
      correct: 1,
      explanation: '#nav contributes 0,1,0,0. .link contributes 0,0,1,0. :hover is a pseudo-class contributing 0,0,1,0. Total: 0,1,2,0.',
    },
    {
      id: 2,
      question: 'Which element is the correct choice for the primary page heading that search engines weight most?',
      options: ['<div class="heading">', '<strong>', '<h1>', '<header>'],
      correct: 2,
      explanation: '<h1> is the primary heading element. Search engines treat it as the strongest signal for page topic. <header> is a landmark element — it can contain the h1 but is not itself a heading.',
    },
    {
      id: 3,
      question: 'Two CSS rules target the same element: one uses a class selector, the other uses an id selector. The class rule is written after the id rule. Which wins?',
      options: [
        'The class rule — it comes later in the file',
        'The id rule — it has higher specificity regardless of order',
        'They cancel each other out',
        'Depends on the browser',
      ],
      correct: 1,
      explanation: 'id specificity (0,1,0,0) beats class specificity (0,0,1,0) regardless of source order. Source order is the tiebreaker only when specificity scores are equal.',
    },
  ],
}
