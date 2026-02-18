import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment variables:', {
  'NEXT_PUBLIC_SUPABASE_URL': supabaseUrl,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'undefined',
  'NODE_ENV': process.env.NODE_ENV
})

console.log('Supabase config:', { 
  url: supabaseUrl, 
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey?.length 
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
