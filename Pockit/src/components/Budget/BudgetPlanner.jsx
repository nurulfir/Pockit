import { useState } from 'react';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const BudgetPlanner = ({ budgets, onAdd, onDelete, expenses }) => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('Makanan');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!amount) return;
    onAdd({ category, amount: parseFloat(amount) });
    setAmount('');
    setShowForm(false);
  };

  const getBudgetStatus = (budget) => {
    const spent = expenses[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return { spent, percentage };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PiggyBank className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">Budget Planning</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Set Budget
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-3 py-2"
            >
              {CATEGORIES.pengeluaran.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Budget amount"
              className="border-2 border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Budget
          </button>
        </div>
      )}

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Belum ada budget. Set budget untuk kontrol pengeluaran!
          </p>
        ) : (
          budgets.map(budget => {
            const { spent, percentage } = getBudgetStatus(budget);
            const isWarning = percentage >= 80 && percentage < 100;
            const isExceeded = percentage >= 100;

            return (
              <div key={budget.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(budget.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between items-center text-sm">
                  <span className={`font-semibold ${
                    isExceeded ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {percentage.toFixed(0)}% used
                  </span>
                  {isExceeded && (
                    <span className="text-red-600 font-semibold">
                      Over budget!
                    </span>
                  )}
                  {isWarning && !isExceeded && (
                    <span className="text-yellow-600 font-semibold">
                      Almost there!
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};