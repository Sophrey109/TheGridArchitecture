import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  salary?: string;
}

const recentJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Architect',
    company: 'Foster + Partners',
    location: 'London, UK',
    type: 'Full-time',
    postedDate: '2 days ago',
    salary: '£65,000 - £85,000'
  },
  {
    id: '2',
    title: 'BIM Coordinator',
    company: 'Zaha Hadid Architects',
    location: 'Remote',
    type: 'Contract',
    postedDate: '3 days ago',
    salary: '£450/day'
  },
  {
    id: '3',
    title: 'Urban Planner',
    company: 'AECOM',
    location: 'New York, NY',
    type: 'Full-time',
    postedDate: '5 days ago',
    salary: '$70,000 - $90,000'
  },
  {
    id: '4',
    title: 'Design Associate',
    company: 'Gensler',
    location: 'San Francisco, CA',
    type: 'Full-time',
    postedDate: '1 week ago',
    salary: '$55,000 - $70,000'
  }
];

export const JobsWidget = () => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          Recent Job Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentJobs.map((job) => (
          <div key={job.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
            <Link to={`/jobs/${job.id}`} className="block group">
              <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                {job.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.postedDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-muted px-2 py-1 rounded">{job.type}</span>
                {job.salary && (
                  <span className="text-xs font-medium text-primary">{job.salary}</span>
                )}
              </div>
            </Link>
          </div>
        ))}
        
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