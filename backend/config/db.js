import { createClient } from '@supabase/supabase-js'
import doenv from 'dotenv'
doenv.config()
const supabaseUrl = 'https://irpdupwcwusqlwhljhrc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;

