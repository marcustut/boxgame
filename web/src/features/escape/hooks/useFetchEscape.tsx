import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_ESCAPE } from '@/graphql'
import { GetEscape, GetEscapeVariables } from '@/graphql/types/GetEscape'

export const useFetchEscape = () => {
  const { refetch: _fetchEscape } = useQuery<GetEscape, GetEscapeVariables>(GET_ESCAPE, { skip: true })
  const [escape, setEscape] = useState<ApolloQueryResult<GetEscape>>()

  const fetchEscape = useCallback(
    async (team_id: string) => {
      const result = await _fetchEscape({ team_id })
      setEscape(result)
      return result
    },
    [_fetchEscape]
  )

  return { escape, fetchEscape }
}
