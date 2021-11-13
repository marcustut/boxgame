import React from 'react'

import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type DisableWrapperProps = {
  disabled: boolean
  message: string
  fontSize?: React.CSSProperties['fontSize']
  utilities?: WindiUtilities
  className?: string
}

export const DisableWrapper: React.FC<DisableWrapperProps> = ({
  disabled,
  message,
  children,
  fontSize,
  utilities,
  className = ''
}) => {
  const defaultUtilities: WindiUtilities = {
    w: 'w-full',
    pos: 'relative',
    pointer: 'pointer-events-none',
    cursor: 'cursor-not-allowed'
  }
  return disabled ? (
    <div className={disabled && constructClassName(utilities, defaultUtilities, className)}>
      {disabled && (
        <>
          <div
            className='top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 bg-red-600 font-bold p-4 z-10'
            style={{ fontSize }}
          >
            {message}
          </div>
          <div className='w-full h-full absolute rounded-lg bg-dark-300/75' />
        </>
      )}
      {children}
    </div>
  ) : (
    <>{children}</>
  )
}
