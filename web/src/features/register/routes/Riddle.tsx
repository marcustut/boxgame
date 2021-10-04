import React from 'react'

import { useRiddle } from '@/hooks/stores/useRiddle'
import { Layout } from '@/features/register'
import { gql, useQuery } from '@apollo/client'

export const Riddle: React.FC = () => {
  const { setTimeUsed, setCompleted } = useRiddle()

  const { loading, error, data } = useQuery(gql`
    query TestData {
      users {
        id
      }
    }
  `)

  return (
    <Layout helmetProps={{ title: 'Riddle' }}>
      <pre>{JSON.stringify(loading)}</pre>
      <pre>{JSON.stringify(error)}</pre>
      <pre>{JSON.stringify(data)}</pre>
      <div>Riddle... (with countdown and stuff)</div>
      <button
        onClick={() => {
          setTimeUsed(123)
          setCompleted(true)
        }}
      >
        Done
      </button>
    </Layout>
  )
}
