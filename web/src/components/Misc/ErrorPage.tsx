import { styled } from '@mui/material'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'

const Root = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const ErrorPage: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return <Root>An error occured - {error.message}</Root>
}
