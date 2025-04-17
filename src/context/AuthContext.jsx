import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SESSION_DURATION = 3600 // 1 hour in seconds

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleAuthStateChange = (_event, session) => {
    setUser(session?.user ?? null)
    setLoading(false)
  }

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Error in signUp:', error)
      return { data: null, error }
    }
  }

  const signIn = async ({ email, password, options = {} }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          ...options,
          sessionDuration: options.rememberMe ? SESSION_DURATION * 24 : SESSION_DURATION // 24 hours if remember me
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Error in signOut:', error)
      return { error }
    }
  }

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}