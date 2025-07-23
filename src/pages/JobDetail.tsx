import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Building, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/hooks/useJobs';
import { Skeleton } from '@/components/ui/skeleton';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('Job Adverts')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !job) {
    return (
      <Layout>
        <div className="min-h-screen py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
              <p className="text-muted-foreground mb-6">The job listing you're looking for doesn't exist.</p>
              <Link to="/jobs">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Link>
            
            <h1 className="hero-text mb-2">{job['Job Title']}</h1>
            {job.Company && (
              <div className="flex items-center gap-2 text-xl text-muted-foreground mb-4">
                <Building className="h-5 w-5" />
                <span>{job.Company}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {job.Location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.Location}</span>
                </div>
              )}
              
              {job.Salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.Salary}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDate(job['Date Posted'])}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {job.Description ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.Description}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No description provided.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job['External Link'] ? (
                    <a 
                      href={job['External Link']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Here
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full">
                      Application Link Not Available
                    </Button>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <h4 className="font-medium mb-1">Job Type</h4>
                      <Badge variant="secondary">{job.Type || 'Not specified'}</Badge>
                    </div>
                    
                    {job.Salary && (
                      <div>
                        <h4 className="font-medium mb-1">Salary Range</h4>
                        <p className="text-sm text-muted-foreground">{job.Salary}</p>
                      </div>
                    )}
                    
                    {job.Location && (
                      <div>
                        <h4 className="font-medium mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground">{job.Location}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-1">Posted Date</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(job['Date Posted'])}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;