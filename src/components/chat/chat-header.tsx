import type { ChatData, User } from "@/types/index"
import { Search } from "lucide-react"
import { HiSparkles } from "react-icons/hi2";

interface ChatHeaderProps {
  chat: ChatData
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <div className="w-10 h-10 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
          {chat.avatar_url ? (
            <img
              src={chat.avatar_url}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg text-gray-600">{chat.name.charAt(0)}</span>
          )}
        </div>
        
        <div>
          <h2 className="font-medium text-gray-800">{chat.name}</h2>
          {chat.participants && chat.participants.length > 0 && (
            <p className="text-xs text-gray-500">
              {chat.participants.map((p: User) => p.full_name).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex mr-4">
          {chat.participants && chat.participants.length > 0 && (
            <div className="flex -space-x-2">
              {chat.participants.slice(0, 4).map((user: User, index: number) => (
                <div 
                  key={index} 
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 overflow-hidden"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    (user.full_name as string).charAt(0)
                  )}
                </div>
              ))}
              
              {chat.participants.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 text-white text-xs flex items-center justify-center">
                  +{chat.participants.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <HiSparkles className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}