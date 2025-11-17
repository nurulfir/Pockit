import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MONTHS_SHORT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const MonthlyTrend = ({ transactions }) => {
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tren Bulanan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="pemasukan" fill="#10b981" />
          <Bar dataKey="pengeluaran" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};