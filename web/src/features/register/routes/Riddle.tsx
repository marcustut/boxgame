import React, { useEffect } from 'react'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useQuery } from '@apollo/client'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout } from '@/features/register'
import { GET_REGISTERED_USER_COUNT, RegisteredUserCount } from '@/graphql'

export const Riddle: React.FC = () => {
  const { timeUsed, completed, setTimeUsed, setCompleted } = useRiddle()
  const { loading, error, data } = useQuery<RegisteredUserCount>(GET_REGISTERED_USER_COUNT)

  useEffect(() => {
    if (timeUsed && completed) window.location.href = '/register'
  }, [timeUsed, completed])

  return (
    <Layout applyRootStyle={false} helmetProps={{ title: 'Riddle' }} style={{ minHeight: '100vh' }}>
      <Container sx={{ height: '100vh', fontFamily: 'monospace' }}>
        <Stack justifyContent='center' alignItems='center' sx={{ height: '100vh' }}>
          <Stack justifyContent='center' alignItems='center'>
            <Typography variant='body1'>Seats Remaining</Typography>
            {!loading && !error && (
              <Typography variant='h3' color='orange' fontWeight='bold' fontFamily='monospace'>
                {data?.userCount}
              </Typography>
            )}
          </Stack>
          <div>Hii I am a Riddle</div>
          <h1>Solve Me</h1>
          <Button
            variant='contained'
            onClick={() => {
              setTimeUsed(123)
              setCompleted(true)
            }}
          >
            Click Me
          </Button>
        </Stack>
      </Container>
    </Layout>
  )
}
