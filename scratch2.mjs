import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nnybfkvrruukkfprjzew.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWJma3ZycnV1a2tmcHJqemV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkzMTIsImV4cCI6MjA4ODM4NTMxMn0.jeq9Vul3ENr9Rx8fuY3v_dZkOe4Kg6ShjW56Eqbg5dU'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, description, price, operation, type')
    .in('id', [54, 55, 48, 51])

  console.log(JSON.stringify(properties, null, 2))
}
main()
