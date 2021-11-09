import { ApolloQueryResult } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_DISCOVERY, useQueryWithTypes } from '@/graphql'
import { GetDiscovery, GetDiscoveryVariables } from '@/graphql/types/GetDiscovery'

export const useFetchDiscovery = () => {
  const { refetch: _fetchDiscovery } = useQueryWithTypes<GetDiscovery, GetDiscoveryVariables>(GET_DISCOVERY, {
    skip: true
  })
  const [discovery, setDiscovery] = useState<ApolloQueryResult<GetDiscovery>>()

  const fetchDiscovery = useCallback(
    async (team_id: string) => {
      const res = await _fetchDiscovery({ team_id })
      setDiscovery(res)
      return res
    },
    [_fetchDiscovery]
  )

  return { discovery, fetchDiscovery }
}
