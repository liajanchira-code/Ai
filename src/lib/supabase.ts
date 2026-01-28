import { createClient } from '@supabase/supabase-js';

// Access environment variables following Vite conventions
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ghetnrtasurnihxwansu.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZXRucnRhc3VybmloeHdhbnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyMzUsImV4cCI6MjA4NTE0MTIzNX0.QONacTzjbFJYehr_qU-mf6yEcluQQBbycXWZtyI-kc8';

export const isSupabaseConfiguredCorrectly = supabaseAnonKey.startsWith('eyJ') && supabaseUrl.includes('supabase.co');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
