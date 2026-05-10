export type Difficulty = 'Core' | 'Tricky' | 'Architecture'

export type TopicProgress = 'not-started' | 'reviewed' | 'confident'

export type InterviewTarget = 'Angular' | 'React' | 'TypeScript' | 'General'

export interface ICheatSheetItem {
  concept: string
  explanation: string
  code?: string
}

export interface ITrap {
  trap: string
  correction: string
}

export interface IInterviewQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface IInterviewTopic {
  id: string
  title: string
  icon: string
  difficulty: Difficulty
  targets: InterviewTarget[]
  cheatSheet: ICheatSheetItem[]
  spokenAnswer: {
    question: string
    answer: string
  }
  traps: ITrap[]
  quiz: IInterviewQuestion[]
}

// localStorage-persisted state per topic
export interface ITopicState {
  progress: TopicProgress
  lastScore: number | null   // 0–100, null = not attempted
}

export type InterviewStore = Record<string, ITopicState>
