import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '.'

export const LockPage: React.FC = ({ children }) => {
  const [password, setPassword] = useState<string>('')

  useEffectOnce(() => {
    if (import.meta.env.DEV) return
    const input = prompt('This page is locked, enter admin password to continue')
    if (!input) {
      window.location.href = '/app'
      return
    }
    setPassword(input)
  })

  if (import.meta.env.DEV) return <>{children}</>

  if (password === 'cyc_m100_abcd') return <>{children}</>
  else return <LoadingPage />
}
