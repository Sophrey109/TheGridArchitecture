import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export const ExhibitionsEvents = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Featured events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !events) {
    return null;
  }

  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Featured events</h2>
        <p className="text-muted-foreground">No upcoming events at the moment.</p>
      </div>
    );
  }

  const handleEventClick = (event: any) => {
    if (event.external_link) {
      window.open(event.external_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Featured events</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer h-48"
          >
            {/* Background Image */}
            {event.image_url && (
              <div className="absolute inset-0">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            )}
            
            {/* Fallback background for events without images */}
            {!event.image_url && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
            
            {/* Event Type Badge */}
            {event.event_type && (
              <div className="absolute top-4 left-0 z-20">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {event.event_type}
                </Badge>
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-white mb-2 line-clamp-2 group-hover:text-primary-foreground transition-colors">
                  {event.title}
                </h3>
              </div>
              
              <div className="space-y-1">
                {event.event_date && (
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs line-clamp-1">
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* External Link Indicator */}
            {event.external_link && (
              <div className="absolute top-4 right-4 z-20">
                <ExternalLink className="h-5 w-5 text-white opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};