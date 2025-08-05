import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      shopping_items: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          completed?: boolean
        }
      }
    }
  }
}
