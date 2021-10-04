import React from 'react'

import { AppProvider } from '@/context'
import { AppRoutes } from '@/routes'

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
