import { ReactNode } from 'react';

export interface Column<T = any> {
  header: string;
  accessor: string;
  render?: (value: any, item: T) => ReactNode;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
}

export default function Table<T>({ columns, data, isLoading }: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="h-14 bg-gray-50 border-b border-gray-200"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b border-gray-100 last:border-0"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item: any, index: number) => (
                <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
