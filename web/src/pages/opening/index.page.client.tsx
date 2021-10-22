import React from 'react'
import ReactDOM from 'react-dom'
import { getPage } from 'vite-plugin-ssr/client'
import type { PageContext } from '@/types/ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/types'
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { extend } from '@react-three/fiber'

extend({ BloomPass, GlitchPass })

const hydrate = async () => {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>()
  const { Page, pageProps } = pageContext
  ReactDOM.hydrate(<Page {...pageProps} />, document.getElementById('page-view'))
}

hydrate()
