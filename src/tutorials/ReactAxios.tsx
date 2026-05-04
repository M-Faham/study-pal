import LessonsAndQuizTutorial from '../components/LessonsAndQuizTutorial'
import { reactAxiosLessons, reactAxiosQuizzes } from '../data/tutorials/react-axios-data'

export default function ReactAxiosTutorial() {
  return (
    <LessonsAndQuizTutorial
      icon="🌐"
      title="Axios in React — Best Practices & Advanced"
      subtitle="Instances, interceptors, error handling, cancellation, upload progress, and React Query integration."
      lessons={reactAxiosLessons}
      quizzes={reactAxiosQuizzes}
    />
  )
}
