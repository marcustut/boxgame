import React from 'react'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout } from '@/features/register'

export const Riddle: React.FC = () => {
  const { setTimeUsed, setCompleted } = useRiddle()

  return (
    <Layout helmetProps={{ title: 'Riddle' }}>
      <div>Riddle... (with countdown and stuff)</div>
      <button
        onClick={() => {
          setTimeUsed(123)
          setCompleted(true)
        }}
      >
        Done
      </button>
    </Layout>
  )
}
