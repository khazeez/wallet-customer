import { useState } from 'react';
import { Badge } from './ui/badge';
import { formatNumber } from '../lib/utils';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'earn' | 'spend';
}

interface TransactionListProps {
  transactions: Transaction[];
  searchTerm?: string;
  filters?: {
    dateRange: 'all' | 'today' | 'week' | 'month';
    type: 'all' | 'earn' | 'spend';
    sortBy: 'newest' | 'oldest' | 'amount';
  };
}

export function TransactionList({ 
  transactions, 
  searchTerm = '', 
  filters = { dateRange: 'all', type: 'all', sortBy: 'newest' } 
}: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(tx => {
    // Search term filter
    if (searchTerm && !tx.merchant.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Transaction type filter
    if (filters.type !== 'all' && tx.type !== filters.type) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const txDate = new Date(tx.date);
      const today = new Date();
      
      if (filters.dateRange === 'today') {
        if (txDate.toDateString() !== today.toDateString()) {
          return false;
        }
      } else if (filters.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        if (txDate < weekAgo) {
          return false;
        }
      } else if (filters.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        if (txDate < monthAgo) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (filters.sortBy === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (filters.sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });
  
  // Paginate transactions
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-cloud-grey overflow-hidden">
      {paginatedTransactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-text">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
              <path d="M18 12H9"/>
            </svg>
          </div>
          <h3 className="text-deep-ink font-medium mb-1">No transactions found</h3>
          <p className="text-secondary-text text-sm">
            {searchTerm ? 'Try adjusting your search or filters' : 'Your transaction history will appear here'}
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-cloud-grey">
            {paginatedTransactions.map((tx) => (
              <li key={tx.id} className="hover:bg-bg-light-gray/30 transition-colors">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'earn' ? 'bg-soft-mint text-flow-teal' : 'bg-bg-light-gray text-secondary-text'
                    }`}>
                      {tx.type === 'earn' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-deep-ink">{tx.merchant}</div>
                      <div className="text-xs text-secondary-text">{formatDate(tx.date)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={tx.type === 'earn' ? 'text-accent-green font-medium' : 'text-alert-coral font-medium'}>
                      {tx.type === 'earn' ? '+' : '-'}{formatNumber(tx.amount)} FP
                    </div>
                    <Badge variant={tx.type === 'earn' ? 'secondary' : 'outline'}
                           className={tx.type === 'earn' ? 'bg-soft-mint text-flow-teal mt-1' : 'border-cloud-grey text-deep-ink mt-1'}>
                      {tx.type === 'earn' ? 'Earned' : 'Spent'}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-cloud-grey p-4">
              <div className="text-sm text-secondary-text">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 
                      ? 'text-cloud-grey cursor-not-allowed' 
                      : 'text-flow-teal hover:bg-soft-mint'
                  }`}
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, index) => {
                  let pageNumber: number;
                  
                  if (totalPages <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 2) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNumber = totalPages - 2 + index;
                  } else {
                    pageNumber = currentPage - 1 + index;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-flow-teal text-white'
                          : 'text-deep-ink hover:bg-bg-light-gray'
                      }`}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages 
                      ? 'text-cloud-grey cursor-not-allowed' 
                      : 'text-flow-teal hover:bg-soft-mint'
                  }`}
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
