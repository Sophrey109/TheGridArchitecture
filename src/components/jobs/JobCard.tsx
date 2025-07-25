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
      <Link to={`/jobs/${job.id}`} className="block">
        <div className="cursor-pointer">
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
            
            {job['External Link'] && (
              <div className="pt-2">
                <a
                  href={job['External Link']}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  Apply Now
                </a>
              </div>
            )}
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};