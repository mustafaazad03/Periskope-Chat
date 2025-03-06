"use client"

import { mockChats, mockMessages } from "@/data/mockData"
import { ChatData } from "@/types"
import { useState } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat/chat-area"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(mockChats[0])
  const [chats, setChats] = useState(mockChats)

  return (
    <div className="flex h-full w-full overflow-hidden bg-gray-100">
      <Sidebar chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      <ChatArea chat={selectedChat} messages={selectedChat ? mockMessages[selectedChat.id] : []} />
    </div>
  )
}

