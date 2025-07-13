import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Award {
  id: string;
  title: string;
  recipient: string;
  project: string;
  organization: string;
  year: string;
  category: string;
  location?: string;
}

const recentAwards: Award[] = [
  {
    id: '1',
    title: 'Pritzker Architecture Prize',
    recipient: 'David Chipperfield',
    project: 'Lifetime Achievement',
    organization: 'Hyatt Foundation',
    year: '2023',
    category: 'Lifetime Achievement',
    location: 'Global'
  },
  {
    id: '2',
    title: 'RIBA Stirling Prize',
    recipient: 'Grafton Architects',
    project: 'Kingston University Town House',
    organization: 'RIBA',
    year: '2023',
    category: 'Building of the Year',
    location: 'London, UK'
  },
  {
    id: '3',
    title: 'AIA Gold Medal',
    recipient: 'Balkrishna Doshi',
    project: 'Career Achievement',
    organization: 'American Institute of Architects',
    year: '2023',
    category: 'Lifetime Achievement',
    location: 'India'
  },
  {
    id: '4',
    title: 'World Architecture Festival',
    recipient: 'Snøhetta',
    project: 'Svart Hotel',
    organization: 'WAF',
    year: '2023',
    category: 'Sustainable Design',
    location: 'Norway'
  }
];

export const AwardsWidget = () => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-primary" />
          Recent Awards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentAwards.map((award) => (
          <div key={award.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
            <Link to={`/awards/${award.id}`} className="block group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors leading-tight flex-1 mr-2">
                  {award.title}
                </h4>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{award.year}</span>
                </div>
              </div>
              
              <p className="text-sm font-medium text-foreground mb-1">{award.recipient}</p>
              <p className="text-sm text-muted-foreground mb-2">{award.project}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span>{award.organization}</span>
                {award.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{award.location}</span>
                    </div>
                  </>
                )}
              </div>
              
              <span className="text-xs bg-muted px-2 py-1 rounded">{award.category}</span>
            </Link>
          </div>
        ))}
        
        <Link 
          to="/awards" 
          className="block text-center text-sm text-primary hover:text-primary/80 transition-colors font-medium mt-4 pt-2 border-t border-border/50"
        >
          View All Awards →
        </Link>
      </CardContent>
    </Card>
  );
};