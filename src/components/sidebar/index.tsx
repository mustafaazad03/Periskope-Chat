import { useState } from "react"
import type { ChatData } from "@/types/index"
import { RiFolderDownloadFill } from "react-icons/ri"
import ChatList from "./chat-list"
import { Search, Filter } from "lucide-react"
import { MdCancel } from "react-icons/md"
import { BiMessageRoundedAdd } from "react-icons/bi"
import NewChatModal from "../modal/newChatModal"

interface SidebarProps {
  chats: ChatData[]
  selectedChat: ChatData | null
  onSelectChat: (chat: ChatData) => void
  isLoading: boolean
}

export default function Sidebar({ 
  chats, 
  selectedChat, 
  onSelectChat,
  isLoading 
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [activeFilters, setActiveFilters] = useState<{[key: string]: boolean}>({})
  const [newChatModalOpen, setNewChatModalOpen] = useState(false)

  // Filter chats based on search and active filters
  const filteredChats = chats.filter(chat => {
    // Apply search filter
    const matchesSearch = searchQuery.trim() === "" || 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.phone && chat.phone.includes(searchQuery));
    
    // Apply tag filters if any are active
    const hasActiveFilters = Object.values(activeFilters).some(active => active);
    if (!hasActiveFilters) return matchesSearch;
    
    const matchesFilters = chat.tags && chat.tags.some(tag => activeFilters[tag.type]);
    
    return matchesSearch && matchesFilters;
  });

  const handleNewChat = (chatId: string) => {
    // Find the newly created chat in our chats array and select it
    const newChat = chats.find(c => c.id === chatId)
    if (newChat) {
      onSelectChat(newChat)
    }
  }

  return (
    <div className="flex h-full relative">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={`flex items-center gap-1 px-2 py-1 text-sm rounded-sm relative bg-white ${Object.values(activeFilters).some(v => v) ? 'text-green-700' : 'text-gray-600'} font-semibold`}
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs">
              {Object.values(activeFilters).some(v => v) ? 'Filtered' : 'Filter'}
            </span>
            {Object.values(activeFilters).some(v => v) && (
              <MdCancel 
                className="h-3 w-3 absolute -top-1 -right-1 bg-white text-blue-400 rounded-full" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFilters({});
                }}
              />
            )}
          </button>
        </div>
        
        {showFilterOptions && (
          <div className="p-2 border-b border-gray-200 bg-white">
            <div className="text-sm font-medium mb-2">Filter by tag</div>
            <div className="flex flex-wrap gap-2">
              {['demo', 'internal', 'signup', 'content'].map(tagType => (
                <button
                  key={tagType}
                  className={`text-xs px-2 py-1 rounded ${
                    activeFilters[tagType] 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => {
                    setActiveFilters(prev => ({
                      ...prev,
                      [tagType]: !prev[tagType]
                    }));
                  }}
                >
                  {tagType.charAt(0).toUpperCase() + tagType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <ChatList 
          chats={filteredChats} 
          selectedChat={selectedChat} 
          onSelectChat={onSelectChat}
          isLoading={isLoading} 
        />
      </div>
      <button 
        className="absolute top-[85%] right-5 bg-green-500 rounded-full flex items-center justify-center p-3 z-50"
        onClick={() => setNewChatModalOpen(true)}
      >
        <BiMessageRoundedAdd className="w-5 h-5 text-white" />
      </button>
      {/* New chat modal */}
      <NewChatModal 
        isOpen={newChatModalOpen} 
        onClose={() => setNewChatModalOpen(false)} 
        onChatCreated={handleNewChat} 
      />
    </div>
  )
}