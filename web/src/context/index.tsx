import { ApolloClient, ApolloProvider } from '@apollo/client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterDayjs'
import { CssBaseline, ThemeProvider, Theme } from '@mui/material'
import useBlobity from 'blobity/lib/useBlobity'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ReactBoundaryErrorPage } from '@/components/Misc'
import { PageContextProvider } from '@/hooks/usePageContext'
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
  useBlobity({
    focusableElementsOffsetX: 5,
    focusableElementsOffsetY: 5,
    fontSize: 12,
    font: "'Inter',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif",
    dotColor: '#e06578'
  })

  return (
    <React.StrictMode>
      <ErrorBoundary FallbackComponent={ReactBoundaryErrorPage}>
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
