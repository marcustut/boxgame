import { styled } from '@mui/material'
import React from 'react'

import { HelmetHandlerProps } from '@/components/Misc'

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

type LayoutProps = {
  applyRootStyle?: boolean
  helmetProps?: HelmetHandlerProps
  style?: React.CSSProperties
}

export const Layout: React.FC<LayoutProps> = ({ applyRootStyle = true, helmetProps, style, children }) => {
  const inner = (
    <div style={style}>
      {/* {helmetProps && <HelmetHandler title={helmetProps.title} link={helmetProps.link} meta={helmetProps.meta} />} */}
      {children}
    </div>
  )

  return <>{applyRootStyle ? <Root>{inner}</Root> : inner}</>
}
