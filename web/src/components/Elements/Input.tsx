import React from 'react'
import { ChangeEventHandler, ComponentPropsWithoutRef, forwardRef, LegacyRef } from 'react'

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  textarea?: boolean
  rows?: number
  error?: string
  transparent?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ textarea, error, transparent, className, ...props }, ref) => {
    const bg = transparent ? `bg-transparent` : `bg-dark-100`
    const ring = error
      ? `ring-2 ring-[#ff4d4d]`
      : `${props.disabled ? '' : 'hover:ring-2'} focus:ring-2 ring-primary-ring`
    const transition = `transition duration-200 ease-in-out`
    const cn = `w-full py-2 px-4 rounded-lg placeholder-true-gray-500 focus:outline-none ${bg} ${ring} ${transition} ${className}`

    return textarea ? (
      <textarea
        ref={ref as LegacyRef<HTMLTextAreaElement>}
        className={cn}
        {...(props as ChangeEventHandler<HTMLTextAreaElement>)}
      />
    ) : (
      <input ref={ref} className={cn} {...props} />
    )
  }
)
Input.displayName = 'Input'
