'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ChatInterface from "@/components/chat-interface"
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [dbInitialized, setDbInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user])

  // Verify database connection on load
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // Simple ping to Supabase to verify connection works
        const { data, error } = await supabase.from('users').select('count').limit(1)
        
        if (error) {
          console.error('Database connection error:', error)
          setError('Failed to connect to the database. Please try again later.')
          return
        }
        
        setDbInitialized(true)
      } catch (err) {
        console.error('Fatal database error:', err)
        setError('Something went wrong. Please refresh or try again later.')
      }
    }

    if (user) {
      checkDbConnection()
    }
  }, [user])

  // Show loading state while authentication is checking
  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading your conversations...</p>
      </div>
    )
  }

  // Show error state if database connection failed
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Connection Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  // Render the chat interface only if authenticated
  return (
    <main className="h-screen w-full">
      {user && <ChatInterface />}
    </main>
  )
}