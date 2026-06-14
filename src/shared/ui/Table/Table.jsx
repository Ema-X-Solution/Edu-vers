import React from 'react';
import Loader from '../Loader';

const Table = ({ 
  columns = [], 
  data = [], 
  isLoading = false,
  emptyStateText = 'No data available',
  className = ''
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-gray-50/50">
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className={`py-4 px-6 text-xs font-semibold text-gray-text uppercase tracking-wider ${
                  col.align === 'right' ? 'text-right' : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <Loader />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                {emptyStateText}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex} 
                className="border-b border-[#E2E8F0] last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col, colIndex) => {
                  const val = item[col.key];
                  return (
                    <td 
                      key={col.key || colIndex} 
                      className={`py-4 px-6 text-sm text-dark-blue ${
                        col.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {col.render ? col.render(val, item) : val}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
