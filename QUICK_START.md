# 🚀 Quick Start Guide

## What You Have

A refactored React + TypeScript learning platform with **detailed comments explaining best practices**.

## Getting Started (2 minutes)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Open http://localhost:3000
```

## What to Read First (10 minutes)

1. **[LEARNING_GUIDE.md](LEARNING_GUIDE.md)** - Best practices explained with examples
2. **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)** - What was changed and why
3. **[BEFORE_AND_AFTER.md](BEFORE_AND_AFTER.md)** - See the transformation

## Key Files to Study

### Core Concepts
- `src/types/tutorial.ts` - Type system (Single Source of Truth)
- `src/constants/quiz.ts` - Constants (Magic Numbers → Named Values)
- `src/data/tutorials/html-accessibility-data.ts` - Data Separation

### Component Patterns
- `src/components/Quiz.tsx` → Container Component
- `src/components/QuizQuestion.tsx` → Presenter Component
- `src/components/CodeEditor.tsx` → Controlled Component
- `src/tutorials/HTMLAccessibility.tsx` → Orchestration Pattern

## Project Structure

```
src/
├── types/
│   └── tutorial.ts                    ← Type definitions
├── constants/
│   └── quiz.ts                        ← Magic numbers & config
├── data/
│   └── tutorials/
│       └── html-accessibility-data.ts ← Content (no logic)
├── components/                        ← Reusable UI pieces
│   ├── Quiz.tsx                       ← Container
│   ├── QuizQuestion.tsx               ← Presenter
│   ├── QuizResults.tsx                ← Presenter
│   ├── CodeChallenge.tsx              ← Container
│   ├── CodeEditor.tsx                 ← Controlled input
│   ├── HintPanel.tsx                  ← Display
│   ├── SolutionPanel.tsx              ← Display
│   └── Lesson.tsx                     ← Display
├── tutorials/
│   └── HTMLAccessibility.tsx          ← Orchestration
├── App.tsx                            ← Main app
└── main.tsx                           ← Entry point
```

## React Best Practices Demonstrated

✅ **Single Responsibility Principle** - Each component does one thing
✅ **Separation of Concerns** - Data ≠ Logic ≠ Presentation
✅ **Type Safety** - TypeScript interfaces everywhere
✅ **Props Over State** - Controlled components
✅ **Derived State** - Calculate instead of store
✅ **Callback Props** - Clear parent-child communication
✅ **Pure Functions** - Reusable, testable logic
✅ **Constants** - Named values, not magic numbers
✅ **Detailed Comments** - Learn WHY code is structured this way

## Next Steps

### 1. Run It
```bash
npm run dev
```
Use the tutorial and see how it works.

### 2. Read the Code
Start with `src/App.tsx`, follow the flow to components.
Comments explain each pattern.

### 3. Modify It
Try the exercises in [LEARNING_GUIDE.md](LEARNING_GUIDE.md):
- Add a new question type
- Create a new tutorial
- Add a feature

### 4. Build Your Own
Create your own tutorial using this as a template:
1. Create data file: `src/data/tutorials/your-topic-data.ts`
2. Create tutorial: `src/tutorials/YourTopic.tsx`
3. Add to `App.tsx`

## Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Build for production
npm run build        # Creates optimized build in dist/

# Preview production build
npm run preview      # Serve the build locally
```

## Documentation Files

| File | Purpose |
|------|---------|
| **[LEARNING_GUIDE.md](LEARNING_GUIDE.md)** | How to learn from this code |
| **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)** | What was refactored and why |
| **[BEFORE_AND_AFTER.md](BEFORE_AND_AFTER.md)** | See the transformation |
| **[FINDINGS.md](FINDINGS.md)** | Original analysis of issues |
| **[README.md](README.md)** | Project overview |

## Key Concepts

### Types (Single Source of Truth)
```tsx
// Define once in src/types/tutorial.ts
export interface IQuiz { ... }

// Use everywhere
import { IQuiz } from '../types/tutorial'
```

### Data Separation
```tsx
// Content in src/data/tutorials/
export const htmlAccessibilityLessons = [...]

// Components in src/components/
export default function Quiz({ quiz }) { ... }

// Orchestration in src/tutorials/
import { htmlAccessibilityLessons } from '../data/...'
```

### Props Flow
```tsx
// Parent owns state
const [code, setCode] = useState('')

// Pass down as props
<CodeEditor code={code} onCodeChange={setCode} />

// Child calls callback when changed
<textarea onChange={e => onCodeChange(e.target.value)} />
```

## Learning Path

1. **Understand Types** (5 min) → `src/types/tutorial.ts`
2. **See Data Separation** (5 min) → `src/data/tutorials/html-accessibility-data.ts`
3. **Study Components** (15 min) → `src/components/*.tsx`
4. **Understand Flow** (10 min) → `src/tutorials/HTMLAccessibility.tsx`
5. **Read Comments** (20 min) → Every file has detailed explanations
6. **Try Exercises** (30 min) → From [LEARNING_GUIDE.md](LEARNING_GUIDE.md)

## Troubleshooting

### Port already in use
```bash
# Use different port
npm run dev -- --port 3001
```

### TypeScript errors
```bash
# Rebuild
npm run build
```

### Need to clear cache
```bash
rm -rf node_modules/.vite
npm run dev
```

## Questions?

Read the relevant documentation:
- **How do components work?** → [LEARNING_GUIDE.md](LEARNING_GUIDE.md)
- **Why was this changed?** → [BEFORE_AND_AFTER.md](BEFORE_AND_AFTER.md)
- **What problems were there?** → [FINDINGS.md](FINDINGS.md)

## Have Fun! 🎓

This codebase is designed as a learning resource. Every file has comments explaining:
- What the code does
- Why it's structured this way
- What React best practice it demonstrates

**Read the comments, run the code, modify it, break it, fix it. That's how you learn! 💡**
