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
        <h2 className="text-2xl font-bold text-foreground">Exhibitions & Events</h2>
        <div className="flex flex-wrap gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-48 rounded-xl" />
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
        <h2 className="text-2xl font-bold text-foreground">Exhibitions & Events</h2>
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
      <h2 className="text-2xl font-bold text-foreground">Exhibitions & Events</h2>
      <div className="flex flex-wrap gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className={`
              relative p-4 rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm
              transition-all duration-300 hover:shadow-lg hover:border-border hover:scale-105
              min-w-48 max-w-64 cursor-pointer group
            `}
          >
            {/* Event Image */}
            {event.image_url && (
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 pr-2">
                  {event.title}
                </h3>
                {event.external_link && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              
              <div className="space-y-1">
                {event.event_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.event_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
              
              {event.event_type && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {event.event_type}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};