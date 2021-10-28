import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { UPDATE_USER } from '@/graphql'
import { UpdateUser, UpdateUserVariables } from '@/graphql/types/UpdateUser'
import { useAuth } from '@/lib/auth'

export const useUpdateUser = () => {
  const { updateUserCache } = useAuth()
  const [_updateUser] = useMutation<UpdateUser, UpdateUserVariables>(UPDATE_USER)

  const updateUser = useCallback(
    async (user_id: string, param: { teamId: string }) => {
      const result = await _updateUser({
        variables: { user_id, param },
        update: (_cache, { data }) => {
          if (!data || !data.updateUser) return
          updateUserCache(data.updateUser)
        }
      })
      return result
    },
    [_updateUser, updateUserCache]
  )

  return { updateUser }
}
