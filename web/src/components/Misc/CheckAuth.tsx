import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { LoadingPage } from '@/components/Misc'
import { supabase } from '@/lib/supabase'

export const CheckAuth: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffectOnce(() => setMounted(true))

  useEffectOnce(() => {
    if (!supabase.auth.session()) window.location.replace('/login')
  })

  if (!mounted) return <LoadingPage />

  return <>{children}</>
}
