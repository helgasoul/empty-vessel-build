
-- First check if calculator_results table exists, if not create it
CREATE TABLE IF NOT EXISTS public.calculator_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calculator_type TEXT NOT NULL,
    calculator_name TEXT NOT NULL,
    input_parameters JSONB NOT NULL DEFAULT '{}',
    result_value NUMERIC,
    result_text TEXT,
    interpretation TEXT NOT NULL,
    reference_range TEXT,
    units TEXT,
    is_critical BOOLEAN DEFAULT false,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    lab_result_id UUID,
    calculated_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for calculator_results if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'calculator_results' 
        AND policyname = 'Patients can view their own calculator results'
    ) THEN
        ALTER TABLE public.calculator_results ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Patients can view their own calculator results" 
            ON public.calculator_results 
            FOR SELECT 
            USING (auth.uid() = patient_id);
    END IF;
END $$;

-- Create doctor_notifications table if not exists
CREATE TABLE IF NOT EXISTS public.doctor_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'new_lab_results', 
        'critical_values', 
        'significant_changes', 
        'consultation_request', 
        'profile_updated'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_critical BOOLEAN DEFAULT false,
    related_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for doctor_notifications if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'doctor_notifications' 
        AND policyname = 'Doctors can view their own notifications'
    ) THEN
        ALTER TABLE public.doctor_notifications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Doctors can view their own notifications" 
            ON public.doctor_notifications 
            FOR SELECT 
            USING (auth.uid() = doctor_id);
            
        CREATE POLICY "Doctors can update their own notifications" 
            ON public.doctor_notifications 
            FOR UPDATE 
            USING (auth.uid() = doctor_id)
            WITH CHECK (auth.uid() = doctor_id);
    END IF;
END $$;

-- Create doctor_patient_messages table if not exists
CREATE TABLE IF NOT EXISTS public.doctor_patient_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'report', 'file', 'calculator_results')),
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for doctor_patient_messages if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'doctor_patient_messages' 
        AND policyname = 'Patients and doctors can view their conversation messages'
    ) THEN
        ALTER TABLE public.doctor_patient_messages ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Patients and doctors can view their conversation messages" 
            ON public.doctor_patient_messages 
            FOR SELECT 
            USING (
                auth.uid() = patient_id 
                OR auth.uid() = doctor_id
            );
            
        CREATE POLICY "Patients and doctors can send messages" 
            ON public.doctor_patient_messages 
            FOR INSERT 
            WITH CHECK (
                (auth.uid() = patient_id AND auth.uid() = sender_id)
                OR (auth.uid() = doctor_id AND auth.uid() = sender_id)
            );
    END IF;
END $$;

-- Add triggers for updated_at if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_calculator_results_updated_at'
    ) THEN
        CREATE TRIGGER update_calculator_results_updated_at
            BEFORE UPDATE ON public.calculator_results
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_doctor_patient_messages_updated_at'
    ) THEN
        CREATE TRIGGER update_doctor_patient_messages_updated_at
            BEFORE UPDATE ON public.doctor_patient_messages
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
