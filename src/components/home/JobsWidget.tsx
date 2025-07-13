import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Building, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobs } from '@/hooks/useJobs';

export const JobsWidget = () => {
  const { data: jobs, isLoading } = useJobs();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 14) return '1 week ago';
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          Recent Job Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))
        ) : jobs && jobs.length > 0 ? (
          jobs.slice(0, 4).map((job) => (
            <div key={job.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
              <Link to="/jobs" className="block group">
                <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                  {job['Job Title']}
                </h4>
                {job.Company && (
                  <p className="text-sm text-muted-foreground mb-2">{job.Company}</p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  {job.Location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.Location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(job['Date Posted'])}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-muted px-2 py-1 rounded">Full-time</span>
                  {job.Salary && (
                    <span className="text-xs font-medium text-primary">{job.Salary}</span>
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No job listings available
          </p>
        )}
        
        <Link 
          to="/jobs" 
          className="block text-center text-sm text-primary hover:text-primary/80 transition-colors font-medium mt-4 pt-2 border-t border-border/50"
        >
          View All Jobs →
        </Link>
      </CardContent>
    </Card>
  );
};