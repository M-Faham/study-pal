import { useState, useCallback } from 'react'

interface StreakStore {
  streak: number
  lastStudyDate: string   // ISO date string YYYY-MM-DD
  todayCount: number
  dailyGoal: number
}

const KEY = 'studypal-streak'
const GOALS = [3, 5, 10]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function load(): StreakStore {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as StreakStore
  } catch {}
  return { streak: 0, lastStudyDate: '', todayCount: 0, dailyGoal: 5 }
}

function save(s: StreakStore) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

export function useStreakStore() {
  const [store, setStore] = useState<StreakStore>(load)

  const recordActivity = useCallback(() => {
    setStore(prev => {
      const t = today()
      let next: StreakStore
      if (prev.lastStudyDate === t) {
        next = { ...prev, todayCount: prev.todayCount + 1 }
      } else {
        const consecutive = prev.lastStudyDate === getPreviousDay(t)
        next = {
          ...prev,
          streak: consecutive ? prev.streak + 1 : 1,
          lastStudyDate: t,
          todayCount: 1,
        }
      }
      save(next)
      return next
    })
  }, [])

  const cycleGoal = useCallback(() => {
    setStore(prev => {
      const idx = GOALS.indexOf(prev.dailyGoal)
      const next = { ...prev, dailyGoal: GOALS[(idx + 1) % GOALS.length] }
      save(next)
      return next
    })
  }, [])

  return { streak: store.streak, todayCount: store.todayCount, dailyGoal: store.dailyGoal, recordActivity, cycleGoal }
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
