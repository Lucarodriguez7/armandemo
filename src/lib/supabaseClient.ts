import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnybfkvrruukkfprjzew.supabase.co'
const supabaseKey = 'sb_publishable_N4fnmDnJZJGNjRlpvpkvTA_lvvn3Afp'

export const supabase = createClient(supabaseUrl, supabaseKey)