import React from 'react'
import { Button } from '@mui/material'

// import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout } from '@/features/register'

export const Riddle: React.FC = () => {
  // const { setTimeUsed, setCompleted } = useRiddle()

  return (
    <Layout helmetProps={{ title: 'Riddle' }}>
      <div>Hii I am a Riddle</div>
      <h1>Solve Me</h1>
      <Button variant='contained'>Click Me</Button>
    </Layout>
  )
}
