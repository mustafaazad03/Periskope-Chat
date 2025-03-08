"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChatData, MessagePopulated } from "@/types"
import Sidebar from "./sidebar"
import ChatArea from "./chat/chat-area"
import NavigationMenu from "./sidebar/navigation-menu"
import Header from "./sidebar/header"
import { useAuth } from "@/context/AuthContext"
import { 
  getChats, 
  getMessages, 
  sendMessage, 
  markMessagesAsRead, 
  subscribeToNewMessages, 
  subscribeToMessageStatus, 
  subscribeToChats 
} from "@/service/chatService"
import RightNavigationMenu from "./sidebar/right-sidebar"

export default function ChatInterface() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [chats, setChats] = useState<ChatData[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null)
  const [messages, setMessages] = useState<MessagePopulated[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user])

  // Fetch chats on component mount
  useEffect(() => {
    if (!user) return

    const loadChats = async () => {
      try {
        setLoading(true);
        console.log("Fetching chats...");
        const fetchedChats = await getChats();
        console.log("Received chats:", fetchedChats);
        
        if (fetchedChats.length === 0) {
          console.log("No chats returned from API");
        }
        
        setChats(fetchedChats);
        
        // Select first chat if available and none is selected
        if (fetchedChats.length > 0 && !selectedChat) {
          setSelectedChat(fetchedChats[0]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    loadChats()

    // Subscribe to chat updates (new chats, participants, etc)
    const unsubscribeFromChats = subscribeToChats(() => {
      loadChats() // Reload chats when there are changes
    })

    return () => {
      unsubscribeFromChats()
    }
  }, [user])

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (!selectedChat) return

    const loadMessages = async () => {
      try {
        const fetchedMessages = await getMessages(selectedChat.id)
        setMessages(fetchedMessages)
        
        // Mark messages as read when chat is selected
        await markMessagesAsRead(selectedChat.id)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }

    loadMessages()

    // Subscribe to new messages
    const unsubscribeFromMessages = subscribeToNewMessages(
      selectedChat.id,
      (newMessage) => {
        if (!user?.email) return;
        const populatedMessage: MessagePopulated = {
          ...newMessage,
          user: {
            ...user,
            email: user.email
          },
          chat: selectedChat
        }
        setMessages(prev => [...prev, populatedMessage])
        markMessagesAsRead(selectedChat.id)
      }
    )

    // Subscribe to message status updates
    const unsubscribeFromStatus = subscribeToMessageStatus(
      selectedChat.id,
      (messageId, status) => {
        setMessages(prev => 
          prev.map(message => 
            message.id === messageId 
              ? { ...message, status: status as "sent" | "delivered" | "read" } 
              : message
          )
        )
      }
    )

    return () => {
      unsubscribeFromMessages()
      unsubscribeFromStatus()
    }
  }, [selectedChat])

  const handleSelectChat = async (chat: ChatData) => {
    setSelectedChat(chat)
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedChat || !text.trim()) return

    try {
      const newMessage = await sendMessage(selectedChat.id, text)
      if (newMessage) {
        // Update will come through subscription, but we can also update local state
        if (!user?.email) throw new Error("User email is required");
        const populatedMessage: MessagePopulated = {
          ...newMessage,
          user: {
            ...user,
            email: user.email
          },
          chat: selectedChat
        }
        setMessages(prev => [...prev, populatedMessage])
      }
    } catch (err) {
      console.error("Error sending message:", err)
    }
  }

  // Show loading state while authentication is being checked
  if (authLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-full w-[100vw] overflow-hidden bg-gray-100">
      <NavigationMenu />
      <div className="w-full h-full">
        <Header />
        <div className="flex h-full">
          <Sidebar 
            chats={chats} 
            selectedChat={selectedChat} 
            onSelectChat={handleSelectChat}
            isLoading={loading}
          />
          <div className="h-auto w-full flex mb-16">
            <ChatArea 
              chat={selectedChat} 
              messages={messages} 
              onSendMessage={handleSendMessage}
            />
          </div>
          <RightNavigationMenu />
        </div>
      </div>
    </div>
  )
}