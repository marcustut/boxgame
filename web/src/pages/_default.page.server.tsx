import { NormalizedCacheObject, ApolloClient, InMemoryCache } from '@apollo/client'
import { getDataFromTree } from '@apollo/client/react/ssr'
import createEmotionServer from '@emotion/server/create-instance'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

import { AppProvider } from '@/context'
import type { PageContext } from '@/types/ssr'
import { createThemeHelper, createEmotionCache } from '@/utils'

const makeApolloClient = (apolloInitialState?: NormalizedCacheObject) => {
  return new ApolloClient({
    uri: `${import.meta.env.VITE_API_URL}/${import.meta.env.DEV ? 'dev' : 'production'}/graphql`,
    cache: apolloInitialState ? new InMemoryCache().restore(apolloInitialState) : new InMemoryCache()
  })
}

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'apolloInitialState', 'redirectTo']

export const render = async (pageContext: PageContextBuiltIn & PageContext) => {
  // Get page context from server
  const { Page, pageProps, apolloClient } = pageContext
  // Create cache for emotion (to work with MUI)
  const emotionCache = createEmotionCache()
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(emotionCache)
  const theme = createThemeHelper('dark')
  const pageHtml = ReactDOMServer.renderToString(
    <AppProvider
      apolloClient={apolloClient ? apolloClient : makeApolloClient()}
      pageContext={pageContext}
      emotionCache={emotionCache}
      theme={theme}
    >
      <Page {...pageProps} />
    </AppProvider>
  )

  // Get the CSS from emotion
  const emotionChunks = extractCriticalToChunks(pageHtml)
  const emotionCss = constructStyleTagsFromChunks(emotionChunks)

  // See https://vite-plugin-ssr.com/html-head
  const { documentProps } = pageContext
  const title = (documentProps && documentProps.title) || 'The Box'
  const desc = (documentProps && documentProps.description) || 'Think out of the Box'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#37a18e">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">
        ${dangerouslySkipEscape(emotionCss)}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}

export const onBeforeRender = async (pageContext: PageContext) => {
  const { Page, pageProps } = pageContext
  const apolloClient = pageContext.apolloClient ? pageContext.apolloClient : makeApolloClient()
  const theme = createThemeHelper('dark')
  const tree = (
    <AppProvider
      apolloClient={apolloClient}
      pageContext={pageContext}
      emotionCache={createEmotionCache()}
      theme={theme}
    >
      <Page {...pageProps} />
    </AppProvider>
  )
  const pageHtml = await getDataFromTree(tree)
  const apolloInitialState = apolloClient.extract()
  return { pageContext: { pageHtml, apolloInitialState } }
}
