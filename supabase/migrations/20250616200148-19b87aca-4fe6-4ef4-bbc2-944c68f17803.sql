
-- Create table for medical calendar events
CREATE TABLE public.medical_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('appointment', 'procedure', 'medication', 'test', 'consultation', 'vaccination', 'checkup')),
  event_date DATE NOT NULL,
  event_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  doctor_name TEXT,
  clinic_name TEXT,
  reminder_minutes INTEGER DEFAULT 15,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_calendar_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own medical events" 
  ON public.medical_calendar_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medical events" 
  ON public.medical_calendar_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical events" 
  ON public.medical_calendar_events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical events" 
  ON public.medical_calendar_events 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_medical_calendar_events_updated_at
  BEFORE UPDATE ON public.medical_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
