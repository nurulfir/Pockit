import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MONTHS_SHORT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const MonthlyTrend = ({ transactions }) => {

  // DETECT DARK MODE
  const isDark = document.documentElement.classList.contains("dark");

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthTransactions = transactions.filter(t => t.month === i);
    const income = monthTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: MONTHS_SHORT[i],
      pemasukan: income,
      pengeluaran: expense
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Tren Bulanan
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          
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

          <Bar
            dataKey="pemasukan"
            fill={isDark ? "#34d399" : "#10b981"}
          />

          <Bar
            dataKey="pengeluaran"
            fill={isDark ? "#f87171" : "#ef4444"}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
