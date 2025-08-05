-- Create shopping_items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own items
CREATE POLICY "Users can only see their own shopping items" ON shopping_items
  FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own items
CREATE POLICY "Users can insert their own shopping items" ON shopping_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own items
CREATE POLICY "Users can update their own shopping items" ON shopping_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own items
CREATE POLICY "Users can delete their own shopping items" ON shopping_items
  FOR DELETE USING (auth.uid() = user_id);
