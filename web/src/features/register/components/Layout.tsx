import React from 'react'

import { styled } from '@mui/material'
import { HelmetHandler, HelmetHandlerProps } from '@/components/Misc'

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

type LayoutProps = {
  helmetProps?: HelmetHandlerProps
}

export const Layout: React.FC<LayoutProps> = ({ helmetProps, children }) => {
  return (
    <Root>
      {helmetProps && <HelmetHandler title={helmetProps.title} link={helmetProps.link} meta={helmetProps.meta} />}
      {children}
    </Root>
  )
}
