import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { UpsertEscapeInput, UPSERT_ESCAPE } from '@/graphql'
import { UpsertEscape, UpsertEscapeVariables } from '@/graphql/types/UpsertEscape'

export const useUpsertEscape = () => {
  const [_upsertEscape] = useMutation<UpsertEscape, UpsertEscapeVariables>(UPSERT_ESCAPE)

  const upsertEscape = useCallback(
    async (param: UpsertEscapeInput) => {
      const result = await _upsertEscape({ variables: { param } })
      return result
    },
    [_upsertEscape]
  )

  return { upsertEscape }
}
