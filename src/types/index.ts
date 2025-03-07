// export interface User {
//   id: string
//   email: string
//   full_name?: string
//   display_name?: string
//   avatar_url?: string
//   created_at?: string
//   updated_at?: string
// }

// export interface Message {
//   id: string
//   chat_id: string
//   sender_id: string
//   content: string
//   type: string
//   created_at: string
//   updated_at?: string
// }

// export interface ChatParticipant {
//   id?: string
//   chat_id: string
//   user_id: string
//   user?: User
//   joined_at?: string
// }

// export interface Chat {
//   id: string
//   name: string
//   created_by: string
//   created_at: string
//   updated_at?: string
//   participants: ChatParticipant[]
//   messages: Message[]
// }

export interface User {
  id: string
  name: string
  avatar?: string
  phone?: string
}

export interface ChatData {
  id: string
  name: string
  avatar?: string
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
  sender: string
  senderName: string
  time: string
  date: string
  status?: "sent" | "delivered" | "read"
  phone?: string
  forwardedFrom?: string
  attachments?: {
    type: "image" | "document" | "audio" | "video"
    url: string
    name?: string
    size?: string
    thumbnail?: string
  }[]
}