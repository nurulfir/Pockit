import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MONTHS } from '../../utils/constants';

export const TransactionList = ({ transactions, selectedMonth, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    b.date.localeCompare(a.date)
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Riwayat Transaksi - {MONTHS[selectedMonth]}
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada transaksi bulan ini
          </p>
        ) : (
          sortedTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    transaction.type === 'pemasukan' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {transaction.category}
                  </span>
                  <p className="font-semibold text-gray-800">
                    {transaction.description}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(transaction.date)}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <p className={`text-lg font-bold ${
                  transaction.type === 'pemasukan' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'pemasukan' ? '+' : '-'} 
                  {formatCurrency(transaction.amount)}
                </p>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};