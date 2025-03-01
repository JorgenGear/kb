import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { username?: string; fullName?: string; avatarUrl?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    navigate('/')
  }

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    const { error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username,
          full_name: fullName
        }
      }
    })
    if (signUpError) throw signUpError

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: (await supabase.auth.getUser()).data.user?.id,
          username,
          full_name: fullName
        }
      ])
    
    if (profileError) throw profileError
    
    navigate('/login')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    navigate('/login')
  }

  const updateProfile = async (data: { username?: string; fullName?: string; avatarUrl?: string }) => {
    if (!user) throw new Error('No user logged in')

    const updates = {
      id: user.id,
      updated_at: new Date().toISOString(),
      ...(data.username && { username: data.username }),
      ...(data.fullName && { full_name: data.fullName }),
      ...(data.avatarUrl && { avatar_url: data.avatarUrl })
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(updates)

    if (error) throw error
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 