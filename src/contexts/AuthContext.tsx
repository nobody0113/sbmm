'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('AuthProvider rendering...')
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Proper authentication state management
  useEffect(() => {
    console.log('useEffect running - supabase available:', !!supabase)
    
    // Set a timeout to ensure loading is never stuck
    const timeout = setTimeout(() => {
      console.log('Timeout reached - forcing loading to false')
      setLoading(false)
    }, 5000)
    
    // Handle implicit flow from URL hash
    const handleImplicitFlow = async () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash
        console.log('Current URL hash:', hash)
        if (hash && hash.includes('access_token')) {
          console.log('Processing implicit flow from hash:', hash.substring(0, 50) + '...')
          
          // Parse the hash parameters manually
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          
          console.log('Extracted tokens:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken })
          
          if (accessToken) {
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              })
              
              console.log('Set session result:', { error: !!error, hasSession: !!data.session, errorDetails: error })
              
              if (!error && data.session) {
                console.log('Successfully processed implicit flow')
                // Clear the hash from URL
                window.history.replaceState({}, document.title, window.location.pathname)
                return
              } else {
                console.error('Error processing implicit flow:', error)
              }
            } catch (err) {
              console.error('Exception in setSession:', err)
            }
          }
        }
      }
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Starting getInitialSession...')
        await handleImplicitFlow()
        console.log('Getting session from Supabase...')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Initial session:', session?.user?.email || 'No session')
        setSession(session)
        setUser(session?.user ?? null)
        console.log('Setting loading to false')
        setLoading(false)
        clearTimeout(timeout)
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setLoading(false)
        clearTimeout(timeout)
      }
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email || 'No user')
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          clearTimeout(timeout)
        }
      )

      return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      clearTimeout(timeout)
      return () => clearTimeout(timeout)
    }
  }, [])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
