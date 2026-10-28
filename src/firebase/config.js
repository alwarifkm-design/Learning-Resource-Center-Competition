// =====================================================
// Supabase configuration
// استخدم متغيرات البيئة في النشر الحقيقي، مع fallback للقيم الحالية
// =====================================================
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yecoazjindxbwtiqjkac.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllY29hemppbmR4Ynd0aXFqa2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMzMyMTksImV4cCI6MjEwODYwOTIxOX0.zZBkzrOf3Ubano3wTUU1ISvl0Skekfs24NauGBpC3-c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase

