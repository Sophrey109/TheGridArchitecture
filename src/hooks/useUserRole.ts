import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role', { ascending: true }) // admin comes first alphabetically
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'user' as UserRole; // Default to user role
      }
      
      return data.role as UserRole;
    },
    enabled: !!user,
  });

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isUser = !!userRole;

  return {
    userRole: userRole || 'user',
    isAdmin,
    isModerator,
    isUser,
    isLoading,
  };
};