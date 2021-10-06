import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ApolloClient, ApolloProvider } from '@apollo/client'

import { ErrorPage } from '@/components/Misc'
import { ThemeProvider } from '@mui/material'
import { PageContextProvider } from '@/hooks/usePageContext'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/react'
import type { PageContext } from '@/types/ssr'
import type { Theme } from '@mui/material'

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
              <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
            </ThemeProvider>
          </CacheProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
