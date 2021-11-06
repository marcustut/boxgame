import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_HUMANITY } from '@/graphql'
import { GetHumanity, GetHumanityVariables } from '@/graphql/types/GetHumanity'

export const useFetchHumanity = () => {
  const { refetch: _fetchHumanity } = useQuery<GetHumanity, GetHumanityVariables>(GET_HUMANITY, { skip: true })
  const [humanity, setHumanity] = useState<ApolloQueryResult<GetHumanity>>()

  const fetchHumanity = useCallback(
    async (team_id: string) => {
      const res = await _fetchHumanity({ team_id })
      setHumanity(res)
      return res
    },
    [_fetchHumanity]
  )

  return { humanity, fetchHumanity }
}
