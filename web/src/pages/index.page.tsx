import React from 'react'
import { useEffectOnce } from 'react-use'

import { supabase } from '@/lib/supabase'

const LandingPage: React.FC = () => {
  useEffectOnce(() => {
    if (supabase.auth.session()) window.location.href = '/app'
    else window.location.href = '/login'
  })
  return <></>
}

export default LandingPage
