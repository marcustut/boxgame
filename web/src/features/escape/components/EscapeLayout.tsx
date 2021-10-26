import { Icon } from '@iconify/react'
import React from 'react'

import { WindiUtilities } from '@/types/windi'
import { constructClassName } from '@/utils'

type EscapeLayoutProps = {
  utilities?: WindiUtilities
  className?: string
}

export const EscapeLayout: React.FC<EscapeLayoutProps> = ({ utilities, className = '', children }) => {
  const defaultUtilities: WindiUtilities = {
    p: 'p-4',
    m: 'mx-auto',
    container: 'container'
  }

  return (
    <div className={constructClassName(utilities, defaultUtilities, className)}>
      <button className='flex items-center text-sm mb-4 focus:outline-none' onClick={() => window.history.back()}>
        <Icon icon='ic:outline-chevron-left' className='w-6 h-6 mr-0.5' />
        Back to Escape
      </button>
      {children}
    </div>
  )
}
