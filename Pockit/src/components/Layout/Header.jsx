import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { slideDown } from '../../utils/animations';

export const Header = () => {
  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Pocket <span className="text-indigo-600 dark:text-indigo-400">IT</span>
        </h1>
      </div>
      <ThemeToggle />
    </motion.div>
  );
};