import { useEffect, useState } from "react"
import type { ChatData } from "@/types/index"
import { Check, CheckCheck, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase" 
import { getUser } from "@/lib/supabase"

interface ChatListProps {
  chats: ChatData[]
  selectedChat: ChatData | null
  onSelectChat: (chat: ChatData) => void
  isLoading: boolean
}

export default function ChatList({ 
  chats, 
  selectedChat, 
  onSelectChat,
  isLoading 
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    // Subscribe to unread count changes
    const setupUnreadCountSubscription = async () => {
      const user = await getUser()
      if (!user) return
      
      const channel = supabase
        .channel('chat-unread-counts')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `user_id=neq.${user.id}`
        }, payload => {
          console.log('Message status updated:', payload)
        })
        .subscribe()
        
      return () => {
        supabase.removeChannel(channel)
      }
    }
    
    setupUnreadCountSubscription()
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-3 p-3 bg-white">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white p-4 text-center">
        <div>
          <p className="text-gray-500 mb-2">No chats yet</p>
          <p className="text-sm text-gray-400">
            Create a new chat to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {filteredChats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => onSelectChat(chat)}
        />
      ))}
    </div>
  )
}

interface ChatItemProps {
  chat: ChatData
  isSelected: boolean
  onClick: () => void
}

function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
  // Track if chat has new messages since last view
  const hasNewMessages = chat.unreadCount > 0

  // Format timestamp for better display
  const formattedTime = formatLastMessageTime(chat.lastMessageTime)

  return (
    <div
      className={`flex p-3 border-b border-gray-100 cursor-pointer relative ${
        isSelected ? "bg-gray-100" : hasNewMessages ? "bg-green-50/30" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 mr-3 relative">
        {chat.avatar_url ? (
          <img
            src={chat.avatar_url || "/placeholder.svg"}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {chat.name.charAt(0)}
          </div>
        )}
        
        {/* Online status indicator - can be implemented with Supabase presence */}
        {chat.participants.some(p => p.id === "online") && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-50"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium truncate ${hasNewMessages ? "text-black" : "text-gray-900"}`}>
            {chat.name}
          </h3>
        </div>

        <div className="flex items-center mt-1">
          {chat.lastMessageStatus === "sent" && <Check className="h-3 w-3 text-gray-400 mr-1" />}
          {chat.lastMessageStatus === "read" && <CheckCheck className="h-3 w-3 text-gray-400 mr-1" />}
          {chat.lastMessageType === "phone" && <Phone className="h-3 w-3 text-gray-400 mr-1" />}
          <p className={`text-sm truncate ${hasNewMessages ? "text-black font-medium" : "text-gray-500"}`}>
            {chat.lastMessage}
          </p>
        </div>

        <div className="flex items-center mt-1 gap-2">
          {chat.phone && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-100 px-1 py-0.5 rounded-md">
              <Phone className="h-2 w-2 mr-1" />
              <span>{"+91 " + chat.phone}</span>
              {chat.participants && chat.participants.length > 1 && ( 
                <span className="ml-1 text-gray-500">{"+"}{chat.participants.length - 1}</span>
              )}
            </div>
          )}

          {chat.unreadCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 bg-green-600 text-white text-[10px] rounded-full absolute top-2 left-2">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-1">
        <div className="gap-1">
          {chat.tags &&
            chat.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-0.5 rounded-sm ${
                  tag.type === "demo"
                    ? "bg-orange-50 text-orange-600"
                    : tag.type === "internal"
                      ? "bg-green-50 text-green-600"
                      : tag.type === "signup"
                        ? "bg-blue-50 text-blue-600"
                        : tag.type === "content"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-gray-50 text-gray-600"
                }`}
              >
                {tag.label}
              </span>
          ))}
          </div>
          <div className="flex flex-col items-end gap-1 mt-1">
            {/* Participants display */}
            {chat.participants && chat.participants.length > 0 && (
              <div className="flex items-center">
                <div className="relative flex items-center">
                  <div className="w-5 h-5 p-1 rounded-full overflow-hidden border border-white bg-gray-200">
                    {chat.participants[0].avatar_url ? (
                      <img 
                        src={chat.participants[0].avatar_url} 
                        alt={chat.participants[0].full_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                        {(chat.participants[0].full_name as string).charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {chat.participants.length > 1 && (
                    <div className="w-5 h-5 p-1 rounded-full bg-green-500 text-white text-xs flex items-center justify-center ml-1">
                      {chat.participants.length - 1}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        <span className={`text-xs whitespace-nowrap ml-1 flex text-right justify-end mt-1 ${hasNewMessages ? "text-green-600 font-medium" : "text-gray-500"}`}>
          {formattedTime}
        </span>
      </div>
    </div>
  )
}

// Helper function to format timestamp
function formatLastMessageTime(timestamp: string): string {
  const now = new Date();
  
  let date;
  try {
    date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return timestamp;
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return timestamp;
  }
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Otherwise, show the full date
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}