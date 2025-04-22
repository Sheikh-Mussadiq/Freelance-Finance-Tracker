import React from 'react';

/**
 * Shimmer component for loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.width - Width of the shimmer (default: '100%')
 * @param {string} props.height - Height of the shimmer (default: '1rem')
 * @param {string} props.borderRadius - Border radius of the shimmer (default: '0.25rem')
 * @param {boolean} props.circle - Whether the shimmer should be a circle
 */
const Shimmer = ({ 
  className = '', 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.25rem',
  circle = false
}) => {
  return (
    <div 
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius: circle ? '50%' : borderRadius 
      }}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
};

/**
 * Card shimmer component for loading states
 */
const CardShimmer = () => (
  <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center">
      <Shimmer className="flex-shrink-0" width="3rem" height="3rem" circle={true} />
      <div className="ml-4 flex-1">
        <Shimmer className="mb-2" width="60%" height="0.875rem" />
        <Shimmer width="40%" height="1.25rem" />
      </div>
    </div>
  </div>
);

/**
 * Table row shimmer component for loading states
 * @param {Object} props - Component props
 * @param {number} props.columns - Number of columns in the row
 * @param {Array<number>} props.widths - Array of column widths in percentage (e.g. [30, 20, 20, 30])
 */
const TableRowShimmer = ({ columns = 4, widths = [] }) => {
  // Default widths if not provided
  const columnWidths = widths.length === columns 
    ? widths 
    : Array(columns).fill(100 / columns);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      {Array(columns).fill().map((_, index) => (
        <td key={index} className="px-3 py-4 whitespace-nowrap">
          <Shimmer width={`${columnWidths[index]}%`} height="1rem" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Table shimmer component for loading states
 * @param {Object} props - Component props
 * @param {number} props.rows - Number of rows to display
 * @param {number} props.columns - Number of columns in each row
 * @param {Array<number>} props.widths - Array of column widths in percentage
 * @param {boolean} props.showHeader - Whether to show a table header
 */
const TableShimmer = ({ 
  rows = 5, 
  columns = 4, 
  widths = [],
  showHeader = true
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      {showHeader && (
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {Array(columns).fill().map((_, index) => (
              <th 
                key={index} 
                className="px-3 py-3 text-left"
              >
                <Shimmer width="70%" height="0.75rem" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {Array(rows).fill().map((_, index) => (
          <TableRowShimmer key={index} columns={columns} widths={widths} />
        ))}
      </tbody>
    </table>
  </div>
);

export { Shimmer, CardShimmer, TableRowShimmer, TableShimmer };
