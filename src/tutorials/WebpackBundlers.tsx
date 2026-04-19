/**
 * BEST PRACTICE: Tutorial Orchestration Component
 *
 * Webpack & Bundlers Tutorial
 * شرح مفصل بدون أسئلة - فقط دروس تعليمية
 */

import { useState } from 'react'
import Lesson from '../components/Lesson'
import { webpackBundlersLessons } from '../data/tutorials/webpack-bundlers-data'
import { ILesson } from '../types/tutorial'

export default function WebpackBundlersTutorial() {
  // تتبع الدرس الحالي (0-based index)
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0)

  // تتبع الدروس المكتملة
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())

  // الدرس الحالي
  const currentLesson = webpackBundlersLessons[currentLessonIndex]

  // حساب النسبة المئوية للتقدم
  const progress = Math.round(
    (completedLessons.size / webpackBundlersLessons.length) * 100
  )

  /**
   * معالج إكمال الدرس
   * يضيف الدرس إلى المكتملة ويذهب للتالي
   */
  const handleLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]))
    goToNext()
  }

  /**
   * الذهاب للدرس التالي
   */
  const goToNext = () => {
    if (currentLessonIndex < webpackBundlersLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  /**
   * الذهاب للدرس السابق
   */
  const goToPrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  /**
   * إعادة تعيين جميع الدروس
   */
  const handleReset = () => {
    setCurrentLessonIndex(0)
    setCompletedLessons(new Set())
  }

  return (
    <div className="space-y-6">
      {/* رأس التيوتوريال مع شريط التقدم */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🔧 Webpack & Bundlers Tutorial
        </h1>
        <p className="text-gray-600 mb-4">
          شرح مفصل عن webpack والأدوات المشابهة - تعلم كيف تعمل أدوات البناء الحديثة
        </p>

        {/* شريط التقدم */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">
              تقدم: {progress}%
            </span>
            <span className="text-sm text-gray-600">
              {completedLessons.size} من {webpackBundlersLessons.length} درس
            </span>
          </div>

          {/* شريط النسبة المئوية */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* معلومات الدرس الحالي */}
          <p className="text-xs text-gray-600 mt-2">
            الدرس {currentLessonIndex + 1} من {webpackBundlersLessons.length}
          </p>
        </div>
      </div>

      {/* محتوى الدرس */}
      <div className="bg-white rounded-lg shadow p-8">
        <Lesson
          lesson={currentLesson as ILesson}
          onComplete={handleLessonComplete}
        />
      </div>

      {/* أزرار التنقل */}
      <div className="flex justify-between gap-4 flex-wrap">
        {/* زر السابق */}
        <button
          onClick={goToPrevious}
          disabled={currentLessonIndex === 0}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ← درس سابق
        </button>

        {/* معلومات الدرس */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {currentLesson?.title}
          </span>
          {completedLessons.has(currentLesson?.id) && (
            <span className="text-green-600 font-bold">✓</span>
          )}
        </div>

        {/* أزرار إضافية */}
        <div className="flex gap-2">
          {/* إعادة تعيين */}
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            إعادة تعيين
          </button>

          {/* درس تالي */}
          <button
            onClick={goToNext}
            disabled={currentLessonIndex === webpackBundlersLessons.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            درس تالي →
          </button>
        </div>
      </div>

      {/* رسالة الانتهاء */}
      {progress === 100 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 font-bold">
            🎉 ألف مبروك! لقد أكملت جميع الدروس عن Webpack والـ Bundlers!
          </p>
          <p className="text-green-600 text-sm mt-1">
            أنت الآن تفهم كيف تعمل أدوات البناء الحديثة وكيف تحسن أداء تطبيقاتك.
          </p>
        </div>
      )}
    </div>
  )
}
