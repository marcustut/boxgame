import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { CREATE_TEAM } from '@/graphql'
import { CreateTeam, CreateTeamVariables } from '@/graphql/types/CreateTeam'

export const useCreateTeam = () => {
  const [_createTeam] = useMutation<CreateTeam, CreateTeamVariables>(CREATE_TEAM)

  const createTeam = useCallback(
    async ({ name, avatarUrl, clusterId }: { name: string; avatarUrl?: string; clusterId?: string }) => {
      const result = await _createTeam({
        variables: { param: { name, avatarUrl, clusterId } }
      })
      return result
    },
    [_createTeam]
  )

  return { createTeam }
}
