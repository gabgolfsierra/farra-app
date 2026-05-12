import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _db: SupabaseClient | null = null

export function getDb(): SupabaseClient {
  if (!_db) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env')
    }
    _db = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  }
  return _db
}

// Keep named export for compatibility
export const db = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getDb() as any)[prop]
  }
})