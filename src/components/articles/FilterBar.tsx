
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  selectedType: string;
  selectedYear: string;
  onTypeChange: (type: string) => void;
  onYearChange: (year: string) => void;
  onClearFilters: () => void;
}

export const FilterBar = ({ 
  selectedType, 
  selectedYear, 
  onTypeChange, 
  onYearChange, 
  onClearFilters 
}: FilterBarProps) => {
  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'interiors', label: 'Interiors' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'technology', label: 'Technology' },
    { value: 'interviews', label: 'Interviews' }
  ];

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' }
  ];

  const hasActiveFilters = selectedType !== 'all' || selectedYear !== 'all';

  return (
    <div className="bg-card border-b border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <span className="body-text font-medium text-foreground">Filter by:</span>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
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
              className="flex items-center gap-2"
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
