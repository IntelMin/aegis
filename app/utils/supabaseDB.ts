import { createClient } from '@supabase/supabase-js'

export const supabaseClient = async () => {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )

  return supabase;
}
