import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline, ThemeProvider, Theme } from '@mui/material'
import { LocalizationProvider } from '@mui/lab'
import { SnackbarProvider } from 'notistack'
import DateAdapter from '@mui/lab/AdapterDayjs'

import { PageContextProvider } from '@/hooks/usePageContext'
import { ErrorPage } from '@/components/Misc'
import { AuthProvider } from '@/lib/auth'
import { PageContext } from '@/types/ssr'

type AppProviderProps<TCache> = {
  apolloClient: ApolloClient<TCache>
  pageContext: PageContext
  emotionCache: EmotionCache
  theme: Theme
}

export const AppProvider: React.FC<AppProviderProps<unknown>> = ({
  apolloClient,
  pageContext,
  emotionCache,
  theme,
  children
}) => {
  return (
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <CacheProvider value={emotionCache}>
              <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                  <LocalizationProvider dateAdapter={DateAdapter}>
                    <CssBaseline />
                    <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
                  </LocalizationProvider>
                </SnackbarProvider>
              </ThemeProvider>
            </CacheProvider>
          </AuthProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
