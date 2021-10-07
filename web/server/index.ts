import express from 'express'
import { createPageRenderer } from 'vite-plugin-ssr'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch'
import path from 'path'

// load .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const isProduction = process.env.NODE_ENV === 'production'
const root = `${__dirname}/..`

startServer()

async function startServer() {
  const app = express()

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    const vite = require('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const apolloClient = makeApolloClient()
    const pageContextInit = { url, apolloClient }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    res.status(httpResponse.statusCode).send(httpResponse.body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function makeApolloClient() {
  if (!process.env.VITE_API_URL || !process.env.NODE_ENV) console.error('.env is not correctly loaded')
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${process.env.VITE_API_URL}/graphql`,
      fetch
    }),
    cache: new InMemoryCache()
  })
  return apolloClient
}
