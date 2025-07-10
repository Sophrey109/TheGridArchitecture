
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { JobFilterBar } from '@/components/jobs/FilterBar';

const Jobs = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedTitle, setSelectedTitle] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const handleClearFilters = () => {
    setSelectedDiscipline('all');
    setSelectedTitle('all');
    setSelectedLocation('all');
    setSelectedType('all');
  };

  return (
    <Layout>
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="hero-text mb-4">Job Board</h1>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              Career opportunities in architecture, design, and BIM across the globe.
            </p>
          </div>
          
          <JobFilterBar
            selectedDiscipline={selectedDiscipline}
            selectedTitle={selectedTitle}
            selectedLocation={selectedLocation}
            selectedType={selectedType}
            onDisciplineChange={setSelectedDiscipline}
            onTitleChange={setSelectedTitle}
            onLocationChange={setSelectedLocation}
            onTypeChange={setSelectedType}
            onClearFilters={handleClearFilters}
          />
          
          <div className="text-center py-20">
            <p className="body-text text-muted-foreground">
              Job listings with advanced filtering coming soon...
            </p>
            {(selectedDiscipline !== 'all' || selectedTitle !== 'all' || selectedLocation !== 'all' || selectedType !== 'all') && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Active filters: 
                  {selectedDiscipline !== 'all' && ` Discipline: ${selectedDiscipline}`}
                  {selectedTitle !== 'all' && ` Title: ${selectedTitle}`}
                  {selectedLocation !== 'all' && ` Location: ${selectedLocation}`}
                  {selectedType !== 'all' && ` Type: ${selectedType}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
