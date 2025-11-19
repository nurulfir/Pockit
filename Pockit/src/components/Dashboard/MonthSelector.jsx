import { Calendar } from 'lucide-react';
import { MONTHS } from '../../utils/constants';

export const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300" />

      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="
          border-2 rounded-lg px-3 py-2 font-medium
          bg-white text-gray-800 border-gray-300
          dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition
        "
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};
