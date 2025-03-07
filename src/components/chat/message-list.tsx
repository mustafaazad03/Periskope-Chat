"use client"

import { useRef } from "react"
import type { ChatData, Message } from "@/types/index"
import { Check, CheckCheck } from "lucide-react"
import { RiSendPlaneFill } from "react-icons/ri";

interface MessageListProps {
  chat: ChatData
  messages: Message[]
}

export default function MessageList({ chat, messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    <div className="flex-1 overflow-y-auto p-4 bgImage">
      {Object.keys(groupedMessages).map((date) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{date}</span>
          </div>

          {groupedMessages[date].map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.sender === "me"}
              showSender={index === 0 || groupedMessages[date][index - 1].sender !== message.sender}
              previousMessage={index > 0 ? groupedMessages[date][index - 1] : null}
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
  previousMessage: Message | null
}

function MessageItem({ message, isOwnMessage, showSender, previousMessage }: MessageItemProps) {
  // Determine if this is part of a message group (same sender with short time difference)
  const isPartOfGroup = previousMessage && 
                        previousMessage.sender === message.sender && 
                        !showSender;

  return (
    <div className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {!isOwnMessage && showSender ? (
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
          {message.senderName.charAt(0)}
        </div>
      ) : (
        <div className="w-8 h-8 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
        </div>
      )}
      
      <div className={`max-w-[70%] rounded-md p-1 px-2 shadow-sm ${isOwnMessage ? "bg-green-100 text-gray-800" : "bg-white text-gray-800 border border-gray-100"}`}>
        {showSender && !isOwnMessage ? (
          <div className="text-sm font-semibold text-green-500 mb-1 ml-1 flex justify-between items-center">
            {message.senderName}
            <span className="text-xs font-normal text-gray-500 ml-6">{message.phone}</span>
          </div>
        ) : (
          <div className="text-sm font-semibold text-green-500 mb-1 ml-1 flex justify-between items-center">
            {message.senderName}
            <span className="text-xs font-normal text-gray-500 ml-6">{message.phone}</span>
          </div>
        )}

        <div
          className={`ml-1 mt-1`}
        >
          <p className="text-sm pr-4 font-medium">{message.text}</p>
          <div className="flex justify-between items-center mt-1">
          {isOwnMessage ? (
              <div className="flex items-center justify-end mt-1 gap-1">
                {message.forwardedFrom && (
                  <div className="text-xs text-gray-500 flex items-center mr-1">
                    <RiSendPlaneFill className="w-2 h-2 mr-0.5" />
                    {message.forwardedFrom}
                  </div>
                )}
              </div>
            ): (
              <div className=""></div>
            )}
            <div className="flex items-center gap-1 justify-end ml-6">
              <span className="text-xs text-gray-500">{message.time}</span>
              {isOwnMessage &&
                (message.status === "read" ? (
                  <CheckCheck className="h-3 w-3 text-blue-600" />
                ) : (
                  <Check className="h-3 w-3 text-gray-400" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}