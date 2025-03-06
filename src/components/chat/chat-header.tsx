import type { ChatData } from "@/types/index"
import { Search, Phone, Video, MoreVertical } from "lucide-react"

interface ChatHeaderProps {
  chat: ChatData
}

export default function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
      <div className="flex items-center">
        <h2 className="font-medium">{chat.name}</h2>
        {chat.participants && <p className="text-sm text-gray-500 ml-2">{chat.participants.join(", ")}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Phone className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Video className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

