/**
 * BEST PRACTICE: Separating Data from Logic
 *
 * This file contains ONLY data - lesson content, quiz questions, challenge specs.
 * No React components, no hooks, no state management.
 *
 * Why separate data from components?
 * 1. Data can be updated without touching component logic
 * 2. Easy to test data independently
 * 3. Can load from API/CMS instead of hardcoding (just replace this file)
 * 4. Components stay focused on rendering, not managing content
 *
 * This pattern scales well: add new tutorials by creating new data files,
 * components handle the presentation for all tutorials the same way.
 */

import { ILesson, IQuiz, ICodeChallenge } from '../../types/tutorial'

/**
 * HTML Accessibility Tutorial - Lessons
 *
 * BEST PRACTICE: Organizing related data
 * - Keep lessons in logical order
 * - Each lesson is self-contained
 * - Content can be HTML (will be rendered with dangerouslySetInnerHTML)
 *   ⚠️  WARNING: Only do this with trusted content. Never render user input this way!
 */
export const htmlAccessibilityLessons: ILesson[] = [
  {
    id: 1,
    title: 'Semantic HTML Basics',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">What is Semantic HTML?</h2>
      <p class="mb-4">Semantic HTML uses meaningful tags that describe the content they contain, making code more readable and accessible.</p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">Key Semantic Elements:</p>
        <ul class="list-disc ml-5 space-y-2">
          <li><code class="bg-gray-200 px-2 py-1">&lt;header&gt;</code> - Page or section header</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;nav&gt;</code> - Navigation links</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;main&gt;</code> - Main content</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;article&gt;</code> - Self-contained content</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;section&gt;</code> - Thematic grouping</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;aside&gt;</code> - Sidebar content</li>
          <li><code class="bg-gray-200 px-2 py-1">&lt;footer&gt;</code> - Footer content</li>
        </ul>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <p class="font-bold mb-2">✓ Good Example:</p>
        <pre class="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm"><code>&lt;header&gt;
  &lt;h1&gt;My Website&lt;/h1&gt;
  &lt;nav&gt;
    &lt;ul&gt;
      &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;h2&gt;Article Title&lt;/h2&gt;
    &lt;p&gt;Content here...&lt;/p&gt;
  &lt;/article&gt;
&lt;/main&gt;</code></pre>
      </div>
    `,
  },
  {
    id: 2,
    title: 'Heading Hierarchy',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">Understanding Heading Hierarchy</h2>
      <p class="mb-4">Proper heading structure helps screen readers navigate and understand page content.</p>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
        <p class="font-bold mb-2">❌ Wrong:</p>
        <pre class="bg-gray-800 text-red-400 p-3 rounded text-sm"><code>&lt;h1&gt;Page Title&lt;/h1&gt;
&lt;h3&gt;Subsection&lt;/h3&gt;
&lt;h2&gt;Another Section&lt;/h2&gt;</code></pre>
      </div>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-2">✓ Correct:</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>&lt;h1&gt;Page Title&lt;/h1&gt;
&lt;h2&gt;Main Section&lt;/h2&gt;
&lt;h3&gt;Subsection&lt;/h3&gt;
&lt;h2&gt;Another Section&lt;/h2&gt;</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="font-bold mb-2">Rules:</p>
        <ul class="list-disc ml-5 space-y-2">
          <li>Only one &lt;h1&gt; per page</li>
          <li>Don't skip heading levels</li>
          <li>Use headings to structure content logically</li>
          <li>Avoid using headings for styling</li>
        </ul>
      </div>
    `,
  },
  {
    id: 3,
    title: 'Images & Alt Text',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">Making Images Accessible</h2>
      <p class="mb-4">Alt text describes images for screen reader users and displays when images fail to load.</p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p class="font-bold mb-2">Good Alt Text Guidelines:</p>
        <ul class="list-disc ml-5 space-y-2">
          <li>Be descriptive but concise</li>
          <li>Don't start with "image of" or "picture of"</li>
          <li>For decorative images, use empty alt: alt=""</li>
          <li>Include relevant context</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-red-50 border-l-4 border-red-500 p-4">
          <p class="font-bold mb-2">❌ Bad:</p>
          <pre class="bg-gray-800 text-red-400 p-3 rounded text-sm"><code>&lt;img src="dog.jpg"
     alt="dog" /&gt;
&lt;img src="logo.png"
     alt="image" /&gt;</code></pre>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-4">
          <p class="font-bold mb-2">✓ Good:</p>
          <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>&lt;img src="dog.jpg"
     alt="Golden retriever running
            in a park" /&gt;
&lt;img src="logo.png"
     alt="" /&gt;</code></pre>
        </div>
      </div>
    `,
  },
  {
    id: 4,
    title: 'Form Accessibility',
    type: 'lesson',
    content: `
      <h2 class="text-2xl font-bold mb-4">Accessible Forms</h2>
      <p class="mb-4">Forms must be properly labeled and structured for keyboard and screen reader users.</p>

      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="font-bold mb-2">✓ Best Practices:</p>
        <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm"><code>&lt;form&gt;
  &lt;label for="email"&gt;Email:&lt;/label&gt;
  &lt;input id="email" type="email" /&gt;

  &lt;label for="message"&gt;Message:&lt;/label&gt;
  &lt;textarea id="message"&gt;&lt;/textarea&gt;

  &lt;button type="submit"&gt;
    Send
  &lt;/button&gt;
&lt;/form&gt;</code></pre>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <p class="font-bold mb-2">Key Points:</p>
        <ul class="list-disc ml-5 space-y-2">
          <li>Always use &lt;label&gt; with for attribute</li>
          <li>Match label's "for" with input's "id"</li>
          <li>Use proper input types (email, number, etc)</li>
          <li>Provide error messages for validation</li>
          <li>Support keyboard navigation (Tab, Enter)</li>
        </ul>
      </div>
    `,
  },
]

/**
 * HTML Accessibility Tutorial - Quizzes
 *
 * BEST PRACTICE: Quiz structure
 * - 'afterLesson' specifies when to show the quiz
 * - Each question has 4 options (0-based indexing)
 * - Explanations help users understand why an answer is correct/incorrect
 */
export const htmlAccessibilityQuizzes: IQuiz[] = [
  {
    id: 1,
    title: 'Semantic HTML Quiz',
    afterLesson: 1,
    type: 'quiz',
    questions: [
      {
        id: 1,
        question: 'Which element should contain the main content of a page?',
        options: ['<div>', '<main>', '<section>', '<article>'],
        correct: 1,
        explanation: '<main> should wrap the primary content of the page.',
      },
      {
        id: 2,
        question: 'What is the purpose of the <nav> element?',
        options: [
          'To style navigation links',
          'To group navigation links',
          'To create a sidebar',
          'To add JavaScript to links',
        ],
        correct: 1,
        explanation: '<nav> semantically groups navigation links together.',
      },
      {
        id: 3,
        question: 'Which is NOT a semantic HTML element?',
        options: ['<header>', '<div>', '<footer>', '<section>'],
        correct: 1,
        explanation: "<div> is not semantic. It's a generic container with no semantic meaning.",
      },
    ],
  },
  {
    id: 2,
    title: 'Heading Hierarchy Quiz',
    afterLesson: 2,
    type: 'quiz',
    questions: [
      {
        id: 1,
        question: 'How many <h1> elements should a page have?',
        options: ['Zero', 'One', 'Multiple', 'As many as needed'],
        correct: 1,
        explanation: 'A page should have exactly one <h1> element.',
      },
      {
        id: 2,
        question: 'What happens if you skip heading levels (like h1 to h3)?',
        options: [
          "Nothing, it doesn't matter",
          'It confuses screen reader users',
          'It makes the page invalid',
          'It automatically fills in the gap',
        ],
        correct: 1,
        explanation: 'Skipping levels confuses screen reader users about content structure.',
      },
    ],
  },
]

/**
 * HTML Accessibility Tutorial - Code Challenges
 *
 * BEST PRACTICE: Challenge structure
 * - 'startCode' is what users see initially
 * - 'solution' is the target they're working toward
 * - 'hints' guide them progressively without giving away the answer
 * - Comparison uses normalized code (whitespace-insensitive)
 */
export const htmlAccessibilityChallenges: ICodeChallenge[] = [
  {
    id: 1,
    title: 'Fix the Semantic HTML',
    afterLesson: 1,
    type: 'challenge',
    description: 'Convert this div-heavy code to use proper semantic HTML elements.',
    startCode: `<div class="header">
  <h1>My Blog</h1>
  <div class="nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
</div>

<div class="main-content">
  <div class="article">
    <h2>Article Title</h2>
    <p>Article content here...</p>
  </div>
</div>

<div class="footer">
  <p>&copy; 2024 My Blog</p>
</div>`,
    solution: `<header>
  <h1>My Blog</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h2>Article Title</h2>
    <p>Article content here...</p>
  </article>
</main>

<footer>
  <p>&copy; 2024 My Blog</p>
</footer>`,
    hints: [
      'Replace generic <div> elements with semantic tags',
      'Use <header> for the top section',
      'Use <nav> for navigation links',
      'Use <main> for the primary content',
      'Use <article> for independent content',
      'Use <footer> for the footer',
    ],
  },
  {
    id: 2,
    title: 'Write Proper Alt Text',
    afterLesson: 3,
    type: 'challenge',
    description: 'Add appropriate alt text to these images.',
    startCode: `<img src="sunset.jpg" alt="sunset" />
<img src="logo.png" alt="logo" />
<img src="chart.jpg" alt="chart" />
<img src="decoration.png" />`,
    solution: `<img src="sunset.jpg" alt="Golden sunset over the ocean with pink and orange clouds" />
<img src="logo.png" alt="StudyPal logo" />
<img src="chart.jpg" alt="Bar chart showing Q1 sales data with values ranging from $10k to $50k" />
<img src="decoration.png" alt="" />`,
    hints: [
      'Be descriptive and specific',
      'Include context and details',
      'For decorative images, use empty alt text',
      "Don't repeat the word \"image\" in alt text",
    ],
  },
]
