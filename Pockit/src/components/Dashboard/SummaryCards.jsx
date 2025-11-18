import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { staggerContainer, scaleIn } from '../../utils/animations';

export const SummaryCards = ({ totalIncome, totalExpense, balance }) => {
  const cards = [
    {
      title: 'Total Pemasukan',
      amount: totalIncome,
      icon: TrendingUp,
      gradient: 'from-green-400 to-green-600',
      bgColor: 'green-100'
    },
    {
      title: 'Total Pengeluaran',
      amount: totalExpense,
      icon: TrendingDown,
      gradient: 'from-red-400 to-red-600',
      bgColor: 'red-100'
    },
    {
      title: 'Saldo',
      amount: balance,
      icon: Wallet,
      gradient: balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600',
      bgColor: balance >= 0 ? 'blue-100' : 'orange-100'
    }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={scaleIn}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`bg-gradient-to-br ${card.gradient} rounded-xl p-5 text-white shadow-lg cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">{card.title}</p>
              <motion.p
                key={card.amount}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold"
              >
                {formatCurrency(card.amount)}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <card.icon className="w-10 h-10 opacity-80" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};