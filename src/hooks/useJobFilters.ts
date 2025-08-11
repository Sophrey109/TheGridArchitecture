import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FilterOption {
  value: string;
  label: string;
}

export const useJobFilters = () => {
  return useQuery({
    queryKey: ['job-filters'],
    queryFn: async () => {
      // Fetch distinct values for each filter column
      const [typesData, locationsData] = await Promise.all([
        supabase
          .from('Job Adverts')
          .select('"Type"')
          .not('"Type"', 'is', null)
          .order('"Type"'),
        
        supabase
          .from('Job Adverts')
          .select('"Location"')
          .not('"Location"', 'is', null)
          .order('"Location"')
      ]);

      if (typesData.error) throw typesData.error;
      if (locationsData.error) throw locationsData.error;

      // Get unique values and format them
      const getUniqueOptions = (data: any[], field: string): FilterOption[] => {
        const unique = [...new Set(data.map(item => item[field]).filter(Boolean))];
        return [
          { value: 'all', label: `All ${field.replace(/"/g, '')}s` },
          ...unique.map(value => ({ value, label: value }))
        ];
      };

      return {
        types: getUniqueOptions(typesData.data || [], 'Type'),
        locations: getUniqueOptions(locationsData.data || [], 'Location')
      };
    },
  });
};