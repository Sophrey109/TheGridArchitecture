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
      const [titlesData, typesData, locationsData, companiesData] = await Promise.all([
        supabase
          .from('Job Adverts')
          .select('"Job Title"')
          .not('"Job Title"', 'is', null)
          .order('"Job Title"'),
        
        supabase
          .from('Job Adverts')
          .select('"Type"')
          .not('"Type"', 'is', null)
          .order('"Type"'),
        
        supabase
          .from('Job Adverts')
          .select('"Location"')
          .not('"Location"', 'is', null)
          .order('"Location"'),
        
        supabase
          .from('Job Adverts')
          .select('"Company"')
          .not('"Company"', 'is', null)
          .order('"Company"')
      ]);

      if (titlesData.error) throw titlesData.error;
      if (typesData.error) throw typesData.error;
      if (locationsData.error) throw locationsData.error;
      if (companiesData.error) throw companiesData.error;

      // Get unique values and format them
      const getUniqueOptions = (data: any[], field: string): FilterOption[] => {
        const unique = [...new Set(data.map(item => item[field]).filter(Boolean))];
        return [
          { value: 'all', label: `All ${field.replace(/"/g, '').replace('Job ', '')}s` },
          ...unique.map(value => ({ value, label: value }))
        ];
      };

      return {
        titles: getUniqueOptions(titlesData.data || [], 'Job Title'),
        types: getUniqueOptions(typesData.data || [], 'Type'),
        locations: getUniqueOptions(locationsData.data || [], 'Location'),
        companies: getUniqueOptions(companiesData.data || [], 'Company')
      };
    },
  });
};