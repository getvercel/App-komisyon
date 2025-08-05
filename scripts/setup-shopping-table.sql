-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shopping_items table
CREATE TABLE IF NOT EXISTS public.shopping_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own shopping items" ON public.shopping_items;

-- Create a single comprehensive policy
CREATE POLICY "Users can manage their own shopping items" ON public.shopping_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.shopping_items TO authenticated;
GRANT ALL ON public.shopping_items TO service_role;
