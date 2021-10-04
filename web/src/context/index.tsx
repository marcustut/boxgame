import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'

import { ErrorPage, LoadingPage } from '@/components/Misc'
import { ChosenThemeProvider, ThemeProvider } from '@/lib/theme'

export const AppProvider: React.FC = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <HelmetProvider>
          <ChosenThemeProvider>
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </ChosenThemeProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
