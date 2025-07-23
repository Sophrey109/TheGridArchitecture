import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, Building } from 'lucide-react';
import { Job } from '@/hooks/useJobs';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="flex h-full">
        <Link to={`/jobs/${job.id}`} className="flex-1 block">
          <div className="cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{job['Job Title']}</CardTitle>
              {job.Company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{job.Company}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {job.Location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.Location}</span>
                </div>
              )}
              
              {job.Salary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.Salary}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDate(job['Date Posted'])}</span>
              </div>
              
              {job.Description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mt-3">
                  {job.Description}
                </p>
              )}
            </CardContent>
          </div>
        </Link>
        
        {job['External Link'] && (
          <div className="flex items-center p-4 border-l border-border/50">
            <a
              href={job['External Link']}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};