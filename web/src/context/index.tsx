import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ApolloClient, ApolloProvider } from '@apollo/client'

import { ErrorPage } from '@/components/Misc'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/lab'
import { PageContextProvider } from '@/hooks/usePageContext'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/react'
import type { PageContext } from '@/types/ssr'
import type { Theme } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterDayjs'

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
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <CssBaseline />
                <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </CacheProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
