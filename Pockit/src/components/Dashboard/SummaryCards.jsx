import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const SummaryCards = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">Total Pemasukan</p>
            <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>
          <TrendingUp className="w-10 h-10 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
          </div>
          <TrendingDown className="w-10 h-10 opacity-80" />
        </div>
      </div>

      <div className={`bg-gradient-to-br ${
        balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600'
      } rounded-xl p-5 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Saldo</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <Wallet className="w-10 h-10 opacity-80" />
        </div>
      </div>
    </div>
  );
};