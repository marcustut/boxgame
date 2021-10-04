import { CircularProgress, styled } from '@mui/material'
import React from 'react'

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

export const LoadingPage: React.FC = () => {
  return (
    <Root>
      <CircularProgress color='primary' />
    </Root>
  )
}
