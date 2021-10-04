import { RegisterRoute } from '@/features/register'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<div>Landing Page...</div>} />
      <Route path='/register' element={<RegisterRoute />} />
      <Route path='/login' element={<div>Login</div>} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
