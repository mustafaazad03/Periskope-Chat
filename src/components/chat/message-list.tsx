"use client"

import { useEffect, useRef } from "react"
import type { ChatData, Message } from "@/types/index"
import { Check, CheckCheck } from "lucide-react"

interface MessageListProps {
  chat: ChatData
  messages: Message[]
}

export default function MessageList({ chat, messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Handle empty messages array
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No messages yet</p>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((message) => {
    if (!groupedMessages[message.date]) {
      groupedMessages[message.date] = []
    }
    groupedMessages[message.date].push(message)
  })

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {Object.keys(groupedMessages).map((date) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{date}</span>
          </div>

          {groupedMessages[date].map((message, index) => (
            <MessageItem
              key={index}
              message={message}
              isOwnMessage={message.sender === "me"}
              showSender={index === 0 || groupedMessages[date][index - 1].sender !== message.sender}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

interface MessageItemProps {
  message: Message
  isOwnMessage: boolean
  showSender: boolean
}

function MessageItem({ message, isOwnMessage, showSender }: MessageItemProps) {
  return (
    <div className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        {showSender && !isOwnMessage && (
          <div className="text-sm font-medium text-gray-600 mb-1">
            {message.senderName}
            {message.phone && <span className="text-xs text-gray-500 ml-2">{message.phone}</span>}
          </div>
        )}

        <div
          className={`rounded-lg p-3 ${
            isOwnMessage ? "bg-green-100 text-gray-800" : "bg-white text-gray-800 border border-gray-200"
          }`}
        >
          <p className="text-sm">{message.text}</p>
          <div className="flex justify-end items-center mt-1 gap-1">
            <span className="text-xs text-gray-500">{message.time}</span>
            {isOwnMessage &&
              (message.status === "read" ? (
                <CheckCheck className="h-3 w-3 text-green-600" />
              ) : (
                <Check className="h-3 w-3 text-gray-400" />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

