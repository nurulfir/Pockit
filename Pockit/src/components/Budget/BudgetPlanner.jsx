import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { notify } from '../../utils/notifications';
import { EmptyState } from '../Shared/EmptyState';
import { staggerContainer, listItem } from '../../utils/animations';

export const BudgetPlanner = ({ budgets, onAdd, onDelete, expenses }) => {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('Makanan');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    if (!amount) {
      notify.error('Mohon isi jumlah budget!');
      return;
    }
    onAdd({ category, amount: parseFloat(amount) });
    notify.success(`Budget ${category} berhasil ditambahkan! 💰`);
    setAmount('');
    setShowForm(false);
  };

  const getBudgetStatus = (budget) => {
    const spent = expenses[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return { spent, percentage };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <PiggyBank className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Budget Planning
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg 
                   hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Set Budget
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                         focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none"
              >
                {CATEGORIES.pengeluaran.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Budget amount"
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                         bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                         focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                         placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="w-full mt-3 bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg 
                       hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Add Budget
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {budgets.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="Belum ada budget"
            description="Set budget untuk kontrol pengeluaran yang lebih baik!"
            action={
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold
                         hover:bg-indigo-700 transition"
              >
                Set Budget Sekarang
              </button>
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {budgets.map((budget) => {
              const { spent, percentage } = getBudgetStatus(budget);
              const isWarning = percentage >= 80 && percentage < 100;
              const isExceeded = percentage >= 100;

              return (
                <motion.div
                  key={budget.id}
                  variants={listItem}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4
                           bg-white dark:bg-gray-700 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {budget.category}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onDelete(budget.id);
                        notify.success('Budget berhasil dihapus!');
                      }}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full transition-colors duration-300 ${
                        isExceeded
                          ? 'bg-red-500'
                          : isWarning
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>

                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span
                      className={`font-semibold ${
                        isExceeded
                          ? 'text-red-600 dark:text-red-400'
                          : isWarning
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {percentage.toFixed(0)}% used
                    </span>
                    {isExceeded && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-red-600 dark:text-red-400 font-semibold"
                      >
                        Over budget! 🚨
                      </motion.span>
                    )}
                    {isWarning && !isExceeded && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-yellow-600 dark:text-yellow-400 font-semibold"
                      >
                        Almost there! ⚠️
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};