// =====================================================
// Supabase configuration
// انسخ القيم من Project Settings > API داخل Supabase
// =====================================================
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yecoazjindxbwtiqjkac.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllY29hemppbmR4Ynd0aXFqa2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMzMyMTksImV4cCI6MjEwODYwOTIxOX0.zZBkzrOf3Ubano3wTUU1ISvl0Skekfs24NauGBpC3-c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase

