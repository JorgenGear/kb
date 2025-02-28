export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      repositories: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          user_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          repository_id: string
          user_id: string
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          repository_id: string
          user_id: string
          type?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          repository_id?: string
          user_id?: string
          type?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 