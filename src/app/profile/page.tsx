'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const { data } = await getCurrentUser()
      
      if (!data.user) {
        router.push('/login')
        return
      }
      
      setUser(data.user)
      
      // Get profile data from the users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
        
      if (profile) {
        setDisplayName(profile.display_name || '')
      }
      
      setLoading(false)
    }
    
    loadUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          display_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (error) {
        throw error
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-black">Your Profile</h1>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full p-2 border rounded text-black bg-gray-100"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="submit"
              className={`flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
            
            <button 
              type="button"
              onClick={handleSignOut}
              className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
            >
              Sign Out
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t">
          <button 
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-700"
          >
            ← Back to Chat
          </button>
        </div>
      </div>
    </div>
  )
}