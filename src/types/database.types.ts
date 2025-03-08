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
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          is_group: boolean
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_group: boolean
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          is_group?: boolean
          created_by?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          created_at: string
          updated_at: string
          role: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          role?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          role?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          text: string
          created_at: string
          updated_at: string
          status: string
          forwarded_from: string | null
          attachment_url: string | null
          attachment_type: string | null
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          text: string
          created_at?: string
          updated_at?: string
          status?: string
          forwarded_from?: string | null
          attachment_url?: string | null
          attachment_type?: string | null
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          text?: string
          created_at?: string
          updated_at?: string
          status?: string
          forwarded_from?: string | null
          attachment_url?: string | null
          attachment_type?: string | null
        }
      }
      chat_tags: {
        Row: {
          id: string
          chat_id: string
          type: string
          label: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          type: string
          label: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          type?: string
          label?: string
          created_at?: string
        }
      }
    }
    Views: {
      chat_with_last_message: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          is_group: boolean
          created_by: string
          last_message: string | null
          last_message_time: string | null
          last_message_status: string | null
          last_message_type: string | null
          unread_count: number
        }
      }
    }
    Functions: {
      get_unread_count: {
        Args: {
          p_chat_id: string
          p_user_id: string
        }
        Returns: number
      }
    }
  }
}