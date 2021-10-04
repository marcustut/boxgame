import React from 'react'

import { lazyImport } from '@/utils/lazyImport'

const { ProtectedRoutes } = lazyImport(() => import('./ProtectedRoutes'), 'ProtectedRoutes')
const { PublicRoutes } = lazyImport(() => import('./PublicRoutes'), 'PublicRoutes')

export const AppRoutes: React.FC = () => {
  // TODO: Implement this
  const user = null
  return user ? <ProtectedRoutes /> : <PublicRoutes />
}
