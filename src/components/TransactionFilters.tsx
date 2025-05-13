import { useState } from 'react';
import { Button } from './ui/button';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionFilters) => void;
  onSearchChange: (searchTerm: string) => void;
}

export interface TransactionFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  type: 'all' | 'earn' | 'spend';
  sortBy: 'newest' | 'oldest' | 'amount';
}

export function TransactionFilters({ 
  onFilterChange, 
  onSearchChange 
}: TransactionFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: 'all',
    type: 'all',
    sortBy: 'newest'
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: value 
    } as TransactionFilters;
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cloud-grey p-4 mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 pl-9 rounded-md border border-cloud-grey focus:border-flow-teal focus:ring-1 focus:ring-flow-teal/30 outline-none"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-secondary-text border-cloud-grey"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M21 4H3"></path>
            <path d="M17 10H3"></path>
            <path d="M10 16H3"></path>
            <path d="m21 16-5.07-2.54a1 1 0 0 1 0-1.78L21 9"></path>
          </svg>
        </Button>
        
        <div className="flex gap-2">
          <select 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="text-xs p-1 rounded border border-cloud-grey text-deep-ink"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-cloud-grey grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-secondary-text mb-1">Date Range</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full text-sm p-1.5 rounded border border-cloud-grey text-deep-ink"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-secondary-text mb-1">Transaction Type</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full text-sm p-1.5 rounded border border-cloud-grey text-deep-ink"
            >
              <option value="all">All Types</option>
              <option value="earn">Earned Points</option>
              <option value="spend">Spent Points</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
