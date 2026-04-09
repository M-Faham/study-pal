# 🎓 React Best Practices Learning Guide

This project is a learning resource. Each file has detailed comments explaining **why** code is structured the way it is.

## Start Here

### 1. **Understand the Type System** (5 min)
📄 `src/types/tutorial.ts`
- Shows how to define reusable types
- Demonstrates discriminated unions (type narrowing)
- Comments explain single source of truth concept

**What to learn:**
- Why define types in one place?
- How do discriminated unions work?
- What's the difference between data types and UI state types?

---

### 2. **See Data Separation** (5 min)
📄 `src/data/tutorials/html-accessibility-data.ts`
- Shows how to separate content from components
- Demonstrates structured data organization
- Comments explain why this matters

**What to learn:**
- How would you load this from an API instead?
- Why is data separate from components?
- How do you maintain content without recompiling?

---

### 3. **Extract Magic Numbers** (3 min)
📄 `src/constants/quiz.ts`
- Shows how to extract hardcoded values
- Demonstrates grouping related constants
- Comments explain the pattern

**What to learn:**
- Why avoid magic numbers in code?
- How to organize constants?
- How does this help with i18n (internationalization)?

---

### 4. **Study Component Decomposition** (10 min)
Read in this order:

1. **Quiz.tsx** (Container component)
   - Manages state
   - Orchestrates children
   - Handles business logic

2. **QuizQuestion.tsx** (Presenter component)
   - Displays single question
   - Receives data via props
   - Calls callbacks on interaction

3. **QuizResults.tsx** (Presenter component)
   - Shows results summary
   - Pure presentation
   - No state management

**What to learn:**
- Container vs Presenter pattern
- Why split components?
- How do callbacks enable parent-child communication?
- What's the difference between props (data) and callbacks (events)?

---

### 5. **See Controlled Components** (7 min)
📄 `src/components/CodeEditor.tsx`
📄 `src/components/CodeChallenge.tsx`

**The Pattern:**
```tsx
// Child: CodeEditor receives data from parent
<CodeEditor
  code={userCode}                    // ← data flows down
  onCodeChange={(newCode) => ...}    // ← events flow up
/>

// Parent: Owns state
const [userCode, setUserCode] = useState('')
const handleCodeChange = (newCode) => setUserCode(newCode)
```

**What to learn:**
- Why is parent-owned state better than child state?
- What's a controlled component?
- How does this prevent bugs?

---

### 6. **Understand Orchestration** (7 min)
📄 `src/tutorials/HTMLAccessibility.tsx`

Shows how to:
- Merge multiple data sources
- Route between different content types
- Track progress
- Orchestrate complex flows

**What to learn:**
- How to build a state machine (lesson → quiz → challenge)?
- How to handle multiple content types?
- How to track progress across steps?

---

### 7. **See It in Action** (5 min)
📄 `src/App.tsx`

The entry point. Shows:
- Tutorial selection
- Navigation between tutorials
- Minimal state management

**What to learn:**
- How to structure app-level state
- Simple vs complex components
- User experience flows

---

## 🎯 Patterns Explained

### Pattern 1: Container/Presenter (SRP)

```
Quiz (Container)
├── Quiz.tsx (60 lines)
│   └─ Logic & State
├── QuizQuestion (Presenter)
│   └─ QuizQuestion.tsx (40 lines)
│      └─ Display & Callbacks
└── QuizResults (Presenter)
    └─ QuizResults.tsx (35 lines)
       └─ Display only
```

**Why?**
- Container handles complex logic
- Presenters are simple and reusable
- Easy to test each part separately
- Easy to change UI without touching logic

---

### Pattern 2: Props Down, Events Up

```
Parent State
    ↓
Props (data flows down)
    ↓
Child Component
    ↓
Callback (events flow up)
    ↓
Parent Handler
    ↓
Parent State Update
```

**Why?**
- Single source of truth
- Parent always knows state
- Changes flow in one direction
- Easier to debug data flow

---

### Pattern 3: Data Separation

```
┌─ Component Code
│  ├─ App.tsx (React logic)
│  ├─ Quiz.tsx (State & flow)
│  └─ QuizQuestion.tsx (Display)
│
└─ Data Files
   ├─ types/tutorial.ts (Schemas)
   ├─ constants/quiz.ts (Config)
   └─ data/tutorials/html-accessibility-data.ts (Content)
```

**Why?**
- Content changes don't require code changes
- Same component can work with different data
- Easy to replace with API calls
- Content can be managed separately (CMS, etc)

---

### Pattern 4: Discriminated Unions

```tsx
type ITutorialStep = ILesson | IQuiz | ICodeChallenge

// TypeScript narrows type based on 'type' field
if (step.type === 'quiz') {
  // TypeScript now knows step: IQuiz
  step.questions  // ← available
}

if (step.type === 'lesson') {
  // TypeScript now knows step: ILesson
  step.content    // ← available
}
```

**Why?**
- Type-safe polymorphism
- No runtime checks needed
- IDE autocomplete works
- Catch errors at compile time

---

## 📝 Code Reading Checklist

When reading any component, ask:

- [ ] What data does it receive? (Props)
- [ ] What state does it manage? (useState)
- [ ] What callbacks does it use? (Handlers)
- [ ] What components does it render?
- [ ] How does it communicate with parent?
- [ ] What's its single responsibility?

---

## 🧪 Try These Exercises

### Exercise 1: Add a New Quiz Question Type
Add true/false questions to the quiz system.

**Steps:**
1. Update `IQuizQuestion` in `src/types/tutorial.ts`
2. Update quiz data in `src/data/tutorials/html-accessibility-data.ts`
3. Update `QuizQuestion.tsx` to handle the new type
4. Run `npm run build` to check for errors

**What you'll learn:** How types propagate through the system

---

### Exercise 2: Add a Progress Indicator
Show which quiz questions were answered correctly/incorrectly.

**Steps:**
1. Add state to track submissions in `Quiz.tsx`
2. Pass it to `QuizQuestion.tsx`
3. Update `QuizQuestion.tsx` to display indicators
4. Test it out

**What you'll learn:** State management and prop drilling

---

### Exercise 3: Create a New Tutorial
Add a "CSS Basics" tutorial.

**Steps:**
1. Copy `src/data/tutorials/html-accessibility-data.ts` → `css-basics-data.ts`
2. Update content, quizzes, challenges
3. Create `src/tutorials/CSSBasics.tsx` (copy from `HTMLAccessibility.tsx`)
4. Import and add to tutorials list in `App.tsx`

**What you'll learn:** How the system scales, data-driven content

---

## 🐛 Debugging Tips

### Print Component Props
```tsx
export default function Quiz({ quiz, onComplete }: QuizProps) {
  console.log('Quiz props:', { quiz, onComplete })
  // ...
}
```

### Track State Changes
```tsx
const [currentQuestion, setCurrentQuestion] = useState(0)

useEffect(() => {
  console.log('Current question changed to:', currentQuestion)
}, [currentQuestion])
```

### Check Type Errors
```bash
# TypeScript will show type errors on build
npm run build

# Or watch for changes
# (add to package.json: "watch": "tsc --watch")
```

---

## 📚 Further Reading

### React Concepts Used Here
- **Hooks:** useState, useReducer, useEffect
- **Components:** Functional components
- **Props:** Prop drilling, prop spreading
- **State Management:** Local state (useState)
- **Rendering:** Conditional rendering, lists
- **Events:** onClick handlers, form handling

### Patterns to Explore Next
- **Context API:** For global state without drilling
- **useReducer:** For complex state machines
- **Custom Hooks:** Extract reusable logic
- **Testing:** Jest, React Testing Library
- **Performance:** React.memo, useMemo, useCallback

---

## 🎯 Next Steps

1. **Run the app:** `npm run dev`
2. **Play with it:** Use the tutorial, see how it works
3. **Read the code:** Start with `src/App.tsx`, follow the flow
4. **Modify it:** Try the exercises above
5. **Break it:** Change things and see what breaks (learning!)
6. **Build:** Make your own tutorial

---

## 💡 Pro Tips

- **Use TypeScript:** Let the compiler help you
- **Keep components small:** One job per component
- **Name things clearly:** `handleSubmitAnswer` vs `doSomething`
- **Comments explain why:** Code shows what, comments explain why
- **Test behavior:** Not implementation details
- **Props are documentation:** Well-typed props are self-documenting

---

## 🤔 Think About

- How would you add animations?
- How would you persist progress to localStorage?
- How would you load content from an API?
- How would you add a difficulty level?
- How would you support multiple languages?
- How would you add unit tests?

Start simple, then evolve! 🚀
