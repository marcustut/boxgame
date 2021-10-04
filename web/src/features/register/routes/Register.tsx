import React from 'react'
import { Layout } from '@/features/register'
import { useRiddle } from '@/hooks/stores/useRiddle'

export const Register: React.FC = () => {
  const { setTimeUsed, setCompleted } = useRiddle()

  return (
    <Layout helmetProps={{ title: 'Register' }}>
      Register Page (with Forms and stuff)
      <button
        onClick={() => {
          setTimeUsed(null)
          setCompleted(false)
        }}
      >
        Undone
      </button>
    </Layout>
  )
}
