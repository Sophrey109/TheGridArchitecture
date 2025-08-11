
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useJobFilters } from '@/hooks/useJobFilters';

interface JobFilterBarProps {
  selectedDiscipline: string;
  selectedTitle: string;
  selectedLocation: string;
  selectedType: string;
  selectedCompany: string;
  onDisciplineChange: (discipline: string) => void;
  onTitleChange: (title: string) => void;
  onLocationChange: (location: string) => void;
  onTypeChange: (type: string) => void;
  onCompanyChange: (company: string) => void;
  onClearFilters: () => void;
}

export const JobFilterBar = ({ 
  selectedDiscipline, 
  selectedTitle, 
  selectedLocation, 
  selectedType,
  selectedCompany, 
  onDisciplineChange, 
  onTitleChange, 
  onLocationChange, 
  onTypeChange,
  onCompanyChange, 
  onClearFilters 
}: JobFilterBarProps) => {
  const { data: filterOptions, isLoading } = useJobFilters();
  const disciplines = [
    { value: 'all', label: 'All Disciplines' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'bim', label: 'BIM' },
    { value: 'interior-design', label: 'Interior Design' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product-design', label: 'Product Design' },
    { value: 'supporting-roles', label: 'Supporting Roles' }
  ];

  const hasActiveFilters = selectedDiscipline !== 'all' || selectedTitle !== 'all' || selectedLocation !== 'all' || selectedType !== 'all' || selectedCompany !== 'all';

  if (isLoading) {
    return <div className="bg-card border-b border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">Loading filters...</div>
      </div>
    </div>;
  }

  return (
    <div className="bg-card border-b border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="body-text font-medium text-foreground">Filter by:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full sm:w-auto">
              <Select value={selectedDiscipline} onValueChange={onDisciplineChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select discipline" />
                </SelectTrigger>
                <SelectContent>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline.value} value={discipline.value}>
                      {discipline.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTitle} onValueChange={onTitleChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.titles?.map((title) => (
                    <SelectItem key={title.value} value={title.value}>
                      {title.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={onLocationChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.locations?.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.types?.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCompany} onValueChange={onCompanyChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions?.companies?.map((company) => (
                    <SelectItem key={company.value} value={company.value}>
                      {company.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilters}
              className="flex items-center gap-2 mt-4 lg:mt-0"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
