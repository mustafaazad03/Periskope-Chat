import type { ChatData, Message, MessagePopulated, User } from "@/types/index"

// Create a set of mock users that can be used across chats
const mockUsers: any[] = [
  { id: "u1", full_name: "Roshnag Airtel", phone: "+91 63646 47925" },
  { id: "u2", full_name: "Roshnag Jio", phone: "+91 73646 48925" },
  { id: "u3", full_name: "Bharat Kumar Ramesh", phone: "+91 83646 49925" },
  { id: "u4", full_name: "Periskope", avatar: "/periskope-logo.svg", phone: "+91 99718 44008" },
  { id: "u5", full_name: "Support2", phone: "+91 99718 44009" },
  { id: "u6", full_name: "Rohosen", phone: "+91 92896 66999" },
  { id: "u7", full_name: "Swapnika", phone: "+91 99999 99999" }
]

export const mockChats: ChatData[] = [
  {
    id: "1",
    name: "Test Skope Final 5",
    lastMessage: "Support2: This doesn't go on Tuesday...",
    lastMessageTime: "Yesterday",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 99718 44008 +1",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [mockUsers[4], mockUsers[3]] // Support2, Periskope
  },
  {
    id: "2",
    name: "Periskope Team Chat",
    avatar_url: "/placeholder.svg?height=40&width=40",
    lastMessage: "Periskope: Test message",
    lastMessageTime: "28-Feb-25",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 99718 44008 +3",
    tags: [
      { type: "demo", label: "Demo" },
      { type: "internal", label: "Internal" },
    ],
    participants: [mockUsers[3], mockUsers[4], mockUsers[2]] // Periskope, Support2, Bharat
  },
  {
    id: "3",
    name: "+91 99999 99999",
    lastMessage: "Hi there, I'm Swapnika, Co-Founder of ...",
    lastMessageTime: "25-Feb-25",
    lastMessageStatus: "sent",
    unreadCount: 0,
    phone: "+91 92896 65999 +1",
    tags: [
      { type: "demo", label: "Demo" },
      { type: "signup", label: "Signup" },
    ],
    participants: [mockUsers[6], mockUsers[3]] // Swapnika, Periskope
  },
  {
    id: "4",
    name: "Test Demo17",
    avatar_url: "/placeholder.svg?height=40&width=40",
    lastMessage: "Rohosen: 123",
    lastMessageTime: "25-Feb-25",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 99718 44008 +1",
    tags: [
      { type: "content", label: "Content" },
      { type: "demo", label: "Demo" },
    ],
    participants: [mockUsers[5], mockUsers[3]] // Rohosen, Periskope
  },
  {
    id: "5",
    name: "Test El Centro",
    lastMessage: "Roshnag: Hello, Ahmadport!",
    lastMessageTime: "04-Feb-25",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 99718 44008",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [
      mockUsers[0], // Roshnag Airtel
      mockUsers[1], // Roshnag Jio
      mockUsers[2], // Bharat Kumar Ramesh
      mockUsers[3]  // Periskope
    ],
  },
  {
    id: "6",
    name: "Testing group",
    lastMessage: "Testing 12345",
    lastMessageTime: "27-Jan-25",
    lastMessageStatus: "sent",
    unreadCount: 0,
    phone: "+91 92896 65999",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [mockUsers[3], mockUsers[5]] // Periskope, Rohosen
  },
  {
    id: "7",
    name: "Yasin 3",
    avatar_url: "/placeholder.svg?height=40&width=40",
    lastMessage: "First Bulk Message",
    lastMessageTime: "25-Nov-24",
    lastMessageStatus: "sent",
    unreadCount: 0,
    phone: "+91 99718 44008 +3",
    tags: [
      { type: "demo", label: "Demo" },
      { type: "dont", label: "Dont Send" },
    ],
    participants: [mockUsers[3], mockUsers[2]] // Periskope, Bharat
  },
  {
    id: "8",
    name: "Test Skope Final 9473",
    lastMessage: "Heyy",
    lastMessageTime: "01-Jan-25",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 99718 44008 +1",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [mockUsers[3], mockUsers[4]] // Periskope, Support2
  },
  {
    id: "9",
    name: "Skope Demo",
    avatar_url: "/placeholder.svg?height=40&width=40",
    lastMessage: "test 123",
    lastMessageTime: "20-Dec-24",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 92896 65999",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [mockUsers[3], mockUsers[6]] // Periskope, Swapnika
  },
  {
    id: "10",
    name: "Test Demo15",
    avatar_url: "/placeholder.svg?height=40&width=40",
    lastMessage: "test 123",
    lastMessageTime: "20-Dec-24",
    lastMessageStatus: "read",
    unreadCount: 0,
    phone: "+91 92896 65999",
    tags: [{ type: "demo", label: "Demo" }],
    participants: [mockUsers[3], mockUsers[5]] // Periskope, Rohosen
  },
]

export const mockMessages: { [key: string]: any[] } = {
  "5": [
    {
      id: "1",
      text: "CVFER",
      sender: "other",
      senderName: "Roshnag Airtel",
      time: "11:51",
      date: "22-01-2025",
      phone: "+91 63646 47925",
    },
    {
      id: "2",
      text: "CDERT",
      sender: "other",
      senderName: "Roshnag Airtel",
      time: "11:54",
      date: "22-01-2025",
      phone: "+91 63646 47925",
    },
    {
      id: "3",
      text: "hello",
      sender: "me",
      senderName: "Periskope",
      time: "12:07",
      date: "22-01-2025",
      status: "read",
      phone: "+91 99718 44008",
    },
    {
      id: "4",
      text: "Hello, South Euna!",
      sender: "other",
      senderName: "Roshnag Airtel",
      time: "08:01",
      date: "23-01-2025",
      phone: "+91 63646 47925",
    },
    {
      id: "5",
      text: "Hello, Livonia!",
      sender: "other",
      senderName: "Roshnag Airtel",
      time: "08:01",
      date: "23-01-2025",
      phone: "+91 63646 47925",
    },
    {
      id: "6",
      text: "test el centro",
      sender: "me",
      senderName: "Periskope",
      time: "09:49",
      date: "23-01-2025",
      status: "read",
      phone: "+91 99718 44008",
      forwardedFrom: "bharat@nashflows.dev"
    },
    {
      id: "7",
      text: "CDERT",
      sender: "other",
      senderName: "Roshnag Airtel",
      time: "09:49",
      date: "23-01-2025",
      phone: "+91 63646 47925",
    },
    {
      id: "8",
      text: "testing",
      sender: "me",
      senderName: "Periskope",
      time: "09:49",
      date: "23-01-2025",
      status: "read",
      phone: "+91 99718 44008",
      forwardedFrom: "bharat@nashflows.dev"
    },
  ],
}