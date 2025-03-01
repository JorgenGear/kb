import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Try to get environment variables from multiple sources
const getEnvVar = (key: string): string => {
  // @ts-ignore - these are injected by Vite
  const value = (window as any)[`__${key}__`] || import.meta.env[key]
  if (!value) {
    console.error(`Missing ${key} environment variable`)
    console.error('Current env:', import.meta.env)
    throw new Error(`Missing ${key} configuration`)
  }
  return value
}

console.log('Environment check:', {
  hasUrl: !!getEnvVar('VITE_SUPABASE_URL'),
  hasKey: !!getEnvVar('VITE_SUPABASE_ANON_KEY'),
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE
})

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL')
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')

let supabaseClient: ReturnType<typeof createClient<Database>>

try {
  console.log('Initializing Supabase client with URL:', supabaseUrl)
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  throw error
}

export const supabase = supabaseClient

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
  const storagePath = `repositories/${Date.now()}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  
  const { data, error } = await supabase
    .from('repositories')
    .insert([
      { 
        name, 
        description, 
        user_id: userId,
        storage_path: storagePath,
        total_size: 0,
        default_branch: 'main',
        is_private: false
      }
    ])
    .select()
    .single()
  
  if (!error && data) {
    // Create default 'main' branch
    await supabase
      .from('branches')
      .insert([
        {
          name: 'main',
          repository_id: data.id,
          is_default: true
        }
      ])
  }
  
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
export const createDocument = async ({
  title,
  content,
  repositoryId,
  userId,
  type = 'document',
  mimeType = 'text/plain',
  filePath = null,
  fileSize = null,
  metadata = {}
}: {
  title: string
  content: string
  repositoryId: string
  userId: string
  type?: string
  mimeType?: string
  filePath?: string | null
  fileSize?: number | null
  metadata?: any
}) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([
      { 
        title,
        content,
        repository_id: repositoryId,
        user_id: userId,
        type,
        mime_type: mimeType,
        file_path: filePath,
        file_size: fileSize,
        metadata
      }
    ])
    .select()
    .single()

  if (!error && data && fileSize) {
    // Update repository total size
    await supabase
      .from('repositories')
      .update({ 
        total_size: supabase.sql`total_size + ${fileSize}` 
      })
      .eq('id', repositoryId)
  }
  
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