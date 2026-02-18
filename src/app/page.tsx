'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'
import { AuthButton } from '@/components/AuthButton'
import { Bookmark, CreateBookmarkData } from '@/types/bookmark'
import { getBookmarks, createBookmark, deleteBookmark, subscribeToBookmarks } from '@/lib/bookmarks'

export default function Home() {
  const { user, loading } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [bookmarksLoading, setBookmarksLoading] = useState(false)

  console.log('Home page - User:', user?.email || 'No user', 'Loading:', loading)

  useEffect(() => {
    if (user) {
      loadBookmarks()
      const channel = subscribeToBookmarks(user.id, setBookmarks)
      
      return () => {
        channel.unsubscribe()
      }
    } else {
      setBookmarks([])
    }
  }, [user])

  const loadBookmarks = async () => {
    if (!user) return
    
    setBookmarksLoading(true)
    try {
      const data = await getBookmarks(user.id)
      setBookmarks(data)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setBookmarksLoading(false)
    }
  }

  const handleCreateBookmark = async (bookmark: CreateBookmarkData) => {
    if (!user) throw new Error('User not authenticated')
    
    await createBookmark(user.id, bookmark)
    // Real-time subscription will update the list automatically
  }

  const handleDeleteBookmark = async (id: string) => {
    if (!user) throw new Error('User not authenticated')
    
    await deleteBookmark(id, user.id)
    // Real-time subscription will update the list automatically
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Bookmark Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sign in with Google to manage your bookmarks
            </p>
            <AuthButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Smart Bookmark Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user.user_metadata?.full_name || user.email}! 👋
              </p>
            </div>
            <AuthButton />
          </div>
        </header>

        <main className="space-y-8">
          {/* Welcome Section */}
          <section className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-sm text-white">
            <h2 className="text-2xl font-semibold mb-2">Welcome to Your Dashboard!</h2>
            <p className="opacity-90">
              You've successfully signed in with Google. Start managing your bookmarks below!
            </p>
          </section>

          {/* Add Bookmark Section */}
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Bookmark
            </h2>
            <BookmarkForm onSubmit={handleCreateBookmark} />
          </section>

          {/* Bookmarks List Section */}
          <section>
            {bookmarksLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
              </div>
            ) : (
              <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
