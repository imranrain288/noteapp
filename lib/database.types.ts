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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string | null
          folder_id: string | null
          user_id: string
          is_published: boolean
          is_archived: boolean
          cover_image: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          folder_id?: string | null
          user_id: string
          is_published?: boolean
          is_archived?: boolean
          cover_image?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          folder_id?: string | null
          user_id?: string
          is_published?: boolean
          is_archived?: boolean
          cover_image?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
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
