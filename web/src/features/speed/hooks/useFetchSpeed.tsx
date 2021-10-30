import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_SPEED } from '@/graphql'
import { GetSpeed, GetSpeedVariables } from '@/graphql/types/GetSpeed'

export const useFetchSpeed = () => {
  const { refetch: _fetchSpeed } = useQuery<GetSpeed, GetSpeedVariables>(GET_SPEED, { skip: true })
  const [speed, setSpeed] = useState<ApolloQueryResult<GetSpeed>>()

  const fetchSpeed = useCallback(
    async (team_id: string) => {
      const res = await _fetchSpeed({ team_id })
      setSpeed(res)
      return res
    },
    [_fetchSpeed]
  )

  return { speed, fetchSpeed }
}
