"use client"

import { useEffect, useRef, useState } from "react"
import type { ChatData, MessagePopulated, User } from "@/types/index"
import { Check, CheckCheck } from "lucide-react"
import { RiSendPlaneFill } from "react-icons/ri";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface MessageListProps {
  chat: ChatData
  messages: MessagePopulated[]
}

export default function MessageList({ chat, messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [liveMessages, setLiveMessages] = useState<MessagePopulated[]>(messages)
  const { user } = useAuth();
  // Update liveMessages when messages prop changes
  useEffect(() => {
    setLiveMessages(messages);
  }, [messages]);

  // Set up realtime subscription
  useEffect(() => {
    if (!chat) return

    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chat.id}`
      }, (payload) => {
        setLiveMessages(prev => [...prev, payload.new as MessagePopulated])
      })
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [chat?.id])

  // Handle empty messages array
  if (!liveMessages || liveMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No messages yet</p>
      </div>
    )
  }

  // Process messages and group by date
  const groupedMessages: { [key: string]: MessagePopulated[] } = {}
  
  liveMessages.forEach((message) => {
    // Format date for grouping (YYYY-MM-DD)
    const messageDate = new Date(message.created_at);
    const dateKey = format(messageDate, "dd-MM-yyyy");
    
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }
    groupedMessages[dateKey].push(message)
  })

  return (
    <div className="flex-1 overflow-y-auto p-4 bgImage">
      {Object.keys(groupedMessages).map((date) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              {date}
            </span>
          </div>

          {groupedMessages[date].map((message, index) => {
            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwnMessage={message.user_id === user?.id}
                showSender={index === 0 || groupedMessages[date][index - 1].user_id !== message.user_id}
                previousMessage={index > 0 ? groupedMessages[date][index - 1] : null}
              />
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

interface MessageItemProps {
  message: MessagePopulated
  isOwnMessage: boolean
  showSender: boolean
  previousMessage: MessagePopulated | null
}

function MessageItem({ message, isOwnMessage, showSender, previousMessage }: MessageItemProps) {
  // Format message time
  const messageTime = format(new Date(message.created_at), "h:mm a");
  
  // Determine if this is part of a message group (same sender with short time difference)
  const isPartOfGroup = previousMessage && 
                        previousMessage.user_id === message.user_id && 
                        !showSender;

  return (
    <div className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {!isOwnMessage && showSender ? (
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
          {message.user?.full_name ? message.user.full_name.charAt(0) : '?'}
        </div>
      ) : (
        <div className="w-8 h-8 mr-2 flex-shrink-0 flex items-center justify-center text-xs">
        </div>
      )}
      
      <div className={`max-w-[70%] rounded-md p-1 px-2 shadow-sm ${isOwnMessage ? "bg-green-100 text-gray-800" : "bg-white text-gray-800 border border-gray-100"}`}>
        {showSender && !isOwnMessage ? (
          <div className="text-sm font-semibold text-green-500 mb-1 ml-1 flex justify-between items-center">
            {message.user?.full_name}
            <span className="text-xs font-normal text-gray-500 ml-6">{message.user?.phone}</span>
          </div>
        ) : (
          <div className="text-sm font-semibold text-green-500 mb-1 ml-1 flex justify-between items-center">
            {message.user?.full_name}
            <span className="text-xs font-normal text-gray-500 ml-6">{message.user?.phone}</span>
          </div>
        )}

        <div className="ml-1 mt-1">
          <p className="text-sm pr-4 font-medium">{message?.text}</p>
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
            ) : (
              <div className=""></div>
            )}
            <div className="flex items-center gap-1 justify-end ml-6">
              <span className="text-xs text-gray-500">{messageTime}</span>
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