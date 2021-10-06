import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Test } from './Test'

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<div>Landing Page...</div>} />
      <Route path='/login' element={<div>Login</div>} />
      <Route path='/test' element={<Test />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}
