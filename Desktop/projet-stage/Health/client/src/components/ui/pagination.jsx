// client/src/components/ui/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPreviousNext = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = ''
}) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const PageButton = ({ page, isActive = false, disabled = false, children }) => (
    <button
      onClick={() => !disabled && onPageChange(page)}
      disabled={disabled}
      className={`
        px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-[#4d89b1] text-white shadow-md' 
          : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#4d89b1]'
        }
        ${disabled ? '' : 'hover:shadow-sm'}
      `}
    >
      {children || page}
    </button>
  );

  const EllipsisButton = () => (
    <span className="px-3 py-2 text-sm text-gray-400">
      <MoreHorizontal className="h-4 w-4" />
    </span>
  );

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Bouton Previous */}
      {showPreviousNext && (
        <PageButton 
          page={currentPage - 1} 
          disabled={currentPage === 1}
        >
          <div className="flex items-center space-x-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:block">Previous</span>
          </div>
        </PageButton>
      )}

      {/* Première page */}
      {showFirstLast && visiblePages[0] > 1 && (
        <>
          <PageButton page={1} />
          {showStartEllipsis && <EllipsisButton />}
        </>
      )}

      {/* Pages visibles */}
      {visiblePages.map(page => (
        <PageButton 
          key={page} 
          page={page} 
          isActive={page === currentPage}
        />
      ))}

      {/* Dernière page */}
      {showFirstLast && visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {showEndEllipsis && <EllipsisButton />}
          <PageButton page={totalPages} />
        </>
      )}

      {/* Bouton Next */}
      {showPreviousNext && (
        <PageButton 
          page={currentPage + 1} 
          disabled={currentPage === totalPages}
        >
          <div className="flex items-center space-x-1">
            <span className="hidden sm:block">Next</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </PageButton>
      )}
    </div>
  );
}