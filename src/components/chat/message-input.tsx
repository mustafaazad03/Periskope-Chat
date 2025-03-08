"use client"

import type React from "react"
import { useState } from "react"
import { FaCircleInfo } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa6";
import { PiClockClockwise } from "react-icons/pi";
import { BsStars } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import Image from 'next/image';
import { FiPaperclip } from "react-icons/fi";
import { CiFaceSmile } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa6";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-none absolute -top-9">
        <FaCircleChevronDown className="w-3 h-3 text-gray-400 ml-2" />
        <div className="border-gray-200 bg-white text-green-500 rounded-t-lg flex items-center gap-2 p-2 px-3">
          <span className="text-sm font-medium">WhatsApp</span>
          <FaCircleInfo className="w-3 h-3 text-gray-400" />
        </div>
        <button className="text-yellow-700 hover:text-yellow-900 bg-white rounded-t-lg flex items-center gap-2 p-2 px-3">
          <span className="text-sm font-medium">Private Note</span>
          <FaCircleInfo className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white px-2" onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
        <div className="flex-1 w-full justify-between items-start p-2 flex">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full resize-none outline-none text-sm min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <button
            type="submit"
            className="bg-white text-green-600 p-2 rounded-full hover:text-green-700 disabled:opacity-50"
            disabled={!message.trim()}
          >
            <IoSend className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 py-2 px-2">
          <div className="flex items-center gap-4">
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <FiPaperclip className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <CiFaceSmile className="h-6 w-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <FaRegClock className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <PiClockClockwise className="h-6 w-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <BsStars className="h-6 w-6" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <IoDocumentText className="h-5 w-5" />
            </button>
            <button type="button" className="text-gray-500 hover:text-gray-700">
              <FaMicrophone className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-between bg-white border border-gray-50 rounded-lg w-auto p-2 px-3">
            <div className="flex items-center gap-1">
              <Image src="/logo.jpeg" width={16} height={16} quality={100} alt="Logo" />
              <span className="text-sm text-gray-500">Periskope</span>
            </div>

            <button className="text-gray-400 hover:text-gray-600 ml-6">
              <Image src="/left-right-arrow.png" alt="left-right-arrow" width={12} height={12} quality={100} className='rotate-90' />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

