import { useState, useCallback } from 'react'
import type { InterviewStore, ITopicState, TopicProgress } from './types'
import { useStreakStore } from './useStreakStore'

const STORAGE_KEY = 'studypal-interview-store'

function load(): InterviewStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InterviewStore) : {}
  } catch {
    return {}
  }
}

function save(store: InterviewStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function defaultState(): ITopicState {
  return { progress: 'not-started', lastScore: null }
}

export function useInterviewStore() {
  const [store, setStore] = useState<InterviewStore>(load)
  const { recordActivity } = useStreakStore()

  const getTopicState = useCallback(
    (id: string): ITopicState => store[id] ?? defaultState(),
    [store]
  )

  const setProgress = useCallback((id: string, progress: TopicProgress) => {
    setStore(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? defaultState()), progress } }
      save(next)
      return next
    })
    recordActivity()
  }, [recordActivity])

  const setScore = useCallback((id: string, score: number) => {
    setStore(prev => {
      const current = prev[id] ?? defaultState()
      const progress: TopicProgress = score >= 80 ? 'confident' : 'reviewed'
      const next = { ...prev, [id]: { ...current, lastScore: score, progress } }
      save(next)
      return next
    })
    recordActivity()
  }, [recordActivity])

  return { getTopicState, setProgress, setScore }
}
