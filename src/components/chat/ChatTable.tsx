'use client';

interface ChatTableProps {
    data: any[]; // The array of objects from your API
  }
  
 function ChatTable({ data }: ChatTableProps) {
    // 1. Handle empty or invalid data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return <p className="text-gray-500 italic">No data available.</p>;
    }
  
    // 2. Extract headers from the keys of the first object
    const headers = Object.keys(data[0]);
  
    return (
      <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left font-semibold text-gray-900 capitalize"
                >
                  {/* Replace CamelCase or snake_case with spaces for readability */}
                  {header.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {/* Handle null values or nested objects */}
                    {row[header] === null ? "-" : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  export default ChatTable  