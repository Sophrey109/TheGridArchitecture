import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Competition {
  id: string;
  title: string;
  organizer: string;
  deadline: string;
  prize: string;
  category: string;
  participants?: number;
}

const activeCompetitions: Competition[] = [
  {
    id: '1',
    title: 'Sustainable Housing Design Challenge',
    organizer: 'UN-Habitat',
    deadline: '2024-03-15',
    prize: '$50,000',
    category: 'Sustainability',
    participants: 245
  },
  {
    id: '2',
    title: 'Young Architect Prize 2024',
    organizer: 'RIBA',
    deadline: '2024-02-28',
    prize: '£10,000',
    category: 'Emerging Talent',
    participants: 156
  },
  {
    id: '3',
    title: 'Smart City Innovation Contest',
    organizer: 'MIT',
    deadline: '2024-04-10',
    prize: '$25,000',
    category: 'Technology',
    participants: 89
  },
  {
    id: '4',
    title: 'Adaptive Reuse Design Competition',
    organizer: 'AIA',
    deadline: '2024-03-30',
    prize: '$15,000',
    category: 'Heritage',
    participants: 178
  }
];

export const CompetitionsWidget = () => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          Open Competitions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCompetitions.map((competition) => (
          <div key={competition.id} className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
            <Link to={`/competitions/${competition.id}`} className="block group">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors leading-tight flex-1 mr-2">
                  {competition.title}
                </h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                  {competition.prize}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{competition.organizer}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due {new Date(competition.deadline).toLocaleDateString()}</span>
                </div>
                {competition.participants && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{competition.participants} entries</span>
                  </div>
                )}
              </div>
              
              <span className="text-xs bg-muted px-2 py-1 rounded">{competition.category}</span>
            </Link>
          </div>
        ))}
        
        <Link 
          to="/competitions" 
          className="block text-center text-sm text-primary hover:text-primary/80 transition-colors font-medium mt-4 pt-2 border-t border-border/50"
        >
          View All Competitions →
        </Link>
      </CardContent>
    </Card>
  );
};