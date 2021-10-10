import React, { useState } from 'react'
import { Spinner } from '@/components/Elements'
import { Riddle } from '@/features/register'
import { useEffectOnce } from 'react-use'

const RiddlePage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffectOnce(() => setMounted(true))

  return mounted ? <Riddle /> : <Spinner center size='medium' className='text-secondary' />
}

export default RiddlePage
