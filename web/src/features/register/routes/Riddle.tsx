import React, { useEffect } from 'react'
import { useEffectOnce } from 'react-use'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useQuery } from '@apollo/client'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout } from '@/features/register'
import { GET_REGISTERED_USER_COUNT, RegisteredUserCount } from '@/graphql'
import { supabase } from '@/lib/supabase'
import { definitions } from '@/types/supabase'

export const Riddle: React.FC = () => {
  const { timeUsed, completed, setTimeUsed, setCompleted } = useRiddle()
  const { loading, error, data, refetch } = useQuery<RegisteredUserCount>(GET_REGISTERED_USER_COUNT)

  useEffectOnce(() => {
    const userSubscription = supabase
      .from<definitions['User']>('User')
      .on('INSERT', () => refetch())
      .subscribe()
    return () => {
      supabase.removeSubscription(userSubscription)
    }
  })

  useEffect(() => {
    if (timeUsed && completed) window.location.href = '/register'
  }, [timeUsed, completed])

  return (
    <Layout applyRootStyle={false} helmetProps={{ title: 'Riddle' }} style={{ minHeight: '100vh' }}>
      <Container sx={{ height: '100vh', fontFamily: 'monospace' }}>
        <Stack justifyContent='center' alignItems='center' sx={{ height: '100vh' }}>
          <Stack justifyContent='center' alignItems='center'>
            <Typography variant='body1' fontFamily='monospace'>
              Seats Remaining
            </Typography>
            {!loading && !error && data && (
              <Typography variant='h3' color='orange' fontWeight='bold' fontFamily='monospace'>
                {400 - data.userCount}
              </Typography>
            )}
          </Stack>
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
