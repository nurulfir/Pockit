import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

export const TransactionFilters = ({ filters, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {[...CATEGORIES.pemasukan, ...CATEGORIES.pengeluaran].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'date'}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                     focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};