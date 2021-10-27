import { Emoji, EmojiData, Picker } from 'emoji-mart'
// import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import useSpring from 'react-use/lib/useSpring'

import 'emoji-mart/css/emoji-mart.css'
import { LoadingPage } from '@/components/Misc'

const TestPage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [emojis, setEmojis] = useState<EmojiData[]>([])
  const [emojiOpacity, setEmojiOpacity] = useState<number>(100)
  const value = useSpring(emojiOpacity)

  useEffectOnce(() => setMounted(true))

  if (!mounted) return <LoadingPage />

  return (
    <div className='w-full flex justify-end items-center'>
      <p>value: {value}</p>
      {emojis.map((e, index) => (
        <div key={index} style={{ opacity: value }}>
          <Emoji emoji={e} size={25} />
        </div>
      ))}
      <Picker title='Pick your emoji…' emoji='point_up' onSelect={emoji => setEmojis([...emojis, emoji])} />
      <button onClick={() => setEmojiOpacity(0)}>Click Me</button>
    </div>
  )
}

export default TestPage
