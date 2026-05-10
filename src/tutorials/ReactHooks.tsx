import LessonsAndQuizTutorial from '../components/LessonsAndQuizTutorial'
import { reactHooksLessons, reactHooksQuizzes } from '../data/tutorials/react-hooks-data'

export default function ReactHooksTutorial() {
  return (
    <LessonsAndQuizTutorial
      icon="🪝"
      title="React Hooks — Complete Guide & Interview Prep"
      subtitle="useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, useLayoutEffect — with interview Q&A for each."
      lessons={reactHooksLessons}
      quizzes={reactHooksQuizzes}
    />
  )
}
