import { QueryHookOptions, TypedDocumentNode, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

export function useQueryWithTypes<TData, TVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
) {
  const result = useQuery(query, options)

  const [data, setData] = useState<TData | undefined>(undefined)
  useEffect(() => {
    if (result.data !== undefined) {
      setData(result.data)
    }
  }, [result.data])

  return { ...result, data }
}
