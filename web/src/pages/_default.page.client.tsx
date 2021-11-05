import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { NormalizedCacheObject } from '@apollo/client'
// import { offsetLimitPagination } from '@apollo/client/utilities'
import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'

import { AppProvider } from '@/context'
import type { PageContext } from '@/types/ssr'
import { createThemeHelper, createEmotionCache } from '@/utils'

import 'virtual:windi.css'
import '@/styles/globals.css'

const makeApolloClient = (apolloInitialState?: NormalizedCacheObject) => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
    cache: apolloInitialState ? new InMemoryCache().restore(apolloInitialState) : new InMemoryCache()
  })
}

const hydrate = async () => {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>()
  const { Page, pageProps } = pageContext
  const apolloClient = pageContext.apolloInitialState
    ? makeApolloClient(pageContext.apolloInitialState)
    : makeApolloClient()
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
