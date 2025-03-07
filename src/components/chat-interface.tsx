"use client"

import { mockChats, mockMessages } from "@/data/mockData"
import { ChatData } from "@/types"
import { useState } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat/chat-area"
import NavigationMenu from "./sidebar/navigation-menu"
import Header from "./sidebar/header"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(mockChats[0])
  const [chats, setChats] = useState(mockChats)

  return (
    <div className="flex h-full w-[100vw] overflow-hidden bg-gray-100">
      <NavigationMenu />
      <div className="w-full h-full">
        <Header />
      <div className="flex h-full">
        <Sidebar chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
        <div className="h-auto w-full flex mb-16">
          <ChatArea chat={selectedChat} messages={selectedChat ? mockMessages[selectedChat.id] : []} />
        </div>
      </div>
      </div>
    </div>
  )
}

