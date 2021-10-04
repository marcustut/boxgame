import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

const MainLayout: React.FC = ({ children }) => <>{children}</>

const AppWrapper: React.FC = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<AppWrapper />}>
        <Route path='/' element={<div>Main Page...</div>} />
        <Route path='/social' element={<div>Social Media Page...</div>} />
        <Route path='/mission' element={<div>Mission Page...</div>} />
        <Route path='/leaderboard' element={<div>Leaderboard Page...</div>} />
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    </Routes>
  )
}
