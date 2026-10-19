import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = (): number[] => {
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    if (currentPage < 3) {
      return Array.from({ length: maxVisible }, (_, i) => i);
    }
    
    if (currentPage >= totalPages - 3) {
      return Array.from({ length: maxVisible }, (_, i) => totalPages - maxVisible + i);
    }
    
    return Array.from({ length: maxVisible }, (_, i) => currentPage - 2 + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 border border-line hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 border transition-colors ${
              currentPage === pageNum
                ? 'bg-ink text-paper-light border-ink'
                : 'bg-paper-light text-ink border-line hover:bg-[#f5f3ed]'
            }`}
            aria-label={`Page ${pageNum + 1}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2 border border-line hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
