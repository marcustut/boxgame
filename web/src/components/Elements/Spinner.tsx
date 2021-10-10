import React from 'react'
import { SVGProps } from 'react'

// I'm not doing string interpolation so tailwind can purge the css
const sizes = {
  tiny: 'h-2 w-2',
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  big: 'h-10 w-10'
}

export type SpinnerProps = SVGProps<SVGSVGElement> & {
  size?: keyof typeof sizes
  center?: true
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', center = false, className = '', ...props }) => {
  const innerSpinner = (
    <svg
      className={`animate-spin text-button ${sizes[size]} ${className}`}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  )

  return center ? <div className='flex justify-center items-center h-[100vh]'>{innerSpinner}</div> : innerSpinner
}
