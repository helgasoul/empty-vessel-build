import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FounderInfo {
  id: string;
  name: string;
  title: string;
  description?: string;
  education?: string[];
  achievements?: string[];
  quote?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

const defaultFounderInfo: FounderInfo = {
  id: 'default',
  name: 'Др. Ольга Пучкова',
  title: 'Врач-онколог, маммолог • Основатель и CEO PREVENT',
  description: 'Врач-онколог с 20-летним опытом работы в области женского здоровья и превентивной медицины. Специалист по ранней диагностике онкологических заболеваний, эксперт в области маммологии и ультразвуковой диагностики. Ольга посвятила свою карьеру созданию персонализированного подхода к профилактике заболеваний, объединяя глубокие медицинские знания с современными технологиями для заботы о здоровье каждой женщины.',
  education: [
    'Московская Медицинская Академия им И.М. Сеченова, лечебное дело (1999-2005)',
    'Ординатура по специальности «Хирургия», ММА им И.М. Сеченова (2005-2007)',
    'Первичная переподготовка по специальности «Онкология», ММА им И.М. Сеченова (2007-2009)',
    'Первичная переподготовка по специальности «Ультразвуковая диагностика», БУЗ ВМХЦ им Н.И. Пирогова (2008-2010)',
    'Первичная переподготовка по специальности «Рентгенология», ФГБУ РНЦРР (2010-2012)'
  ],
  achievements: [
    'Повышение квалификации «Маммология» (2008)',
    'Специализация «Интервенционная диагностика в маммологии» (2010)',
    'Обучение «Основы клинической и эстетической маммологии» (2010)',
    'Сертификат «Ultrasound guided breast biopsy», Австрия (2011)',
    'Мастер-класс «Stereotactic guided breast biopsy» и «MRI guided breast biopsy» (2012)',
    'Курс профессора László Tabár по ранней диагностике рака молочной железы, Швеция (2012)'
  ],
  quote: 'Моя миссия — дать каждой женщине уверенность в завтрашнем дне через знания, заботу и современные технологии диагностики. Превентивная медицина — это не просто выявление рисков, это путь к гармонии между телом и душой.',
  image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

export const useFounderInfo = () => {
  return useQuery({
    queryKey: ['founder-info'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('founder_info')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.warn('Ошибка при загрузке данных основателя:', error.message);
          return defaultFounderInfo;
        }

        // Если данных нет в базе, возвращаем данные по умолчанию
        return data || defaultFounderInfo;
      } catch (error) {
        console.warn('Ошибка при запросе данных основателя:', error);
        return defaultFounderInfo;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут (заменил cacheTime на gcTime)
  });
};

export const useUpdateFounderInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (founderData: Omit<FounderInfo, 'id' | 'created_at' | 'updated_at'>) => {
      // Сначала проверяем, есть ли уже запись
      const { data: existing } = await supabase
        .from('founder_info')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Обновляем существующую запись
        const { data, error } = await supabase
          .from('founder_info')
          .update(founderData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('founder_info')
          .insert(founderData)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founder-info'] });
    },
  });
};

export const useUploadFounderImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `founder-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('founder-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('founder-images')
        .getPublicUrl(fileName);

      return publicUrl;
    },
  });
};
