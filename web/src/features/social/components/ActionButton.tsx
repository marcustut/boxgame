import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { Icon } from '@iconify/react'

import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type ActionButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant: 'like' | 'comment'
  highlighted?: boolean
  className?: string
  utilities?: WindiUtilities
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  highlighted = false,
  className = '',
  utilities,
  ...props
}) => {
  const defaultUtilities: WindiUtilities = {
    w: 'w-full',
    p: 'px-4 py-2',
    bg: 'hover:bg-dark-400 focus:bg-dark-400',
    text:
      variant === 'like' && highlighted
        ? 'text-secondary-ring'
        : variant === 'comment' && highlighted
        ? 'text-primary-ring'
        : '',
    ring: '',
    flex: 'flex',
    align: 'items-center',
    border: 'rounded-md',
    justify: 'justify-center',
    outline: 'focus:outline-none',
    transition: 'transition duration-200 ease-in-out'
  }

  return (
    <button className={constructClassName(utilities, defaultUtilities, className)} {...props}>
      <Icon
        icon={
          variant === 'like' ? (highlighted ? 'ant-design:like-filled' : 'ant-design:like-outlined') : 'uil:comment'
        }
        className='w-5 h-5 mr-1'
      />
      {variant === 'like' ? 'Like' : 'Comment'}
    </button>
  )
}
