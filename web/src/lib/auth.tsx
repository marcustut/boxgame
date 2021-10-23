import React, { useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Provider, Session, User } from '@supabase/gotrue-js'
import { useQuery } from '@apollo/client'
import { GET_USER } from '@/graphql'
import { GetUser, GetUserVariables, GetUser_user } from '@/graphql/types/GetUser'
import { UserCredentials } from '@supabase/supabase-js'
import { clearItem, getItem, setItem } from '@/utils/storage'

export type UserWithAuth = {
  user: GetUser_user
  auth: Session
}

interface IAuthContext {
  signUp: (
    params: UserCredentials,
    options?:
      | {
          redirectTo?: string | undefined
          data?: object | undefined
        }
      | undefined
  ) => Promise<{
    user: User | null
    session: Session | null
    error: Error | null
    data: Session | User | null // Deprecated
  }>
  signIn: (
    params: UserCredentials,
    options?:
      | {
          redirectTo?: string | undefined
          scopes?: string | undefined
        }
      | undefined
  ) => Promise<{
    session: Session | null
    user: User | null
    provider?: Provider
    url?: string | null
    error: Error | null
    data: Session | null // Deprecated
  }>
  signOut: () => Promise<{ error: Error | null }>
  user?: UserWithAuth
  loading: boolean
}

const AuthContext = React.createContext<IAuthContext>({
  signIn: null as unknown as IAuthContext['signIn'],
  signUp: null as unknown as IAuthContext['signUp'],
  signOut: null as unknown as IAuthContext['signOut'],
  loading: false
})

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserWithAuth>()
  const [loading, setLoading] = useState<boolean>(false)
  const { refetch: fetchUser } = useQuery<GetUser, GetUserVariables>(GET_USER, { skip: true })

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session()
    const { data: cachedUser } = getItem<UserWithAuth>('token')
    ;(async () => {
      if (session && session.user) {
        setLoading(true)

        if (cachedUser) {
          setUser(cachedUser)
          setItem<UserWithAuth>('token', cachedUser)
        } else {
          const { data, error, errors } = await fetchUser({ user_id: session.user.id })
          if (error || errors || !data || !data.user) {
            console.error(errors)
            console.error(error)
            return
          }
          setUser({ user: data.user, auth: session })
          setItem<UserWithAuth>('token', { user: data.user, auth: session })
        }

        setLoading(false)
      }
    })()

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && session.user) {
        setLoading(true)

        if (cachedUser) {
          setUser(cachedUser)
          setItem<UserWithAuth>('token', cachedUser)
        } else {
          const { data, error, errors } = await fetchUser({ user_id: session.user.id })
          if (error || errors || !data || !data.user) {
            console.error(errors)
            console.error(error)
            return
          }
          setUser({ user: data.user, auth: session })
          setItem<UserWithAuth>('token', { user: data.user, auth: session })
        }

        setLoading(false)
      }
    })

    return () => {
      listener?.unsubscribe()
    }
  }, [fetchUser])

  // Will be passed down to Signup, Login and Dashboard components
  const value: IAuthContext = {
    signUp: (params, options) => supabase.auth.signUp(params, options),
    signIn: (params, options) => supabase.auth.signIn(params, options),
    signOut: () => {
      setTimeout(() => (window.location.href = '/login'), 500)
      clearItem('token')
      return supabase.auth.signOut()
    },
    user,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
