export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  display_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface ChatData {
  id: string
  name: string
  avatar_url?: string
  lastMessage: string
  lastMessageTime: string
  lastMessageStatus?: "sent" | "delivered" | "read"
  lastMessageType?: "text" | "image" | "phone"
  unreadCount: number
  phone?: string
  participants: User[]
  tags?: {
    type: string
    label: string
  }[]
}

export interface Message {
  id: string
  text: string
  chat_id: string
  user_id: string
  created_at: string
  updated_at?: string
  status: "sent" | "delivered" | "read"
  forwardedFrom?: string
  attachmentUrl?: string
  attachmentType?: string
}

export interface MessagePopulated extends Message {
  user: User
  chat: ChatData
}