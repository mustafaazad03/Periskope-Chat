import type { ChatData, Message } from "@/types/index"
import ChatHeader from "./chat-header"
import MessageList from "./message-list"
import MessageInput from "./message-input"

interface ChatAreaProps {
  chat: ChatData | null
  messages: Message[] | undefined
}

export default function ChatArea({ chat, messages = [] }: ChatAreaProps) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chat={chat} />
      <MessageList chat={chat} messages={messages || []} />
      <MessageInput />
    </div>
  )
}

