import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_MISSIONS, PaginationInput } from '@/graphql'
import { GetMissions, GetMissionsVariables } from '@/graphql/types/GetMissions'

export const useFetchMissions = (page: PaginationInput) => {
  const { refetch: _fetchMissions } = useQuery<GetMissions, GetMissionsVariables>(GET_MISSIONS, { skip: true })
  const [missions, setMissions] = useState<ApolloQueryResult<GetMissions>>()

  const fetchMissions = useCallback(async () => {
    const res = await _fetchMissions({ page })
    setMissions(res)
  }, [_fetchMissions, page])

  return { missions, fetchMissions }
}
