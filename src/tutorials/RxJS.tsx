import LessonsAndQuizTutorial from '../components/LessonsAndQuizTutorial'
import { rxjsLessons, rxjsQuizzes } from '../data/tutorials/rxjs-data'

export default function RxJSTutorial() {
  return (
    <LessonsAndQuizTutorial
      icon="🔀"
      title="RxJS — Angular Interview Crash Course"
      subtitle="Observables, Subjects, operators (switchMap, mergeMap, combineLatest…), error handling and Angular patterns."
      lessons={rxjsLessons}
      quizzes={rxjsQuizzes}
    />
  )
}
