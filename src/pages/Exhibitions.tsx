
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useEvents } from '@/hooks/useEvents';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, ExternalLink, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const Exhibitions = () => {
  const { data: events, isLoading, error } = useEvents();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique event types and countries from events
  const eventTypes = events ? Array.from(new Set(events.map(event => event.event_type).filter(Boolean))) : [];
  const countries = events ? Array.from(new Set(events.map(event => {
    if (!event.location) return null;
    // Extract country from location (assumes format like "City, Country" or "Venue, City, Country")
    const parts = event.location.split(',');
    return parts[parts.length - 1]?.trim();
  }).filter(Boolean))) : [];

  // Filter events based on selected filters
  const filteredEvents = events?.filter(event => {
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    const matchesCountry = countryFilter === 'all' || event.location?.includes(countryFilter);
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesCountry && matchesSearch;
  });

  const handleEventClick = (event: any) => {
    if (event.external_link) {
      window.open(event.external_link, '_blank', 'noopener,noreferrer');
    }
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCountryFilter('all');
    setSearchQuery('');
  };

  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="hero-text mb-4">Events & Exhibitions</h1>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              Discover upcoming design and architecture events, exhibitions, and conferences worldwide.
            </p>
          </div>
          
          {/* Filter Section */}
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filter Events</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Event Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {eventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Country Filter */}
              <div>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Clear Filters */}
              <div>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="body-text text-destructive mb-4">
                Error loading events. Please try again later.
              </p>
            </div>
          ) : !filteredEvents || filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="body-text text-muted-foreground mb-4">
                {events?.length === 0 ? 'No events available at the moment.' : 'No events match your current filters.'}
              </p>
              {(typeFilter !== 'all' || countryFilter !== 'all' || searchQuery) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Event Type Badge */}
                      {event.event_type && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="secondary" className="bg-white/90 text-primary">
                            {event.event_type}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {event.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      {/* External Link Indicator */}
                      {event.external_link && (
                        <div className="absolute bottom-4 right-4">
                          <ExternalLink className="h-5 w-5 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      {event.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        {event.event_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(event.event_date), 'MMM dd, yyyy')}
                              {event.end_date && event.end_date !== event.event_date && 
                                ` - ${format(new Date(event.end_date), 'MMM dd, yyyy')}`
                              }
                            </span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Exhibitions;
