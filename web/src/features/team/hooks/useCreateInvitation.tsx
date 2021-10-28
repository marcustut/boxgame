import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { CREATE_INVITATION } from '@/graphql'
import { CreateInvitation, CreateInvitationVariables } from '@/graphql/types/CreateInvitation'

export const useCreateInvitation = () => {
  const [_createInvitation] = useMutation<CreateInvitation, CreateInvitationVariables>(CREATE_INVITATION)

  const createInvitation = useCallback(
    async (param: { from: string; to: string; teamId: string }) => {
      const result = await _createInvitation({ variables: { param } })
      return result
    },
    [_createInvitation]
  )

  return { createInvitation }
}
