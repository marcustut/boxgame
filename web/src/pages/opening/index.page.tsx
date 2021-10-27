import React from 'react'

import { LoadingPage } from '@/components/Misc'
import { Opening } from '@/features/opening'
import { supabase } from '@/lib/supabase'

const OpeningPage: React.FC = () => {
  return supabase.auth.session() ? <Opening /> : <LoadingPage />
}

export default OpeningPage
