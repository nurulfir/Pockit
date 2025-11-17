import { Calendar } from 'lucide-react';
import { MONTHS } from '../../utils/constants';

export const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-5 h-5 text-gray-600" />
      <select 
        value={selectedMonth}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="border-2 border-gray-300 rounded-lg px-3 py-2 font-medium"
      >
        {MONTHS.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>
    </div>
  );
};