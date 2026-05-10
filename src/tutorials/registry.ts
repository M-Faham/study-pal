import type { ILesson, IQuiz } from '../types/tutorial'
import type { ReactNode } from 'react'

import { reactRouterLessons }        from '../data/tutorials/react-router-data'
import { reactLocalizationLessons }  from '../data/tutorials/react-localization-data'
import { reactFormsLessons }         from '../data/tutorials/react-forms-data'
import { reactBestPracticesLessons } from '../data/tutorials/react-best-practices-data'
import { reactAxiosLessons, reactAxiosQuizzes }   from '../data/tutorials/react-axios-data'
import { reactHooksLessons, reactHooksQuizzes }   from '../data/tutorials/react-hooks-data'
import { eventLoopLessons, eventLoopQuizzes }     from '../data/tutorials/event-loop-data'
import { rxjsLessons, rxjsQuizzes }               from '../data/tutorials/rxjs-data'
import { webpackBundlersLessons }    from '../data/tutorials/webpack-bundlers-data'

interface BaseTutorialConfig {
  id: string
  icon: string
  title: string
  subtitle: string
  extra?: ReactNode
}

export interface LessonsOnlyConfig extends BaseTutorialConfig {
  kind: 'lessons-only'
  lessons: ILesson[]
}

export interface LessonsAndQuizConfig extends BaseTutorialConfig {
  kind: 'lessons-and-quiz'
  lessons: ILesson[]
  quizzes: IQuiz[]
}

export type TutorialConfig = LessonsOnlyConfig | LessonsAndQuizConfig

export const tutorialRegistry: TutorialConfig[] = [
  {
    id: 'react-router',
    kind: 'lessons-only',
    icon: '🗺️',
    title: 'React Router — Crash Course',
    subtitle: 'Client-side routing, dynamic params, nested layouts, guards and programmatic navigation.',
    lessons: reactRouterLessons,
  },
  {
    id: 'react-localization',
    kind: 'lessons-only',
    icon: '🌍',
    title: 'React Localization (i18n) — Crash Course',
    subtitle: 'Internationalization, react-i18next setup, plurals, RTL support and Intl formatting.',
    lessons: reactLocalizationLessons,
  },
  {
    id: 'react-forms',
    kind: 'lessons-only',
    icon: '📝',
    title: 'React Forms — Crash Course',
    subtitle: 'Controlled inputs, form state, Zod validation, React Hook Form and async submission.',
    lessons: reactFormsLessons,
  },
  {
    id: 'react-best-practices',
    kind: 'lessons-only',
    icon: '⭐',
    title: 'React Best Practices',
    subtitle: 'Component design, state management, performance optimisation, custom hooks and error boundaries.',
    lessons: reactBestPracticesLessons,
  },
  {
    id: 'webpack-bundlers',
    kind: 'lessons-only',
    icon: '🔧',
    title: 'Webpack & Bundlers',
    subtitle: 'Webpack core concepts, Vite, Parcel, esbuild, Rollup — how bundling really works.',
    lessons: webpackBundlersLessons,
  },
  {
    id: 'react-axios',
    kind: 'lessons-and-quiz',
    icon: '🌐',
    title: 'Axios in React — Best Practices & Advanced',
    subtitle: 'Instances, interceptors, error handling, cancellation, upload progress, and React Query integration.',
    lessons: reactAxiosLessons,
    quizzes: reactAxiosQuizzes,
  },
  {
    id: 'react-hooks',
    kind: 'lessons-and-quiz',
    icon: '🪝',
    title: 'React Hooks — Complete Guide & Interview Prep',
    subtitle: 'useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, useLayoutEffect — with interview Q&A for each.',
    lessons: reactHooksLessons,
    quizzes: reactHooksQuizzes,
  },
  {
    id: 'event-loop',
    kind: 'lessons-and-quiz',
    icon: '⚙️',
    title: 'JavaScript Event Loop — Crash Course',
    subtitle: 'Call stack, Web APIs, microtasks, macrotasks and async/await internals.',
    lessons: eventLoopLessons,
    quizzes: eventLoopQuizzes,
  },
  {
    id: 'rxjs',
    kind: 'lessons-and-quiz',
    icon: '🔀',
    title: 'RxJS — Angular Interview Crash Course',
    subtitle: 'Observables, Subjects, operators (switchMap, mergeMap, combineLatest…), error handling and Angular patterns.',
    lessons: rxjsLessons,
    quizzes: rxjsQuizzes,
  },
]

export const tutorialById = Object.fromEntries(tutorialRegistry.map(t => [t.id, t]))
