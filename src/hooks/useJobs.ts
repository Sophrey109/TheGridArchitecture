import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: number;
  'Job Title': string;
  Company: string | null;
  Location: string | null;
  Salary: string | null;
  Description: string | null;
  'Date Posted': string | null;
}

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Job Adverts')
        .select('*')
        .order('Date Posted', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });
};