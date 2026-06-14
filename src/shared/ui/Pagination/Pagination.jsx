import React from 'react';

const Pagination = ({
  currentPage = 1,
  totalEntries = 0,
  pageSize = 5,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalEntries / pageSize);
  if (totalPages <= 1) return null;

  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const pages = [];
  // For simplicity, generate all pages up to totalPages, or max 3
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-sm text-gray-text flex-col sm:flex-row gap-4 bg-white">
      <p>
        Showing <span className="font-semibold text-dark-blue">{startEntry}</span> to{' '}
        <span className="font-semibold text-dark-blue">{endEntry}</span> of{' '}
        <span className="font-semibold text-dark-blue">{totalEntries.toLocaleString()}</span> entries
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium transition-colors"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded text-sm font-medium cursor-pointer transition-colors ${
              currentPage === p
                ? 'bg-main text-white'
                : 'border border-[#E2E8F0] bg-white hover:bg-gray-50 text-gray-text'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-medium transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
