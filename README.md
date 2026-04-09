# StudyPal - Interactive Learning Platform

A modern, interactive learning application built with **React**, **TypeScript**, and **Tailwind CSS**. Start with HTML Accessibility and expand with more tutorials!

## Features

✨ **Interactive Learning**
- Structured lessons with clear explanations
- Multiple-choice quizzes to test knowledge
- Hands-on code challenges to practice

📊 **Progress Tracking**
- Visual progress bar showing completion status
- Track completed lessons, quizzes, and challenges

🎓 **HTML Accessibility Tutorial**
- Semantic HTML Basics
- Heading Hierarchy
- Images & Alt Text
- Form Accessibility

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
study-pal/
├── src/
│   ├── components/
│   │   ├── Lesson.tsx           # Lesson display component
│   │   ├── Quiz.tsx             # Interactive quiz component
│   │   └── CodeChallenge.tsx    # Code challenge component
│   ├── tutorials/
│   │   └── HTMLAccessibility.tsx # HTML Accessibility tutorial content
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind CSS imports
├── index.html                   # HTML template
├── package.json                 # Project dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript Node configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## How to Use

1. **Browse Tutorials**: Select "HTML Accessibility" from the home page
2. **Learn**: Read through interactive lessons with code examples
3. **Quiz**: Test your understanding with multiple-choice questions
4. **Challenge**: Complete hands-on code challenges
5. **Track Progress**: Watch your progress bar fill as you complete sections

## Tutorial Structure

Each tutorial follows this pattern:
- **Lessons**: Learn concepts with examples
- **Quizzes**: Answer questions after each lesson
- **Challenges**: Write or modify code to practice

## Adding New Tutorials

To add a new tutorial:

1. Create a new file in `src/tutorials/`
2. Define lessons, quizzes, and challenges
3. Add it to the tutorials list in `App.jsx`

Example structure:
```jsx
const lessons = [
  {
    id: 1,
    title: 'Topic Name',
    content: `<h2>Content HTML</h2>...`,
    type: 'lesson'
  }
]

const quizzes = [
  {
    id: 1,
    title: 'Quiz Title',
    afterLesson: 1,
    questions: [...]
  }
]

const challenges = [
  {
    id: 1,
    title: 'Challenge Title',
    afterLesson: 1,
    description: 'Description',
    startCode: '...',
    solution: '...',
    hints: [...]
  }
]
```

## Technologies

- **React 18**: UI library
- **TypeScript 5.3**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server with TypeScript support

## License

MIT
