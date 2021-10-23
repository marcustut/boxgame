import React from 'react'

import { Gender } from '@/graphql'
import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'
import { Icon } from '@iconify/react'

type AvatarProps = {
  src: string | null
  gender: Gender
  name: string
  upload?: boolean
  uploadOnClick?: () => void
  className?: string
  utilities?: WindiUtilities
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  gender,
  name,
  upload = false,
  uploadOnClick,
  className = '',
  utilities
}) => {
  const defaultUtilities: WindiUtilities = {
    w: 'w-24',
    h: 'h-24',
    p: 'p-2',
    bg: 'bg-dark-200',
    border: 'border-2 border-true-gray-500 rounded-full'
  }

  const avatar = (
    <img
      src={src ? src : `https://avatars.dicebear.com/api/${gender.toLowerCase()}/${name}.svg?mood[]=happy`}
      alt={`${name}'s avatar`}
      className={constructClassName(utilities, defaultUtilities, className)}
    />
  )

  return (
    <>
      {upload ? (
        <div className='relative'>
          {avatar}
          <button
            className='bg-dark-200 rounded-full p-1.5 absolute right-0 bottom-0 shadow-sm focus:outline-none transition duration-200 ease-in-out focus:ring-2 focus:ring-primary-ring'
            onClick={uploadOnClick}
          >
            <Icon icon='mdi:camera' className='text-true-gray-400' />
          </button>
        </div>
      ) : (
        avatar
      )}
    </>
  )
}
