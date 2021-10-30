import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_MISSION } from '@/graphql'
import { GetMission, GetMissionVariables } from '@/graphql/types/GetMission'

export const useFetchMission = () => {
  const { refetch: _fetchMission } = useQuery<GetMission, GetMissionVariables>(GET_MISSION, { skip: true })
  const [mission, setMission] = useState<ApolloQueryResult<GetMission>>()

  const fetchMission = useCallback(
    async (mission_id: string) => {
      const res = await _fetchMission({ mission_id })
      setMission(res)
    },
    [_fetchMission]
  )

  return { mission, fetchMission }
}
