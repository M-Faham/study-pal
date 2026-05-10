import { useState } from 'react'
import { allInterviewTopics } from './index'
import { useInterviewStore } from './useInterviewStore'
import InterviewHome from './InterviewHome'
import InterviewTopicView from './InterviewTopic'
import MockInterview from './MockInterview'
import type { TopicProgress } from './types'

interface Props {
  selectedTopicId: string | null
  onSelectTopic: (id: string) => void
  onBack: () => void
}

export default function InterviewPrep({ selectedTopicId, onSelectTopic, onBack }: Props) {
  const [mockMode, setMockMode] = useState(false)
  const { getTopicState, setProgress, setScore } = useInterviewStore()

  const storeSnapshot = Object.fromEntries(
    allInterviewTopics.map(t => [t.id, getTopicState(t.id)])
  )

  if (mockMode) {
    return (
      <MockInterview
        topics={allInterviewTopics}
        onDone={() => setMockMode(false)}
      />
    )
  }

  if (selectedTopicId) {
    const topic = allInterviewTopics.find(t => t.id === selectedTopicId)
    if (!topic) return null
    const state = getTopicState(topic.id)

    return (
      <InterviewTopicView
        topic={topic}
        progress={state.progress}
        onSetProgress={(p: TopicProgress) => setProgress(topic.id, p)}
        onQuizComplete={(score: number) => setScore(topic.id, score)}
        onBack={onBack}
      />
    )
  }

  return (
    <InterviewHome
      topics={allInterviewTopics}
      store={storeSnapshot}
      onSelect={onSelectTopic}
      onMockInterview={() => setMockMode(true)}
      selectedTopicId={selectedTopicId}
    />
  )
}
