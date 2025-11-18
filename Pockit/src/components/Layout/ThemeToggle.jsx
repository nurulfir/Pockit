import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full p-[2px] transition-colors duration-300"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-[2px] left-[2px] w-7 h-7 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-400" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};