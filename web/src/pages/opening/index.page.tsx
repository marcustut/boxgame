import { AuthRequiredPage } from '@/components/Misc'
import { Opening } from '@/features/opening'
import { useAuth } from '@/lib/auth'
import React from 'react'

const OpeningPage: React.FC = () => {
  const { user } = useAuth()
  return user ? <Opening /> : <AuthRequiredPage />
}

export default OpeningPage
