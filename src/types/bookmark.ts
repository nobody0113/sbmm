export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
  updated_at: string
}

export interface CreateBookmarkData {
  title: string
  url: string
}
