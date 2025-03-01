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
          default_branch: string
          is_private: boolean
          storage_path: string
          total_size: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          user_id: string
          default_branch?: string
          is_private?: boolean
          storage_path?: string
          total_size?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          user_id?: string
          default_branch?: string
          is_private?: boolean
          storage_path?: string
          total_size?: number
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
          current_version: string
          parent_version: string | null
          mime_type: string
          file_path: string | null
          file_size: number | null
          metadata: Json
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
          current_version?: string
          parent_version?: string | null
          mime_type?: string
          file_path?: string | null
          file_size?: number | null
          metadata?: Json
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
          current_version?: string
          parent_version?: string | null
          mime_type?: string
          file_path?: string | null
          file_size?: number | null
          metadata?: Json
        }
      }
      versions: {
        Row: {
          id: string
          created_at: string
          document_id: string
          content: string
          version_hash: string
          commit_message: string
          user_id: string
          parent_version: string | null
          branch: string
          file_path: string | null
          file_size: number | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          content: string
          version_hash: string
          commit_message: string
          user_id: string
          parent_version?: string | null
          branch?: string
          file_path?: string | null
          file_size?: number | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          content?: string
          version_hash?: string
          commit_message?: string
          user_id?: string
          parent_version?: string | null
          branch?: string
          file_path?: string | null
          file_size?: number | null
          metadata?: Json
        }
      }
      branches: {
        Row: {
          id: string
          created_at: string
          name: string
          repository_id: string
          latest_commit: string | null
          is_default: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          repository_id: string
          latest_commit?: string | null
          is_default?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          repository_id?: string
          latest_commit?: string | null
          is_default?: boolean
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