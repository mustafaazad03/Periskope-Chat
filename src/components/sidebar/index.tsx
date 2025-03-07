import type { ChatData } from "@/types/index"
import { RiFolderDownloadFill } from "react-icons/ri";
import ChatList from "./chat-list"
import { Search, Filter } from "lucide-react"
import { MdCancel } from "react-icons/md";

interface SidebarProps {
  chats: ChatData[]
  selectedChat: ChatData | null
  onSelectChat: (chat: ChatData) => void
}

export default function Sidebar({ chats, selectedChat, onSelectChat }: SidebarProps) {
  return (
    <div className="flex h-full">
      <div className="w-[360px] flex flex-col border-r border-gray-200 bg-gray-100">

        <div className="flex items-center gap-2 p-2 border-b border-gray-200">
          <div className="flex items-center gap-1 text-green-600 px-2 py-1">
            <RiFolderDownloadFill className="h-4 w-4" />
            <span className="text-xs font-semibold">Custom filter</span>
          </div>
          <button className="p-1 px-2 text-gray-500 bg-white rounded-sm border-2 hover:bg-gray-100 border-gray-300 flex items-center gap-2 -ml-2">
            <span className="text-xs font-semibold">Save</span>
          </button>

          <div className="flex items-center ml-1 flex-1 relative">
            <Search className="h-4 w-4 absolute left-2 text-black" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-7 pr-2 py-1 text-xs text-black placeholder:text-black border border-gray-300 rounded-sm bg-white"
            />
          </div>
          <button
            className={`flex items-center gap-1 px-2 py-1 text-sm rounded-sm relative bg-white text-green-700 font-semibold`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs">Filtered</span>
            <MdCancel className="h-3 w-3 absolute -top-1 -right-1 bg-white text-blue-400 rounded-full" />
          </button>
        </div>
        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={onSelectChat} />
      </div>
    </div>
  )
}

