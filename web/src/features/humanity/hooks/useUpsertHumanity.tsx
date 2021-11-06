import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { GET_HUMANITY, UpsertHumanityInput, UPSERT_HUMANITY } from '@/graphql'
import { GetHumanity, GetHumanityVariables } from '@/graphql/types/GetHumanity'
import { UpsertHumanity, UpsertHumanityVariables } from '@/graphql/types/UpsertHumanity'

export const useUpsertHumanity = () => {
  const [_upsertHumanity] = useMutation<UpsertHumanity, UpsertHumanityVariables>(UPSERT_HUMANITY)

  const upsertHumanity = useCallback(
    async (param: UpsertHumanityInput) => {
      const result = await _upsertHumanity({
        variables: { param },
        update: (cache, { data }) => {
          try {
            const humanity = cache.readQuery<GetHumanity, GetHumanityVariables>({
              query: GET_HUMANITY,
              variables: { team_id: param.teamId }
            })
            if (!humanity || humanity.humanity || !data || !data.upsertHumanity) {
              console.error('error getting GET_HUMANITY cache from apollo')
              return
            }

            cache.writeQuery<GetHumanity, GetHumanityVariables>({
              query: GET_HUMANITY,
              variables: { team_id: param.teamId },
              data: {
                humanity: data.upsertHumanity
              }
            })
          } catch (err) {
            console.error(err)
          }
        }
      })
      return result
    },
    [_upsertHumanity]
  )

  return { upsertHumanity }
}
