import React from 'react'
import { Helmet } from 'react-helmet-async'

export type HelmetHandlerProps = {
  title?: string
  link?: Record<string, string>
  meta?: Record<string, string>
}

export const HelmetHandler: React.FC<HelmetHandlerProps> = ({ title, link, meta }) => {
  return (
    <Helmet>
      {title && <title>{`${title} | The Box`}</title>}
      {link && Object.entries(link).map(entry => <link rel={entry[0]} href={entry[1]} />)}
      {meta && Object.entries(meta).map(entry => <meta property={entry[0]} content={entry[1]} />)}
    </Helmet>
  )
}
