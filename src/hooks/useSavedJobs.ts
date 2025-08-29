import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSavedJobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ['saved-jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => item.job_id);
    },
    enabled: !!user,
  });

  const saveJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs', user?.id] });
      toast({
        title: "Job saved",
        description: "Job has been added to your saved list.",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505' || error.message?.includes('unique_user_job')) {
        toast({
          title: "Already saved",
          description: "This job is already in your saved list.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save job. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const removeSavedJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs', user?.id] });
      toast({
        title: "Job removed",
        description: "Job has been removed from your saved list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isJobSaved = (jobId: number) => {
    return savedJobs?.includes(jobId) || false;
  };

  const toggleSaveJob = (jobId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save jobs.",
        variant: "destructive",
      });
      return;
    }

    if (isJobSaved(jobId)) {
      removeSavedJobMutation.mutate(jobId);
    } else {
      saveJobMutation.mutate(jobId);
    }
  };

  return {
    savedJobs: savedJobs || [],
    isLoading,
    isJobSaved,
    toggleSaveJob,
    isSaving: saveJobMutation.isPending || removeSavedJobMutation.isPending,
  };
};