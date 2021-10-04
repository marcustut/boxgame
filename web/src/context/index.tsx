import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'

import { ErrorPage, LoadingPage } from '@/components/Misc'
import { ChosenThemeProvider, ThemeProvider } from '@/lib/theme'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/apollo'

export const AppProvider: React.FC = ({ children }) => {
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <HelmetProvider>
          <ApolloProvider client={client}>
            <ChosenThemeProvider>
              <ThemeProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </ThemeProvider>
            </ChosenThemeProvider>
          </ApolloProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
