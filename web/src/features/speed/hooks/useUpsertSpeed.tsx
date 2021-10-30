import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { GET_SPEED, UpsertSpeedInput, UPSERT_SPEED } from '@/graphql'
import { GetSpeed, GetSpeedVariables } from '@/graphql/types/GetSpeed'
import { UpsertSpeed, UpsertSpeedVariables } from '@/graphql/types/UpsertSpeed'

export const useUpsertSpeed = () => {
  const [_upsertSpeed] = useMutation<UpsertSpeed, UpsertSpeedVariables>(UPSERT_SPEED)

  const upsertSpeed = useCallback(
    async (param: UpsertSpeedInput) => {
      const result = await _upsertSpeed({
        variables: { param },
        update: (cache, { data }) => {
          try {
            const speed = cache.readQuery<GetSpeed, GetSpeedVariables>({
              query: GET_SPEED,
              variables: { team_id: param.teamId }
            })
            if (!speed || speed.speed || !data || !data.upsertSpeed) {
              console.error('error getting GET_SPEED cache from apollo')
              return
            }

            cache.writeQuery<GetSpeed, GetSpeedVariables>({
              query: GET_SPEED,
              variables: { team_id: param.teamId },
              data: {
                speed: data.upsertSpeed
              }
            })
          } catch (err) {
            console.error(err)
          }
        }
      })
      return result
    },
    [_upsertSpeed]
  )

  return { upsertSpeed }
}
