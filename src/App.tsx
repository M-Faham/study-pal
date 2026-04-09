import { useState } from 'react'
import HTMLAccessibilityTutorial from './tutorials/HTMLAccessibility'

interface Tutorial {
  id: string
  title: string
  description: string
  icon: string
}

export default function App() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null)

  const tutorials: Tutorial[] = [
    {
      id: 'html-accessibility',
      title: 'HTML Accessibility',
      description: 'Learn semantic HTML and ARIA attributes for accessible web development',
      icon: '♿'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📚 StudyPal</h1>
          <p className="text-gray-600 mt-1">Interactive Learning Platform</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {selectedTutorial ? (
          <div>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Back to Tutorials
            </button>
            <HTMLAccessibilityTutorial />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map(tutorial => (
                <div
                  key={tutorial.id}
                  onClick={() => setSelectedTutorial(tutorial.id)}
                  className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition transform"
                >
                  <div className="text-4xl mb-4">{tutorial.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600">{tutorial.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
