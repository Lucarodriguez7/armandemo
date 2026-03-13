import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnybfkvrruukkfprjzew.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWJma3ZycnV1a2tmcHJqemV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkzMTIsImV4cCI6MjA4ODM4NTMxMn0.jeq9Vul3ENr9Rx8fuY3v_dZkOe4Kg6ShjW56Eqbg5dU'

export const supabase = createClient(supabaseUrl, supabaseKey)