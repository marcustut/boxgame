import React from 'react'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Register } from './Register'
import { Riddle } from './Riddle'

export const RegisterRoute: React.FC = () => {
  const { timeUsed, completed } = useRiddle()
  return <>{timeUsed && completed ? <Register /> : <Riddle />}</>
}
