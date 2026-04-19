import LessonsOnlyTutorial from '../components/LessonsOnlyTutorial'
import { reactFormsLessons } from '../data/tutorials/react-forms-data'

export default function ReactFormsTutorial() {
  return (
    <LessonsOnlyTutorial
      icon="📝"
      title="React Forms — Crash Course"
      subtitle="Controlled inputs, form state, Zod validation, React Hook Form and async submission."
      lessons={reactFormsLessons}
    />
  )
}
