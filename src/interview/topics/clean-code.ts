import type { IInterviewTopic } from '../types'

export const topic: IInterviewTopic = {
  id: "clean-code",
  title: "Clean Code",
  icon: "✨",
  difficulty: "Core",
  targets: ['General'],
  keyPoints: [
    'Functions do one thing — if you need "and" in the name, split it',
    'Names should reveal intent — no abbreviations, no comments to explain variable names',
    'Avoid deep nesting — early returns flatten the happy path',
    'DRY: extract repeated logic, but only after the third repetition',
    'Leave the code better than you found it — Boy Scout Rule',
  ],
  cheatSheet: [
    {
      concept: "Single Responsibility Principle",
      explanation:
        'A function or class should have one reason to change. If you can describe what it does with "and", it has two responsibilities.',
      code: `// ❌ Two responsibilities — data fetching AND formatting
function getUserLabel(id: number): Promise<string> {
  return fetch('/users/' + id)
    .then(r => r.json())
    .then(u => u.firstName + ' ' + u.lastName)
}

// ✅ Separated
async function fetchUser(id: number): Promise<User> {
  return fetch('/users/' + id).then(r => r.json())
}

function formatUserLabel(user: User): string {
  return user.firstName + ' ' + user.lastName
}`,
    },
    {
      concept: "Naming — Intention-Revealing",
      explanation:
        "Names should explain WHY, not WHAT. Avoid abbreviations, generic names (data, info, temp), and boolean negatives.",
      code: `// ❌ Cryptic
const d = new Date()
const chk = usr.a && !usr.b

// ✅ Self-documenting
const createdAt = new Date()
const isEligibleForDiscount = user.isVerified && !user.hasUsedPromo

// ❌ Boolean negation
if (!isNotAdmin) { ... }   // double negative — confusing

// ✅
if (isAdmin) { ... }`,
    },
    {
      concept: "Small Functions, Single Level of Abstraction",
      explanation:
        "Functions should do one thing at one level of abstraction. Mix of high-level logic and low-level detail in one function makes it hard to read and change.",
      code: `// ❌ Mixed abstraction levels
function processOrder(order: Order) {
  // high level
  validateOrder(order)
  // low level — doesn't belong here
  const tax = order.total * 0.2
  const rounded = Math.round(tax * 100) / 100
  order.tax = rounded
  // back to high level
  saveOrder(order)
  sendConfirmationEmail(order)
}

// ✅ Consistent abstraction
function processOrder(order: Order) {
  validateOrder(order)
  applyTax(order)
  saveOrder(order)
  sendConfirmationEmail(order)
}`,
    },
    {
      concept: "Avoid Magic Numbers and Strings",
      explanation:
        "Unexplained literals in code hide intent and make changes error-prone. Extract to named constants.",
      code: `// ❌ Magic numbers
if (user.score > 750) grantAccess()
setTimeout(refresh, 86400000)

// ✅ Named constants
const CREDIT_SCORE_THRESHOLD = 750
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (user.score > CREDIT_SCORE_THRESHOLD) grantAccess()
setTimeout(refresh, ONE_DAY_MS)`,
    },
  ],
  spokenAnswer: {
    question:
      "What does clean code mean to you and how do you apply it day to day?",
    answer: `To me clean code means code that another developer can read and understand without having to ask me what it does or why. The most impactful practice is naming — if I spend an extra 30 seconds finding a name that clearly expresses intent, I save the next reader minutes of mental work. I keep functions small and focused: if a function does two things, I split it. I avoid comments that explain what the code does — good names should do that — and instead write comments only when the why is non-obvious: a workaround for a specific browser bug, a regulatory constraint, a performance invariant. For pull reviews I look for magic numbers, deeply nested conditions, functions that mix abstraction levels, and any place where I have to read three more functions to understand the one I'm looking at. I also treat tests as first-class documentation — a well-named test tells you what the code is supposed to do without reading the implementation.`,
  },
  traps: [
    {
      trap: "Writing comments to explain what complex code does instead of simplifying the code",
      correction:
        "A comment that translates convoluted code into English is a signal to refactor the code. The comment will go stale; the code won't. Rename, extract a function, or restructure until the code explains itself.",
    },
    {
      trap: "DRY taken too far — abstracting things that only look similar",
      correction:
        "Two pieces of code that look the same now may diverge in the future. Premature abstraction creates coupling — changing the shared function breaks both callers. Wait until you have three or more actual duplications with proven identical semantics before abstracting.",
    },
  ],
  quiz: [
    {
      id: 1,
      question:
        'A function is named "processData". What is wrong with this name?',
      options: [
        "It is too short",
        "It is too generic — it reveals no intention about what data or what processing",
        "It should start with a capital letter",
        "Functions should be named with nouns, not verbs",
      ],
      correct: 1,
      explanation:
        "processData tells you nothing about what data or what process. A name like validateAndSaveUserProfile, or better yet two separate functions validateUserProfile and saveUserProfile, reveals actual intent.",
    },
    {
      id: 2,
      question: "When is the right time to add a comment to code?",
      options: [
        "Before every function to document its purpose",
        "Only when the WHY is non-obvious — a workaround, constraint, or surprising invariant",
        "Whenever the code is longer than 5 lines",
        "Never — code should always be self-explanatory without comments",
      ],
      correct: 1,
      explanation:
        "Comments explaining WHAT the code does are a smell — the code should do that. Comments explaining WHY add genuine value: a browser workaround, a regulatory requirement, a performance constraint that isn't obvious from the code.",
    },
  ],
}
