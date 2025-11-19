import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MONTHS } from '../../utils/constants';
import { SearchBar } from '../Dashboard/SearchBar';
import { TransactionFilters } from './TransactionFilters';
import { EmptyState } from '../Shared/EmptyState';
import { useSearch } from '../../hooks/useSearch';
import { listItem, staggerContainer } from '../../utils/animations';

export const TransactionList = ({ transactions, selectedMonth, onDelete }) => {
  const [showFilters, setShowFilters] = useState(false);
  const { searchTerm, setSearchTerm, filters, setFilters, filteredItems } = useSearch(
    transactions,
    ['description', 'category']
  );

  const sortedTransactions = [...filteredItems].sort((a, b) => {
    if (filters.sortBy === 'amount') return b.amount - a.amount;
    if (filters.sortBy === 'category') return a.category.localeCompare(b.category);
    return b.date.localeCompare(a.date);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 
                 border border-gray-200 dark:border-gray-700 
                 h-full flex flex-col"
    >
      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 tracking-tight">
        Riwayat Transaksi — {MONTHS[selectedMonth]}
      </h2>

      {/* SEARCH + FILTERS */}
      <div className="space-y-4 mb-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari transaksi…"
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
        </button>

        <AnimatePresence>
          {showFilters && (
            <TransactionFilters filters={filters} onChange={setFilters} />
          )}
        </AnimatePresence>
      </div>

      {/* LIST WRAPPER - FLEX & SCROLL */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 overflow-y-auto pr-1 flex-1 
                   scroll-smooth"
      >
        {sortedTransactions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Tidak ada transaksi"
            description={
              searchTerm || filters.type !== 'all' || filters.category !== 'all'
                ? 'Tidak ada transaksi yang sesuai filter'
                : 'Belum ada transaksi untuk bulan ini'
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {sortedTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                variants={listItem}
                layout
                exit={{ opacity: 0, x: -60 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 
                           rounded-2xl p-4 border border-gray-200 dark:border-gray-600 
                           hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize
                        ${
                          tx.type === 'pemasukan'
                            ? 'bg-green-200/60 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-red-200/60 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        }`}
                    >
                      {tx.category}
                    </span>

                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {tx.description}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(tx.date)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <p
                    className={`text-lg font-bold ${
                      tx.type === 'pemasukan'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {tx.type === 'pemasukan' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(tx.id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-300
                               p-2 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};
