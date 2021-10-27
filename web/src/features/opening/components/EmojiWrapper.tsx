import { Emoji, EmojiProps } from 'emoji-mart'
import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import useSpring from 'react-use/lib/useSpring'

import { getRandomInt } from '@/utils'

type EmojiWrapperProps = EmojiProps & { lifetime: number }

export const EmojiWrapper: React.FC<EmojiWrapperProps> = ({ lifetime, size, ...props }) => {
  const [_opacity, setOpacity] = useState<number>(100)
  const opacity = useSpring(_opacity)

  useEffectOnce(() => {
    setTimeout(() => setOpacity(0), lifetime)
  })

  return (
    <span
      role='img'
      style={{
        opacity,
        transition: 'transform 150ms ease-in-out',
        transform: `rotate(${getRandomInt(-10, 15)}deg) translate(${getRandomInt(0, 15)}px, ${getRandomInt(0, 15)}px)`
      }}
    >
      <Emoji size={getRandomInt(size - 10, size + 10)} {...props} />
    </span>
  )
}
