import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { Spinner } from '@/components/Elements'
import { Riddle } from '@/features/register'

const RiddlePage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffectOnce(() => setMounted(true))

  return mounted ? <Riddle /> : <Spinner center size='medium' className='text-secondary' />
}

export default RiddlePage
