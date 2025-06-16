
-- Create genetic_data table for storing genetic test results
CREATE TABLE public.genetic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  gene_variants JSONB,
  results JSONB,
  test_date DATE DEFAULT CURRENT_DATE,
  lab_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.genetic_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for genetic_data
CREATE POLICY "Users can view their own genetic data" 
  ON public.genetic_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own genetic data" 
  ON public.genetic_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own genetic data" 
  ON public.genetic_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own genetic data" 
  ON public.genetic_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_genetic_data_updated_at
  BEFORE UPDATE ON public.genetic_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
