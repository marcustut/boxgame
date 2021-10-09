import React from 'react'

type InputErrorMsgProps = {
  className?: string
}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ className = '', children }) => {
  return <div className={`flex ${className}`}>{children}</div>
}
