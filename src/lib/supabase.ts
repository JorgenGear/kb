import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Repository helpers
export const createRepository = async (name: string, description: string, userId: string) => {
  const { data, error } = await supabase
    .from('repositories')
    .insert([
      { name, description, user_id: userId }
    ])
    .select()
    .single()
  
  return { data, error }
}

export const getRepositories = async (userId: string) => {
  const { data, error } = await supabase
    .from('repositories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Document helpers
export const createDocument = async (
  title: string,
  content: string,
  repositoryId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      { 
        title,
        content,
        repository_id: repositoryId,
        user_id: userId
      }
    ])
    .select()
    .single()
  
  return { data, error }
}

export const getDocuments = async (repositoryId: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('repository_id', repositoryId)
    .order('updated_at', { ascending: false })
  
  return { data, error }
} 