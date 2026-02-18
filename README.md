# Smart Bookmark Manager

A modern bookmark manager with Google OAuth authentication and real-time updates built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Authentication**: Sign in using your Google account (no email/password)
- **Private Bookmarks**: Each user can only see their own bookmarks
- **Real-time Updates**: Bookmarks update in real-time across multiple browser tabs
- **CRUD Operations**: Add and delete bookmarks
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full TypeScript support for better development experience

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Database**: PostgreSQL (via Supabase)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Set up Authentication

1. In your Supabase project, go to Authentication > Settings
2. Under "External OAuth Providers", enable Google
3. Add your Google OAuth credentials:
   - Get these from the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your Supabase redirect URL: `https://[your-project-id].supabase.co/auth/v1/callback`

### 3. Set up Database

Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor, or run:

```bash
# Copy the schema content and run it in Supabase SQL Editor
cat supabase-schema.sql
```

### 4. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

### 5. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Bookmark**: Enter a title and URL, then click "Add Bookmark"
3. **View Bookmarks**: Your bookmarks will appear in the list below
4. **Delete Bookmark**: Click the trash icon next to any bookmark to delete it
5. **Real-time Updates**: Open multiple tabs to see real-time synchronization

## Security Features

- **Row Level Security (RLS)**: Ensures users can only access their own bookmarks
- **OAuth Authentication**: Secure Google OAuth integration
- **TypeScript**: Type safety for better code quality
- **Environment Variables**: Secure credential management

## Project Structure

```
src/
├── app/
│   ├── auth/callback/     # OAuth callback handler
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Main application page
├── components/
│   ├── AuthButton.tsx     # Authentication button component
│   ├── BookmarkForm.tsx    # Add bookmark form
│   └── BookmarkList.tsx   # Bookmark list with delete functionality
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── bookmarks.ts       # Bookmark CRUD operations
└── types/
    └── bookmark.ts        # TypeScript type definitions
```

## License

MIT License
