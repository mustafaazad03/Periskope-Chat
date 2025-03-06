import type { ChatData } from "@/types/index"
import NavigationMenu from "./navigation-menu"
import ChatList from "./chat-list"
import { Search, Filter } from "lucide-react"

interface SidebarProps {
  chats: ChatData[]
  selectedChat: ChatData | null
  onSelectChat: (chat: ChatData) => void
}

export default function Sidebar({ chats, selectedChat, onSelectChat }: SidebarProps) {
  return (
    <div className="flex h-full">
      <NavigationMenu />
      <div className="w-[360px] flex flex-col border-r border-gray-200 bg-white">
        <div className="p-2 flex items-center gap-2 border-b border-gray-200">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <span>chats</span>
            </div>
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 4v16"></path>
              <path d="M9 4v16"></path>
              <path d="M14 4v16"></path>
              <path d="M19 4v16"></path>
              <path d="M4 9h16"></path>
              <path d="M4 14h16"></path>
            </svg>
            <span className="sr-only">Refresh</span>
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <span className="sr-only">Help</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-2 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-white text-green-600 px-2 py-1 rounded-md border border-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
            </svg>
            <span className="text-sm">Custom filter</span>
          </div>
          <button className="px-3 py-1 text-sm text-gray-500">Save</button>

          <div className="flex items-center ml-2 flex-1 relative">
            <Search className="h-4 w-4 absolute left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded-md"
            />
          </div>

          <button className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-md">
            <Filter className="h-4 w-4" />
            <span>Filtered</span>
          </button>
        </div>

        <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={onSelectChat} />
      </div>
    </div>
  )
}

