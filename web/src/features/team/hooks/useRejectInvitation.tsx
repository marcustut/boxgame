import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { REJECT_INVITATION } from '@/graphql'
import { RejectInvitation, RejectInvitationVariables } from '@/graphql/types/RejectInvitation'
import { useAuth } from '@/lib/auth'

export const useRejectInvitation = () => {
  const { refetch } = useAuth()
  const [_rejectInvitation] = useMutation<RejectInvitation, RejectInvitationVariables>(REJECT_INVITATION)

  const rejectInvitation = useCallback(
    async (invitation_id: string) => {
      const res = await _rejectInvitation({ variables: { invitation_id }, update: async () => await refetch() })
      return res
    },
    [_rejectInvitation, refetch]
  )

  return { rejectInvitation }
}
