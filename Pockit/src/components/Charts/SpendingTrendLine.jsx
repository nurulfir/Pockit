import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MONTHS_SHORT } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const SpendingTrendLine = ({ transactions }) => {
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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">6-Month Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={last6Months}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};