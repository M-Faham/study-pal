import LessonsOnlyTutorial from '../components/LessonsOnlyTutorial'
import { reactLocalizationLessons } from '../data/tutorials/react-localization-data'

export default function ReactLocalizationTutorial() {
  return (
    <LessonsOnlyTutorial
      icon="🌍"
      title="React Localization (i18n) — Crash Course"
      subtitle="Internationalization, react-i18next setup, plurals, RTL support and Intl formatting."
      lessons={reactLocalizationLessons}
    />
  )
}
