
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { JobFilterBar } from '@/components/jobs/FilterBar';
import { JobCard } from '@/components/jobs/JobCard';
import { useJobs } from '@/hooks/useJobs';
import { Loader2 } from 'lucide-react';

const Jobs = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedTitle, setSelectedTitle] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  
  const { data: jobs, isLoading, error } = useJobs();

  const handleClearFilters = () => {
    setSelectedDiscipline('all');
    setSelectedTitle('all');
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedCompany('all');
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
            selectedCompany={selectedCompany}
            onDisciplineChange={setSelectedDiscipline}
            onTitleChange={setSelectedTitle}
            onLocationChange={setSelectedLocation}
            onTypeChange={setSelectedType}
            onCompanyChange={setSelectedCompany}
            onClearFilters={handleClearFilters}
          />
          
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500">Error loading jobs: {error.message}</p>
            </div>
          )}
          
          {jobs && jobs.length === 0 && (
            <div className="text-center py-20">
              <p className="body-text text-muted-foreground">
                No job listings available at the moment.
              </p>
            </div>
          )}
          
          {jobs && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
          
          {(selectedDiscipline !== 'all' || selectedTitle !== 'all' || selectedLocation !== 'all' || selectedType !== 'all' || selectedCompany !== 'all') && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>Active filters: 
                {selectedDiscipline !== 'all' && ` Discipline: ${selectedDiscipline}`}
                {selectedTitle !== 'all' && ` Title: ${selectedTitle}`}
                {selectedLocation !== 'all' && ` Location: ${selectedLocation}`}
                {selectedType !== 'all' && ` Type: ${selectedType}`}
                {selectedCompany !== 'all' && ` Company: ${selectedCompany}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
