import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_API_URL}/${import.meta.env.DEV ? 'dev' : 'production'}/graphql`,
  cache: new InMemoryCache()
})
