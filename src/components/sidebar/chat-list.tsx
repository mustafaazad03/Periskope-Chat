import type { ChatData } from "@/types/index"
import { Check, CheckCheck, Phone } from "lucide-react"

interface ChatListProps {
  chats: ChatData[]
  selectedChat: ChatData | null
  onSelectChat: (chat: ChatData) => void
}

export default function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
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
  return (
    <div
      className={`flex p-3 border-b border-gray-100 cursor-pointer ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"}`}
      onClick={onClick}
    >
      <div className="w-10 h-10 mr-3">
        {chat.avatar ? (
          <img
            src={chat.avatar || "/placeholder.svg"}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {chat.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-1">{chat.lastMessageTime}</span>
        </div>

        <div className="flex items-center mt-1">
          {chat.lastMessageStatus === "sent" && <Check className="h-3 w-3 text-gray-400 mr-1" />}
          {chat.lastMessageStatus === "read" && <CheckCheck className="h-3 w-3 text-gray-400 mr-1" />}
          {chat.lastMessageType === "phone" && <Phone className="h-3 w-3 text-gray-400 mr-1" />}
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
        </div>

        <div className="flex items-center mt-1 gap-2">
          {chat.phone && (
            <div className="flex items-center text-xs text-gray-400">
              <Phone className="h-3 w-3 mr-1" />
              <span>{chat.phone}</span>
            </div>
          )}

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

          {chat.unreadCount > 0 && (
            <span className="ml-auto flex items-center justify-center w-5 h-5 bg-green-600 text-white text-xs rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

