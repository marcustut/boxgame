import React from 'react'

type InputErrorMsgProps = {
  className?: string
}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ className = '', children }) => {
  return (
    <div className={`flex ${className}`} data-testid='input-error-msg'>
      {children}
    </div>
  )
}
