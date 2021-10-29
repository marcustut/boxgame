import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { ACCEPT_INVITATION } from '@/graphql'
import { AcceptInvitation, AcceptInvitationVariables } from '@/graphql/types/AcceptInvitation'
import { useAuth } from '@/lib/auth'

export const useAcceptInvitation = () => {
  const { refetch } = useAuth()
  const [_acceptInvitation] = useMutation<AcceptInvitation, AcceptInvitationVariables>(ACCEPT_INVITATION)

  const acceptInvitation = useCallback(
    async (invitation_id: string) => {
      const res = await _acceptInvitation({
        variables: { invitation_id },
        update: async () => await refetch()
      })
      return res
    },
    [_acceptInvitation, refetch]
  )

  return { acceptInvitation }
}
