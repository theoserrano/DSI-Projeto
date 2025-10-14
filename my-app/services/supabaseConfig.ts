// Import the functions you need from the SDKs you need
import { createClient } from '@supabase/supabase-js'
const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'
const SUPABASE_URL = "https://irpdupwcwusqlwhljhrc.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.EXPO_PUBLIC_API_KEY || '');

// Export client and helpers
export { supabase };
export const auth = supabase.auth;