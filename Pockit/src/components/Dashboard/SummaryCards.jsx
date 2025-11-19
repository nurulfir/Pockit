import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { staggerContainer, scaleIn } from '../../utils/animations';

export const SummaryCards = ({ totalIncome, totalExpense, balance }) => {
  const cards = [
    {
      id: 'income',
      title: 'Total Pemasukan',
      amount: totalIncome,
      Icon: TrendingUp,
      accent: 'green'
    },
    {
      id: 'expense',
      title: 'Total Pengeluaran',
      amount: totalExpense,
      Icon: TrendingDown,
      accent: 'red'
    },
    {
      id: 'balance',
      title: 'Saldo',
      amount: balance,
      Icon: Wallet,
      accent: balance >= 0 ? 'indigo' : 'orange'
    }
  ];

  const accentClasses = {
    green: {
      ring: 'ring-green-400/30',
      text: 'text-green-500 dark:text-green-300',
      bg: 'bg-green-100/20 dark:bg-green-900/20'
    },
    red: {
      ring: 'ring-red-400/30',
      text: 'text-red-500 dark:text-red-300',
      bg: 'bg-red-100/20 dark:bg-red-900/20'
    },
    indigo: {
      ring: 'ring-indigo-400/30',
      text: 'text-indigo-500 dark:text-indigo-300',
      bg: 'bg-indigo-100/20 dark:bg-indigo-900/20'
    },
    orange: {
      ring: 'ring-orange-400/30',
      text: 'text-orange-500 dark:text-orange-300',
      bg: 'bg-orange-100/20 dark:bg-orange-900/20'
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
    >
      {cards.map((c) => {
        const cls = accentClasses[c.accent];

        return (
          <motion.div
            key={c.id}
            variants={scaleIn}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="
              rounded-3xl 
              p-6 
              w-full
              h-full
              max-w-full
              backdrop-blur-xl 
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              shadow-[0_8px_30px_rgba(0,0,0,0.25)]
              relative
            "
          >
            {/* Glow */}
            <div className={`absolute -inset-px rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300 ${cls.ring}`} />

            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{c.title}</p>

                <motion.div
                  key={c.amount}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white mt-1"
                >
                  {formatCurrency(c.amount)}
                </motion.div>
              </div>

              <div className={`p-3 rounded-2xl ${cls.bg} border border-gray-200 dark:border-gray-700`}>
                <c.Icon className={cls.text} />
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              {c.id === 'balance'
                ? balance >= 0 ? 'Keuangan sehat bulan ini' : 'Perhatikan pengeluaran Anda'
                : `Ringkasan ${c.title.toLowerCase()}`}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
