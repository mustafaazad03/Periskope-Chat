# Periskope Chat Application

[Screencast from 08-03-25 04:49:47 PM IST.webm](https://github.com/user-attachments/assets/9f72a3bb-261e-4c3d-8ea8-997f01bd771d)

## Overview

Periskope Chat is a modern, real-time messaging application built with Next.js and Supabase. This project demonstrates a fully functional chat system with features similar to popular messaging platforms like WhatsApp, while maintaining a clean and intuitive user interface.

## Features

- **Authentication System**
  - User signup and login
  - Password recovery
  - Profile management

- **Real-time Messaging**
  - Individual and group chats
  - Message status indicators (sent, delivered, read)
  - Message forwarding
  - File attachments

- **Advanced Chat Management**
  - Create individual and group conversations
  - Chat tagging system with customizable tags (demo, internal, signup, content)
  - User presence indicators (online status)
  - Unread message counters

- **User Interface**
  - Responsive design 
  - Light/dark theme support
  - Chat search functionality
  - User-friendly message input with emoji support

## Tech Stack

- **Frontend**
  - Next.js 15.2.0
  - React 19
  - TypeScript
  - TailwindCSS for styling
  - Shadcn UI components
  - React Icons

- **Backend**
  - Supabase (Authentication, PostgreSQL Database, Realtime subscriptions)
  - UUID for generating unique identifiers

- **Utilities**
  - date-fns for date formatting and manipulation

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn package manager
- Supabase account for backend services

### Installation

1. Clone the repository
```bash
git clone https://github.com/mustafaazad03/Periskope-Chat.git
cd Periskope-Chat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Supabase Setup

This project uses Supabase for authentication, database, and realtime features. You'll need to set up the following tables in your Supabase project:

- `users` - Store user information
- `chats` - Store chat metadata
- `chat_participants` - Link users to chats
- `messages` - Store chat messages
- `chat_tags` - Store tags associated with chats

Database schema details can be found in `src/types/database.types.ts`.

## Usage

### Authentication

The application starts with authentication. Users can:
- Sign up with email, password, full name and phone number
- Log in with existing credentials
- Manage profile information
- Sign out

### Chat Interface

Once logged in, users are presented with the main chat interface:
- Left sidebar: Shows available chats with search functionality
- Main area: Displays the selected chat with messages
- Right navigation menu: Provides additional options

### Creating a New Chat

1. Click the "+" button in the left sidebar
2. Select users to include in the chat
3. For group chats, provide a name
4. Add tags to organize chats (optional)
5. Click "Create Chat"

### Messaging

- Type in the message input at the bottom of the chat area
- Send text messages with the send button
- View message status (sent, delivered, read)
- Track when users are online with presence indicators

## Deployment

The application can be deployed to any platform that supports Next.js applications:

1. Build the production-ready application:
```bash
npm run build
# or
yarn build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Future Improvements

- Implement end-to-end encryption for enhanced security
- Add voice and video calling features
- Create mobile applications using React Native
- Enhance file sharing capabilities
- Integrate with third-party services (e.g., Google Drive, Dropbox)
