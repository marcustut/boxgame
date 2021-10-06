import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createThemeHelper, createEmotionCache } from '@/utils'
import { AppProvider } from '@/context'
import type { PageContext } from '@/types/ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'
import type { NormalizedCacheObject } from '@apollo/client'

const makeApolloClient = (apolloInitialState: NormalizedCacheObject) => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_API_URL}/${import.meta.env.DEV ? 'dev' : 'production'}/graphql`,
    cache: new InMemoryCache().restore(apolloInitialState)
  })
}

const hydrate = async () => {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>()
  const { Page, pageProps } = pageContext
  const apolloClient = makeApolloClient(pageContext.apolloInitialState)
  const theme = createThemeHelper('dark')
  ReactDOM.hydrate(
    <AppProvider
      apolloClient={apolloClient}
      pageContext={pageContext}
      emotionCache={createEmotionCache()}
      theme={theme}
    >
      <Page {...pageProps} />
    </AppProvider>,
    document.getElementById('page-view')
  )
}

hydrate()
