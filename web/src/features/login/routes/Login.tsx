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
