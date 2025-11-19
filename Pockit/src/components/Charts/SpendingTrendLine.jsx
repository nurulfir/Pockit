import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MONTHS_SHORT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const SpendingTrendLine = ({ transactions }) => {

  // DETECT DARK MODE
  const isDark = document.documentElement.classList.contains("dark");

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (new Date().getMonth() - 5 + i + 12) % 12;
    const monthTransactions = transactions.filter(t => t.month === monthIndex);
    
    const income = monthTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = monthTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: MONTHS_SHORT[monthIndex],
      pemasukan: income,
      pengeluaran: expense,
      saldo: income - expense
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">6-Month Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={last6Months}>

          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "#4b5563" : "#d1d5db"}
          />

          <XAxis 
            dataKey="month" 
            stroke={isDark ? "#e5e7eb" : "#374151"} 
          />

          <YAxis 
            stroke={isDark ? "#e5e7eb" : "#374151"} 
          />

          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />

          <Line 
            type="monotone" 
            dataKey="pemasukan" 
            stroke={isDark ? "#34d399" : "#10b981"} 
            strokeWidth={2} 
          />

          <Line 
            type="monotone" 
            dataKey="pengeluaran" 
            stroke={isDark ? "#f87171" : "#ef4444"} 
            strokeWidth={2} 
          />

          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke={isDark ? "#60a5fa" : "#3b82f6"} 
            strokeWidth={2} 
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
