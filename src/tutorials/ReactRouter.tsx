import LessonsOnlyTutorial from '../components/LessonsOnlyTutorial'
import { reactRouterLessons } from '../data/tutorials/react-router-data'

export default function ReactRouterTutorial() {
  return (
    <LessonsOnlyTutorial
      icon="🗺️"
      title="React Router — Crash Course"
      subtitle="Client-side routing, dynamic params, nested layouts, guards and programmatic navigation."
      lessons={reactRouterLessons}
    />
  )
}
