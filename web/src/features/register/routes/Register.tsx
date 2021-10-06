import React, { useEffect } from 'react'
import { Layout } from '@/features/register'
import { useRiddle } from '@/hooks/stores/useRiddle'
import { Button, Stack, TextField } from '@mui/material'

export const Register: React.FC = () => {
  const { timeUsed, completed, setTimeUsed, setCompleted } = useRiddle()

  useEffect(() => {
    if (!timeUsed && !completed) window.location.href = '/riddle'
  }, [timeUsed, completed])

  return (
    <Layout helmetProps={{ title: 'Register' }}>
      <Stack justifyContent='center' alignItems='center'>
        <Stack component='form' spacing={2}>
          <TextField label='Name' variant='filled' />
          <TextField label='Age' variant='filled' />
          <TextField label='Phone Number' variant='filled' />
          <TextField label='Email' variant='filled' />
          <TextField label='Address' variant='filled' />
          <TextField label='Invited By' variant='filled' />
        </Stack>
        <Button
          variant='contained'
          onClick={() => {
            setTimeUsed(null)
            setCompleted(false)
          }}
          sx={{ marginTop: '2rem' }}
        >
          Undone
        </Button>
      </Stack>
    </Layout>
  )
}
