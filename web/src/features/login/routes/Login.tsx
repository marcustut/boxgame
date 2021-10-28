import useBlobity from 'blobity/lib/useBlobity'
import React, { useState } from 'react'

import { LoginForm, RecoveryForm, SmokeBackground } from '@/features/login'
import { useAuth } from '@/lib/auth'

import '@/features/login/styles/styles.css'

enum AuthState {
  LOGIN = 'login',
  RECOVERY = 'recovery'
}

export const Login = () => {
  const { user } = useAuth()
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN)

  useBlobity({
    zIndex: 1,
    focusableElementsOffsetX: 5,
    focusableElementsOffsetY: 5,
    fontSize: 12,
    font: "'Inter',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif",
    dotColor: '#e06578'
  })

  // redirect user if is logged in
  if (user) window.location.href = '/app'

  return (
    <SmokeBackground>
      {authState === AuthState.LOGIN ? (
        <LoginForm forgotPasswordOnClick={() => setAuthState(AuthState.RECOVERY)} />
      ) : authState === AuthState.RECOVERY ? (
        <RecoveryForm goBackOnClick={() => setAuthState(AuthState.LOGIN)} />
      ) : null}
    </SmokeBackground>
  )
}
