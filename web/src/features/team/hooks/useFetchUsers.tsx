import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_USERS, PaginationInput } from '@/graphql'
import { GetUsers, GetUsersVariables } from '@/graphql/types/GetUsers'

export const useFetchUsers = () => {
  const { refetch: _fetchUsers } = useQuery<GetUsers, GetUsersVariables>(GET_USERS, { skip: true })
  const [users, setUsers] = useState<ApolloQueryResult<GetUsers>>()

  const fetchUsers = useCallback(
    async (page: PaginationInput) => {
      const res = await _fetchUsers({ page })
      setUsers(res)
      return res
    },
    [_fetchUsers]
  )

  return { users, fetchUsers }
}
