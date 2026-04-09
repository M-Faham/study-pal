# 📑 Project Index

## Quick Navigation

### 🎯 Start Here
- **[START_HERE.md](START_HERE.md)** - Overview & learning paths
- **[QUICK_START.md](QUICK_START.md)** - Get started in 2 minutes

### 📚 Learning Resources
- **[LEARNING_GUIDE.md](LEARNING_GUIDE.md)** - Learn React patterns with exercises
- **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)** - What was refactored & why
- **[BEFORE_AND_AFTER.md](BEFORE_AND_AFTER.md)** - See the transformation
- **[SUMMARY.md](SUMMARY.md)** - Project summary & metrics

### 📖 Reference
- **[README.md](README.md)** - Project overview
- **[FINDINGS.md](FINDINGS.md)** - Original analysis of issues

---

## 📁 Source Code Structure

### Core Application
```
src/
├── App.tsx                 - Main app component
├── main.tsx               - React entry point
```

### Types & Configuration
```
src/types/
└── tutorial.ts            - Type definitions (ILesson, IQuiz, ICodeChallenge, etc)

src/constants/
└── quiz.ts               - Constants & configuration
```

### Data (Content)
```
src/data/tutorials/
└── html-accessibility-data.ts  - Tutorial content (lessons, quizzes, challenges)
```

### Components (UI)
```
src/components/
├── Quiz.tsx              - Quiz container component
├── QuizQuestion.tsx      - Single question presenter
├── QuizResults.tsx       - Results summary
├── CodeChallenge.tsx     - Code challenge container
├── CodeEditor.tsx        - Code input component
├── HintPanel.tsx         - Hints display
├── SolutionPanel.tsx     - Solution display
└── Lesson.tsx           - Lesson content display
```

### Features
```
src/tutorials/
└── HTMLAccessibility.tsx  - HTML Accessibility tutorial orchestration
```

---

## 🎓 Learning Path

### Level 1: Understand the Architecture (30 minutes)
1. Read **START_HERE.md**
2. Read **QUICK_START.md**
3. Read **SUMMARY.md**
4. Run: `npm run dev`

### Level 2: Learn the Patterns (1-2 hours)
1. Read **LEARNING_GUIDE.md**
2. Study `src/types/tutorial.ts`
3. Study `src/constants/quiz.ts`
4. Study `src/data/tutorials/html-accessibility-data.ts`

### Level 3: Deep Dive into Components (2-3 hours)
1. Read **REFACTORING_COMPLETE.md**
2. Study component files in order:
   - `src/components/Lesson.tsx` (simplest)
   - `src/components/HintPanel.tsx`
   - `src/components/CodeEditor.tsx`
   - `src/components/Quiz.tsx` (container pattern)
   - `src/components/CodeChallenge.tsx` (composition)
3. Study `src/tutorials/HTMLAccessibility.tsx` (orchestration)

### Level 4: Understand the Transformation (1 hour)
1. Read **BEFORE_AND_AFTER.md**
2. Read **FINDINGS.md**
3. Compare old vs new approach mentally

### Level 5: Practice (1-2 hours)
1. Do exercises from **LEARNING_GUIDE.md**
2. Modify components
3. Create a new tutorial

---

## 📊 File Statistics

| Type | Count | Lines |
|------|-------|-------|
| Type definitions | 1 | 133 |
| Constants | 1 | 77 |
| Data files | 1 | 332 |
| Components | 8 | 540 |
| Tutorials | 1 | 171 |
| Main app | 1 | 64 |
| Entry | 1 | 10 |
| **Total** | **14** | **1,327** |

---

## 🔍 What Each File Teaches

### `src/types/tutorial.ts`
- Type definitions and design
- Discriminated unions
- Type-driven development
- **Read when**: You want to understand the data model

### `src/constants/quiz.ts`
- Extracting magic numbers
- Configuration management
- Named constants
- **Read when**: You want to understand constants pattern

### `src/data/tutorials/html-accessibility-data.ts`
- Data organization
- Separation of concerns
- Content structure
- **Read when**: You want to understand data layer

### `src/components/Lesson.tsx`
- Simple presentation component
- dangerouslySetInnerHTML warnings
- Props pattern
- **Read when**: You're learning basic components

### `src/components/HintPanel.tsx`
- Display component
- Conditional rendering
- Progressive disclosure
- **Read when**: You're learning UI patterns

### `src/components/CodeEditor.tsx`
- Controlled component pattern
- Input handling
- Props flowing down
- **Read when**: You're learning controlled components

### `src/components/Quiz.tsx`
- Container component
- State management
- Orchestrating subcomponents
- **Read when**: You're learning container pattern

### `src/components/QuizQuestion.tsx`
- Presenter component
- Props and callbacks
- Receiving data, calling events
- **Read when**: You're learning presenter pattern

### `src/components/CodeChallenge.tsx`
- Component composition
- Multiple subcomponents
- State orchestration
- **Read when**: You're building complex components

### `src/tutorials/HTMLAccessibility.tsx`
- Tutorial orchestration
- Content flow management
- Discriminated unions in action
- **Read when**: You're learning orchestration pattern

### `src/App.tsx`
- Application structure
- Tutorial selection
- Top-level state
- **Read when**: You're understanding app architecture

---

## 🎯 Use Cases

### "I want to understand React best practices"
→ Read: START_HERE → LEARNING_GUIDE → Code with comments

### "I want to extend this app"
→ Read: QUICK_START → `src/data/tutorials/html-accessibility-data.ts` → Create new data file

### "I want to see the refactoring"
→ Read: BEFORE_AND_AFTER → REFACTORING_COMPLETE → Compare files

### "I want to learn component patterns"
→ Read: LEARNING_GUIDE → Study components in order

### "I want a reference for my own projects"
→ Bookmark relevant files → Copy patterns → Adapt to your needs

---

## 🚀 Quick Commands

```bash
# Install and run
npm install
npm run dev              # http://localhost:3000

# Build for production
npm run build
npm run preview
```

---

## 📚 Documentation Map

```
START_HERE.md (entry point)
    ├── QUICK_START.md (5 min read)
    ├── SUMMARY.md (10 min read)
    ├── LEARNING_GUIDE.md (30 min read)
    │   ├── BEFORE_AND_AFTER.md (15 min)
    │   └── Code comments (60 min)
    ├── REFACTORING_COMPLETE.md (20 min)
    ├── FINDINGS.md (reference)
    └── README.md (reference)
```

---

## 💡 Pro Tips

1. **Start with START_HERE.md** - It's written to guide you
2. **Read comments in code** - They explain the WHY
3. **Run the app first** - See how it works
4. **Try the exercises** - Hands-on learning
5. **Modify the code** - Break things to learn
6. **Build something** - Best way to learn

---

**Ready to learn? Start with [START_HERE.md](START_HERE.md) →**
