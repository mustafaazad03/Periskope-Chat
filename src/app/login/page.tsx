'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const { signIn, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  
  useEffect(() => {
    if (user) {
      router.push(redirectUrl)
    }
    
    // Check for verification success
    const verification = searchParams.get('verified')
    if (verification === 'success') {
      setSuccessMessage('Email verified successfully! You can now log in.')
    }
  }, [user, redirectUrl, searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        // More user-friendly error messages
        if (error.message.includes('Invalid login')) {
          setError('Invalid email or password')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email before logging in')
        } else {
          setError(error.message)
        }
      }
      // No need to handle redirection here as it's done in AuthContext
    } catch (err: any) {
      setError('Failed to connect to authentication service. Please try again later.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">P</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Welcome back</h1>
        <p className="text-center text-gray-600 mb-6">Sign in to continue to Periskope</p>
        
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 flex items-center">
            <span>{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="name@company.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                disabled={loading}
                required
              />
              <button 
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            className={`w-full bg-green-600 text-white p-2.5 rounded-md hover:bg-green-700 transition flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2">Signing In</span>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
          
          <div className="mt-6 text-center text-gray-600">
            <p>
              Need an account?{' '}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}