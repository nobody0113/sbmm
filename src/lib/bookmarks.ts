import { supabase } from './supabase'
import { Bookmark, CreateBookmarkData } from '@/types/bookmark'

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createBookmark(userId: string, bookmark: CreateBookmarkData): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({ ...bookmark, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBookmark(bookmarkId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', userId) // Ensure user can only delete their own bookmarks

  if (error) throw error
}

export function subscribeToBookmarks(userId: string, callback: (bookmarks: Bookmark[]) => void) {
  const channel = supabase
    .channel('bookmarks')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${userId}`
      },
      async () => {
        // Refetch bookmarks when changes occur
        const bookmarks = await getBookmarks(userId)
        callback(bookmarks)
      }
    )
    .subscribe()

  return channel
}
