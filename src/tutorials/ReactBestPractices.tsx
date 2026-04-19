import LessonsOnlyTutorial from '../components/LessonsOnlyTutorial'
import { reactBestPracticesLessons } from '../data/tutorials/react-best-practices-data'

export default function ReactBestPracticesTutorial() {
  return (
    <LessonsOnlyTutorial
      icon="⭐"
      title="React Best Practices"
      subtitle="Component design, state management, performance optimisation, custom hooks and error boundaries."
      lessons={reactBestPracticesLessons}
    />
  )
}
