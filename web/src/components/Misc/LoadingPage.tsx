import { styled } from '@mui/material'
import React from 'react'
import { Spinner } from '@/components/Elements'

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
      <Spinner className='text-secondary' />
    </Root>
  )
}
