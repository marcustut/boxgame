import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { Scene } from '@/features/opening'

export const Opening: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  // const [videoElem, setVideoElem] = useState<HTMLVideoElement | null>()

  useEffectOnce(() => setMounted(true))
  // useEffectOnce(() => setVideoElem(document.getElementById('logo-opening') as HTMLVideoElement))

  // useEvent('click', () => videoElem!.play())

  if (!mounted) return null

  return (
    <>
      <video id='logo-opening' width='0' height='0' controls>
        <source src='/video/TheBoxLogo_Opening.mp4' type='video/mp4' />
      </video>
      <div className='bg-dark-800' style={{ height: '100vh' }}>
        <Scene />
      </div>
    </>
  )
}
