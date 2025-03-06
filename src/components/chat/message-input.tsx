"use client"

import type React from "react"

import { useState } from "react"
import { Paperclip, Smile, Mic, Clock, Image, Send } from "lucide-react"

export default function MessageInput() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Send message logic would go here
      setMessage("")
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-green-600">
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
            <path d="M3 3h18v18H3z"></path>
          </svg>
        </button>
        <span className="text-sm text-gray-500">WhatsApp</span>
        <span className="text-sm text-gray-400 mx-1">|</span>
        <button className="text-yellow-500 hover:text-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-5-5 1.4-1.4L11 14.2l7.6-7.6L20 8l-9 9z"></path>
          </svg>
        </button>
        <span className="text-sm text-gray-500">Private Note</span>
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 border border-gray-300 rounded-lg bg-white p-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full resize-none outline-none text-sm min-h-[24px] max-h-[120px]"
            rows={1}
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Paperclip className="h-5 w-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Smile className="h-5 w-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Mic className="h-5 w-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Clock className="h-5 w-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-700">
                <Image className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:opacity-50"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="M12 8v4l2 2"></path>
            </svg>
          </div>
          <span className="text-sm text-gray-500">Periskope</span>
        </div>

        <button className="text-gray-400 hover:text-gray-600">
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
            <path d="M12 3v18"></path>
            <path d="M5 10l7-7 7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

