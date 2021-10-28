import { ApolloQueryResult, useQuery } from '@apollo/client'
import { useCallback, useState } from 'react'

import { GET_INVITATIONS_WITH_USER_ID, PaginationInput } from '@/graphql'
import { GetInvitationsWithUserId, GetInvitationsWithUserIdVariables } from '@/graphql/types/GetInvitationsWithUserId'

export const useFetchInvitations = () => {
  const { refetch: _fetchInvitations } = useQuery<GetInvitationsWithUserId, GetInvitationsWithUserIdVariables>(
    GET_INVITATIONS_WITH_USER_ID,
    { skip: true }
  )
  const [invitations, setInvitations] = useState<ApolloQueryResult<GetInvitationsWithUserId>>()

  const fetchInvitations = useCallback(
    async (user_id: string, page: PaginationInput) => {
      const res = await _fetchInvitations({ user_id, page })
      setInvitations(res)
      return res
    },
    [_fetchInvitations]
  )

  return { invitations, fetchInvitations }
}
