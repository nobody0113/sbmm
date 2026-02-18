'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCodeError() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Authentication Error
        </h1>
        
        <div className="space-y-4 text-gray-600 dark:text-gray-400">
          <p>
            There was an error signing you in. This usually happens when:
          </p>
          
          <ul className="text-left space-y-2 text-sm">
            <li>• Google OAuth is not properly configured in Supabase</li>
            <li>• The redirect URL doesn't match in Google Cloud Console</li>
            <li>• Your app is still in testing mode and you're not a test user</li>
          </ul>
          
          <p className="text-sm">
            Please check your Supabase authentication settings and try again.
          </p>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back to Home
          </button>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  )
}
