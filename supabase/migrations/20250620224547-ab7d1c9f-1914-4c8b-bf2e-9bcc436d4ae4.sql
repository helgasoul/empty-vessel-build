
-- Создаем таблицу для верификации дипломов врачей
CREATE TABLE public.doctor_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    diploma_file_path TEXT NOT NULL,
    diploma_file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для верификации дипломов
ALTER TABLE public.doctor_verifications ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут просматривать свои документы
CREATE POLICY "Users can view their own verifications" 
    ON public.doctor_verifications 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Политика: пользователи могут загружать свои документы
CREATE POLICY "Users can upload their verifications" 
    ON public.doctor_verifications 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Политика: администраторы могут управлять всеми верификациями
CREATE POLICY "Admins can manage all verifications" 
    ON public.doctor_verifications 
    FOR ALL 
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Создаем таблицу для хранения файлов дипломов
CREATE TABLE public.diploma_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES public.doctor_verifications(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для файлов дипломов
ALTER TABLE public.diploma_files ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут просматривать файлы своих верификаций
CREATE POLICY "Users can view their verification files" 
    ON public.diploma_files 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.doctor_verifications dv 
            WHERE dv.id = verification_id AND dv.user_id = auth.uid()
        )
    );

-- Политика: пользователи могут загружать файлы для своих верификаций
CREATE POLICY "Users can upload verification files" 
    ON public.diploma_files 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.doctor_verifications dv 
            WHERE dv.id = verification_id AND dv.user_id = auth.uid()
        )
    );

-- Политика: администраторы могут управлять всеми файлами
CREATE POLICY "Admins can manage all verification files" 
    ON public.diploma_files 
    FOR ALL 
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Добавляем триггеры для обновления updated_at
CREATE TRIGGER update_doctor_verifications_updated_at
    BEFORE UPDATE ON public.doctor_verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем бакет для хранения дипломов
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diplomas', 'diplomas', false)
ON CONFLICT (id) DO NOTHING;

-- Политики для бакета дипломов
CREATE POLICY "Users can upload their own diplomas" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'diplomas' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own diplomas" 
    ON storage.objects 
    FOR SELECT 
    USING (
        bucket_id = 'diplomas' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR public.has_role(auth.uid(), 'admin')
        )
    );

CREATE POLICY "Admins can manage all diplomas" 
    ON storage.objects 
    FOR ALL 
    USING (bucket_id = 'diplomas' AND public.has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'diplomas' AND public.has_role(auth.uid(), 'admin'));
