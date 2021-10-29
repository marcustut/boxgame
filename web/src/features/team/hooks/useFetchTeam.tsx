import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_TEAM } from '@/graphql'
import { GetTeam, GetTeamVariables } from '@/graphql/types/GetTeam'

export const useFetchTeam = () => {
  const { refetch: _fetchTeam } = useQuery<GetTeam, GetTeamVariables>(GET_TEAM, { skip: true })
  const [team, setTeam] = useState<ApolloQueryResult<GetTeam>>()

  const fetchTeam = useCallback(
    async (team_id: string) => {
      const res = await _fetchTeam({ team_id })
      setTeam(res)
      return res
    },
    [_fetchTeam]
  )

  return { team, fetchTeam }
}
