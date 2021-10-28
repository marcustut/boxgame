import React from 'react'

import { ErrorPage } from '@/components/Misc'

type VitePluginSSRErrorPageProps = {
  is404: boolean
}

const VitePluginSSRErrorPage: React.FC<VitePluginSSRErrorPageProps> = ({ is404 }: { is404: boolean }) =>
  is404 ? <ErrorPage is404 /> : <ErrorPage is404={false} />

export default VitePluginSSRErrorPage
